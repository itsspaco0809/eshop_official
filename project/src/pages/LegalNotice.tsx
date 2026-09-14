import { Scale } from 'lucide-react';

export default function LegalNotice() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <div className="pt-16 md:pt-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-7 h-7 text-neutral-900 dark:text-white" />

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Legal Notice
            </h1>
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg">
            Important legal information about LCP.works, our website, products,
            and intellectual property.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              1. Website Ownership
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This website, LCP.works, is owned and operated by LCP.works.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Throughout this website, the terms "LCP.works", "LCP", "we", "our",
              and "us" refer to LCP.works and the operator of this website and
              its associated services.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              2. Intellectual Property
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Unless otherwise stated, content created and published by
              LCP.works is owned by or licensed to LCP.works.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              This includes, but is not limited to:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              <li>Product designs</li>
              <li>Brick model designs</li>
              <li>Digital building instructions</li>
              <li>Digital files and downloadable materials</li>
              <li>Digital renders</li>
              <li>Photography</li>
              <li>Graphics and illustrations</li>
              <li>Logos and branding</li>
              <li>Product names and descriptions</li>
              <li>Packaging and promotional artwork</li>
              <li>Website content and layouts</li>
              <li>Marketing materials</li>
            </ul>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              These materials may be protected by applicable copyright,
              trademark, design, and other intellectual property laws.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              No content belonging to LCP.works may be copied, reproduced,
              modified, distributed, republished, sold, licensed, or otherwise
              commercially exploited without prior written permission, except
              where such use is expressly permitted by applicable law.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              3. Trademarks & Third-Party Brands
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works, its name, logo, branding, product names, visual
              identity, and original creative materials may constitute
              trademarks, trade names, or proprietary assets of LCP.works.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Unauthorised use of LCP.works branding, logos, product artwork, or
              other proprietary materials is not permitted without prior written
              permission.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Third-party vehicle names, model names, manufacturer names,
              trademarks, logos, racing names, and other brand identities
              referenced on this website remain the property of their respective
              owners.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Such references may be used for descriptive, identification,
              compatibility, or informational purposes and do not necessarily
              indicate any affiliation, sponsorship, endorsement, or licensing
              relationship with LCP.works.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              4. LEGO & Automotive Disclaimer
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works products are independently designed brick-built products
              and automotive-inspired collectibles.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Unless expressly stated otherwise, LCP.works is not affiliated
              with, endorsed by, sponsored by, or officially associated with
              The LEGO Group, any automobile manufacturer, vehicle brand,
              tuning company, motorsport organisation, racing team, or other
              third-party brand referenced on our website or in our products.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              LEGO® is a trademark of the LEGO Group, which does not sponsor,
              authorise, or endorse LCP.works or its products unless explicitly
              stated otherwise.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Any third-party trademarks, names, logos, or other intellectual
              property remain the property of their respective owners.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              5. Product Information
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We make reasonable efforts to ensure that product descriptions,
              specifications, prices, photographs, renders, measurements, and
              other information displayed on LCP.works are accurate and
              up-to-date.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              However, product information may occasionally contain errors,
              omissions, inaccuracies, or differences resulting from updates,
              production changes, photography, lighting, display settings, or
              other circumstances.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              LCP.works reserves the right to correct errors, update information,
              change product specifications, modify availability, or discontinue
              products without prior notice.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              6. Product Images & Colours
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Product photographs, digital renders, illustrations, and displayed
              colours are provided for reference. Actual products may appear
              slightly different due to lighting conditions, photography,
              manufacturing variations, material differences, or individual
              screen and display settings.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Such differences do not necessarily indicate that a product is
              defective or materially different from its advertised description.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              7. Digital Products & Files
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Digital instructions, digital files, templates, renders, and other
              downloadable materials provided through LCP.works remain protected
              intellectual property unless otherwise stated.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Purchasing or downloading a digital product does not transfer
              ownership of the underlying intellectual property to the purchaser.
              Digital products are provided subject to the applicable licence
              and restrictions described on our website and in our Terms of
              Service.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              8. Website Content & Availability
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We make reasonable efforts to keep the information and functionality
              of LCP.works available and accurate. However, we do not guarantee
              that the website or any particular content will always be available,
              uninterrupted, complete, current, or free from errors.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Website content, features, product listings, pricing, availability,
              and functionality may be changed, suspended, or discontinued at any
              time where reasonably necessary.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              9. External Links
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LCP.works may provide links to third-party websites, platforms, or
              services for convenience or reference.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Unless expressly stated otherwise, LCP.works does not control and
              is not responsible for the content, availability, security,
              accuracy, or privacy practices of external websites.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              The inclusion of an external link does not necessarily constitute
              an endorsement, recommendation, or affiliation with the linked
              website or its operator.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              10. Limitation of Liability
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              To the maximum extent permitted by applicable law, LCP.works is not
              responsible for indirect, incidental, special, consequential, or
              other losses arising from the use of this website or our products.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              This includes losses arising from website interruptions, technical
              issues, third-party services, external websites, delays, or other
              circumstances outside our reasonable control.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Nothing in this Legal Notice is intended to exclude, restrict, or
              modify any rights or remedies that cannot legally be excluded,
              restricted, or modified under applicable consumer protection or
              other laws.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              11. Related Policies
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This Legal Notice should be read together with our other applicable
              policies, including our Privacy Policy, Terms of Service, and
              Shipping Info.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              These policies provide additional information about how LCP.works
              operates, how we handle personal information, how orders are
              processed, and how our products are supplied.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              12. Changes to This Legal Notice
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may update this Legal Notice from time to time to reflect changes
              to our website, products, services, business practices, or legal
              requirements.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
              Any updated version will be published on this page together with a
              revised "Last updated" date.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              13. Contact
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you have any questions regarding this Legal Notice, our website,
              our products, or the use of LCP.works content, please contact us at:
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