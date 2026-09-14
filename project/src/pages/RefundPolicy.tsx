import { RotateCcw } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="pt-16 md:pt-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="w-7 h-7 text-neutral-900 dark:text-white" />

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Refund Policy
            </h1>
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg">
            Information about refunds, returns, cancellations, and
            order-related issues.
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
              General Refund Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We want you to have a positive experience with LCP.works.
              If you experience an issue with an order or product, please
              contact us as soon as possible so we can review the situation
              and determine the appropriate solution.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Refund requests are reviewed on a case-by-case basis and may
              depend on the condition of the product, the reason for the
              request, whether the order has been shipped, and the type of
              product purchased.
            </p>
          </section>

          {/* =====================================================
              ELIGIBILITY
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Refund Eligibility
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Refunds may be considered in situations including, but not
              limited to:
            </p>

            <ul className="list-disc pl-5 mt-3 space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>
                An item arrives damaged or materially defective.
              </li>
              <li>
                An incorrect item was sent.
              </li>
              <li>
                An order cannot be fulfilled by LCP.works.
              </li>
              <li>
                A refund is otherwise agreed with LCP.works before the
                order is completed.
              </li>
            </ul>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              A refund is not automatically available simply because a
              customer changes their mind after an order has been placed.
              Please contact us before assuming that an order is eligible
              for a refund.
            </p>
          </section>

          {/* =====================================================
              DAMAGED / DEFECTIVE
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Damaged or Defective Products
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If your order arrives damaged or you believe a product is
              defective, please contact us at{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                cs@lcpworks.com
              </a>{' '}
              as soon as possible.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Please include your order information and clear photographs
              showing the product, packaging, shipping label, and any visible
              damage or defect. This information allows us to investigate the
              issue and determine the appropriate resolution.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Depending on the circumstances, we may offer a replacement,
              partial refund, full refund, or another suitable resolution.
            </p>
          </section>

          {/* =====================================================
              WRONG ITEM
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Incorrect or Missing Items
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you receive an incorrect item or an item is missing from
              your order, please contact us at{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                cs@lcpworks.com
              </a>{' '}
              with your order information and photographs where applicable.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              We will review the order and work with you to determine the
              appropriate solution.
            </p>
          </section>

          {/* =====================================================
              RETURN REQUEST
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Returns
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Returns are not automatically accepted for every order.
              Please contact us before sending any product back.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If a return is approved, we will provide instructions regarding
              the return process and the required condition of the product.
              Products should not be returned without prior approval.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Unless otherwise agreed, returned products should be in their
              original condition and include the relevant packaging and
              accessories.
            </p>
          </section>

          {/* =====================================================
              NON-REFUNDABLE
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Products That May Not Be Eligible for Refund
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Certain products or circumstances may not be eligible for a
              refund, including products that have been substantially used,
              modified, damaged after delivery, or otherwise altered by the
              customer.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Digital products or downloadable files may also be subject to
              different refund conditions because they cannot necessarily be
              physically returned once access or delivery has been provided.
            </p>
          </section>

          {/* =====================================================
              DIGITAL PRODUCTS
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Digital Products & Files
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Due to the nature of digital products, downloadable files,
              instructions, or other digital content, refunds may not be
              available once the digital product has been downloaded,
              accessed, or delivered.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If you experience a technical issue, receive an incorrect file,
              or are unable to access a purchased digital product, please
              contact us at{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                cs@lcpworks.com
              </a>
              .
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              We will review the issue and, where appropriate, provide a
              corrected file, replacement access, or another suitable
              resolution.
            </p>
          </section>

          {/* =====================================================
              SHIPPING COSTS
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Shipping Costs
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Where a refund is approved, the treatment of shipping costs
              will depend on the reason for the refund and the circumstances
              of the order.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Shipping costs may not be refundable where an order is returned
              for reasons unrelated to an error, defect, or issue attributable
              to LCP.works.
            </p>
          </section>

          {/* =====================================================
              REFUND METHOD
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Refund Method
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Approved refunds will generally be issued to the original
              payment method used for the order, unless otherwise agreed or
              where the original payment method does not allow a refund.
            </p>
          </section>

          {/* =====================================================
              REFUND PROCESSING
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Refund Processing Time
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Once a refund has been approved and processed by LCP.works,
              the time required for the funds to appear in your account may
              vary depending on your payment provider, card issuer, bank, or
              other financial institution.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              LCP.works cannot guarantee the exact time required for a
              payment provider or financial institution to complete the
              refund.
            </p>
          </section>

          {/* =====================================================
              CANCELLATION
              ===================================================== */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Order Cancellations
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Cancellation requests should be submitted as soon as possible
              after placing an order. Because some products may begin
              preparation shortly after an order is placed, we cannot
              guarantee that every cancellation request can be accepted.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              For full information about cancelling an order, please refer
              to our Cancellation Policy.
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
              If you have a question about a refund, return, damaged product,
              or order issue, please contact us through our Contact page or
              email{' '}
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