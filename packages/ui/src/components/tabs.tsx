'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';

// ── Tabs ────────────────────────────────────────────────────

export interface TabsProps {
  /** Tab definitions. */
  tabs: Array<{
    id: string;
    label: string;
    content: ReactNode;
    badge?: string | number;
    disabled?: boolean;
  }>;
  /** Active tab ID (controlled). */
  activeTab?: string;
  /** Default tab ID (uncontrolled). */
  defaultTab?: string;
  /** Tab change handler (controlled). */
  onTabChange?: (tabId: string) => void;
  /** Variant. */
  variant?: 'underline' | 'pills' | 'buttons';
  /** Additional className. */
  className?: string;
  /** Additional tab list className. */
  tabListClassName?: string;
}

const tabListVariants = {
  underline: 'border-b border-border',
  pills: 'flex-wrap gap-2',
  buttons: 'flex-wrap gap-1 rounded-lg bg-muted p-1',
};

const tabTriggerVariants = {
  underline:
    'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200 data-[active=true]:border-primary data-[active=true]:text-primary',
  pills:
    'rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground',
  buttons:
    'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-sm',
};

export function Tabs({
  tabs,
  activeTab: controlledActive,
  defaultTab,
  onTabChange,
  variant = 'underline',
  className,
  tabListClassName,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultTab ?? tabs[0]?.id ?? '');
  const activeTab = controlledActive ?? internalActive;

  const handleTabClick = (tabId: string) => {
    setInternalActive(tabId);
    onTabChange?.(tabId);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={className}>
      <div className={cn('flex', tabListVariants[variant], tabListClassName)} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            disabled={tab.disabled}
            data-active={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(tabTriggerVariants[variant])}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.badge !== undefined && (
                <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4" role="tabpanel">
        {activeContent}
      </div>
    </div>
  );
}
