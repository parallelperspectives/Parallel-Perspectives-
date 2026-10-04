import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { Camera, Image as ImageIcon, Upload, X, Check } from 'lucide-react';
import { INITIAL_MAGAZINE_DATA } from '../constants/initialData';

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (newSrc: string) => void;
  className?: string;
  aspectRatio?: string;
  onClickPreview?: () => void;
  caption?: string;
}

const PRESET_IMAGES = [
  { name: 'Monsoon Cover Spread', url: INITIAL_MAGAZINE_DATA.hero.coverImage },
  { name: 'The Last Dance (Dev Pedhadia)', url: INITIAL_MAGAZINE_DATA.stories[0]?.image || '' },
  { name: 'Where The Clouds Gather (Dev Pedhadia)', url: INITIAL_MAGAZINE_DATA.stories[1]?.image || '' },
  { name: 'Beyond The Net (Khushal Nasit)', url: INITIAL_MAGAZINE_DATA.stories[2]?.image || '' },
  { name: 'Before The Downpour (Dev Pedhadia)', url: INITIAL_MAGAZINE_DATA.stories[3]?.image || '' },
  { name: 'Through Rain-Stained Glass (Dev Pedhadia)', url: INITIAL_MAGAZINE_DATA.stories[4]?.image || '' },
  { name: 'Pause & Perceive (Khushal Nasit)', url: INITIAL_MAGAZINE_DATA.stories[5]?.image || '' },
];

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onSave,
  className = '',
  onClickPreview,
  caption,
}) => {
  const { editMode } = useEditor();
  const [modalOpen, setModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(src);
  const [previewError, setPreviewError] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    if (editMode) {
      e.stopPropagation();
      setUrlInput(src);
      setModalOpen(true);
    } else if (onClickPreview) {
      onClickPreview();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        // Compress image using canvas to prevent exceeding localStorage quota
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.8);
            setUrlInput(compressed);
            onSave(compressed);
            setModalOpen(false);
          } else {
            setUrlInput(rawDataUrl);
            onSave(rawDataUrl);
            setModalOpen(false);
          }
        };
        img.onerror = () => {
          setUrlInput(rawDataUrl);
          onSave(rawDataUrl);
          setModalOpen(false);
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUrl = () => {
    if (urlInput.trim()) {
      onSave(urlInput.trim());
      setModalOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className={`relative overflow-hidden group transition-all duration-300 ${
          editMode ? 'cursor-pointer ring-2 ring-transparent hover:ring-black' : onClickPreview ? 'cursor-zoom-in' : ''
        } ${className}`}
      >
        <img
          src={src}
          alt={alt}
          onError={() => setPreviewError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        {/* Fallback if image fails to load */}
        {previewError && (
          <div className="absolute inset-0 bg-neutral-900 text-white flex flex-col items-center justify-center p-4 text-center">
            <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">Fine Art Photography</span>
            <span className="text-xs text-neutral-300 mt-1 max-w-xs">{alt}</span>
          </div>
        )}

        {/* Edit mode overlay badge */}
        {editMode && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px] p-3 text-center">
            <div className="bg-white text-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
              <Camera size={14} />
              Change Photograph
            </div>
            <span className="text-[10px] text-white/90 mt-2 font-mono">Click to choose or upload</span>
          </div>
        )}

        {caption && !editMode && (
          <div className="sr-only">{caption}</div>
        )}
      </div>

      {/* Modal for image management */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white max-w-xl w-full p-6 text-black border border-neutral-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-black">Update Editorial Photograph</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Select an Issue 01 photograph, upload a local file, or paste a link.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-black p-1 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-700 mb-2">
                Issue 01 Curated Photo Library
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {PRESET_IMAGES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrlInput(item.url);
                      onSave(item.url);
                      setModalOpen(false);
                    }}
                    className={`relative aspect-4/3 overflow-hidden border-2 text-left transition-all ${
                      urlInput === item.url ? 'border-black ring-2 ring-black' : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[9px] p-1 truncate block">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload or URL */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-700 mb-1.5">
                  Or Paste Custom Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/photograph.jpg"
                    className="flex-1 px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-black font-mono"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="px-4 py-2 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1"
                  >
                    <Check size={14} />
                    Apply
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-700 mb-1.5">
                  Or Upload From Device
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-neutral-300 hover:border-black cursor-pointer text-xs font-medium text-neutral-600 hover:text-black transition-colors bg-neutral-50 hover:bg-neutral-100">
                  <Upload size={16} />
                  <span>Choose file from your computer</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
