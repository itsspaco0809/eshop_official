import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <div className="pt-16 md:pt-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-neutral-900 dark:text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg">
            How we collect, use, store, and protect your information.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              1. Information We Collect
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              When you use LCP.works, place an order, create an account, download
              digital products, or contact us, we may collect information that you
              provide directly to us.
            </p>

            <h3 className="font-semibold mb-2">
              Contact Information
            </h3>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>Full name</li>
              <li>Email address</li>
              <li>Billing and shipping address</li>
              <li>Phone number, where provided</li>
            </ul>

            <h3 className="font-semibold mt-5 mb-2">
              Account Information
            </h3>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you create an account, we may collect information associated with
              your account, including your email address, account preferences,
              saved information, and order history.
            </p>

            <h3 className="font-semibold mt-5 mb-2">
              Order Information
            </h3>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">
              Depending on how you use our website, this may include:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>Products purchased or viewed</li>
              <li>Cart contents</li>
              <li>Purchase history</li>
              <li>Order and delivery information</li>
              <li>Refund or support requests</li>
              <li>Information you provide in order notes or enquiries</li>
            </ul>

            <h3 className="font-semibold mt-5 mb-2">
              Communications
            </h3>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may retain information you provide when contacting us, including
              customer support enquiries, product questions, order-related
              communications, and requests for assistance.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              2. Payment Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Payments are processed securely through our payment provider,
              including Stripe where applicable. LCP.works does not store complete
              credit or debit card numbers on our own servers. Payment information
              is handled by the relevant payment provider in accordance with its
              own privacy and security practices.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              3. Device & Website Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              When you visit our website, certain technical information may be
              collected automatically to help us operate, secure, and improve the
              website.
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type and information</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Website activity and interactions</li>
              <li>Referring websites or pages</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              4. How We Collect Your Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              We may collect information through several methods, including:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>Information you provide when creating an account</li>
              <li>Information provided when placing an order</li>
              <li>Information you provide when contacting us</li>
              <li>Cookies and similar technologies</li>
              <li>Payment and payment-processing providers</li>
              <li>Shipping and delivery providers where necessary</li>
              <li>Other service providers that support the operation of our website</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              5. How We Use Your Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              We may use the information we collect for purposes including:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>Processing and fulfilling orders</li>
              <li>Providing digital products and downloads</li>
              <li>Processing payments</li>
              <li>Arranging shipping and delivery</li>
              <li>Managing refunds and order-related requests</li>
              <li>Providing customer support</li>
              <li>Responding to enquiries</li>
              <li>Managing and maintaining customer accounts</li>
              <li>Improving our website, products, and services</li>
              <li>Detecting and preventing fraud or unauthorised activity</li>
              <li>Protecting the security of our website and users</li>
              <li>Complying with applicable legal obligations</li>
            </ul>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Where permitted and where you have provided the appropriate consent,
              we may also use your email address to send product announcements,
              updates, or other marketing communications. You may unsubscribe from
              marketing communications at any time.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              6. Cookies & Tracking Technologies
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may use cookies and similar technologies to keep your shopping
              session active, remember certain preferences, maintain account
              functionality, improve website performance, understand how visitors
              use our website, and help protect against fraudulent activity.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Some third-party services used on our website may also use cookies
              or similar technologies for payment processing, analytics, security,
              or other services.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              You can manage or disable cookies through your browser settings.
              Please note that disabling certain cookies may affect the
              functionality of parts of our website.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              7. How We Share Your Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              We do not sell your personal information. We may share information
              only where reasonably necessary to operate our business, provide
              services, process orders, or comply with legal obligations.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              This may include sharing relevant information with:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>Payment processors such as Stripe</li>
              <li>Shipping and delivery providers</li>
              <li>Website hosting and infrastructure providers</li>
              <li>Analytics and website performance providers</li>
              <li>Fraud prevention and security providers</li>
              <li>Customer support or communication providers</li>
              <li>Government, legal, or regulatory authorities where required by law</li>
            </ul>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Third-party service providers may process information on our behalf
              only as necessary to provide the services they perform for us.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              8. International Data Transfers
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Some of our service providers may operate in countries outside your
              country of residence. As a result, your information may be processed
              or transferred internationally when necessary to provide our
              services, process payments, deliver orders, maintain our website,
              or provide customer support.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              9. Data Security
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We take reasonable technical and organisational measures to protect
              personal information against unauthorised access, alteration,
              disclosure, loss, or misuse.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              However, no method of transmission over the internet or method of
              electronic storage can be guaranteed to be completely secure.
              Therefore, while we take reasonable steps to protect your information,
              we cannot guarantee absolute security.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              10. Data Retention
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We retain personal information only for as long as reasonably
              necessary for the purposes described in this Privacy Policy,
              including to:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              <li>Complete and maintain records of orders</li>
              <li>Provide customer support</li>
              <li>Manage refunds or order-related issues</li>
              <li>Maintain account information where applicable</li>
              <li>Meet legal, accounting, and tax requirements</li>
              <li>Resolve disputes</li>
              <li>Prevent fraud and enforce our agreements</li>
            </ul>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              11. Your Privacy Rights
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              Depending on your country or region, you may have rights regarding
              your personal information, including the right to:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>Request access to personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of your personal information where applicable</li>
              <li>Request a copy of certain personal information</li>
              <li>Withdraw consent for certain processing or marketing communications</li>
              <li>Object to or restrict certain processing where applicable</li>
              <li>Lodge a privacy complaint with the appropriate authority</li>
            </ul>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              To exercise any applicable rights or ask questions about how your
              information is handled, please contact us at{' '}
              <a
                href="mailto:cs@lcpworks.com"
                className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                cs@lcpworks.com
              </a>
              .
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              12. Children's Privacy
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Our website is not intended for children under the minimum age
              required by applicable law. We do not knowingly collect personal
              information from children. If you believe that a child has provided
              us with personal information, please contact us so that we can take
              appropriate steps.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              13. Third-Party Websites & Services
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Our website may contain links to third-party websites, services, or
              platforms. We are not responsible for the privacy practices,
              security, or content of third-party websites. We recommend reviewing
              the privacy policies of any third-party services you use.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              14. Changes to This Privacy Policy
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes to our services, technology, legal requirements, or business
              practices.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Any updated version will be published on this page together with a
              revised "Last updated" date. We encourage you to review this page
              periodically for the latest information about our privacy practices.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              15. Contact Us
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you have any questions about this Privacy Policy, how we collect
              or use your information, or wish to exercise an applicable privacy
              right, please contact us at:
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

          {/* Last Updated */}
          <p className="text-sm text-neutral-400 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            Last updated: September 2026
          </p>

        </div>
      </div>
    </div>
  );
}
