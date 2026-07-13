import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LegalPageLayout } from '../components/legal/LegalPageLayout'

export default function Shipping() {
  const { t } = useTranslation()

  return (
    <LegalPageLayout title={t('legal.shipping.title')} lastUpdated="July 13, 2026">
      <p>
        This policy covers how orders placed through ABG's order forms are confirmed, processed,
        and shipped. Since each drop is a limited run, timelines can vary slightly between drops —
        anything specific to a drop will be communicated by email.
      </p>

      <section>
        <h2>1. order confirmation</h2>
        <p>
          After you submit an order form, we'll email you to confirm your order, availability, and
          payment instructions. Your order isn't final until we've confirmed it — please check
          your inbox (and spam folder) after ordering.
        </p>
      </section>

      <section>
        <h2>2. processing time</h2>
        <p>
          Orders are typically processed and shipped within{' '}
          <strong>[3–7 business days]</strong> of order confirmation and payment. During a drop
          launch, processing may take longer due to volume — we'll let you know if that's the
          case.
        </p>
      </section>

      <section>
        <h2>3. shipping within Thailand</h2>
        <p>
          Domestic orders are shipped via <strong>[carrier TBD]</strong>. Shipping cost is
          calculated based on your address and confirmed with you before payment.
        </p>
      </section>

      <section>
        <h2>4. international shipping</h2>
        <p>
          We ship internationally on a limited basis depending on the drop. International
          shipping costs, carriers, and delivery estimates are confirmed with you individually, and
          you're responsible for any customs duties or import taxes charged by your country.
        </p>
      </section>

      <section>
        <h2>5. delays</h2>
        <p>
          Because we run a small operation, unexpected delays can happen — supplier issues,
          holidays, or carrier disruptions. We'll always try to flag delays by email as soon as we
          know about them.
        </p>
      </section>

      <section>
        <h2>6. lost or damaged in transit</h2>
        <p>
          If your order arrives damaged or doesn't arrive at all, contact us within{' '}
          <strong>[7 days]</strong> of the expected delivery date and we'll work with you on a
          resolution — see our{' '}
          <Link to="/returns">Returns &amp; Exchanges Policy</Link>.
        </p>
      </section>

      <section>
        <h2>7. contact</h2>
        <p>
          Questions about a shipment? Email{' '}
          <a href="mailto:touch.apinankul@gmail.com">touch.apinankul@gmail.com</a> with your order
          details.
        </p>
      </section>
    </LegalPageLayout>
  )
}
