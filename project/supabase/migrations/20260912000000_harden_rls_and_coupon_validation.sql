/*
  LCP Works final security hardening.

  Preserves:
  - public product browsing
  - guest checkout through create-order
  - authenticated Order History
  - admin panel CRUD
  - Stripe webhook order creation
  - coupon validation
  - digital instruction downloads
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

/* ---------------------------------------------------------
   PRODUCTS
--------------------------------------------------------- */
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read_products ON public.products;
DROP POLICY IF EXISTS admin_manage_products ON public.products;

CREATE POLICY public_read_products
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY admin_manage_products
ON public.products FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

/* ---------------------------------------------------------
   ORDERS
   Browser clients do not directly create/update orders.
   Edge Functions use service_role.
--------------------------------------------------------- */
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read_orders ON public.orders;
DROP POLICY IF EXISTS public_insert_orders ON public.orders;
DROP POLICY IF EXISTS public_update_orders ON public.orders;
DROP POLICY IF EXISTS anon_insert_orders ON public.orders;
DROP POLICY IF EXISTS insert_own_orders ON public.orders;
DROP POLICY IF EXISTS select_own_orders ON public.orders;
DROP POLICY IF EXISTS update_own_orders ON public.orders;
DROP POLICY IF EXISTS admin_manage_orders ON public.orders;

CREATE POLICY select_own_orders
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY admin_manage_orders
ON public.orders FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_orders_user_id
ON public.orders(user_id)
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_stripe_session_id_unique
ON public.orders(stripe_session_id)
WHERE stripe_session_id IS NOT NULL;

/* ---------------------------------------------------------
   ORDER ITEMS
--------------------------------------------------------- */
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read_order_items ON public.order_items;
DROP POLICY IF EXISTS public_insert_order_items ON public.order_items;
DROP POLICY IF EXISTS anon_read_order_items ON public.order_items;
DROP POLICY IF EXISTS read_own_order_items ON public.order_items;
DROP POLICY IF EXISTS admin_manage_order_items ON public.order_items;

CREATE POLICY read_own_order_items
ON public.order_items FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.user_id = auth.uid()
  )
);

CREATE POLICY admin_manage_order_items
ON public.order_items FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
ON public.order_items(order_id);

/* ---------------------------------------------------------
   DIGITAL FILES
   Admin CRUD only. Edge Functions use service_role.
--------------------------------------------------------- */
DO $$
DECLARE p record;
BEGIN
  IF to_regclass('public.digital_files') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.digital_files ENABLE ROW LEVEL SECURITY';

    FOR p IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'digital_files'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.digital_files', p.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY admin_manage_digital_files ON public.digital_files FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;
END $$;

/* ---------------------------------------------------------
   CONTACT MESSAGES
--------------------------------------------------------- */
DO $$
DECLARE p record;
BEGIN
  IF to_regclass('public.contact_messages') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY';

    FOR p IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'contact_messages'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.contact_messages', p.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY public_insert_contact_messages ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true)';
    EXECUTE 'CREATE POLICY admin_manage_contact_messages ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;
END $$;

/* ---------------------------------------------------------
   PAGE VIEWS
   Keep existing public INSERT behaviour, restrict reads to admin.
--------------------------------------------------------- */
DO $$
DECLARE p record;
BEGIN
  IF to_regclass('public.page_views') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY';

    FOR p IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'page_views'
        AND cmd = 'SELECT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.page_views', p.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY admin_read_page_views ON public.page_views FOR SELECT TO authenticated USING (public.is_admin())';
  END IF;
END $$;

/* ---------------------------------------------------------
   COUPONS
   Direct table reads are blocked. Checkout uses validate_coupon().
--------------------------------------------------------- */
DO $$
DECLARE p record;
BEGIN
  IF to_regclass('public.coupons') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY';

    FOR p IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'coupons'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.coupons', p.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY admin_manage_coupons ON public.coupons FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.validate_coupon(coupon_code_input text)
RETURNS TABLE (
  code text,
  discount_type text,
  discount_value numeric,
  currency text,
  min_spend integer,
  expires_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.code,
    c.discount_type,
    c.discount_value,
    c.currency,
    c.min_spend,
    c.expires_at
  FROM public.coupons c
  WHERE upper(trim(c.code)) = upper(trim(coupon_code_input))
    AND c.is_active = true
    AND (c.expires_at IS NULL OR c.expires_at >= now())
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.validate_coupon(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text) TO anon, authenticated, service_role;

/* ---------------------------------------------------------
   ATOMIC DOWNLOAD COUNTER
--------------------------------------------------------- */
CREATE OR REPLACE FUNCTION public.increment_order_download_count(target_order_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.orders
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = target_order_id
    AND COALESCE(download_count, 0) < 3
  RETURNING true;
$$;

REVOKE ALL ON FUNCTION public.increment_order_download_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_order_download_count(uuid) TO service_role;

/* ---------------------------------------------------------
   GUEST STRIPE CONFIRMATION
   Returns only non-sensitive status fields.
--------------------------------------------------------- */
CREATE OR REPLACE FUNCTION public.get_checkout_status(checkout_session_id text)
RETURNS TABLE (
  order_id uuid,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.status
  FROM public.orders o
  WHERE o.stripe_session_id = NULLIF(trim(checkout_session_id), '')
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_checkout_status(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_checkout_status(text) TO anon, authenticated, service_role;

/* ---------------------------------------------------------
   BASIC DATA INTEGRITY
--------------------------------------------------------- */
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'order_items_quantity_positive'
      AND conrelid = 'public.order_items'::regclass
  ) THEN
    ALTER TABLE public.order_items
      ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);
  END IF;
END $$;
