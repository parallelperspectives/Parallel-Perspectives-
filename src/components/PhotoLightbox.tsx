import React, { useEffect } from 'react';
import { useEditor } from '../context/EditorContext';
import { X, ChevronLeft, ChevronRight, Camera, Aperture, Info } from 'lucide-react';

export const PhotoLightbox: React.FC = () => {
  const { data, activeLightboxIndex, closeLightbox, openLightbox } = useEditor();

  const story = activeLightboxIndex !== null ? data.stories[activeLightboxIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' && activeLightboxIndex < data.stories.length - 1) {
        openLightbox(activeLightboxIndex + 1);
      }
      if (e.key === 'ArrowLeft' && activeLightboxIndex > 0) {
        openLightbox(activeLightboxIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, data.stories.length, closeLightbox, openLightbox]);

  if (activeLightboxIndex === null || !story) return null;

  const hasPrev = activeLightboxIndex > 0;
  const hasNext = activeLightboxIndex < data.stories.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between text-white animate-in fade-in duration-200"
      onClick={closeLightbox}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-400">
            {story.plateLabel !== undefined
              ? (story.plateLabel ? `${story.plateLabel} / ${String(data.stories.length).padStart(2, '0')}` : `${String(activeLightboxIndex + 1).padStart(2, '0')} / ${String(data.stories.length).padStart(2, '0')}`)
              : `Plate ${String(activeLightboxIndex + 1).padStart(2, '0')} / ${String(data.stories.length).padStart(2, '0')}`}
          </span>
          <span className="text-neutral-600">·</span>
          <span className="text-xs uppercase tracking-widest text-neutral-300 font-medium">
            Issue 01: Monsoon
          </span>
        </div>

        <button
          onClick={closeLightbox}
          className="text-neutral-400 hover:text-white transition-colors p-1 flex items-center gap-1.5 text-xs uppercase tracking-widest"
        >
          <span>Close</span>
          <X size={20} />
        </button>
      </div>

      {/* Main stage with photo & navigation */}
      <div
        className="flex-1 flex items-center justify-between px-4 md:px-12 py-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev button */}
        {hasPrev ? (
          <button
            onClick={() => openLightbox(activeLightboxIndex - 1)}
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all backdrop-blur-xs z-10"
            aria-label="Previous photograph"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-12 hidden md:block" />
        )}

        {/* The photo itself */}
        <div className="max-h-[75vh] max-w-[85vw] mx-auto flex flex-col items-center justify-center">
          <img
            src={story.image}
            alt={story.title}
            className="max-h-[72vh] max-w-full object-contain shadow-2xl rounded-xs select-none"
          />
        </div>

        {/* Next button */}
        {hasNext ? (
          <button
            onClick={() => openLightbox(activeLightboxIndex + 1)}
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all backdrop-blur-xs z-10"
            aria-label="Next photograph"
          >
            <ChevronRight size={24} />
          </button>
        ) : (
          <div className="w-12 hidden md:block" />
        )}
      </div>

      {/* Bottom metadata panel */}
      <div
        className="bg-black/80 border-t border-white/10 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold tracking-tight text-white">{story.title}</h3>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-300 font-medium">{story.photographer}</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-400 font-mono text-[11px]">{story.tag}</span>
          </div>
          <p className="text-neutral-400 max-w-2xl text-xs leading-relaxed">
            {story.storyBody || story.teaser}
          </p>
        </div>

        <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px] shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-white/10">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xs">
            <Aperture size={13} className="text-neutral-300" />
            <span>{story.exif}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xs">
            <Camera size={13} className="text-neutral-300" />
            <span>Issue 01 Monochromatic</span>
          </div>
        </div>
      </div>
    </div>
  );
};
