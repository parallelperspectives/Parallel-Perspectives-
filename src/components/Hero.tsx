import React from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { Logo } from './Logo';
import { ArrowDown, BookOpen, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, updateData, editMode } = useEditor();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 md:py-24 bg-white border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edition metadata bar */}
        {(data.hero.badge || data.hero.details || editMode) && (
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-neutral-200 text-xs font-mono tracking-wider text-neutral-500 uppercase">
            <div className="flex items-center gap-2">
              {data.hero.badge && <span className="w-2 h-2 rounded-full bg-black inline-block animate-pulse" />}
              <EditableText
                value={data.hero.badge}
                onSave={(val) => updateData('hero', { badge: val })}
                className="text-neutral-900 font-semibold"
                label="Edition Badge"
              />
            </div>
            <div className="flex items-center gap-4 text-[11px] text-neutral-500">
              <EditableText
                value={data.hero.details}
                onSave={(val) => updateData('hero', { details: val })}
                label="Edition Details"
              />
            </div>
          </div>
        )}

        {/* Hero Grid: Left Editorial Typography & Excerpt / Right Large Magazine Cover */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-12 lg:pt-16">
          {/* Left Column (7 cols): Typography, Origin, and Intent */}
          <div className="lg:col-span-7 space-y-8">
            {/* Prominent Logo & Title Lockup */}
            <div className="space-y-4">
              <div className="mb-2">
                <Logo size="lg" placement="hero" className="scale-100 sm:scale-110 origin-left" />
              </div>

              {(data.hero.title || editMode) && (
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-black uppercase leading-[0.95] text-balance">
                  <EditableText
                    value={data.hero.title}
                    onSave={(val) => updateData('hero', { title: val })}
                    label="Hero Title"
                  />
                </h1>
              )}

              {(data.hero.subtitle || editMode) && (
                <div className="text-sm sm:text-base font-medium tracking-wide uppercase text-neutral-500 font-mono">
                  <EditableText
                    value={data.hero.subtitle}
                    onSave={(val) => updateData('hero', { subtitle: val })}
                    label="Hero Subtitle"
                  />
                </div>
              )}
            </div>

            {/* Editorial Excerpt */}
            {(data.hero.excerpt || editMode) && (
              <div className="relative pl-6 border-l-2 border-black/80">
                <div
                  className="text-lg sm:text-xl text-neutral-800 font-normal leading-relaxed text-balance"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {data.hero.excerpt ? '“' : ''}
                  <EditableText
                    value={data.hero.excerpt}
                    onSave={(val) => updateData('hero', { excerpt: val })}
                    multiline
                    label="Hero Excerpt"
                  />
                  {data.hero.excerpt ? '”' : ''}
                </div>
              </div>
            )}

            {/* Curator Credits */}
            {(data.hero.curators || editMode) && (
              <div className="pt-2 text-xs font-mono text-neutral-500 flex items-center gap-2">
                {(data.hero.curatorsPrefix || editMode) && (
                  <EditableText
                    value={data.hero.curatorsPrefix || ''}
                    onSave={(val) => updateData('hero', { curatorsPrefix: val })}
                    label="Curation Label"
                    className="text-black font-semibold uppercase tracking-wider"
                  />
                )}
                <EditableText
                  value={data.hero.curators}
                  onSave={(val) => updateData('hero', { curators: val })}
                  label="Curators"
                />
              </div>
            )}

            {/* Primary Action Buttons */}
            {(data.hero.ctaFlipbookText || data.hero.ctaStoriesText || editMode) && (
              <div className="pt-4 flex flex-wrap items-center gap-4">
                {(data.hero.ctaFlipbookText || editMode) && (
                  <button
                    onClick={() => scrollTo('flipbook')}
                    className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer"
                  >
                    <BookOpen size={15} />
                    <EditableText
                      value={data.hero.ctaFlipbookText || ''}
                      onSave={(val) => updateData('hero', { ctaFlipbookText: val })}
                      label="Flipbook Button"
                      className="text-white hover:text-white"
                    />
                  </button>
                )}

                {(data.hero.ctaStoriesText || editMode) && (
                  <button
                    onClick={() => scrollTo('featured-stories')}
                    className="px-6 py-3.5 bg-white hover:bg-neutral-100 text-black border border-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <EditableText
                      value={data.hero.ctaStoriesText || ''}
                      onSave={(val) => updateData('hero', { ctaStoriesText: val })}
                      label="Stories Button"
                    />
                    <ArrowDown size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Magazine Cover Showcase (Pristine, No Text Overlays) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              {/* Subtle background shadow spread */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-neutral-200 to-neutral-100 rounded-sm -rotate-1 group-hover:rotate-0 transition-transform duration-500" />

              <div className="relative bg-white border border-neutral-300 p-2 sm:p-3 shadow-xl">
                {/* Pure Cover Image container without any overlaid or adjacent text */}
                <div className="aspect-[3/4] overflow-hidden bg-neutral-900 relative">
                  <EditableImage
                    src={data.hero.coverImage}
                    alt="Parallel Perspectives Issue 01 Monsoon"
                    onSave={(url) => updateData('hero', { coverImage: url })}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
