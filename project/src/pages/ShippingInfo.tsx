import { Truck } from 'lucide-react';

export default function ShippingInfo() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="pt-16 md:pt-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-7 h-7 text-neutral-900 dark:text-white" />

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Shipping Info
            </h1>
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg">
            Everything you need to know about how your order is prepared,
            shipped, tracked, and delivered.
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">

          {/* =================================================
              1. WHERE WE SHIP FROM
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Where is LCP.works based?
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works is a{' '}
              <strong className="text-neutral-900 dark:text-white">
                Hong Kong-based brand
              </strong>
              , and orders are shipped directly from Hong Kong.
            </p>
          </section>

          {/* =================================================
              2. PROCESSING TIMES
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Order Processing & Preparation
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Please allow{' '}
              <strong className="text-neutral-900 dark:text-white">
                2–3 weeks for us to prepare your order
              </strong>{' '}
              before it is shipped.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Many LCP.works products are prepared on demand rather than
              being dispatched immediately from pre-packed inventory.
              Preparation time may therefore vary depending on the product,
              order volume, availability of components, and production
              schedule.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              During product launches, promotional periods, holidays, or
              periods of unusually high order volume, preparation may take
              longer than the estimated timeframe above.
            </p>
          </section>

          {/* =================================================
              3. SHIPPING TIMES
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Shipping & Delivery Times
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Once your order has been prepared, it will be handed to the
              selected shipping carrier. Actual delivery time depends on
              your destination, shipping service, customs processing, and
              local delivery conditions.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                  <tr>
                    <th className="p-4 font-medium">
                      Region
                    </th>

                    <th className="p-4 font-medium">
                      Shipping Service
                    </th>

                    <th className="p-4 font-medium">
                      Estimated Time
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  <tr>
                    <td className="p-4">
                      Hong Kong
                    </td>

                    <td className="p-4">
                      Hong Kong Post
                    </td>

                    <td className="p-4">
                      3–7 business days
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4">
                      Hong Kong
                    </td>

                    <td className="p-4">
                      SF Express
                    </td>

                    <td className="p-4">
                      2–5 business days
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4">
                      International
                    </td>

                    <td className="p-4">
                      SF Express / DHL
                    </td>

                    <td className="p-4">
                      Varies by destination
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-neutral-400 mt-3">
              Delivery estimates are provided as a guide only and are not
              guaranteed. Actual delivery times may be affected by customs
              clearance, local postal services, weather, public holidays,
              carrier delays, or other circumstances outside our control.
            </p>
          </section>

          {/* =================================================
              4. TRACKING
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Tracking
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <strong className="text-neutral-900 dark:text-white">
                Tracking is provided for shipped orders.
              </strong>{' '}
              Once your order has been dispatched, tracking information will
              be provided so you can follow the progress of your shipment.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Please note that tracking information may take some time to
              become active after the parcel has been handed to the carrier.
            </p>
          </section>

          {/* =================================================
              5. INTERNATIONAL ORDERS
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              International Orders
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works ships internationally. Delivery availability and
              shipping options may vary depending on the destination country.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              International orders may be subject to customs duties, import
              taxes, VAT, customs handling fees, or other charges imposed by
              the destination country.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              These charges are the responsibility of the recipient unless
              otherwise stated at checkout. LCP.works does not control the
              amount of customs duties or taxes charged by the destination
              country.
            </p>
          </section>

          {/* =================================================
              6. CUSTOMS DELAYS
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Customs & Delivery Delays
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              International shipments may be delayed while undergoing customs
              inspection or clearance. Customs authorities may also request
              additional information or payment from the recipient before the
              shipment can be delivered.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              LCP.works is not responsible for delays caused by customs
              authorities, postal carriers, courier services, weather events,
              public holidays, transportation disruptions, or other events
              outside our reasonable control.
            </p>
          </section>

          {/* =================================================
              7. SHIPPING ADDRESS
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Shipping Address
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Customers are responsible for providing a complete and accurate
              shipping address when placing an order.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If you notice an incorrect address after placing your order,
              please contact us as soon as possible at{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                cs@lcpworks.com
              </a>
              .
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Address changes can only be made if the order has not yet been
              dispatched. Once an order has shipped, we may be unable to
              redirect or modify the shipment.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              LCP.works is not responsible for delivery failures resulting
              from an incorrect or incomplete shipping address supplied by
              the customer.
            </p>
          </section>

          {/* =================================================
              8. PRE-ORDERS / BUILD-TO-ORDER
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Pre-Orders & Build-to-Order Products
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Some LCP.works products may be offered as pre-orders or
              build-to-order products.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Products that require additional preparation may have a longer
              processing period than standard ready-to-ship products. Any
              specific estimated preparation or release timeframe will be
              communicated on the relevant product page where applicable.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If an order contains multiple products with different
              availability or preparation periods, the order may be shipped
              once the relevant items are ready, unless otherwise agreed with
              the customer.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Estimated preparation and release dates are provided as
              estimates and may change due to production, component
              availability, or shipping circumstances.
            </p>
          </section>

          {/* =================================================
              9. CAN I CHANGE / CANCEL?
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Can I Change or Cancel My Order?
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If your order has not yet been shipped, please contact us as
              soon as possible if you need to change your shipping details or
              request a cancellation.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Because some products may begin preparation shortly after an
              order is placed, we cannot guarantee that every cancellation or
              change request can be accommodated.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Once an order has been dispatched, changes or cancellations may
              no longer be possible.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              For more information about cancellations and refunds, please
              refer to our applicable refund and cancellation policies.
            </p>
          </section>

          {/* =================================================
              10. LOST / DELAYED / DAMAGED
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Lost, Delayed or Damaged Packages
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If your parcel appears to be delayed, lost, or delivered with
              visible damage, please contact us at{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                cs@lcpworks.com
              </a>{' '}
              as soon as possible.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              For damaged deliveries, please provide photographs of the
              product, packaging, shipping label, and any visible damage.
              This information helps us investigate the issue with the
              shipping carrier and determine the appropriate resolution.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If a shipment is lost or significantly delayed, we will work
              with the relevant carrier to investigate the shipment and assist
              with the next steps where possible.
            </p>
          </section>

          {/* =================================================
              11. DELIVERY ATTEMPTS
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Delivery Attempts
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Customers are responsible for ensuring that the shipping
              address is accessible and that any required delivery
              instructions are accurate.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              If a carrier is unable to complete delivery because of an
              incorrect address, failure to receive the parcel, unpaid
              customs charges, or other circumstances attributable to the
              recipient, additional delivery or return costs may apply.
            </p>
          </section>

          {/* =================================================
              12. SHIPPING CARRIERS
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Shipping Carriers
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Depending on the destination and service selected, orders may
              be shipped using carriers such as Hong Kong Post, SF Express,
              DHL, or another available shipping provider.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              The shipping carrier available for a particular order may vary
              based on destination, package size, service availability, and
              other logistical considerations.
            </p>
          </section>

          {/* =================================================
              13. SHIPPING ESTIMATES
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Important Delivery Notice
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              All preparation and delivery timeframes shown on this page are
              estimates only. They are intended to provide a general
              indication of expected delivery timing and do not constitute a
              guaranteed delivery date.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              Delays may occur due to circumstances outside our control,
              including carrier congestion, customs clearance, weather,
              public holidays, transportation disruptions, or other
              unforeseen events.
            </p>
          </section>

          {/* =================================================
              14. QUESTIONS
              ================================================= */}

          <section>
            <h2 className="text-xl font-bold mb-3">
              Questions?
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you have a shipping-related question that is not covered
              here, please contact us through our Contact page or email{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                cs@lcpworks.com
              </a>
              .
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              We will do our best to assist with your order and provide the
              most accurate information available.
            </p>
          </section>

          {/* =================================================
              LAST UPDATED
              ================================================= */}

          <p className="text-sm text-neutral-400 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            Last updated: September 2026
          </p>
        </div>
      </div>
    </div>
  );
}