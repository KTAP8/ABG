import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LegalPageLayout } from '../components/legal/LegalPageLayout'

export default function Terms() {
  const { t } = useTranslation()

  return (
    <LegalPageLayout title={t('legal.terms.title')} lastUpdated="July 13, 2026">
      <p>
        These Terms of Service ("Terms") govern your use of the ABG website (the "Site") and any
        purchase you make through it. By browsing the Site, joining a waitlist, or placing an
        order through one of our order forms, you agree to these Terms. If you do not agree,
        please do not use the Site.
      </p>

      <section>
        <h2>1. who we are</h2>
        <p>
          ABG ("Attitude Before Garment", "we", "us", "our") is an independent clothing brand
          operating limited drops. This Site is used for browsing collections, joining waitlists,
          and directing you to place an order.
        </p>
      </section>

      <section>
        <h2>2. how ordering works</h2>
        <p>
          ABG does not process payments directly on this Site. When a drop is live, the "order
          now" action takes you to an external order form. Submitting that form is an offer to
          purchase, not a confirmed sale — we'll follow up by email to confirm your order,
          availability, and payment instructions. A sale is only final once we confirm it.
        </p>
        <p>
          Because runs are limited, stock shown on the Site may change or sell out before your
          order is confirmed. If an item you ordered is no longer available, we'll contact you
          using the email you provided instead of charging you for it.
        </p>
      </section>

      <section>
        <h2>3. eligibility</h2>
        <p>
          You must be able to form a legally binding contract to place an order — generally this
          means being at least 18, or having a parent/guardian's permission if you're younger. You
          agree that any information you give us (email, sizing, shipping details) is accurate.
        </p>
      </section>

      <section>
        <h2>4. pricing and availability</h2>
        <p>
          Prices, product details, and availability are subject to change without notice ahead of
          a drop going live. We make reasonable efforts to keep the Site accurate but don't
          guarantee it's error-free.
        </p>
      </section>

      <section>
        <h2>5. intellectual property</h2>
        <p>
          Everything on this Site — designs, photography, copy, logos, and the ABG name — belongs
          to us or our licensors and is protected by intellectual property law. You may not
          reproduce, sell, or otherwise use it without our written permission.
        </p>
      </section>

      <section>
        <h2>6. acceptable use</h2>
        <p>
          Don't misuse the Site: no scraping, no attempting to disrupt or gain unauthorized access
          to it, and no using it for anything unlawful.
        </p>
      </section>

      <section>
        <h2>7. shipping and returns</h2>
        <p>
          Shipping timelines are covered in our <Link to="/shipping">Shipping Policy</Link>, and
          our return/exchange terms are covered in our{' '}
          <Link to="/returns">Returns &amp; Exchanges Policy</Link>.
        </p>
      </section>

      <section>
        <h2>8. limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, ABG is not liable for indirect, incidental, or
          consequential damages arising from your use of the Site or a purchase made through it.
          Nothing in these Terms limits liability that cannot be limited under applicable law.
        </p>
      </section>

      <section>
        <h2>9. governing law</h2>
        <p>
          These Terms are governed by the laws of Thailand, without regard to conflict-of-law
          principles. Any dispute will be subject to the exclusive jurisdiction of the courts of
          Thailand.
        </p>
      </section>

      <section>
        <h2>10. changes to these terms</h2>
        <p>
          We may update these Terms from time to time. The "last updated" date at the top of this
          page reflects the most recent revision. Continuing to use the Site after changes means
          you accept the updated Terms.
        </p>
      </section>

      <section>
        <h2>11. contact</h2>
        <p>
          Questions about these Terms? Email us at{' '}
          <a href="mailto:touch.apinankul@gmail.com">touch.apinankul@gmail.com</a>.
        </p>
      </section>
    </LegalPageLayout>
  )
}
