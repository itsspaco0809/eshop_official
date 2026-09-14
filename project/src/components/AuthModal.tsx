import { useEffect, useRef, useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { signIn, signUp } = useAuth();

  const [isRendered, setIsRendered] =
    useState(isOpen);

  const [isAnimating, setIsAnimating] =
    useState(false);

  const [mode, setMode] = useState<
    'login' | 'register'
  >('login');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const closeTimerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const closeDuration = 220;

  /*
   * =========================================================
   * MODAL OPEN / CLOSE ANIMATION
   *
   * IMPORTANT:
   *
   * This component intentionally does NOT modify
   * document.body.style.overflow.
   *
   * Navbar / other surface controllers own page scrolling.
   * This prevents AuthModal from fighting with the mobile
   * hamburger's fixed-body scroll lock.
   * =========================================================
   */

  useEffect(() => {
    if (closeTimerRef.current) {
      clearTimeout(
        closeTimerRef.current
      );

      closeTimerRef.current =
        null;
    }

    if (
      animationFrameRef.current !==
      null
    ) {
      cancelAnimationFrame(
        animationFrameRef.current
      );

      animationFrameRef.current =
        null;
    }

    if (isOpen) {
      setIsRendered(true);

      setError(null);
      setPassword('');
      setConfirmPassword('');

      /*
       * Let React render the modal first, then animate.
       */
      animationFrameRef.current =
        requestAnimationFrame(() => {
          animationFrameRef.current =
            requestAnimationFrame(() => {
              setIsAnimating(true);

              animationFrameRef.current =
                null;
            });
        });
    } else {
      /*
       * Start close animation.
       */
      setIsAnimating(false);

      closeTimerRef.current =
        setTimeout(() => {
          setIsRendered(false);

          closeTimerRef.current =
            null;
        }, closeDuration);
    }

    return () => {
      if (
        closeTimerRef.current
      ) {
        clearTimeout(
          closeTimerRef.current
        );

        closeTimerRef.current =
          null;
      }

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }
    };
  }, [isOpen]);

  /*
   * =========================================================
   * CLOSE
   * =========================================================
   */

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);

    if (
      mode === 'register' &&
      password !== confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      );

      return;
    }

    if (
      mode === 'register' &&
      password.length < 6
    ) {
      setError(
        'Password must be at least 6 characters.'
      );

      return;
    }

    setLoading(true);

    const result =
      mode === 'login'
        ? await signIn(
            email,
            password
          )
        : await signUp(
            email,
            password
          );

    setLoading(false);

    if (result.error) {
      setError(result.error);

      return;
    }

    /*
     * Clear credentials before closing.
     */
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    /*
     * Navbar owns the scroll restoration.
     */
    onClose();
  };

  /*
   * =========================================================
   * LOGIN / REGISTER MODE
   * =========================================================
   */

  const handleModeChange = () => {
    if (loading) {
      return;
    }

    setMode(
      (currentMode) =>
        currentMode === 'login'
          ? 'register'
          : 'login'
    );

    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  /*
   * =========================================================
   * UNMOUNT
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (
        closeTimerRef.current
      ) {
        clearTimeout(
          closeTimerRef.current
        );

        closeTimerRef.current =
          null;
      }

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }
    };
  }, []);

  if (!isRendered) {
    return null;
  }

  const inputClass =
    'w-full rounded-xl border py-3.5 pl-11 pr-4 text-base outline-none transition-all duration-200 ' +
    'bg-white border-neutral-200 text-neutral-950 placeholder:text-neutral-400 ' +
    'focus:border-neutral-400 focus:ring-4 focus:ring-neutral-950/[0.04] ' +
    'dark:bg-neutral-950 dark:border-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ' +
    'dark:focus:border-neutral-600 dark:focus:ring-white/[0.05]';

  return (
    <div
      className={`
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        p-4
        transition-opacity
        duration-[220ms]
        ease-out

        ${
          isAnimating
            ? 'opacity-100'
            : 'opacity-0'
        }
      `}
      aria-hidden={
        !isAnimating
      }
    >
      {/* =====================================================
          BACKDROP
          ===================================================== */}

      <div
        className={`
          absolute
          inset-0
          bg-black/35
          backdrop-blur-[3px]
          transition-all
          duration-[220ms]
          ease-out
          dark:bg-black/60

          ${
            isAnimating
              ? 'opacity-100 backdrop-blur-[3px]'
              : 'opacity-0 backdrop-blur-none'
          }
        `}
        onClick={
          handleClose
        }
      />

      {/* =====================================================
          MODAL
          ===================================================== */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className={`
          relative
          z-10
          w-full
          max-w-[420px]
          overflow-hidden
          rounded-3xl
          border
          shadow-2xl
          transition-all
          duration-[220ms]
          ease-out

          ${
            isAnimating
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-3 scale-[0.975] opacity-0'
          }

          bg-white
          border-neutral-200
          shadow-black/10

          dark:bg-neutral-900
          dark:border-neutral-800
          dark:shadow-black/50
        `}
      >
        {/* Top subtle accent */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-px
            bg-neutral-300
            dark:bg-neutral-700
          "
        />

        {/* ===================================================
            CLOSE BUTTON
            =================================================== */}

        <button
          type="button"
          onClick={
            handleClose
          }
          disabled={loading}
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-neutral-500
            transition-all
            duration-200
            hover:bg-neutral-100
            hover:text-neutral-950
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:text-neutral-400
            dark:hover:bg-neutral-800
            dark:hover:text-white
          "
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* =================================================
              HEADER
              ================================================= */}

          <div className="mb-7 text-center">
            <div className="mb-5 flex justify-center">
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-neutral-100
                  shadow-sm
                  dark:border-neutral-700
                  dark:bg-neutral-800
                "
              >
                <UserIcon
                  className="
                    h-6
                    w-6
                    text-neutral-900
                    dark:text-white
                  "
                />
              </div>
            </div>

            <h2
              id="auth-modal-title"
              className="
                text-2xl
                font-bold
                tracking-tight
                text-neutral-950
                dark:text-white
              "
            >
              {mode === 'login'
                ? 'Welcome back'
                : 'Create your account'}
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-[290px]
                text-sm
                leading-6
                text-neutral-500
                dark:text-neutral-400
              "
            >
              {mode === 'login'
                ? 'Sign in to view your orders and manage your account.'
                : 'Create an account to track your orders and save your information.'}
            </p>
          </div>

          {/* =================================================
              FORM
              ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-3.5"
          >
            {/* Email */}
            <div className="relative">
              <Mail
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  h-[18px]
                  w-[18px]
                  -translate-y-1/2
                  text-neutral-400
                  dark:text-neutral-500
                "
              />

              <input
                required
                autoComplete="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                disabled={loading}
                className={
                  inputClass
                }
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  h-[18px]
                  w-[18px]
                  -translate-y-1/2
                  text-neutral-400
                  dark:text-neutral-500
                "
              />

              <input
                required
                autoComplete={
                  mode ===
                  'login'
                    ? 'current-password'
                    : 'new-password'
                }
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                disabled={loading}
                className={
                  inputClass
                }
              />
            </div>

            {/* Confirm Password */}
            <div
              className={`
                grid
                transition-all
                duration-200
                ease-out

                ${
                  mode ===
                  'register'
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }
              `}
            >
              <div className="overflow-hidden">
                <div className="relative pt-3.5">
                  <Lock
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-[calc(50%+7px)]
                      h-[18px]
                      w-[18px]
                      -translate-y-1/2
                      text-neutral-400
                      dark:text-neutral-500
                    "
                  />

                  <input
                    required={
                      mode ===
                      'register'
                    }
                    autoComplete="new-password"
                    type="password"
                    placeholder="Confirm password"
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    disabled={
                      loading ||
                      mode !==
                        'register'
                    }
                    tabIndex={
                      mode ===
                      'register'
                        ? 0
                        : -1
                    }
                    className={
                      inputClass
                    }
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            <div
              className={`
                grid
                transition-all
                duration-200

                ${
                  error
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }
              `}
            >
              <div className="overflow-hidden">
                <div
                  className="
                    rounded-xl
                    border
                    border-red-500/25
                    bg-red-500/10
                    px-4
                    py-3
                    text-sm
                    text-red-600
                    dark:text-red-400
                  "
                >
                  {error ||
                    ''}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-neutral-950
                py-3.5
                text-sm
                font-bold
                uppercase
                tracking-[0.12em]
                text-white
                transition-all
                duration-200
                hover:bg-neutral-800
                hover:shadow-lg
                hover:shadow-black/10
                active:scale-[0.985]
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:bg-white
                dark:text-neutral-950
                dark:hover:bg-neutral-200
              "
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />

                  <span>
                    Please wait
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode ===
                    'login'
                      ? 'Sign in'
                      : 'Create account'}
                  </span>

                  <ArrowRight
                    className="
                      h-4
                      w-4
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                    "
                  />
                </>
              )}
            </button>
          </form>

          {/* =================================================
              DIVIDER
              ================================================= */}

          <div className="my-6 flex items-center gap-4">
            <div
              className="
                h-px
                flex-1
                bg-neutral-200
                dark:bg-neutral-800
              "
            />

            <span
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-neutral-400
                dark:text-neutral-500
              "
            >
              or
            </span>

            <div
              className="
                h-px
                flex-1
                bg-neutral-200
                dark:bg-neutral-800
              "
            />
          </div>

          {/* =================================================
              TOGGLE MODE
              ================================================= */}

          <p
            className="
              text-center
              text-sm
              text-neutral-500
              dark:text-neutral-400
            "
          >
            {mode ===
            'login'
              ? "Don't have an account?"
              : 'Already have an account?'}

            <button
              type="button"
              onClick={
                handleModeChange
              }
              disabled={loading}
              className="
                ml-1.5
                font-semibold
                text-neutral-950
                underline
                decoration-neutral-300
                underline-offset-4
                transition-colors
                hover:decoration-neutral-950
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:text-white
                dark:decoration-neutral-700
                dark:hover:decoration-white
              "
            >
              {mode ===
              'login'
                ? 'Create one'
                : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}