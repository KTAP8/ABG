import { useTranslation } from 'react-i18next'
import type { ProductSizeChartRow } from '../../lib/api'

type ColumnKey = 'bust' | 'length' | 'sleeve_length' | 'shoulder'

function cellValue(row: ProductSizeChartRow, key: ColumnKey) {
  const value = row[key]
  return value?.trim() ? value.trim() : ''
}

function columnVisible(rows: ProductSizeChartRow[], key: ColumnKey) {
  return rows.some((row) => cellValue(row, key))
}

export function hasStructuredSizeChart(rows: ProductSizeChartRow[] | undefined) {
  return (rows ?? []).some((row) => row.size?.trim())
}

export function SizeGuideContent({
  sizeGuide,
  sizeChart,
}: {
  sizeGuide?: string | null
  sizeChart?: ProductSizeChartRow[]
}) {
  const { t } = useTranslation()
  const rows = sizeChart ?? []

  if (hasStructuredSizeChart(rows)) {
    const show = {
      bust: columnVisible(rows, 'bust'),
      length: columnVisible(rows, 'length'),
      sleeve_length: columnVisible(rows, 'sleeve_length'),
      shoulder: columnVisible(rows, 'shoulder'),
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse border border-charcoal text-left">
          <thead>
            <tr className="bg-cream">
              <th className="border border-charcoal px-3 py-2 font-body text-[11px] font-normal uppercase tracking-[-0.04em] text-charcoal">
                {t('product.sizeguide.col.size')}
              </th>
              {show.bust && (
                <th className="border border-charcoal px-3 py-2 font-body text-[11px] font-normal uppercase tracking-[-0.04em] text-charcoal">
                  {t('product.sizeguide.col.bust')}
                </th>
              )}
              {show.length && (
                <th className="border border-charcoal px-3 py-2 font-body text-[11px] font-normal uppercase tracking-[-0.04em] text-charcoal">
                  {t('product.sizeguide.col.length')}
                </th>
              )}
              {show.sleeve_length && (
                <th className="border border-charcoal px-3 py-2 font-body text-[11px] font-normal uppercase tracking-[-0.04em] text-charcoal">
                  {t('product.sizeguide.col.sleeve')}
                </th>
              )}
              {show.shoulder && (
                <th className="border border-charcoal px-3 py-2 font-body text-[11px] font-normal uppercase tracking-[-0.04em] text-charcoal">
                  {t('product.sizeguide.col.shoulder')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="border border-charcoal px-3 py-2 font-body text-[13px] font-bold tracking-[-0.04em] text-charcoal">
                  {row.size}
                </td>
                {show.bust && (
                  <td className="border border-charcoal px-3 py-2 font-body text-[13px] tracking-[-0.04em] text-charcoal">
                    {cellValue(row, 'bust')}
                  </td>
                )}
                {show.length && (
                  <td className="border border-charcoal px-3 py-2 font-body text-[13px] tracking-[-0.04em] text-charcoal">
                    {cellValue(row, 'length')}
                  </td>
                )}
                {show.sleeve_length && (
                  <td className="border border-charcoal px-3 py-2 font-body text-[13px] tracking-[-0.04em] text-charcoal">
                    {cellValue(row, 'sleeve_length')}
                  </td>
                )}
                {show.shoulder && (
                  <td className="border border-charcoal px-3 py-2 font-body text-[13px] tracking-[-0.04em] text-charcoal">
                    {cellValue(row, 'shoulder')}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 font-body text-[12px] leading-snug tracking-[-0.04em] text-charcoal/60">
          {t('product.sizeguide.footnote')}
        </p>
      </div>
    )
  }

  if (sizeGuide?.trim()) {
    return (
      <p className="whitespace-pre-line font-body text-sm leading-relaxed tracking-[-0.04em] text-charcoal/80">
        {sizeGuide.trim()}
      </p>
    )
  }

  return null
}

export function productHasSizeGuide(sizeGuide?: string | null, sizeChart?: ProductSizeChartRow[]) {
  if (hasStructuredSizeChart(sizeChart)) return true
  return Boolean(sizeGuide?.trim())
}
