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
      {items.map((item, index) => {
        const isExpanded = expandedIndices.includes(index)
        return (
          <div key={index} className="border-b border-charcoal">
            <button
              onClick={() => toggleItem(index)}
              className="w-full py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-charcoal hover:text-red transition-colors flex justify-between items-center cursor-pointer"
            >
              <span>{item.title}</span>
              <span className="font-bold text-xs">{isExpanded ? '[-]' : '[+]'}</span>
            </button>
            {isExpanded && (
              <div className="pb-4 font-body text-xs text-charcoal/80 leading-relaxed">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
