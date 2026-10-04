import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';
import {
  BookOpen,
  ExternalLink,
  Link2,
  Check,
  Sparkles,
  Maximize2,
  X,
  Settings,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const FlipbookSection: React.FC = () => {
  const { data, updateData, editMode } = useEditor();

  const currentHeyzineUrl =
    data.flipbook.heyzineUrl || data.flipbook.embedUrl || 'https://heyzine.com';

  const [inputUrl, setInputUrl] = useState(
    data.flipbook.heyzineUrl || data.flipbook.embedUrl || ''
  );
  const [showConfigTab, setShowConfigTab] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showModalViewer, setShowModalViewer] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveHeyzineLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = inputUrl.trim();
    updateData('flipbook', {
      ...data.flipbook,
      heyzineUrl: cleanUrl,
      embedUrl: cleanUrl,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleOpenHeyzine = () => {
    const url = currentHeyzineUrl.trim();
    if (url) {
      const validUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;
      window.open(validUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text.trim());
      }
    } catch {
      // Fallback if permission denied
    }
  };

  const isLinkConfigured = Boolean(
    (data.flipbook.heyzineUrl && data.flipbook.heyzineUrl.trim()) ||
    (data.flipbook.embedUrl && data.flipbook.embedUrl.trim())
  );

  return (
    <section id="flipbook" className="py-20 md:py-28 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-3 max-w-2xl">
            {(data.flipbook.tag || editMode) && (
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500 block">
                <EditableText
                  value={data.flipbook.tag || ''}
                  onSave={(val) => updateData('flipbook', { tag: val })}
                  label="Flipbook Tag"
                />
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black">
              <EditableText
                value={data.flipbook.title}
                onSave={(val) => updateData('flipbook', { title: val })}
                label="Flipbook Title"
              />
            </h2>
            {(data.flipbook.description || editMode) && (
              <div className="text-sm sm:text-base text-neutral-600 font-light">
                <EditableText
                  value={data.flipbook.description}
                  onSave={(val) => updateData('flipbook', { description: val })}
                  multiline
                  label="Flipbook Description"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {editMode && (
              <button
                type="button"
                onClick={() => setShowConfigTab(!showConfigTab)}
                className={`px-3.5 py-2 border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer rounded-xs ${
                  showConfigTab
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 hover:border-black text-black bg-neutral-50'
                }`}
              >
                <Link2 size={13} />
                <span>{showConfigTab ? 'Hide Heyzine Link Tab' : 'Edit Heyzine Link Tab'}</span>
              </button>
            )}

            {(data.flipbook.badgeText || editMode) && (
              <div className="text-xs font-mono text-neutral-600 bg-neutral-100 px-3 py-2 border border-neutral-200 rounded-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                <EditableText
                  value={data.flipbook.badgeText || 'Hosted on Heyzine'}
                  onSave={(val) => updateData('flipbook', { badgeText: val })}
                  label="Platform Badge"
                />
              </div>
            )}
          </div>
        </div>

        {/* Large Prominent Tab for Adding / Configuring the Heyzine Link (Edit Mode) */}
        {editMode && showConfigTab && (
          <div className="bg-neutral-50 border-2 border-black p-6 sm:p-8 rounded-xs space-y-5 animate-in fade-in duration-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold text-xs">
                  HZ
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black font-mono">
                    Heyzine Flipbook Link Manager
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Paste your Heyzine publication link here. Visitors will click the large button below to open your flipbook.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-xs uppercase tracking-wider font-semibold ${
                  isLinkConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {isLinkConfigured ? 'Link Connected' : 'No Link Configured'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveHeyzineLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1.5">
                  Heyzine Publication URL:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://heyzine.com/flip-book/..."
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-neutral-300 font-mono focus:outline-none focus:border-black bg-white shadow-2xs"
                    />
                    <Link2 size={14} className="absolute left-3 top-3 text-neutral-400" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="px-3 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                      title="Paste from clipboard"
                    >
                      Paste
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                    >
                      <Check size={14} />
                      <span>Save Link</span>
                    </button>

                    {inputUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const url = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="px-3 py-2.5 border border-neutral-300 hover:border-black text-black bg-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        title="Test link in new tab"
                      >
                        <ExternalLink size={13} />
                        <span>Test Link</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <Check size={14} className="text-emerald-700" />
                  <span>Heyzine flipbook link saved successfully!</span>
                </div>
              )}

              <div className="text-[11px] font-mono text-neutral-500 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                <span>Supported: `heyzine.com/flip-book/...`</span>
                <span>·</span>
                <span>Supports full-screen interactive reader on mobile & desktop</span>
              </div>
            </form>
          </div>
        )}

        {/* Grand Editorial Showcase Card with Large Heyzine Button */}
        <div className="bg-neutral-950 text-white border border-neutral-800 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl rounded-xs">
          {/* Subtle architectural background grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (5 cols): Magazine Book Replica Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={handleOpenHeyzine}
                className="group/book relative cursor-pointer select-none max-w-xs sm:max-w-sm w-full transition-transform duration-300 hover:-translate-y-1.5"
                title="Click to open full flipbook on Heyzine"
              >
                {/* 3D Magazine Depth Spine & Shadow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-neutral-800/80 via-neutral-900/60 to-black blur-md rounded-xs opacity-75 group-hover/book:opacity-100 transition-opacity" />

                <div className="relative bg-neutral-900 border-2 border-neutral-700 overflow-hidden shadow-2xl aspect-[3/4] flex flex-col justify-between">
                  <img
                    src={data.hero.coverImage}
                    alt="Issue 01 Monsoon Cover"
                    className="absolute inset-0 w-full h-full object-cover group-hover/book:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

                  {/* Top Book Header */}
                  <div className="relative z-10 p-5 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-white/90">
                    <span className="font-bold">PARALLEL PERSPECTIVES</span>
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-xs text-white text-[10px]">
                      ISSUE 01
                    </span>
                  </div>

                  {/* Bottom Book Floating Strip */}
                  <div className="relative z-10 p-5 space-y-1 text-white">
                    <div className="text-xs font-mono uppercase tracking-widest text-neutral-300">
                      Fine-Art Monograph
                    </div>
                    <div className="text-xl font-extrabold uppercase tracking-tight">
                      Monsoon Edition
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-neutral-300">
                      <BookOpen size={13} />
                      <span>16 Archival Pages · Click to Read</span>
                    </div>
                  </div>

                  {/* Interactive Hover Pill */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/book:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <span className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl">
                      <span>Open on Heyzine</span>
                      <ExternalLink size={13} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Editorial Typography, Details & Large Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>Digital Monograph Reader</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
                  <EditableText
                    value={data.flipbook.subtitle || 'Complete 16-Page Editorial Edition'}
                    onSave={(val) => updateData('flipbook', { subtitle: val })}
                    label="Flipbook Subtitle"
                    className="text-white hover:text-white"
                  />
                </h3>

                <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed max-w-xl">
                  Browse the tactile monsoon print edition from any device. Rendered with dual-page spreads, authentic paper-turn physics, crisp zoom fidelity, and curated typography.
                </p>
              </div>

              {/* Meta details strip */}
              {(data.flipbook.metaDetails || editMode) && (
                <div className="py-3 px-4 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 flex items-center gap-2 max-w-xl">
                  <Layers size={14} className="text-neutral-400 shrink-0" />
                  <EditableText
                    value={data.flipbook.metaDetails || '16 Archival Pages · Fine Art Spreads · High-Resolution Flipbook'}
                    onSave={(val) => updateData('flipbook', { metaDetails: val })}
                    label="Flipbook Meta Details"
                    className="text-neutral-300 hover:text-white"
                  />
                </div>
              )}

              {/* Large Buttons: Primary Heyzine Link & In-Modal Interactive Reader */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleOpenHeyzine}
                  className="px-8 py-4 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 cursor-pointer group/btn"
                >
                  <BookOpen size={16} className="text-black group-hover/btn:scale-110 transition-transform" />
                  <EditableText
                    value={data.flipbook.buttonText || 'Read Issue 01 on Heyzine'}
                    onSave={(val) => updateData('flipbook', { buttonText: val })}
                    label="Heyzine Button Text"
                    className="text-black hover:text-black font-bold"
                  />
                  <ExternalLink size={15} className="text-black/70 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>

                {currentHeyzineUrl && currentHeyzineUrl !== 'https://heyzine.com' && (
                  <button
                    type="button"
                    onClick={() => setShowModalViewer(true)}
                    className="px-6 py-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-mono font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Maximize2 size={14} />
                    <span>Instant Preview</span>
                  </button>
                )}
              </div>

              {/* Colophon & Archival release info */}
              {(data.flipbook.colophon || editMode) && (
                <div className="pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-500">
                  <EditableText
                    value={data.flipbook.colophon || ''}
                    onSave={(val) => updateData('flipbook', { colophon: val })}
                    label="Flipbook Colophon"
                    className="text-neutral-500 hover:text-neutral-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Full-Screen Iframe Reader (if user clicks Instant Preview) */}
      {showModalViewer && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setShowModalViewer(false)}
        >
          <div
            className="flex items-center justify-between pb-3 text-white font-mono text-xs border-b border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold uppercase tracking-wider">Parallel Perspectives</span>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-400">Issue 01: Monsoon — Heyzine Reader</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleOpenHeyzine}
                className="text-neutral-400 hover:text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px]"
              >
                <span>Open in New Tab</span>
                <ExternalLink size={13} />
              </button>
              <button
                type="button"
                onClick={() => setShowModalViewer(false)}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div
            className="flex-1 my-3 bg-neutral-900 border border-neutral-800 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={currentHeyzineUrl}
              title="Parallel Perspectives Heyzine Flipbook"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>

          <div className="text-[11px] font-mono text-neutral-500 text-center">
            Press Esc or click outside to return to the website.
          </div>
        </div>
      )}
    </section>
  );
};
