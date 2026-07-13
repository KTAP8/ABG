import { useTranslation } from 'react-i18next'
import { LegalPageLayout } from '../components/legal/LegalPageLayout'

export default function Returns() {
  const { t } = useTranslation()

  return (
    <LegalPageLayout title={t('legal.returns.title')} lastUpdated="July 13, 2026">
      <section>
        <h2>1. final sale</h2>
        <p>
          Every ABG drop is a limited, cut-first run — once it's gone, it doesn't come back. Because
          of that, all sales are <strong>final</strong>. We don't offer returns or exchanges for
          change of mind, wrong size, or any reason outside of the exception below.
        </p>
        <p>Please check our size guide carefully before ordering.</p>
      </section>

      <section>
        <h2>2. damaged, defective, or incorrect items</h2>
        <p>
          If your order arrives damaged, defective, or isn't what you ordered, contact us within{' '}
          <strong>[7 days]</strong> of delivery at{' '}
          <a href="mailto:touch.apinankul@gmail.com">touch.apinankul@gmail.com</a> with your order
          number and photos of the issue. We'll review it and, where the issue is on us, offer a
          replacement if stock is available or a refund if it isn't.
        </p>
      </section>

      <section>
        <h2>3. how to report an issue</h2>
        <p>To report a damaged, defective, or incorrect item, please include:</p>
        <ul>
          <li>Your order number</li>
          <li>Photos of the item and any packaging damage</li>
          <li>A short description of the issue</li>
        </ul>
        <p>We'll get back to you as soon as we can.</p>
      </section>

      <section>
        <h2>4. order confirmation errors</h2>
        <p>
          Since orders are placed through an external order form and confirmed by us over email, if
          you spot a mistake in your order (wrong size, wrong address) before we've shipped it,
          email us right away and we'll do our best to correct it before it ships.
        </p>
      </section>

      <section>
        <h2>5. contact</h2>
        <p>
          Questions about this policy? Email{' '}
          <a href="mailto:touch.apinankul@gmail.com">touch.apinankul@gmail.com</a>.
        </p>
      </section>
    </LegalPageLayout>
  )
}
