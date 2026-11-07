import { useTranslation } from 'react-i18next'
import { LegalPageLayout } from '../components/legal/LegalPageLayout'

export default function Privacy() {
  const { t } = useTranslation()

  return (
    <LegalPageLayout title={t('legal.privacy.title')} lastUpdated="November 7, 2026">
      <p>
        This Privacy Policy explains what personal data ABG ("we", "us", "our") collects through
        this Site, why we collect it, and how you can reach us about it.
      </p>

      <section>
        <h2>1. what we collect</h2>
        <p>We collect the information you give us directly, which may include:</p>
        <ul>
          <li>Email address, when you join the waitlist or newsletter</li>
          <li>Name, email, and social handle, when you claim a discount code (IYKYK)</li>
          <li>
            Account details when you sign in with Google (name, email address, and profile image
            provided by Google), plus optional profile preferences you choose during onboarding —
            how you found us, shopping preference (men / women / both), and how you want drop alerts
            (email and/or LINE)
          </li>
          <li>
            Name, contact details, shipping address, and size, when you place an order
          </li>
          <li>
            Your answers to the optional survey shown after checkout
          </li>
          <li>
            Usage data about how you use the Site, such as pages viewed, products viewed, items
            added to your cart, your device and browser type, how you reached the Site, and your
            approximate location. If you accept analytics, this can include masked recordings of
            your visits (see section 4)
          </li>
        </ul>
        <p>
          Card payments are handled on Stripe's secure checkout page. We never see or store your
          full card details.
        </p>
      </section>

      <section>
        <h2>2. how we use it</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Confirm and fulfil orders, and contact you about them</li>
          <li>Notify you about drops, waitlist updates, and discount codes you've requested</li>
          <li>Send newsletter emails, if you've subscribed</li>
          <li>Respond to support requests</li>
          <li>Understand how the Site is used, and improve it, its products, and its promotions</li>
        </ul>
        <p>We do not sell your personal data.</p>
      </section>

      <section>
        <h2>3. who we share it with</h2>
        <p>
          We use a small number of third-party services to run the Site and fulfil orders, and
          they process data on our behalf:
        </p>
        <ul>
          <li>
            <strong>Stripe</strong>, to process payments and collect shipping details at checkout
          </li>
          <li>
            <strong>PostHog</strong>, to analyze how the Site is used. PostHog stores this data in
            the European Union, which is outside Thailand
          </li>
          <li>
            <strong>Resend</strong>, to send transactional and drop-related emails
          </li>
          <li>
            <strong>Google</strong>, for Google sign-in (OAuth). Information Google shares with us
            is also subject to Google's privacy policy
          </li>
          <li>
            <strong>Neon</strong>, to store account and profile data in our database, and to run
            managed authentication (Neon Auth)
          </li>
          <li>
            <strong>Google Forms</strong>, to collect waitlist and order submissions. Information
            you enter directly into a Google Form is also subject to Google's own privacy policy
          </li>
        </ul>
        <p>
          We don't share your data with third parties for their own marketing purposes.
        </p>
      </section>

      <section>
        <h2>4. cookies</h2>
        <p>
          The Site uses essential, strictly-necessary cookies and similar browser storage to make
          basic functionality work (for example, keeping your cart, remembering your cookie choice,
          or keeping you signed in after Google authentication). We don't use advertising cookies
          or tracking pixels.
        </p>
        <p>
          With your consent, we also use PostHog analytics. If you accept, PostHog stores an
          identifier in your browser so we can understand repeat visits and link activity to your
          account if you're signed in. Accepting also allows masked session recordings, which show
          how pages are used. We mask what you type and hide sensitive areas such as forms, order
          details, and discount codes.
        </p>
        <p>
          If you decline, or haven't chosen yet, we don't store analytics identifiers in your
          browser or record your session, and we only collect anonymous, aggregated usage counts.
          We also keep a record of completed orders for reporting, which isn't linked to your
          analytics activity.
        </p>
        <p>
          You can change your choice at any time using “cookie settings” in the footer.
        </p>
      </section>

      <section>
        <h2>5. data retention and security</h2>
        <p>
          We keep personal data only as long as we need it for the purposes above, or as required
          by law. We take reasonable technical and organizational measures to protect your data,
          but no method of transmission or storage is completely secure.
        </p>
      </section>

      <section>
        <h2>6. your rights</h2>
        <p>
          If you're in Thailand, you have rights under the Personal Data Protection Act (PDPA),
          including the right to access, correct, delete, or request a copy of your personal data,
          and to withdraw consent (for example, unsubscribing from our newsletter). Wherever
          you're located, you can email us to make a request and we'll respond as required by
          applicable law.
        </p>
      </section>

      <section>
        <h2>7. children's privacy</h2>
        <p>
          The Site is not directed at children, and we don't knowingly collect personal data from
          children without appropriate consent.
        </p>
      </section>

      <section>
        <h2>8. changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The "last updated" date at the top
          reflects the most recent revision.
        </p>
      </section>

      <section>
        <h2>9. contact</h2>
        <p>
          For any privacy questions or requests, email{' '}
          <a href="mailto:touch.apinankul@gmail.com">touch.apinankul@gmail.com</a>.
        </p>
      </section>
    </LegalPageLayout>
  )
}
