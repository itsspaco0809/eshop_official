import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <div className="pt-16 md:pt-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-7 h-7 text-neutral-900 dark:text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Terms of Service
            </h1>
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg">
            The terms and conditions governing your use of LCP.works and our products.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              1. General Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works is an online store offering custom-designed brick building
              kits, digital building instructions, digital files, and related
              products inspired by automotive culture and design.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              By accessing, browsing, creating an account, placing an order, or
              purchasing from LCP.works, you agree to be bound by these Terms of
              Service and any other policies referenced on our website.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              2. Acceptance of Terms
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              By using LCP.works, you confirm that you have read, understood, and
              agree to these Terms of Service. If you do not agree with these
              terms, please do not use our website or purchase our products.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              We may update or modify these Terms from time to time. Changes become
              effective when published on this page. Your continued use of the
              website after changes are published constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              3. Products & Availability
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Our products include physical brick building kits and digital
              products such as building instructions and digital files.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              All products are subject to availability. We make reasonable efforts
              to ensure that product descriptions, specifications, images, prices,
              and other information displayed on our website are accurate.
              However, occasional errors or omissions may occur.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              We reserve the right to correct errors, update product information,
              change availability, or discontinue products without prior notice.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              4. Product Designs & Brand Disclaimer
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works products are independently designed and are created for
              collectors, hobbyists, builders, and display purposes.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Unless explicitly stated otherwise, LCP.works is not affiliated
              with, endorsed by, sponsored by, or officially associated with
              LEGO Group or any automobile manufacturer, automotive brand,
              tuning company, racing organisation, or other third-party brand
              referenced or represented through our products.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Any third-party names, trademarks, logos, vehicle names, or other
              intellectual property remain the property of their respective
              owners and are referenced where applicable for identification,
              inspiration, or descriptive purposes.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              5. Pricing & Currency
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Product prices are displayed on our website in the selected
              currency where supported. Currency conversion may be provided for
              display and checkout purposes.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Prices may change from time to time. Any price change will not
              affect an order that has already been successfully confirmed and
              paid for, except where correction is required because of an
              obvious pricing or technical error.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Customers may be responsible for applicable customs duties,
              import taxes, VAT, or other government charges imposed by the
              destination country.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              6. Orders & Payment
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              By placing an order, you confirm that the information provided is
              accurate and complete, including your name, contact information,
              billing information, and shipping address where applicable.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              An order is considered confirmed only after payment has been
              successfully processed and the order has been accepted by
              LCP.works.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Payments are processed securely through our payment provider,
              including Stripe where applicable. LCP.works does not store
              complete payment card details on our own servers.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              We reserve the right to refuse or cancel an order where there is
              suspected fraud, unauthorised activity, a payment issue, an
              obvious pricing error, or another legitimate reason affecting
              the fulfilment of the order.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              7. Build-to-Order Products & Shipping
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Certain LCP.works physical products are built or prepared to order.
              Unless otherwise stated on the relevant product page, custom kits
              typically require approximately 4–6 weeks before shipment.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              The stated preparation time is an estimate and may vary depending
              on product availability, order volume, production requirements,
              holidays, or circumstances outside our reasonable control.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Delivery times after shipment vary depending on the destination,
              carrier, shipping service, customs processing, and other factors.
              Estimated delivery dates are provided as a guide and are not
              guaranteed.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Customers are responsible for providing a complete and accurate
              shipping address. LCP.works is not responsible for delays or
              additional costs resulting from incorrect or incomplete delivery
              information supplied by the customer.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              8. Customs, Duties & Import Charges
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              International orders may be subject to customs duties, import
              taxes, VAT, handling fees, or other charges imposed by the
              destination country.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Unless explicitly stated at checkout, these charges are the
              responsibility of the customer. LCP.works does not control the
              customs policies, fees, or processing times of individual countries.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              9. Digital Products & Licensing
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Digital products sold through LCP.works, including digital
              instructions, files, templates, or other downloadable materials,
              are licensed to the purchaser for personal use unless a different
              licence is explicitly stated on the product page.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Purchasing a digital product does not transfer ownership of the
              underlying intellectual property to the customer.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              You may not, without our prior written permission:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              <li>Resell or sublicense digital files</li>
              <li>Redistribute or publicly share digital files</li>
              <li>Upload digital files to file-sharing or download platforms</li>
              <li>Sell or distribute copies of our instructions</li>
              <li>Use our digital files to create a competing commercial product</li>
              <li>Claim our designs or digital materials as your own</li>
            </ul>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              You are responsible for keeping your purchased digital files secure
              and preventing unauthorised access or distribution.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              10. Returns, Replacements & Defective Products
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Because many LCP.works products are custom-made or prepared to
              order, returns for change of mind may not be accepted once an order
              has entered production or been dispatched, except where required
              by applicable consumer law.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              If your physical order arrives damaged, defective, or with missing
              components, please contact us as soon as reasonably possible and
              provide your order number together with clear photographs or other
              information that helps us assess the issue.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Depending on the circumstances, LCP.works may provide replacement
              parts, a replacement product, a repair or another appropriate
              remedy, including a refund where required by applicable law.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Please do not return a product without contacting us first and
              receiving return instructions where a return is required.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              11. Order Cancellations
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you need to cancel an order, please contact us as soon as
              possible after placing the order.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Cancellation requests may not be accepted once a custom or
              made-to-order product has entered production or an order has been
              dispatched.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Nothing in this section limits any cancellation or consumer rights
              that cannot legally be excluded under applicable law.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              12. Intellectual Property
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Unless otherwise stated, all content created or provided by
              LCP.works, including website content, product designs, digital
              instructions, digital files, graphics, photographs, renders,
              product descriptions, logos, branding, layouts, and other
              materials, is owned by or licensed to LCP.works.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Such content may not be copied, reproduced, modified, distributed,
              republished, commercially exploited, or used to create derivative
              commercial products without prior written permission from
              LCP.works.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              13. User Conduct
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              When using LCP.works, you agree not to:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>Use the website for unlawful or fraudulent purposes</li>
              <li>Attempt to gain unauthorised access to our systems or accounts</li>
              <li>Interfere with or disrupt the operation of the website</li>
              <li>Submit false, misleading, or malicious information</li>
              <li>Attempt to bypass security or access restrictions</li>
              <li>Copy or misuse our website content or intellectual property</li>
              <li>Redistribute purchased digital products without permission</li>
              <li>Use the website to infringe the rights of LCP.works or others</li>
            </ul>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              14. Website Availability
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We aim to keep LCP.works available and operating reliably, but we
              cannot guarantee that the website will always be available,
              uninterrupted, error-free, or free from security vulnerabilities.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              We may temporarily suspend or restrict access to parts of the
              website for maintenance, updates, security reasons, technical
              issues, or circumstances outside our reasonable control.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              15. Limitation of Liability
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              To the maximum extent permitted by applicable law, LCP.works will
              not be responsible for indirect, incidental, special, or
              consequential loss or damage arising from your use of our website,
              products, or digital products.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Where liability cannot legally be excluded or limited, our
              liability will be limited to the remedies available under
              applicable law.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Nothing in these Terms is intended to exclude, restrict, or
              modify any rights or remedies that cannot legally be excluded,
              restricted, or modified.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              16. Privacy
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Your privacy is important to us. Information collected through
              LCP.works is handled in accordance with our Privacy Policy.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Please review our Privacy Policy for information about how we
              collect, use, store, protect, and disclose personal information.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              17. Third-Party Services
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works may rely on third-party services to provide payment
              processing, hosting, analytics, shipping, authentication, email,
              security, or other functionality.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Your use of certain third-party services may also be subject to
              those providers' own terms and policies. LCP.works is not
              responsible for the independent operation, availability, or
              policies of third-party services.
            </p>
          </section>

          {/* 18 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              18. Force Majeure
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works will not be responsible for delays or failure to perform
              obligations where the cause is outside our reasonable control.
              This may include natural disasters, severe weather, war, strikes,
              government actions, transportation disruptions, customs delays,
              major technical failures, supply shortages, or other extraordinary
              circumstances.
            </p>
          </section>

          {/* 19 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              19. Changes to These Terms
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may revise these Terms of Service from time to time to reflect
              changes to our products, services, business practices, technology,
              or legal requirements.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              The latest version will always be published on this page with an
              updated "Last updated" date. Your continued use of LCP.works after
              the revised Terms are published constitutes acceptance of the
              updated Terms, to the extent permitted by applicable law.
            </p>
          </section>

          {/* 20 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              20. Governing Law
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              These Terms are governed by the laws applicable to LCP.works and
              the applicable jurisdiction in which the business is established,
              without regard to conflict-of-law principles.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Any dispute arising from these Terms or your use of LCP.works will
              be subject to the applicable courts and legal jurisdiction,
              except where mandatory consumer protection law provides otherwise.
            </p>
          </section>

          {/* 21 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              21. Contact Us
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you have any questions about these Terms of Service, an order,
              a product, a digital purchase, or any other matter relating to
              LCP.works, please contact us at:
            </p>

            <div className="mt-4 space-y-1 text-neutral-600 dark:text-neutral-400">
              <p>
                <span className="font-medium text-neutral-900 dark:text-neutral-200">
                  LCP.works
                </span>
              </p>

              <p>
                Email:{' '}
                <a
                  href="mailto:cs@lcpworks.com"
                  className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  cs@lcpworks.com
                </a>
              </p>
            </div>
          </section>

          <p className="text-sm text-neutral-400 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            Last updated: September 2026
          </p>

        </div>
      </div>
    </div>
  );
}