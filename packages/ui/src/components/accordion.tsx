'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

// ── Accordion ───────────────────────────────────────────────

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  /** Accordion items. */
  items: AccordionItem[];
  /** Allow multiple items open. */
  multiple?: boolean;
  /** Default open item IDs. */
  defaultOpen?: string[];
  /** Additional className. */
  className?: string;
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (multiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('divide-y divide-border rounded-lg border', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id}>
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggleItem(item.id)}
              className={cn(
                'flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors',
                'hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              aria-expanded={isOpen}
            >
              {item.title}
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className="px-4 pb-3 pt-0 text-sm text-muted-foreground">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
