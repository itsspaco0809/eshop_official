import { Ban } from 'lucide-react';

export default function CancellationPolicy() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="pt-16 md:pt-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="flex items-center gap-3 mb-2">
            <Ban className="w-7 h-7 text-neutral-900 dark:text-white" />

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Cancellation Policy
            </h1>
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg">
            Information about cancelling orders before and after shipment.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">

          {/* =====================================================
              GENERAL
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              General Cancellation Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you need to cancel an order, please contact us as soon as
              possible after placing your order. We will review the status of
              the order and determine whether the cancellation can still be
              processed.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Because some LCP.works products may require preparation,
              assembly, sourcing, or other work after an order is placed,
              cancellation requests cannot always be guaranteed.
            </p>
          </section>

          {/* =====================================================
              BEFORE PREPARATION
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Cancellation Before Preparation
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If an order has not yet entered preparation, you may contact us
              to request cancellation.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              We will make reasonable efforts to accommodate cancellation
              requests received before preparation begins, but cancellation
              is not guaranteed until confirmed by LCP.works.
            </p>
          </section>

          {/* =====================================================
              DURING PREPARATION
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Orders Already in Preparation
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Once preparation, assembly, customization, sourcing, or other
              order-specific work has started, cancellation may no longer be
              possible.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              This is because work or materials may already have been
              allocated specifically for the order.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If you request cancellation after preparation has started,
              please contact us and we will review the specific circumstances
              of your order.
            </p>
          </section>

          {/* =====================================================
              AFTER SHIPMENT
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Orders That Have Been Shipped
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Once an order has been dispatched to the shipping carrier,
              cancellation is generally no longer possible.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If you no longer want an order after it has shipped, please
              contact us. Depending on the circumstances, you may need to
              receive the shipment and follow the applicable return or refund
              process.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Please do not refuse or abandon a shipment without contacting
              us first, as this may affect the available resolution and any
              applicable shipping or return costs.
            </p>
          </section>

          {/* =====================================================
              PRE-ORDERS
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Pre-Orders
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Some products may be offered as pre-orders. Pre-order products
              may require preparation or production before they are ready for
              shipment.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If you wish to cancel a pre-order, please contact us as early
              as possible. Cancellation may be possible before preparation or
              production begins, but cannot be guaranteed after work has
              started.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Any specific cancellation conditions stated on the relevant
              product page at the time of purchase will also apply.
            </p>
          </section>

          {/* =====================================================
              BUILD TO ORDER
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Build-to-Order & Custom Products
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Products that are made, assembled, prepared, or customized
              specifically for an order may have different cancellation
              conditions from standard products.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Once work has started on a build-to-order or customized product,
              cancellation may no longer be available.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If you are unsure whether your order can still be cancelled,
              please contact us before making any assumptions about
              cancellation eligibility.
            </p>
          </section>

          {/* =====================================================
              HOW TO REQUEST
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              How to Request a Cancellation
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              To request a cancellation, please email us at{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                cs@lcpworks.com
              </a>{' '}
              as soon as possible.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Please include your order number and the email address used to
              place the order so that we can identify the order and review its
              current status.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              A cancellation request is not considered confirmed until
              LCP.works confirms that the order has been successfully
              cancelled.
            </p>
          </section>

          {/* =====================================================
              REFUND AFTER CANCELLATION
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Refunds After Cancellation
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If a cancellation is approved and a refund is applicable, the
              refund will generally be issued to the original payment method
              used for the order.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              The time required for the refund to appear in your account may
              vary depending on your payment provider, card issuer, bank, or
              other financial institution.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              For additional information about refunds, please refer to our
              Refund Policy.
            </p>
          </section>

          {/* =====================================================
              PARTIAL CANCELLATION
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Cancelling Part of an Order
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you wish to cancel only part of an order containing multiple
              products, please contact us as soon as possible.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Whether an individual item can be cancelled may depend on its
              preparation status and whether order-specific work has already
              begun.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              We will review the request and confirm what can be cancelled
              before making any changes to the order.
            </p>
          </section>

          {/* =====================================================
              IMPORTANT NOTICE
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Important Notice
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Submitting a cancellation request does not automatically cancel
              an order.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Orders may continue to be processed while a request is being
              reviewed. For this reason, customers should contact us as soon
              as possible if they no longer wish to proceed with an order.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Product-specific terms shown at checkout or on the relevant
              product page may apply in addition to this policy.
            </p>
          </section>

          {/* =====================================================
              CONTACT
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Questions?
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you have any questions about cancelling an order, please
              contact us through our Contact page or email{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                cs@lcpworks.com
              </a>
              .
            </p>
          </section>

          <p className="text-sm text-neutral-400 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            Last updated: September 2026
          </p>
        </div>
      </div>
    </div>
  );
}