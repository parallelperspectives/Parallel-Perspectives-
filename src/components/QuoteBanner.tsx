import React from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';

export const QuoteBanner: React.FC = () => {
  const { data, updateData, editMode } = useEditor();

  const hasQuote = Boolean(data.quote.text && data.quote.text.trim());
  const hasAuthor = Boolean(data.quote.author && data.quote.author.trim());
  const hasCitation = Boolean(data.quote.citation && data.quote.citation.trim());

  // In preview mode, if quote is removed, hide banner completely
  if (!hasQuote && !hasAuthor && !hasCitation && !editMode) {
    return null;
  }

  return (
    <section className="bg-neutral-50 border-y border-neutral-200 py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {(data.quote.categoryTag || editMode) && (
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-500 block">
            <EditableText
              value={data.quote.categoryTag || ''}
              onSave={(val) => updateData('quote', { categoryTag: val })}
              label="Quote Tag"
            />
          </span>
        )}

        <blockquote className="space-y-4">
          <div
            className="text-2xl sm:text-3xl md:text-4xl text-black font-normal leading-snug tracking-tight max-w-4xl mx-auto text-balance"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {hasQuote ? '“' : ''}
            <EditableText
              value={data.quote.text}
              onSave={(val) => updateData('quote', { text: val })}
              label="Quote Body"
              className="font-normal"
            />
            {hasQuote ? '”' : ''}
          </div>

          {(hasAuthor || hasCitation || editMode) && (
            <footer className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-mono text-neutral-600 uppercase tracking-widest">
              {(hasAuthor || editMode) && (
                <cite className="not-italic font-bold text-black text-sm flex items-center gap-1">
                  {hasAuthor && <span>—</span>}
                  <EditableText
                    value={data.quote.author}
                    onSave={(val) => updateData('quote', { author: val })}
                    label="Quote Author"
                  />
                </cite>
              )}

              {hasAuthor && hasCitation && (
                <span className="hidden sm:inline text-neutral-400">·</span>
              )}

              {(hasCitation || editMode) && (
                <span className="text-neutral-500 text-[11px]">
                  <EditableText
                    value={data.quote.citation}
                    onSave={(val) => updateData('quote', { citation: val })}
                    label="Quote Citation"
                  />
                </span>
              )}
            </footer>
          )}
        </blockquote>
      </div>
    </section>
  );
};
