/*
  LCP Works abuse / spam protection.

  Protects:
  - public contact form spam
  - public page-view inflation
  - coupon-code brute forcing / enumeration

  The rate-limit table and function are service-role only.
  Browser clients never get direct access to them.
*/

CREATE TABLE IF NOT EXISTS public.security_rate_limits (
  rate_key text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.security_rate_limits FROM PUBLIC;
REVOKE ALL ON TABLE public.security_rate_limits FROM anon;
REVOKE ALL ON TABLE public.security_rate_limits FROM authenticated;
GRANT ALL ON TABLE public.security_rate_limits TO service_role;

CREATE INDEX IF NOT EXISTS idx_security_rate_limits_updated_at
ON public.security_rate_limits(updated_at);

CREATE OR REPLACE FUNCTION public.consume_security_rate_limit(
  p_rate_key text,
  p_max_requests integer,
  p_window_seconds integer
)
RETURNS TABLE (
  allowed boolean,
  remaining integer,
  retry_after_seconds integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_started_at timestamptz;
  current_count integer;
  next_count integer;
  seconds_since_start integer;
BEGIN
  IF p_rate_key IS NULL OR length(trim(p_rate_key)) = 0 THEN
    RAISE EXCEPTION 'rate key is required';
  END IF;

  IF p_max_requests < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'invalid rate limit';
  END IF;

  INSERT INTO public.security_rate_limits (
    rate_key,
    window_started_at,
    request_count,
    updated_at
  )
  VALUES (
    p_rate_key,
    now(),
    1,
    now()
  )
  ON CONFLICT (rate_key) DO NOTHING;

  SELECT
    r.window_started_at,
    r.request_count
  INTO
    current_started_at,
    current_count
  FROM public.security_rate_limits r
  WHERE r.rate_key = p_rate_key
  FOR UPDATE;

  seconds_since_start := GREATEST(
    0,
    FLOOR(EXTRACT(EPOCH FROM (now() - current_started_at)))::integer
  );

  IF seconds_since_start >= p_window_seconds THEN
    UPDATE public.security_rate_limits
    SET
      window_started_at = now(),
      request_count = 1,
      updated_at = now()
    WHERE rate_key = p_rate_key;

    RETURN QUERY
    SELECT true, GREATEST(p_max_requests - 1, 0), 0;
    RETURN;
  END IF;

  IF current_count < p_max_requests THEN
    next_count := current_count + 1;

    UPDATE public.security_rate_limits
    SET
      request_count = next_count,
      updated_at = now()
    WHERE rate_key = p_rate_key;

    RETURN QUERY
    SELECT
      true,
      GREATEST(p_max_requests - next_count, 0),
      0;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    false,
    0,
    GREATEST(p_window_seconds - seconds_since_start, 1);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_security_rate_limit(text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_security_rate_limit(text, integer, integer) FROM anon;
REVOKE ALL ON FUNCTION public.consume_security_rate_limit(text, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.consume_security_rate_limit(text, integer, integer) TO service_role;

/*
  Coupon validation remains available to server-side service_role code,
  but browsers must go through the rate-limited Edge Function.
*/
REVOKE ALL ON FUNCTION public.validate_coupon(text) FROM anon;
REVOKE ALL ON FUNCTION public.validate_coupon(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text) TO service_role;

/*
  The contact form is now written by the rate-limited Edge Function.
  Remove the direct browser INSERT policy so it cannot be bypassed.
*/
DO $$
BEGIN
  IF to_regclass('public.contact_messages') IS NOT NULL THEN
    DROP POLICY IF EXISTS public_insert_contact_messages ON public.contact_messages;
  END IF;
END $$;

/*
  Page views are now written by the rate-limited Edge Function.
  Existing admin SELECT policy remains untouched.
*/
DO $$
DECLARE p record;
BEGIN
  IF to_regclass('public.page_views') IS NOT NULL THEN
    FOR p IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'page_views'
        AND cmd = 'INSERT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.page_views', p.policyname);
    END LOOP;
  END IF;
END $$;
