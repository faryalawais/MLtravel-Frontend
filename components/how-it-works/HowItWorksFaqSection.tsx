'use client';

import Image from 'next/image';
import { useCallback, useId, useState } from 'react';
import {
  HIW_FAQ_ACCORDION_CLASS,
  HIW_FAQ_ANSWER_CLASS,
  HIW_FAQ_BLOCK_CLASS,
  HIW_FAQ_DEFAULT_EXPANDED_INDEX,
  HIW_FAQ_DIVIDER_CLASS,
  HIW_FAQ_HEADING_CLASS,
  HIW_FAQ_ITEM_CLASS,
  HIW_FAQ_QUESTION_DESKTOP_CLASS,
  HIW_FAQ_QUESTION_MOBILE_CLASS,
  HIW_FAQ_QUESTION_ROW_CLASS,
  HIW_FAQ_SECTION_CLASS,
  HIW_FAQ_TAB_ACTIVE_CLASS,
  HIW_FAQ_TAB_INACTIVE_CLASS,
  HIW_FAQ_TABS,
  HIW_FAQ_TABS_CLASS,
} from '@/constants/how-it-works.constants';
import { ids } from '@/tokens/build/test-ids';
import type { HiwFaqItemConfig } from '@/types/how-it-works.types';

const faq = ids.component.howItWorks.faq;

function FaqChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={`inline-flex size-[var(--spacing-24)] shrink-0 text-[var(--color-text-primary)] transition-transform ${
        expanded ? 'rotate-180' : ''
      }`}
      aria-hidden="true"
    >
      <Image src="/icons/icon-faq-chevron.svg" alt="" width={24} height={24} className="size-full" />
    </span>
  );
}

function FaqAccordionItem({
  item,
  expanded,
  onToggle,
  headingId,
  panelId,
}: {
  item: HiwFaqItemConfig;
  expanded: boolean;
  onToggle: () => void;
  headingId: string;
  panelId: string;
}) {
  return (
    <article
      data-testid={faq.question}
      data-faq-item-id={item.id}
      className={`${HIW_FAQ_ITEM_CLASS}${item.desktopOnly ? ' hidden lg:flex' : ''}`}
    >
      <button
        type="button"
        data-testid={item.questionTestId}
        aria-expanded={expanded}
        aria-controls={panelId}
        id={headingId}
        className={`${HIW_FAQ_QUESTION_ROW_CLASS} w-full text-left`}
        onClick={onToggle}
      >
        <span className={`${HIW_FAQ_QUESTION_MOBILE_CLASS} lg:hidden`}>{item.question}</span>
        <span className={`hidden ${HIW_FAQ_QUESTION_DESKTOP_CLASS} lg:inline`}>{item.question}</span>
        <FaqChevronIcon expanded={expanded} />
      </button>
      {expanded ? (
        <p data-testid={item.answerTestId} id={panelId} role="region" aria-labelledby={headingId} className={HIW_FAQ_ANSWER_CLASS}>
          {item.answer}
        </p>
      ) : null}
      <div className={HIW_FAQ_DIVIDER_CLASS} aria-hidden="true" />
    </article>
  );
}

export function HowItWorksFaqSection() {
  const baseId = useId();
  const [activeTabId, setActiveTabId] = useState(HIW_FAQ_TABS[0].id);
  const [expandedByTab, setExpandedByTab] = useState<Record<string, number>>(() => ({
    [HIW_FAQ_TABS[0].id]: HIW_FAQ_DEFAULT_EXPANDED_INDEX,
  }));

  const activeTab = HIW_FAQ_TABS.find((tab) => tab.id === activeTabId) ?? HIW_FAQ_TABS[0];
  const expandedIndex = expandedByTab[activeTab.id] ?? HIW_FAQ_DEFAULT_EXPANDED_INDEX;

  const handleTabSelect = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    setExpandedByTab((prev) => ({
      ...prev,
      [tabId]: prev[tabId] ?? HIW_FAQ_DEFAULT_EXPANDED_INDEX,
    }));
  }, []);

  const handleQuestionToggle = useCallback(
    (index: number) => {
      setExpandedByTab((prev) => ({
        ...prev,
        [activeTab.id]: prev[activeTab.id] === index ? -1 : index,
      }));
    },
    [activeTab.id],
  );

  return (
    <section data-testid={faq.root} className={HIW_FAQ_SECTION_CLASS}>
      <h2 data-testid={faq.heading} className={HIW_FAQ_HEADING_CLASS}>
        FAQs
      </h2>

      <div data-testid={faq.block} className={HIW_FAQ_BLOCK_CLASS}>
        <div
          data-testid={faq.tabs}
          role="tablist"
          aria-label="FAQ categories"
          className={HIW_FAQ_TABS_CLASS}
        >
          {HIW_FAQ_TABS.map((tab) => {
            const selected = tab.id === activeTab.id;
            const visibilityClass = tab.desktopOnly ? 'hidden lg:inline-flex' : '';
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                data-testid={tab.tabTestId}
                aria-selected={selected}
                className={`${selected ? HIW_FAQ_TAB_ACTIVE_CLASS : HIW_FAQ_TAB_INACTIVE_CLASS} ${visibilityClass}`.trim()}
                onClick={() => handleTabSelect(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          data-testid={faq.accordion}
          role="tabpanel"
          aria-label={`${activeTab.label} questions`}
          className={HIW_FAQ_ACCORDION_CLASS}
        >
          {activeTab.items.map((item, index) => {
            const headingId = `${baseId}-${activeTab.id}-${item.id}-heading`;
            const panelId = `${baseId}-${activeTab.id}-${item.id}-panel`;

            return (
              <FaqAccordionItem
                key={item.id}
                item={item}
                expanded={expandedIndex === index}
                onToggle={() => handleQuestionToggle(index)}
                headingId={headingId}
                panelId={panelId}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
