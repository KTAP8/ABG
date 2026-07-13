import { useTranslation } from 'react-i18next'
import { LegalPageLayout } from '../components/legal/LegalPageLayout'

export default function Privacy() {
  const { t } = useTranslation()

  return (
    <LegalPageLayout title={t('legal.privacy.title')} lastUpdated="July 13, 2026">
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
            Name, contact details, shipping address, and size, when you submit an order through an
            external order form linked from the Site
          </li>
        </ul>
        <p>
          We don't collect payment card details on this Site — we don't process payments here.
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
            <strong>Resend</strong>, to send transactional and drop-related emails
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
          The Site does not currently use analytics or advertising cookies or tracking pixels. It
          may use essential, strictly-necessary cookies to make basic functionality work (for
          example, remembering a language preference). If we add analytics or marketing cookies in
          the future, we'll update this section and, where required, ask for your consent first.
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
