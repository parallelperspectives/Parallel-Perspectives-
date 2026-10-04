import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { LogoConfig } from '../types';
import { Pencil, ZoomIn, ZoomOut, Upload, Trash2, Plus } from 'lucide-react';
import { LogoEditorModal } from './LogoEditorModal';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
  compact?: boolean;
  overrideConfig?: LogoConfig;
  placement?: 'header' | 'hero' | 'footer';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  inverted = false,
  compact = false,
  overrideConfig,
  placement,
}) => {
  let contextEditor: ReturnType<typeof useEditor> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    contextEditor = useEditor();
  } catch {
    // context not available in isolated preview
  }

  const editMode = contextEditor?.editMode || false;
  const config: LogoConfig = overrideConfig || contextEditor?.data?.siteInfo?.logo || {
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const placements = config.placements || { header: true, hero: true, footer: true };
  const isVisibleInPlacement = placement ? placements[placement] !== false : true;

  const currentScale = overrideConfig?.scale ?? config.scale ?? 1.0;
  const textColor = inverted ? '#FFFFFF' : '#000000';
  const gradStop = inverted ? '#444444' : '#737373';

  const heightMap = {
    xs: 28,
    sm: 38,
    md: 56,
    lg: 84,
    xl: 120,
  };

  const targetHeight = heightMap[size] || 56;
  const targetWidth = Math.round(targetHeight * (compact ? 2.2 : 1.75));

  const handleClick = (e: React.MouseEvent) => {
    if (editMode && !overrideConfig) {
      e.preventDefault();
      e.stopPropagation();
      setIsModalOpen(true);
    }
  };

  const handleQuickZoom = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!contextEditor || overrideConfig) return;
    const newScale = Math.max(0.4, Math.min(3.5, Math.round((currentScale + delta) * 100) / 100));
    contextEditor.updateData('siteInfo', {
      ...contextEditor.data.siteInfo,
      logo: {
        ...config,
        scale: newScale,
      },
    });
  };

  const handleTogglePlacement = (placeKey: 'header' | 'hero' | 'footer', visible: boolean) => {
    if (!contextEditor || overrideConfig) return;
    contextEditor.updateData('siteInfo', {
      ...contextEditor.data.siteInfo,
      logo: {
        ...config,
        placements: {
          ...placements,
          [placeKey]: visible,
        },
      },
    });
  };

  // If deleted from this specific placement
  if (!isVisibleInPlacement) {
    if (!editMode) {
      return null;
    }

    return (
      <div className={`inline-flex items-center my-1 ${className}`}>
        <button
          type="button"
          onClick={() => placement && handleTogglePlacement(placement, true)}
          className={`px-3 py-1.5 border border-dashed text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer rounded-xs ${
            inverted
              ? 'border-neutral-700 hover:border-white text-neutral-400 hover:text-white bg-neutral-900/60'
              : 'border-neutral-300 hover:border-black text-neutral-500 hover:text-black bg-neutral-50/80 hover:bg-neutral-100'
          }`}
          title={`Click to restore logo in ${placement || 'this place'}`}
        >
          <Plus size={12} />
          <span>+ Add Logo to {placement ? placement.charAt(0).toUpperCase() + placement.slice(1) : 'Section'}</span>
        </button>
      </div>
    );
  }

  // Quick zoom & delete controls overlay when in Edit Mode
  const renderQuickControls = () => {
    if (!editMode || overrideConfig) return null;
    return (
      <div
        className="absolute -top-7 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-mono shadow-xl flex items-center gap-1.5 z-30 select-none pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => handleQuickZoom(e, -0.1)}
          className="hover:text-amber-400 p-0.5 cursor-pointer"
          title="Zoom Out Logo (-10%)"
        >
          <ZoomOut size={11} />
        </button>
        <span className="font-bold text-white px-0.5">
          {Math.round(currentScale * 100)}%
        </span>
        <button
          type="button"
          onClick={(e) => handleQuickZoom(e, 0.1)}
          className="hover:text-amber-400 p-0.5 cursor-pointer"
          title="Zoom In Logo (+10%)"
        >
          <ZoomIn size={11} />
        </button>
        <span className="text-neutral-500">·</span>
        <button
          type="button"
          onClick={handleClick}
          className="hover:text-white flex items-center gap-0.5 cursor-pointer uppercase text-[9px] tracking-wider"
          title="Upload, Scale, or Edit Logo"
        >
          <Upload size={10} />
          <span>Upload</span>
        </button>

        {placement && (
          <>
            <span className="text-neutral-500">·</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTogglePlacement(placement, false);
              }}
              className="hover:text-red-400 p-0.5 cursor-pointer text-neutral-400"
              title={`Delete logo from ${placement}`}
            >
              <Trash2 size={11} />
            </button>
          </>
        )}
      </div>
    );
  };

  // If a custom image logo is uploaded
  if (config.customImageUrl) {
    return (
      <>
        <div
          onClick={handleClick}
          className={`inline-flex items-center group relative ${
            editMode && !overrideConfig ? 'cursor-pointer hover:ring-1 hover:ring-black/40 p-0.5 rounded-xs' : ''
          } ${className}`}
          style={{ height: targetHeight }}
          title={editMode ? 'Click to change, zoom, or delete logo' : undefined}
        >
          {renderQuickControls()}

          <div
            className="h-full flex items-center origin-left transition-transform duration-150"
            style={{
              transform: `scale(${currentScale})`,
            }}
          >
            <img
              src={config.customImageUrl}
              alt={`${config.prefix}${config.suffix} ${config.subtitle}`}
              className={`h-full w-auto object-contain max-h-[160px] ${
                inverted ? 'brightness-0 invert' : ''
              }`}
            />
          </div>

          {editMode && !overrideConfig && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 p-1 bg-black text-white rounded-full text-[10px] inline-flex items-center shadow-md">
              <Pencil size={10} />
            </span>
          )}
        </div>

        {isModalOpen && (
          <LogoEditorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </>
    );
  }

  // Compact inline mode (e.g. for small headers)
  if (compact) {
    return (
      <>
        <div
          onClick={handleClick}
          className={`inline-flex items-center gap-2 select-none group relative ${
            editMode && !overrideConfig ? 'cursor-pointer hover:ring-1 hover:ring-black/40 p-0.5 rounded-xs' : ''
          } ${className}`}
          title={editMode ? 'Click to edit, zoom, or delete logo' : undefined}
        >
          {renderQuickControls()}

          <div
            className="inline-flex items-center gap-2 origin-left transition-transform duration-150"
            style={{
              transform: `scale(${currentScale})`,
            }}
          >
            <span
              className="font-extrabold tracking-tighter text-sm uppercase"
              style={{ color: textColor, fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
            >
              {config.prefix}
              {config.suffix}
            </span>
            <span
              className="text-[10px] tracking-[0.25em] font-medium uppercase opacity-70"
              style={{ color: textColor }}
            >
              {config.subtitle}
            </span>
          </div>

          {editMode && !overrideConfig && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 bg-black text-white rounded-full text-[9px] inline-flex items-center shadow-xs">
              <Pencil size={9} />
            </span>
          )}
        </div>

        {isModalOpen && (
          <LogoEditorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </>
    );
  }

  const gradId = `logo-stem-grad-${inverted ? 'inv' : 'std'}-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <>
      <div
        onClick={handleClick}
        className={`inline-block select-none group relative ${
          editMode && !overrideConfig ? 'cursor-pointer hover:ring-1 hover:ring-black/40 p-0.5 rounded-xs' : ''
        } ${className}`}
        style={{ height: targetHeight, width: targetWidth }}
        title={editMode ? 'Click to edit, upload, zoom, or delete logo' : undefined}
      >
        {renderQuickControls()}

        <div
          className="w-full h-full origin-left transition-transform duration-150"
          style={{
            transform: `scale(${currentScale})`,
          }}
        >
          <svg
            viewBox="0 0 280 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
            aria-label="Parallel Perspectives Logo"
            role="img"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={textColor} stopOpacity="1" />
                <stop offset="55%" stopColor={textColor} stopOpacity="1" />
                <stop offset="92%" stopColor={gradStop} stopOpacity="0.8" />
                <stop offset="100%" stopColor={gradStop} stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Prefix (default PARA) */}
            <text
              x="12"
              y="72"
              fill={textColor}
              fontSize="68"
              fontWeight="900"
              letterSpacing="-1.5px"
              fontFamily="'Plus Jakarta Sans', 'Arial Black', sans-serif"
              style={{ textTransform: 'uppercase' }}
            >
              {config.prefix}
            </text>

            {/* Two tall parallel vertical pillar stems descending */}
            {config.showPillars && (
              <>
                <rect
                  x="154"
                  y="18"
                  width="19"
                  height="146"
                  fill={`url(#${gradId})`}
                />
                <rect
                  x="175"
                  y="18"
                  width="19"
                  height="146"
                  fill={`url(#${gradId})`}
                />
              </>
            )}

            {/* Suffix (default EL) */}
            <text
              x={config.showPillars ? "196" : "160"}
              y="72"
              fill={textColor}
              fontSize="68"
              fontWeight="900"
              letterSpacing="-1.5px"
              fontFamily="'Plus Jakarta Sans', 'Arial Black', sans-serif"
              style={{ textTransform: 'uppercase' }}
            >
              {config.suffix}
            </text>

            {/* Subtitle (default PERSPECTIVES) */}
            <text
              x="12"
              y="88"
              fill={textColor}
              fontSize="11.5"
              fontWeight="700"
              letterSpacing="4.8px"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              style={{ textTransform: 'uppercase' }}
            >
              {config.subtitle}
            </text>
          </svg>
        </div>

        {editMode && !overrideConfig && (
          <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-black text-white rounded-full text-[10px] shadow-lg flex items-center gap-1 z-20">
            <Pencil size={11} />
          </span>
        )}
      </div>

      {isModalOpen && (
        <LogoEditorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};
