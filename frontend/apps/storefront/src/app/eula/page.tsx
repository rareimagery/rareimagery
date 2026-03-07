import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'End User License Agreement',
};

export default function EulaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        End User License Agreement
      </h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: March 6, 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the RareImagery platform (&quot;Platform&quot;)
            at rareimagery.net, you agree to be bound by this End User License
            Agreement (&quot;Agreement&quot;). If you do not agree to these
            terms, do not use the Platform. This Agreement applies to all
            visitors, users, creators, and buyers who access or use the
            Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. Platform Description
          </h2>
          <p>
            RareImagery is a multi-creator merchandise platform where X
            (Twitter) profiles become branded storefronts. Creators can sell
            physical products (print-on-demand and custom) and digital
            downloads. The Platform facilitates transactions between creators
            and buyers but does not manufacture, store, or ship physical
            products directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            3. Account Eligibility
          </h2>
          <p>
            You must be at least 18 years old or the age of majority in your
            jurisdiction to create a store or make purchases on the Platform.
            By using the Platform, you represent and warrant that you meet
            these eligibility requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Creator Store Terms
          </h2>
          <p className="mb-2">
            As a creator on the Platform, you agree to the following:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You must connect a valid Stripe account via Stripe Connect to
              receive payments.
            </li>
            <li>
              You are solely responsible for the content, products, and
              materials you list on your store.
            </li>
            <li>
              You retain ownership of your original content and grant
              RareImagery a non-exclusive license to display it on the
              Platform.
            </li>
            <li>
              You are responsible for fulfilling custom orders and ensuring
              product descriptions are accurate.
            </li>
            <li>
              You must comply with all applicable laws regarding product
              safety, labeling, and consumer protection.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            5. Buyer Terms
          </h2>
          <p className="mb-2">
            As a buyer on the Platform, you acknowledge that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Purchases are made directly from individual creators, not from
              RareImagery.
            </li>
            <li>
              Print-on-demand products are manufactured and shipped by
              third-party fulfillment providers.
            </li>
            <li>
              Digital downloads are delivered electronically and may be
              subject to the creator&apos;s individual usage terms.
            </li>
            <li>
              Refund and return policies may vary by product type and
              creator. Contact the creator directly for order issues.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            6. Platform Fees &amp; Payments
          </h2>
          <p className="mb-2">
            All payments are processed securely through Stripe. RareImagery
            charges a per-order platform fee as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Physical products</strong> (print-on-demand and custom):
              $1.00 per order
            </li>
            <li>
              <strong>Digital downloads:</strong> $0.05 per order
            </li>
          </ul>
          <p className="mt-2">
            The remainder of each transaction is transferred directly to the
            creator&apos;s connected Stripe account. Standard Stripe
            processing fees also apply and are deducted by Stripe before
            payout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            7. Intellectual Property
          </h2>
          <p>
            The RareImagery name, logo, and platform design are the property
            of RareImagery. Creators retain all rights to their original
            content. You may not use, reproduce, or distribute any content
            from the Platform without permission from the respective rights
            holder. You must not list products that infringe on any
            third-party intellectual property rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            8. Prohibited Conduct
          </h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Use the Platform for any unlawful purpose or in violation of
              any applicable laws.
            </li>
            <li>
              List counterfeit, stolen, or infringing products.
            </li>
            <li>
              Engage in fraudulent transactions or misrepresent product
              information.
            </li>
            <li>
              Attempt to circumvent platform fees or payment processing.
            </li>
            <li>
              Harass, abuse, or harm other users of the Platform.
            </li>
            <li>
              Interfere with or disrupt the Platform&apos;s infrastructure or
              security.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            9. Disclaimers
          </h2>
          <p>
            The Platform is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, whether express or
            implied. RareImagery does not guarantee the quality, safety, or
            legality of products listed by creators. We are not responsible
            for the accuracy of product descriptions, the ability of creators
            to fulfill orders, or the quality of products received.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            10. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, RareImagery shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of the Platform, including
            but not limited to loss of profits, data, or goodwill. Our total
            liability for any claim related to the Platform shall not exceed
            the total fees paid by you to RareImagery in the twelve months
            preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            11. Termination
          </h2>
          <p>
            RareImagery may suspend or terminate your access to the Platform
            at any time for violation of this Agreement or for any reason at
            our sole discretion. Upon termination, your right to use the
            Platform ceases immediately. Pending orders and payouts will be
            handled in accordance with Stripe&apos;s policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            12. Changes to This Agreement
          </h2>
          <p>
            We reserve the right to modify this Agreement at any time.
            Changes will be posted on this page with an updated date.
            Continued use of the Platform after changes are posted
            constitutes acceptance of the revised Agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            13. Governing Law
          </h2>
          <p>
            This Agreement shall be governed by and construed in accordance
            with the laws of the United States. Any disputes arising from
            this Agreement shall be resolved through binding arbitration in
            accordance with the rules of the American Arbitration Association.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            14. Contact
          </h2>
          <p>
            If you have any questions about this Agreement, please contact us
            at{' '}
            <a
              href="mailto:legal@rareimagery.net"
              className="text-blue-600 hover:underline"
            >
              legal@rareimagery.net
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
