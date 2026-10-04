import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { LogoConfig } from '../types';
import {
  X,
  Check,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Type,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Trash2,
  Layers,
} from 'lucide-react';
import { Logo } from './Logo';

interface LogoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoEditorModal: React.FC<LogoEditorModalProps> = ({ isOpen, onClose }) => {
  const { data, updateData } = useEditor();
  const currentLogo = data.siteInfo.logo || {
    prefix: "PARA",
    suffix: "EL",
    subtitle: "PERSPECTIVES",
    showPillars: true,
    customImageUrl: "",
    scale: 1.0,
    offsetX: 0,
    offsetY: 0,
    placements: {
      header: true,
      hero: true,
      footer: true,
    },
  };

  const [form, setForm] = useState<LogoConfig>({
    ...currentLogo,
    scale: currentLogo.scale || 1.0,
    offsetX: currentLogo.offsetX || 0,
    offsetY: currentLogo.offsetY || 0,
    placements: currentLogo.placements || {
      header: true,
      hero: true,
      footer: true,
    },
  });

  const [activeTab, setActiveTab] = useState<'image' | 'vector'>(
    currentLogo.customImageUrl ? 'image' : 'image'
  );

  const [previewBg, setPreviewBg] = useState<'light' | 'dark' | 'checker'>('light');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setForm((prev) => ({
            ...prev,
            customImageUrl: reader.result as string,
            scale: prev.scale || 1.0,
          }));
          setActiveTab('image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const updated: LogoConfig = {
      ...form,
      customImageUrl: activeTab === 'image' ? form.customImageUrl : '',
      scale: form.scale || 1.0,
      placements: form.placements || { header: true, hero: true, footer: true },
    };
    updateData('siteInfo', {
      ...data.siteInfo,
      logo: updated,
    });
    onClose();
  };

  const handleResetToDefault = () => {
    const def: LogoConfig = {
      prefix: "PARA",
      suffix: "EL",
      subtitle: "PERSPECTIVES",
      showPillars: true,
      customImageUrl: "",
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      placements: {
        header: true,
        hero: true,
        footer: true,
      },
    };
    setForm(def);
  };

  const currentScale = form.scale || 1.0;

  const handleZoomChange = (newScale: number) => {
    const clamped = Math.max(0.4, Math.min(3.5, Math.round(newScale * 100) / 100));
    setForm((prev) => ({ ...prev, scale: clamped }));
  };

  const placements = form.placements || { header: true, hero: true, footer: true };

  const handleTogglePlace = (placeKey: 'header' | 'hero' | 'footer') => {
    setForm((prev) => {
      const curPlacements = prev.placements || { header: true, hero: true, footer: true };
      return {
        ...prev,
        placements: {
          ...curPlacements,
          [placeKey]: !curPlacements[placeKey],
        },
      };
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-xl w-full p-6 text-black border border-neutral-300 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-black flex items-center gap-2">
              <span>Logo Studio</span>
              <span className="text-[10px] font-mono font-normal uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-xs">
                Upload & Sizing
              </span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Upload your own logo, adjust zoom in/out, or delete/hide from any section.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-200 gap-6 text-xs font-mono uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'image'
                ? 'border-b-2 border-black text-black font-bold'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <ImageIcon size={14} />
            <span>Upload Logo Image</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vector')}
            className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'vector'
                ? 'border-b-2 border-black text-black font-bold'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <Type size={14} />
            <span>Vector Wordmark Editor</span>
          </button>
        </div>

        {/* Live Preview Stage with Background Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span className="uppercase tracking-wider">
              Live Preview ({Math.round(currentScale * 100)}% Zoom)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px]">Preview Bg:</span>
              <button
                type="button"
                onClick={() => setPreviewBg('light')}
                className={`p-1 rounded-xs cursor-pointer ${
                  previewBg === 'light' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
                title="White Background"
              >
                <Sun size={12} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewBg('dark')}
                className={`p-1 rounded-xs cursor-pointer ${
                  previewBg === 'dark' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
                title="Dark Background"
              >
                <Moon size={12} />
              </button>
            </div>
          </div>

          <div
            className={`border border-neutral-200 p-6 flex flex-col items-center justify-center min-h-[160px] max-h-[220px] overflow-hidden rounded-xs relative transition-colors ${
              previewBg === 'dark'
                ? 'bg-neutral-950 text-white'
                : previewBg === 'checker'
                ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] bg-white'
                : 'bg-neutral-50 text-black'
            }`}
          >
            {activeTab === 'image' && form.customImageUrl ? (
              <div
                className="transition-transform duration-100 origin-center flex items-center justify-center max-w-full max-h-full"
                style={{
                  transform: `scale(${currentScale})`,
                }}
              >
                <img
                  src={form.customImageUrl}
                  alt="Custom Logo Preview"
                  className={`max-h-24 max-w-full object-contain ${
                    previewBg === 'dark' ? 'brightness-0 invert' : ''
                  }`}
                />
              </div>
            ) : (
              <div
                className="transition-transform duration-100 origin-center"
                style={{
                  transform: `scale(${currentScale})`,
                }}
              >
                <Logo
                  overrideConfig={{
                    prefix: form.prefix,
                    suffix: form.suffix,
                    subtitle: form.subtitle,
                    showPillars: form.showPillars,
                    customImageUrl: '',
                    scale: 1.0,
                  }}
                  inverted={previewBg === 'dark'}
                  size="lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section Placement & Deletion Controls */}
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5 font-mono">
              <Layers size={13} />
              <span>Logo Placements (Click to Show / Delete):</span>
            </label>
            <span className="text-[10px] font-mono text-neutral-500">Toggle presence per place</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'header' as const, label: 'Header Bar' },
              { key: 'hero' as const, label: 'Hero Spotlight' },
              { key: 'footer' as const, label: 'Footer Strip' },
            ].map(({ key, label }) => {
              const isShown = placements[key] !== false;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTogglePlace(key)}
                  className={`p-2.5 border text-left text-xs font-mono transition-all rounded-xs flex items-center justify-between cursor-pointer ${
                    isShown
                      ? 'border-black bg-white text-black font-semibold shadow-2xs'
                      : 'border-neutral-200 bg-neutral-100 text-neutral-400 line-through'
                  }`}
                  title={isShown ? `Click to delete logo from ${label}` : `Click to restore logo in ${label}`}
                >
                  <span className="truncate">{label}</span>
                  <span
                    className={`text-[9px] px-1 py-0.5 rounded font-mono uppercase tracking-tight shrink-0 ml-1 ${
                      isShown ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {isShown ? 'Active' : 'Deleted'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Zoom In / Zoom Out Controls */}
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5 font-mono">
              <ZoomIn size={13} />
              <span>Logo Zoom & Scaling:</span>
            </label>
            <span className="text-xs font-mono font-bold text-black bg-white px-2 py-0.5 border border-neutral-300">
              {Math.round(currentScale * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleZoomChange(currentScale - 0.1)}
              className="p-2 border border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 text-black transition-colors rounded-xs cursor-pointer"
              title="Zoom Out (-10%)"
              aria-label="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>

            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.05"
              value={currentScale}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="flex-1 accent-black h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
              aria-label="Logo Zoom Slider"
            />

            <button
              type="button"
              onClick={() => handleZoomChange(currentScale + 0.1)}
              className="p-2 border border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 text-black transition-colors rounded-xs cursor-pointer"
              title="Zoom In (+10%)"
              aria-label="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 text-[11px] font-mono">
            <div className="flex gap-1.5">
              {[0.6, 0.8, 1.0, 1.25, 1.5, 2.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleZoomChange(preset)}
                  className={`px-2 py-0.5 border text-[10px] transition-colors cursor-pointer ${
                    Math.abs(currentScale - preset) < 0.03
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  {Math.round(preset * 100)}%
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleZoomChange(1.0)}
              className="text-[10px] text-neutral-500 hover:text-black underline cursor-pointer"
            >
              Reset to 100%
            </button>
          </div>
        </div>

        {/* Tab Content: Upload Image */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            {/* Drag & Drop Box */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? 'border-black bg-neutral-100'
                  : 'border-neutral-300 hover:border-black bg-neutral-50'
              }`}
            >
              <Upload size={24} className="mx-auto text-neutral-400 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-black">
                Drag & Drop Your Logo File Here
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 mb-3">
                Supports PNG with transparency, SVG, JPG, or WebP.
              </p>

              <label className="inline-block px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider cursor-pointer shadow-xs">
                <span>Browse File From Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Custom URL Input & Delete Uploaded Logo */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-700 mb-1 font-mono">
                Or Paste Image Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.customImageUrl || ''}
                  onChange={(e) => setForm({ ...form, customImageUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="flex-1 px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-black font-mono"
                />
                {form.customImageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, customImageUrl: '' })}
                    className="px-3 py-2 border border-neutral-300 hover:bg-red-50 hover:text-red-600 text-xs font-mono cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {form.customImageUrl && (
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-xs flex items-center justify-between">
                <span className="text-xs font-mono text-red-900">Custom logo is currently active.</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, customImageUrl: '' })}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer rounded-xs"
                >
                  <Trash2 size={12} />
                  <span>Delete Uploaded Logo</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Vector Wordmark */}
        {activeTab === 'vector' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-700 mb-1 font-mono">
                  Prefix (Left Word)
                </label>
                <input
                  type="text"
                  value={form.prefix}
                  onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-black font-mono"
                  placeholder="PARA"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-700 mb-1 font-mono">
                  Suffix (Right Word)
                </label>
                <input
                  type="text"
                  value={form.suffix}
                  onChange={(e) => setForm({ ...form, suffix: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-black font-mono"
                  placeholder="EL"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-700 mb-1 font-mono">
                Subtitle (Under Prefix)
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-black font-mono"
                placeholder="PERSPECTIVES"
              />
            </div>

            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                <input
                  type="checkbox"
                  checked={form.showPillars}
                  onChange={(e) => setForm({ ...form, showPillars: e.target.checked })}
                  className="rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="text-neutral-800">Show Twin Parallel Pillar Stems</span>
              </label>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 font-mono underline cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-neutral-500 hover:text-black font-mono underline cursor-pointer"
          >
            Reset All Settings
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check size={14} />
              <span>Apply Logo Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
