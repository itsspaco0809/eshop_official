import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import {
  ArrowLeft,
  CreditCard,
  Lock,
  Check,
  ShoppingBag,
  AlertCircle,
  Tag,
  Banknote,
} from 'lucide-react';

import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { useCurrency } from '@/lib/currency';

import {
  US,
  HK,
  CA,
  GB,
  AU,
  EU,
  JP,
} from 'country-flag-icons/react/3x2';

const COUNTRY_CONFIG: Record<
  string,
  {
    currency: string;
    rate: number;
    symbol: string;
    taxRate: number;
    Flag: React.ComponentType<{ className?: string }>;
  }
> = {
  'Hong Kong': {
    currency: 'HKD',
    rate: 7.8,
    symbol: 'HK$',
    taxRate: 0,
    Flag: HK,
  },
  'United States': {
    currency: 'USD',
    rate: 1.0,
    symbol: '$',
    taxRate: 0.08,
    Flag: US,
  },
  Canada: {
    currency: 'CAD',
    rate: 1.35,
    symbol: 'CA$',
    taxRate: 0.08,
    Flag: CA,
  },
  'United Kingdom': {
    currency: 'GBP',
    rate: 0.78,
    symbol: '£',
    taxRate: 0.08,
    Flag: GB,
  },
  Australia: {
    currency: 'AUD',
    rate: 1.52,
    symbol: 'A$',
    taxRate: 0.08,
    Flag: AU,
  },
  Germany: {
    currency: 'EUR',
    rate: 0.92,
    symbol: '€',
    taxRate: 0.08,
    Flag: EU,
  },
  France: {
    currency: 'EUR',
    rate: 0.92,
    symbol: '€',
    taxRate: 0.08,
    Flag: EU,
  },
  Japan: {
    currency: 'JPY',
    rate: 155.0,
    symbol: '¥',
    taxRate: 0.08,
    Flag: JP,
  },
};

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  'Hong Kong': 'HKD',
  'United States': 'USD',
  Canada: 'CAD',
  'United Kingdom': 'GBP',
  Australia: 'AUD',
  Germany: 'EUR',
  France: 'EUR',
  Japan: 'JPY',
};

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  HKD: 'Hong Kong',
  USD: 'United States',
  CAD: 'Canada',
  GBP: 'United Kingdom',
  AUD: 'Australia',
  EUR: 'Germany',
  JPY: 'Japan',
};

type AppliedCoupon = {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  currency: string;
};

type CheckoutStatus =
  | 'idle'
  | 'submitting'
  | 'success';

export default function Checkout() {
  const { items = [], clearCart } = useCart();

  const { navigate } = useRouter();

  const {
    user,
    isAdmin,
  } = useAuth();

  const {
    currency: globalCurrency,
    setCurrency: setGlobalCurrency,
  } = useCurrency();

  /*
   * =========================================================
   * SUBMIT LOCK
   * =========================================================
   *
   * React state alone is not enough to prevent two very fast
   * taps/clicks from entering handleSubmit before React has
   * re-rendered.
   *
   * This ref acts as a synchronous lock.
   */

  const submitLockRef = useRef(false);

  const [form, setForm] = useState({
    email: '',
    phone: '',
    full_name: '',
    shipping_address: '',
    city: '',
    postal_code: '',
    country:
      CURRENCY_TO_COUNTRY[globalCurrency] ||
      'United States',
    notes: '',
  });

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] =
    useState<AppliedCoupon | null>(null);

  const [couponError, setCouponError] =
    useState<string | null>(null);

  const [isValidatingCoupon, setIsValidatingCoupon] =
    useState(false);

  const [status, setStatus] =
    useState<CheckoutStatus>('idle');

  const [orderId, setOrderId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [dbOrderStatus, setDbOrderStatus] =
    useState<string>('pending');

  /*
   * =========================================================
   * STRIPE RETURN INITIAL STATE
   * =========================================================
   *
   * IMPORTANT:
   *
   * This MUST NOT simply start as false.
   *
   * Stripe redirects back to:
   *
   * /checkout?success=true&session_id=...
   *
   * React can render the component once BEFORE useEffect()
   * executes.
   *
   * If this state starts as false, the normal checkout UI
   * can briefly appear before useEffect() changes it to true.
   *
   * We therefore inspect the URL during the INITIAL STATE
   * calculation.
   *
   * This means the FIRST render after Stripe returns is already
   * the confirmation/loading screen.
   */

  const [isConfirmingStripeReturn, setIsConfirmingStripeReturn] =
    useState(() => {
      if (typeof window === 'undefined') {
        return false;
      }

      const searchParams = new URLSearchParams(
        window.location.search
      );

      const paymentStatus =
        searchParams.get('status');

      const stripeSuccess =
        searchParams.get('success');

      const sessionId =
        searchParams.get('session_id');

      return (
        !!sessionId &&
        (
          paymentStatus === 'success' ||
          stripeSuccess === 'true'
        )
      );
    });

  /*
   * =========================================================
   * ADMIN CASH PAYMENT
   * =========================================================
   *
   * Only an authenticated admin with the correct
   * app_metadata role can trigger CASH.
   */

  const isCashPayment =
    isAdmin &&
    form.notes
      .trim()
      .toUpperCase()
      .includes('CASH');

  /*
   * =========================================================
   * SCROLL TO TOP
   * =========================================================
   */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const mainContainer =
      document.querySelector('main');

    if (mainContainer) {
      mainContainer.scrollTop = 0;
    }
  };

  /*
   * =========================================================
   * STRIPE WEBHOOK CONFIRMATION
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    let pollTimer:
      | ReturnType<typeof setTimeout>
      | null = null;

    const confirmStripeOrder = async () => {
      const searchParams = new URLSearchParams(
        window.location.search
      );

      const paymentStatus =
        searchParams.get('status');

      const stripeSuccess =
        searchParams.get('success');

      const sessionId =
        searchParams.get('session_id');

      const paramOrderId =
        searchParams.get('order_id');

      /*
       * -----------------------------------------------------
       * CASH / LEGACY DIRECT ORDER
       * -----------------------------------------------------
       */

      if (paramOrderId) {
        if (cancelled) {
          return;
        }

        setOrderId(paramOrderId);
        setStatus('success');

        /*
         * Fetch the actual database status so the success
         * page can correctly show PAID or DONE.
         */

        const {
          data,
          error,
        } = await supabase
          .from('orders')
          .select('status')
          .eq('id', paramOrderId)
          .maybeSingle();

        if (cancelled) {
          return;
        }

        if (
          !error &&
          data?.status
        ) {
          setDbOrderStatus(
            data.status
          );
        } else {
          setDbOrderStatus('paid');
        }

        clearCart();
        scrollToTop();

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        return;
      }

      /*
       * -----------------------------------------------------
       * STRIPE CANCEL
       * -----------------------------------------------------
       */

      if (
        paymentStatus === 'cancel'
      ) {
        if (cancelled) {
          return;
        }

        setIsConfirmingStripeReturn(false);

        setStatus('idle');

        setErrorMessage(
          'Payment was cancelled. No order was created.'
        );

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        return;
      }

      /*
       * -----------------------------------------------------
       * NOTHING TO CONFIRM
       * -----------------------------------------------------
       */

      if (
        (
          paymentStatus !== 'success' &&
          stripeSuccess !== 'true'
        ) ||
        !sessionId
      ) {
        if (!cancelled) {
          setIsConfirmingStripeReturn(false);
        }

        return;
      }

      if (cancelled) {
        return;
      }

      /*
       * -----------------------------------------------------
       * STRIPE RETURN
       * -----------------------------------------------------
       *
       * The initial useState() has already made the FIRST
       * render the loading screen.
       *
       * This remains here as a safety net for any client-side
       * navigation that reaches this component with Stripe
       * parameters.
       */

      setIsConfirmingStripeReturn(true);
      setErrorMessage(null);

      scrollToTop();

      /*
       * Remove URL query parameters immediately.
       *
       * replaceState() does not reload the page.
       */

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      const startedAt = Date.now();

      const pollForOrder = async () => {
        if (cancelled) {
          return;
        }

        try {
          const {
            data,
            error,
          } = await supabase
            .from('orders')
            .select('id,status')
            .eq(
              'stripe_session_id',
              sessionId
            )
            .maybeSingle();

          if (error) {
            console.error(
              'Stripe order confirmation query failed:',
              error
            );
          }

          if (data?.id) {
            if (cancelled) {
              return;
            }

            setOrderId(data.id);

            /*
             * IMPORTANT:
             *
             * Finding the order does NOT mean payment is
             * complete.
             *
             * create-order creates the order row first.
             *
             * Stripe webhook then changes:
             *
             * pending → paid
             *
             * OR
             *
             * pending → done
             *
             * Therefore we keep the confirmation screen
             * visible while the status is still pending.
             */

            if (
              data.status === 'paid' ||
              data.status === 'done'
            ) {
              setDbOrderStatus(
                data.status
              );

              clearCart();

              /*
               * IMPORTANT:
               *
               * Only hide the Stripe confirmation screen
               * AFTER the final DB status is confirmed.
               */

              setIsConfirmingStripeReturn(false);

              setStatus('success');

              scrollToTop();

              return;
            }

            /*
             * Order exists but webhook has not finished yet.
             *
             * Keep polling.
             */

            if (
              Date.now() - startedAt <
              60000
            ) {
              pollTimer = setTimeout(
                pollForOrder,
                1000
              );

              return;
            }
          }

          /*
           * Continue polling for up to 60 seconds.
           */

          if (
            Date.now() - startedAt <
            60000
          ) {
            pollTimer = setTimeout(
              pollForOrder,
              1500
            );

            return;
          }

          if (cancelled) {
            return;
          }

          /*
           * Confirmation timed out.
           */

          setIsConfirmingStripeReturn(false);

          setStatus('idle');

          setErrorMessage(
            'Payment received. Your order is still being processed. Please check your order history shortly.'
          );
        } catch (error) {
          console.error(
            'Stripe order confirmation error:',
            error
          );

          if (
            Date.now() - startedAt <
            60000
          ) {
            pollTimer = setTimeout(
              pollForOrder,
              1500
            );

            return;
          }

          if (cancelled) {
            return;
          }

          setIsConfirmingStripeReturn(false);

          setStatus('idle');

          setErrorMessage(
            'We could not confirm your order yet. Please check your order history shortly.'
          );
        }
      };

      pollForOrder();
    };

    confirmStripeOrder();

    return () => {
      cancelled = true;

      if (pollTimer) {
        clearTimeout(pollTimer);
      }
    };
  }, [clearCart]);

  /*
   * =========================================================
   * CURRENCY → COUNTRY SYNC
   * =========================================================
   */

  useEffect(() => {
    const matchingCountry =
      CURRENCY_TO_COUNTRY[globalCurrency];

    if (
      matchingCountry &&
      form.country !== matchingCountry
    ) {
      setForm((prev) => ({
        ...prev,
        country: matchingCountry,
      }));

      setAppliedCoupon(null);
      setCouponError(null);
    }
  }, [globalCurrency]);

  const selectedCountryConfig =
    COUNTRY_CONFIG[form.country] ||
    COUNTRY_CONFIG['United States'];

  const {
    taxRate,
    symbol,
    rate,
    currency: selectedCurrency,
  } = selectedCountryConfig;

  const SelectedCountryFlag =
    selectedCountryConfig.Flag;

  /*
   * =========================================================
   * PRICE HELPERS
   * =========================================================
   */

  const calculateLocalAmount = (
    usdAmount: number
  ) => {
    const raw = usdAmount * rate;

    return selectedCurrency === 'HKD'
      ? Math.ceil(raw)
      : Number(raw.toFixed(2));
  };

  const renderFormattedPrice = (
    usdAmount: number
  ) => {
    const localAmount =
      calculateLocalAmount(usdAmount);

    const isHKD =
      selectedCurrency === 'HKD';

    const formattedNumber =
      localAmount.toLocaleString(
        'en-US',
        {
          minimumFractionDigits:
            isHKD ? 0 : 2,
          maximumFractionDigits:
            isHKD ? 0 : 2,
        }
      );

    return `${symbol}${formattedNumber}`;
  };

  /*
   * =========================================================
   * COUNTRY
   * =========================================================
   */

  const handleCountryChange = (
    country: string
  ) => {
    setForm((prev) => ({
      ...prev,
      country,
    }));

    const newCurrency =
      COUNTRY_TO_CURRENCY[country];

    if (
      newCurrency &&
      newCurrency !== globalCurrency
    ) {
      setGlobalCurrency(newCurrency);

      setAppliedCoupon(null);
      setCouponError(null);
    }
  };

  /*
   * =========================================================
   * NOTES
   * =========================================================
   */

  const handleNotesChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;

    const words = text.trim()
      ? text.trim().split(/\s+/).length
      : 0;

    if (
      words <= 200 ||
      text.length < form.notes.length
    ) {
      setForm((prev) => ({
        ...prev,
        notes: text,
      }));
    }
  };

  /*
   * =========================================================
   * PRODUCT HELPERS
   * =========================================================
   */

  const getProductPriceUSD = (
    price?: number
  ) => {
    if (typeof price !== 'number') {
      return 0;
    }

    return price / 100;
  };

  /*
   * =========================================================
   * INSTRUCTIONS PRODUCT DETECTION
   * =========================================================
   *
   * Keep this aligned with the server-side create-order
   * and stripe-webhook logic.
   *
   * An item is considered an Instructions product when
   * section, category, OR name contains "instruction".
   */

  const isInstructionItem = (
    item?: (typeof items)[0]
  ) => {
    if (!item?.product) {
      return false;
    }

    const product =
      item.product as any;

    const rawSection =
      product.section;

    const rawCategory =
      product.category;

    const rawName =
      product.name;

    const sectionStr =
      Array.isArray(rawSection)
        ? rawSection.join(' ')
        : String(
            rawSection || ''
          );

    const categoryStr =
      Array.isArray(rawCategory)
        ? rawCategory.join(' ')
        : String(
            rawCategory || ''
          );

    const nameStr =
      Array.isArray(rawName)
        ? rawName.join(' ')
        : String(
            rawName || ''
          );

    const section =
      sectionStr
        .trim()
        .toLowerCase();

    const category =
      categoryStr
        .trim()
        .toLowerCase();

    const name =
      nameStr
        .trim()
        .toLowerCase();

    return (
      section.includes(
        'instruction'
      ) ||
      category.includes(
        'instruction'
      ) ||
      name.includes(
        'instruction'
      )
    );
  };

  /*
   * =========================================================
   * SUBTOTAL
   * =========================================================
   */

  const normalizedSubtotalUSD =
    items.reduce(
      (acc, item) => {
        if (!item?.product) {
          return acc;
        }

        return (
          acc +
          getProductPriceUSD(
            item.product.price
          ) *
            (item.quantity || 1)
        );
      },
      0
    );

  /*
   * =========================================================
   * COUPON
   * =========================================================
   */

  const handleApplyCoupon = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setCouponError(null);

    const code =
      couponInput
        .trim()
        .toUpperCase();

    if (!code) {
      return;
    }

    setIsValidatingCoupon(true);

    try {
      const {
        data,
        error,
      } = await supabase.functions.invoke(
        'validate-coupon',
        {
          body: {
            code,
          },
        }
      );

      const coupon =
        data?.coupon ?? null;

      if (
        error ||
        !coupon
      ) {
        setCouponError(
          'Invalid coupon code.'
        );

        return;
      }

      if (
        coupon.expires_at &&
        new Date(
          coupon.expires_at
        ) < new Date()
      ) {
        setCouponError(
          'This coupon has expired.'
        );

        return;
      }

      const couponCurrency =
        coupon.currency ||
        'USD';

      if (
        couponCurrency !== 'ALL' &&
        couponCurrency !== selectedCurrency
      ) {
        setCouponError(
          `This coupon is only valid for purchases in ${couponCurrency}.`
        );

        return;
      }

      const currentSubtotalLocal =
        calculateLocalAmount(
          normalizedSubtotalUSD
        );

      if (
        coupon.min_spend &&
        currentSubtotalLocal <
          coupon.min_spend
      ) {
        setCouponError(
          `Minimum order spend of ${symbol}${coupon.min_spend} required.`
        );

        return;
      }

      setAppliedCoupon({
        code: coupon.code,
        discountType:
          coupon.discount_type,
        discountValue:
          Number(
            coupon.discount_value
          ),
        currency:
          couponCurrency,
      });

      setCouponInput('');
    } catch (error) {
      console.error(
        'Coupon validation error:',
        error
      );

      setCouponError(
        'Failed to validate coupon.'
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  /*
   * =========================================================
   * SUCCESS SCROLL
   * =========================================================
   */

  useEffect(() => {
    if (status === 'success') {
      scrollToTop();
    }
  }, [status]);

  /*
   * =========================================================
   * ORDER STATUS LISTENER
   * =========================================================
   */

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const fetchOrderStatus =
      async () => {
        const {
          data,
        } = await supabase
          .from('orders')
          .select('status')
          .eq('id', orderId)
          .maybeSingle();

        if (data?.status) {
          setDbOrderStatus(
            data.status
          );
        }
      };

    fetchOrderStatus();

    const channel =
      supabase
        .channel(
          `order-status-${orderId}`
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`,
          },
          (payload) => {
            if (
              payload.new &&
              payload.new.status
            ) {
              setDbOrderStatus(
                payload.new.status
              );
            }
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [orderId]);

  /*
   * =========================================================
   * DISCOUNT
   * =========================================================
   */

  let discountAmountUSD = 0;

  if (appliedCoupon) {
    if (
      appliedCoupon.discountType ===
      'percentage'
    ) {
      discountAmountUSD =
        (
          normalizedSubtotalUSD *
          appliedCoupon.discountValue
        ) /
        100;
    } else {
      discountAmountUSD =
        appliedCoupon.currency !==
        'USD'
          ? appliedCoupon.discountValue /
            rate
          : appliedCoupon.discountValue;
    }
  }

  const discountedSubtotalUSD =
    Math.max(
      0,
      normalizedSubtotalUSD -
        discountAmountUSD
    );

  /*
   * =========================================================
   * PHYSICAL ITEMS
   * =========================================================
   */

  const basePhysicalSubtotalUSD =
    items.reduce(
      (acc, item) => {
        if (
          item?.product &&
          !isInstructionItem(item)
        ) {
          return (
            acc +
            getProductPriceUSD(
              item.product.price
            ) *
              (item.quantity || 1)
          );
        }

        return acc;
      },
      0
    );

  const hasPhysicalItems =
    items.some(
      (item) =>
        item?.product &&
        !isInstructionItem(item)
    );

  /*
   * IMPORTANT:
   *
   * Only an order where EVERY item is an Instructions
   * product is considered Instructions Only.
   *
   * Therefore:
   *
   * Instructions
   * → done
   *
   * Kits
   * → paid
   *
   * Custom Parts
   * → paid
   *
   * Kits + Instructions
   * → paid
   *
   * Kits + Instructions + Custom Parts
   * → paid
   */

  const isInstructionOnly =
    items.length > 0 &&
    items.every(
      (item) =>
        item?.product &&
        isInstructionItem(item)
    );

  /*
   * =========================================================
   * SHIPPING / TAX
   * =========================================================
   */

  const freeShippingThresholdUSD =
    99;

  const isHongKong =
    form.country ===
    'Hong Kong';

  const baseShippingUSD =
    isHongKong ||
    !hasPhysicalItems ||
    basePhysicalSubtotalUSD === 0 ||
    basePhysicalSubtotalUSD >=
      freeShippingThresholdUSD
      ? 0
      : 7.99;

  const baseTaxUSD =
    discountedSubtotalUSD === 0
      ? 0
      : discountedSubtotalUSD *
        taxRate;

  const baseTotalUSD =
    discountedSubtotalUSD +
    baseShippingUSD +
    baseTaxUSD;

  const wordCount =
    form.notes.trim()
      ? form.notes
          .trim()
          .split(/\s+/)
          .length
      : 0;

  /*
   * =========================================================
   * READ CURRENT AUTH SESSION
   * =========================================================
   *
   * This is the important part for your current
   * "Invalid Refresh Token" problem.
   *
   * We do NOT blindly trust the React `user` state.
   *
   * The Supabase session is checked immediately before
   * creating the order.
   */

  const getCheckoutSession =
    async () => {
      try {
        const {
          data,
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.warn(
            '[Checkout] getSession failed:',
            error
          );

          return null;
        }

        return data.session;
      } catch (error) {
        console.warn(
          '[Checkout] Unable to read auth session:',
          error
        );

        return null;
      }
    };

  /*
   * =========================================================
   * LOCAL SESSION CLEANUP
   * =========================================================
   *
   * Used only when Supabase tells us that the existing
   * refresh token/session is invalid.
   */

  const clearBrokenAuthSession =
    async () => {
      try {
        await supabase.auth.signOut({
          scope: 'local',
        });
      } catch (error) {
        console.warn(
          '[Checkout] Failed to clear broken auth session:',
          error
        );
      }
    };

  /*
   * =========================================================
   * EDGE FUNCTION ERROR PARSER
   * =========================================================
   */

  const parseFunctionError =
    async (
      funcError: any
    ) => {
      let message =
        funcError?.message ||
        'Failed to process order.';

      const statusCode =
        funcError?.context?.status;

      let retryAfter:
        | string
        | null = null;

      /*
       * Read Retry-After header if the backend provides it.
       */

      try {
        if (
          funcError?.context
            ?.headers?.get
        ) {
          retryAfter =
            funcError.context.headers.get(
              'Retry-After'
            );
        }
      } catch (_) {}

      /*
       * Try reading JSON error body.
       */

      try {
        if (
          funcError?.context &&
          typeof funcError
            .context
            .json === 'function'
        ) {
          const body =
            await funcError
              .context
              .json();

          if (body?.error) {
            message = body.error;
          } else if (
            body?.message
          ) {
            message =
              body.message;
          }
        }
      } catch (_) {}

      /*
       * -----------------------------------------------------
       * RATE LIMIT
       * -----------------------------------------------------
       */

      if (statusCode === 429) {
        if (retryAfter) {
          const seconds =
            Number(retryAfter);

          if (
            Number.isFinite(
              seconds
            )
          ) {
            const minutes =
              Math.max(
                1,
                Math.ceil(
                  seconds / 60
                )
              );

            message =
              `Too many checkout attempts. Please wait about ${minutes} minute${minutes === 1 ? '' : 's'} and try again.`;
          } else {
            message =
              'Too many checkout attempts. Please wait a few minutes and try again.';
          }
        } else {
          message =
            'Too many checkout attempts. Please wait a few minutes and try again.';
        }
      }

      /*
       * -----------------------------------------------------
       * INVALID REFRESH TOKEN
       * -----------------------------------------------------
       */

      const lowerMessage =
        String(
          message || ''
        ).toLowerCase();

      const isInvalidRefreshToken =
        lowerMessage.includes(
          'invalid refresh token'
        ) ||
        lowerMessage.includes(
          'refresh token not found'
        ) ||
        lowerMessage.includes(
          'refresh_token_not_found'
        );

      return {
        message,
        statusCode,
        isInvalidRefreshToken,
      };
    };

  /*
   * =========================================================
   * SUBMIT ORDER
   * =========================================================
   */

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    /*
     * -------------------------------------------------------
     * HARD DOUBLE-SUBMIT LOCK
     * -------------------------------------------------------
     */

    if (submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;

    setStatus('submitting');
    setErrorMessage(null);

    /*
     * -------------------------------------------------------
     * VALIDATE CART
     * -------------------------------------------------------
     */

    const invalidItems =
      items.filter(
        (item) =>
          !item?.product
      );

    if (
      invalidItems.length > 0
    ) {
      submitLockRef.current =
        false;

      setStatus('idle');

      setErrorMessage(
        'Failed to fetch product details. Please refresh or remove invalid cart items.'
      );

      return;
    }

    /*
     * -------------------------------------------------------
     * DETERMINE ORDER STATUS
     * -------------------------------------------------------
     *
     * IMPORTANT:
     *
     * Instructions ONLY
     * → done
     *
     * Cash order with physical products
     * → paid
     *
     * Normal Stripe order
     * → pending
     *
     * The final Stripe status is still determined by the
     * stripe-webhook using the actual order_items/products
     * on the server.
     */

    const targetStatus =
      isInstructionOnly
        ? 'done'
        : isCashPayment
        ? 'paid'
        : 'pending';

    const localTotalAmount =
      calculateLocalAmount(
        baseTotalUSD
      );

    const localDiscountAmount =
      calculateLocalAmount(
        discountAmountUSD
      );

    try {
      /*
       * =====================================================
       * STEP 1 — VERIFY CURRENT SESSION
       * =====================================================
       */

      let activeSession =
        await getCheckoutSession();

      /*
       * If React says a user is logged in but Supabase
       * currently has no valid session:
       *
       * - CASH/admin → stop and ask admin to sign in
       * - normal Stripe → clear stale local auth and
       *   continue as guest
       */

      if (
        user &&
        !activeSession
      ) {
        console.warn(
          '[Checkout] React user exists but Supabase session is unavailable.'
        );

        await clearBrokenAuthSession();

        if (isCashPayment) {
          throw new Error(
            'Your admin session has expired. Please sign in again before creating a cash order.'
          );
        }

        /*
         * Guest checkout is allowed for normal Stripe orders.
         */

        activeSession = null;
      }

      /*
       * =====================================================
       * STEP 2 — CREATE ORDER / STRIPE SESSION
       * =====================================================
       */

      const requestBody = {
        /*
         * IMPORTANT:
         *
         * Use the CURRENT Supabase session user ID,
         * not a stale React user ID.
         */

        user_id:
          activeSession?.user?.id ??
          null,

        email:
          form.email.trim(),

        full_name:
          form.full_name.trim(),

        phone:
          form.phone.trim(),

        shipping_address:
          `${form.shipping_address.trim()}, ${form.city.trim()}, ${form.postal_code.trim()}`,

        city:
          form.city.trim(),

        postal_code:
          form.postal_code.trim(),

        country:
          form.country,

        currency:
          globalCurrency,

        /*
         * Instructions only:
         * done
         *
         * Cash physical order:
         * paid
         *
         * Stripe:
         * pending until webhook confirmation
         */

        status:
          targetStatus,

        payment_method:
          isCashPayment
            ? 'cash'
            : 'stripe',

        notes:
          form.notes,

        coupon_code:
          appliedCoupon
            ? appliedCoupon.code
            : null,

        discount_amount:
          Math.round(
            localDiscountAmount * 100
          ),

        total_amount:
          Math.round(
            localTotalAmount * 100
          ),

        items: items.map(
          (item) => {
            const prod =
              item.product as any;

            const colorName =
              item.selectedColor ||
              prod?.selectedColor ||
              null;

            return {
              product_id:
                prod?.id,

              product_name:
                prod?.name,

              selected_color:
                colorName,

              quantity:
                item.quantity,

              /*
               * Kept for compatibility.
               *
               * create-order should continue using
               * the database product price as the
               * authoritative price.
               */

              price:
                Math.round(
                  calculateLocalAmount(
                    getProductPriceUSD(
                      prod?.price
                    )
                  ) * 100
                ),
            };
          }
        ),
      };

      let data: any = null;
      let funcError: any = null;

      /*
       * -------------------------------------------------------
       * FIRST ATTEMPT
       * -------------------------------------------------------
       */

      const firstAttempt =
        await supabase.functions.invoke(
          'create-order',
          {
            body:
              requestBody,
          }
        );

      data =
        firstAttempt.data;

      funcError =
        firstAttempt.error;

      /*
       * -------------------------------------------------------
       * INVALID REFRESH TOKEN RECOVERY
       * -------------------------------------------------------
       *
       * If Supabase tried to use an old refresh token and
       * the function call failed because of it:
       *
       * 1. Clear broken local session.
       * 2. Do NOT repeat for admin CASH.
       * 3. Retry ONE time as guest for normal Stripe.
       */

      if (funcError) {
        const parsed =
          await parseFunctionError(
            funcError
          );

        if (
          parsed.isInvalidRefreshToken
        ) {
          console.warn(
            '[Checkout] Invalid refresh token detected. Clearing local auth session.'
          );

          await clearBrokenAuthSession();

          if (isCashPayment) {
            throw new Error(
              'Your admin session has expired. Please sign in again before creating a cash order.'
            );
          }

          /*
           * Retry exactly ONCE.
           */

          const retryBody = {
            ...requestBody,
            user_id: null,
          };

          const retry =
            await supabase.functions.invoke(
              'create-order',
              {
                body:
                  retryBody,
              }
            );

          data =
            retry.data;

          funcError =
            retry.error;
        }
      }

      /*
       * -------------------------------------------------------
       * FUNCTION ERROR
       * -------------------------------------------------------
       */

      if (funcError) {
        const parsed =
          await parseFunctionError(
            funcError
          );

        console.error(
          '[Checkout] create-order failed:',
          {
            status:
              parsed.statusCode,
            message:
              parsed.message,
          }
        );

        throw new Error(
          parsed.message ||
            'Failed to process order.'
        );
      }

      /*
       * -------------------------------------------------------
       * BACKEND RESPONSE VALIDATION
       * -------------------------------------------------------
       */

      if (
        !data?.success
      ) {
        throw new Error(
          data?.error ||
            data?.message ||
            'Order creation failed.'
        );
      }

      /*
       * =====================================================
       * CASH / FREE ORDER
       * =====================================================
       */

      if (
        isCashPayment ||
        baseTotalUSD === 0
      ) {
        if (
          !data.order_id
        ) {
          throw new Error(
            'Order was created but no order reference was returned.'
          );
        }

        setOrderId(
          data.order_id
        );

        /*
         * IMPORTANT:
         *
         * Use the backend status as authoritative.
         *
         * Instructions only → done
         * Physical/Cash order → paid
         */

        setDbOrderStatus(
          data.status ||
            targetStatus ||
            'paid'
        );

        scrollToTop();

        setStatus('success');

        /*
         * Clear cart ONLY after successful order creation.
         */

        clearCart();

        return;
      }

      /*
       * =====================================================
       * STRIPE
       * =====================================================
       *
       * create-order returns the Stripe Checkout URL.
       *
       * We DO NOT clear the cart here.
       *
       * Cart is cleared only after:
       *
       * Stripe payment
       *       ↓
       * stripe-webhook
       *       ↓
       * orders row
       *       ↓
       * Checkout polling / order status
       *       ↓
       * success
       */

      if (
        typeof data.checkout_url !==
          'string' ||
        !data.checkout_url
      ) {
        throw new Error(
          'Stripe checkout URL was not returned.'
        );
      }

      /*
       * Stripe Checkout redirect
       *
       * Use assign() instead of href so browser navigation
       * is explicit and SPA router interference is avoided.
       */

      window.location.assign(
        data.checkout_url
      );
    } catch (err: any) {
      console.error(
        '[Checkout] Order submission error:',
        err
      );

      setStatus('idle');

      /*
       * Never leave the lock active after an error.
       */

      submitLockRef.current =
        false;

      const rawMessage =
        String(
          err?.message || ''
        );

      const lowerMessage =
        rawMessage.toLowerCase();

      /*
       * -------------------------------------------------------
       * AUTH ERROR
       * -------------------------------------------------------
       */

      if (
        lowerMessage.includes(
          'invalid refresh token'
        ) ||
        lowerMessage.includes(
          'refresh token not found'
        ) ||
        lowerMessage.includes(
          'refresh_token_not_found'
        )
      ) {
        setErrorMessage(
          isCashPayment
            ? 'Your admin session has expired. Please sign in again before creating a cash order.'
            : 'Your login session expired. Please try checkout again.'
        );

        return;
      }

      /*
       * -------------------------------------------------------
       * RATE LIMIT
       * -------------------------------------------------------
       */

      if (
        lowerMessage.includes(
          'too many'
        ) ||
        lowerMessage.includes(
          'rate limit'
        ) ||
        lowerMessage.includes(
          '429'
        )
      ) {
        setErrorMessage(
          'Too many checkout attempts. Please wait a few minutes before trying again.'
        );

        return;
      }

      /*
       * -------------------------------------------------------
       * NORMAL ERROR
       * -------------------------------------------------------
       */

      setErrorMessage(
        rawMessage ||
          'Failed to process order.'
      );
    }
  };

  /*
   * =========================================================
   * STRIPE RETURN LOADING
   * =========================================================
   *
   * Because isConfirmingStripeReturn is initialized from
   * window.location.search, this screen is rendered on the
   * FIRST render after Stripe redirects back.
   *
   * This prevents:
   *
   * Checkout UI
   *      ↓
   * flash
   *      ↓
   * Confirming payment...
   *
   * Instead:
   *
   * Confirming payment...
   *      ↓
   * Success
   */

  if (
    isConfirmingStripeReturn &&
    status !== 'success'
  ) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen w-full flex items-center justify-center px-4 transition-none">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin mx-auto mb-5" />

          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Confirming payment...
          </p>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * SUCCESS
   * =========================================================
   */

  if (
    status === 'success'
  ) {
    const isCompleted =
      dbOrderStatus === 'done';

    return (
      <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen flex flex-col justify-start items-center px-4 pb-12 pt-[calc(5rem+env(safe-area-inset-top)+2rem)] md:pt-[calc(7rem+env(safe-area-inset-top)+2rem)] transition-colors">
        <div className="max-w-md text-center pt-8 md:pt-12">
          <div className="w-20 h-20 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white dark:text-neutral-950" />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
            Order Confirmed!
          </h1>

          <div className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider mb-4">
            <span
              className={`w-2 h-2 rounded-full ${
                isCompleted
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-indigo-500 animate-pulse'
              }`}
            />

            <span
              className={`font-bold ${
                isCompleted
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              Status:{' '}
              {String(
                dbOrderStatus ||
                  'paid'
              ).toUpperCase()}
            </span>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-2">
            {isCompleted
              ? 'Your order has been completed and processed!'
              : "Thank you for your purchase. We've received your order."}
          </p>

          {orderId && (
            <p className="text-neutral-500 text-sm mb-8">
              Order reference:{' '}
              <span className="text-neutral-800 dark:text-neutral-300 font-mono">
                {orderId
                  .slice(0, 8)
                  .toUpperCase()}
              </span>
            </p>
          )}

          <Link
            to="/store"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-sm uppercase tracking-wider rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * EMPTY CART
   * =========================================================
   */

  if (
    items.length === 0
  ) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen flex items-center justify-center px-4 transition-colors">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-neutral-500 dark:text-neutral-600" />
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Your cart is empty
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Add some kits to your cart before checking out.
          </p>

          <Link
            to="/store"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all hover:scale-105"
          >
            Browse the Store
          </Link>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * CHECKOUT UI
   * =========================================================
   */

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          type="button"
          onClick={() =>
            navigate('/store')
          }
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />

          Continue Shopping
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight mb-8">
          Checkout
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />

            <span>
              {errorMessage}
            </span>
          </div>
        )}

        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start"
        >
          <div className="w-full space-y-6 order-1">
            {/* CONTACT */}

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm dark:shadow-none">
              <h2 className="text-neutral-900 dark:text-white font-bold text-lg mb-4">
                Contact Information
              </h2>

              <div className="space-y-4">
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  style={{
                    fontSize: '16px',
                  }}
                  className={
                    inputClass
                  }
                />

                <input
                  required
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  style={{
                    fontSize: '16px',
                  }}
                  className={
                    inputClass
                  }
                />

                <input
                  required
                  type="text"
                  placeholder="Full name"
                  value={
                    form.full_name
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      full_name:
                        e.target.value,
                    })
                  }
                  style={{
                    fontSize: '16px',
                  }}
                  className={
                    inputClass
                  }
                />
              </div>
            </div>

            {/* SHIPPING */}

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm dark:shadow-none">
              <h2 className="text-neutral-900 dark:text-white font-bold text-lg mb-4">
                Shipping Address
              </h2>

              <div className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Street address"
                  value={
                    form.shipping_address
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shipping_address:
                        e.target.value,
                    })
                  }
                  style={{
                    fontSize: '16px',
                  }}
                  className={
                    inputClass
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        city: e.target.value,
                      })
                    }
                    style={{
                      fontSize: '16px',
                    }}
                    className={
                      inputClass
                    }
                  />

                  <input
                    required
                    type="text"
                    placeholder="Postal code"
                    value={
                      form.postal_code
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        postal_code:
                          e.target.value,
                      })
                    }
                    style={{
                      fontSize: '16px',
                    }}
                    className={
                      inputClass
                    }
                  />
                </div>

                <select
                  value={form.country}
                  onChange={(e) =>
                    handleCountryChange(
                      e.target.value
                    )
                  }
                  style={{
                    fontSize: '16px',
                  }}
                  className={
                    inputClass +
                    ' cursor-pointer'
                  }
                >
                  {Object.keys(
                    COUNTRY_CONFIG
                  ).map(
                    (country) => (
                      <option
                        key={country}
                        value={
                          country
                        }
                      >
                        {country}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* NOTES */}

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm dark:shadow-none">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-neutral-900 dark:text-white font-bold text-lg">
                  Order Notes (Optional)
                </h2>

                <span className="text-xs text-neutral-500 font-mono">
                  {wordCount} / 200
                  words
                </span>
              </div>

              <textarea
                rows={3}
                placeholder="Delivery instructions, gift notes, wheel setup, etc."
                value={form.notes}
                onChange={
                  handleNotesChange
                }
                style={{
                  fontSize: '16px',
                }}
                className={
                  inputClass +
                  ' resize-none'
                }
              />
            </div>

            {/* PAYMENT */}

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 mb-4">
                {isCashPayment ? (
                  <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <CreditCard className="w-5 h-5 text-neutral-900 dark:text-white" />
                )}

                <h2 className="text-neutral-900 dark:text-white font-bold text-lg">
                  {isCashPayment
                    ? 'Payment (Cash on Store)'
                    : 'Payment'}
                </h2>
              </div>

              {isCashPayment ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />

                  <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                    Store Cash Payment
                    detected. Stripe
                    checkout will be
                    bypassed.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <Lock className="w-5 h-5 text-neutral-500" />

                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Secure checkout
                    powered by Stripe.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY
              ================================================= */}

          <div
            className="
              w-full
              order-2
              lg:sticky
              lg:top-32
              lg:pt-8
              xl:top-36
              xl:pt-10
              self-start
              space-y-6
            "
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6 shadow-sm dark:shadow-none">
              <div className="flex justify-between items-center">
                <h2 className="text-neutral-900 dark:text-white font-bold text-lg">
                  Order Summary
                </h2>

                <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-xs px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-700/50">
                  <SelectedCountryFlag className="w-4 h-3 object-cover rounded-sm" />

                  <span>
                    {globalCurrency}
                  </span>
                </div>
              </div>

              {/* ITEMS */}

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(
                  (
                    item,
                    idx
                  ) => {
                    if (
                      !item?.product
                    ) {
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs"
                        >
                          Failed to
                          fetch
                          product
                          details
                        </div>
                      );
                    }

                    const prod =
                      item.product as any;

                    const unitPriceUSD =
                      getProductPriceUSD(
                        prod.price
                      );

                    const displayColorName =
                      item.selectedColor ||
                      prod.selectedColor;

                    const matchedColorObj =
                      (
                        prod.colors as any[]
                      )?.find(
                        (color) =>
                          color.name
                            ?.toLowerCase() ===
                          displayColorName?.toLowerCase()
                      );

                    const displayImage =
                      item.selectedImage ||
                      matchedColorObj?.thumbnail ||
                      matchedColorObj?.gallery?.[0] ||
                      prod.image_url;

                    return (
                      <div
                        key={`${prod.id}-${displayColorName || idx}`}
                        className="flex gap-3 items-center"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                          <img
                            src={
                              displayImage
                            }
                            alt={
                              prod.name
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-neutral-900 dark:text-white text-sm font-semibold truncate">
                            {prod.name}
                          </p>

                          <p className="text-neutral-500 text-xs truncate">
                            Qty:{' '}
                            {
                              item.quantity
                            }{' '}
                            {displayColorName
                              ? `· Color: ${displayColorName}`
                              : ''}
                          </p>
                        </div>

                        <p className="text-neutral-900 dark:text-white text-sm font-bold flex-shrink-0">
                          {unitPriceUSD ===
                          0
                            ? 'Free'
                            : renderFormattedPrice(
                                unitPriceUSD *
                                  item.quantity
                              )}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>

              {/* COUPON */}

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                <label className="block text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Coupon Code
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />

                      <span className="font-mono font-bold">
                        {
                          appliedCoupon.code
                        }
                      </span>

                      <span className="text-xs">
                        (
                        {appliedCoupon.discountType ===
                        'percentage'
                          ? `${appliedCoupon.discountValue}% OFF`
                          : `-${renderFormattedPrice(
                              discountAmountUSD
                            )}`}
                        )
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={
                        removeCoupon
                      }
                      className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={
                        couponInput
                      }
                      onChange={(e) =>
                        setCouponInput(
                          e.target.value
                        )
                      }
                      style={{
                        fontSize:
                          '16px',
                      }}
                      className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 font-mono focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-600 uppercase"
                    />

                    <button
                      type="button"
                      onClick={
                        handleApplyCoupon
                      }
                      disabled={
                        isValidatingCoupon ||
                        !couponInput.trim()
                      }
                      className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-xs rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    >
                      {isValidatingCoupon
                        ? 'Checking...'
                        : 'Apply'}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {
                      couponError
                    }
                  </p>
                )}
              </div>

              {/* TOTALS */}

              <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Subtotal
                  </span>

                  <span className="text-neutral-900 dark:text-white">
                    {normalizedSubtotalUSD ===
                    0
                      ? 'Free'
                      : renderFormattedPrice(
                          normalizedSubtotalUSD
                        )}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                    <span>
                      Discount (
                      {
                        appliedCoupon.code
                      }
                      )
                    </span>

                    <span>
                      -
                      {renderFormattedPrice(
                        discountAmountUSD
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Shipping
                  </span>

                  <span className="text-neutral-900 dark:text-white">
                    {baseShippingUSD ===
                    0
                      ? 'Free'
                      : renderFormattedPrice(
                          baseShippingUSD
                        )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Tax{' '}
                    {taxRate > 0
                      ? `(${taxRate * 100}%)`
                      : ''}
                  </span>

                  <span className="text-neutral-900 dark:text-white">
                    {taxRate === 0 ||
                    baseTaxUSD === 0
                      ? 'Free'
                      : renderFormattedPrice(
                          baseTaxUSD
                        )}
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-900 dark:text-white font-bold">
                    Total
                  </span>

                  <span className="text-neutral-900 dark:text-white text-xl font-bold">
                    {baseTotalUSD ===
                    0
                      ? 'Free'
                      : renderFormattedPrice(
                          baseTotalUSD
                        )}
                  </span>
                </div>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                form="checkout-form"
                disabled={
                  status ===
                  'submitting'
                }
                className={`flex items-center justify-center gap-2 w-full py-4 text-white dark:text-neutral-950 font-bold text-sm uppercase tracking-wider rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                  isCashPayment
                    ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-white'
                    : 'bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200'
                }`}
              >
                {status ===
                'submitting'
                  ? 'Processing...'
                  : isCashPayment
                  ? `Place Cash Order · ${renderFormattedPrice(
                      baseTotalUSD
                    )}`
                  : baseTotalUSD ===
                    0
                  ? 'Place Order · Free'
                  : `Place Order · ${renderFormattedPrice(
                      baseTotalUSD
                    )}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
 * ===========================================================
 * INPUT STYLE
 * ===========================================================
 */

const inputClass =
  'w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-[16px] focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-600 transition-colors';
