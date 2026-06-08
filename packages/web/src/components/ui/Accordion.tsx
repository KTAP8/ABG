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
    <div className="space-y-0 border-t border-charcoal">
      {items.map((item, index) => (
        <div key={index} className="border-b border-charcoal">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-4 py-3 text-left font-body uppercase tracking-wide text-charcoal hover:bg-charcoal hover:text-cream transition-all flex justify-between items-center"
          >
            <span>{item.title}</span>
            <span className="text-xl">{expandedIndices.includes(index) ? '−' : '+'}</span>
          </button>
          {expandedIndices.includes(index) && (
            <div className="px-4 py-3 bg-cream text-charcoal font-body text-sm">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
