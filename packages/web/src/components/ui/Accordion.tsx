import { useState } from 'react'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setExpandedIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
      )
    } else {
      setExpandedIndices((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <div className="space-y-0 border-t border-charcoal/15">
      {items.map((item, index) => {
        const isExpanded = expandedIndices.includes(index)
        return (
          <div key={index} className="border-b border-charcoal/15">
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="flex w-full cursor-pointer items-center justify-between py-3.5 text-left font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal transition-opacity hover:opacity-70"
            >
              <span>{item.title}</span>
              <span className="text-charcoal/40">{isExpanded ? '−' : '+'}</span>
            </button>
            {isExpanded && (
              <div className="pb-4 font-body text-[13px] leading-snug tracking-[-0.04em] text-charcoal/70">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
