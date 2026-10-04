import React, { createContext, useContext, useState, useEffect } from 'react';
import { MagazineData } from '../types';
import { INITIAL_MAGAZINE_DATA } from '../constants/initialData';

interface EditorContextType {
  data: MagazineData;
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  toggleEditMode: () => void;
  updateData: <K extends keyof MagazineData>(section: K, update: Partial<MagazineData[K]>) => void;
  updateStory: (id: string, updatedFields: Partial<MagazineData['stories'][0]>) => void;
  addStory: () => void;
  deleteStory: (id: string) => void;
  resetToDefaults: () => void;
  exportJSON: () => void;
  hasCustomEdits: boolean;
  activeLightboxIndex: number | null;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
}

const STORAGE_KEY = 'parallel_perspectives_issue01_data_v2';

/**
 * Safely saves data to localStorage without throwing QuotaExceededError.
 * Automatically cleans up stale keys and strips large base64 data URLs if quota is constrained.
 */
function safeSaveToLocalStorage(key: string, dataToSave: MagazineData): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(dataToSave));
    return true;
  } catch (err: any) {
    const isQuota =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014;

    if (!isQuota) {
      return false;
    }

    // 1. Remove legacy storage keys to free space
    try {
      localStorage.removeItem('parallel_perspectives_issue01_data_v1');
    } catch {
      // ignore
    }

    try {
      localStorage.setItem(key, JSON.stringify(dataToSave));
      return true;
    } catch {
      // 2. If quota is still tight, save a lightweight version replacing heavy base64 images with defaults
      try {
        const lightweightData = {
          ...dataToSave,
          hero: {
            ...dataToSave.hero,
            coverImage: dataToSave.hero.coverImage?.startsWith('data:image')
              ? INITIAL_MAGAZINE_DATA.hero.coverImage
              : dataToSave.hero.coverImage,
          },
          stories: dataToSave.stories.map((story, idx) => ({
            ...story,
            image: story.image?.startsWith('data:image')
              ? (INITIAL_MAGAZINE_DATA.stories[idx]?.image || INITIAL_MAGAZINE_DATA.stories[0].image)
              : story.image,
          })),
        };
        localStorage.setItem(key, JSON.stringify(lightweightData));
        return true;
      } catch {
        // Quota completely exhausted on origin; fail gracefully without console error noise
        return false;
      }
    }
  }
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MagazineData>(() => {
    try {
      // Cleanup legacy key
      try {
        localStorage.removeItem('parallel_perspectives_issue01_data_v1');
      } catch {
        // ignore
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed = JSON.parse(saved);
        // Sanitize legacy page numbers and monochrome references
        if (parsed.hero && parsed.hero.details && (parsed.hero.details.includes('68 Pages') || parsed.hero.details.toLowerCase().includes('monochromatic'))) {
          parsed.hero.details = INITIAL_MAGAZINE_DATA.hero.details;
        }
        if (parsed.foundersStory && parsed.foundersStory.mediumValue && parsed.foundersStory.mediumValue.toLowerCase().includes('monochrome')) {
          parsed.foundersStory.mediumValue = 'Fine Art Photography';
        }
        if (parsed.flipbook) {
          if (parsed.flipbook.totalPages === 68) parsed.flipbook.totalPages = 16;
          if (parsed.flipbook.subtitle && parsed.flipbook.subtitle.includes('68')) {
            parsed.flipbook.subtitle = INITIAL_MAGAZINE_DATA.flipbook.subtitle;
          }
          if (parsed.flipbook.metaDetails && (parsed.flipbook.metaDetails.includes('68') || parsed.flipbook.metaDetails.toLowerCase().includes('monochromatic'))) {
            parsed.flipbook.metaDetails = INITIAL_MAGAZINE_DATA.flipbook.metaDetails;
          }
          if (parsed.flipbook.description && (parsed.flipbook.description.includes('68') || parsed.flipbook.description.toLowerCase().includes('monochrome'))) {
            parsed.flipbook.description = INITIAL_MAGAZINE_DATA.flipbook.description;
          }
        }
        // Sanitize legacy unbundled raw image paths
        if (parsed.hero && parsed.hero.coverImage && parsed.hero.coverImage.startsWith('/src/assets/images')) {
          parsed.hero.coverImage = INITIAL_MAGAZINE_DATA.hero.coverImage;
        }
        if (Array.isArray(parsed.stories)) {
          parsed.stories = parsed.stories.map((s: any, idx: number) => {
            if (s.image && s.image.startsWith('/src/assets/images')) {
              const defaultMatch = INITIAL_MAGAZINE_DATA.stories[idx]?.image || INITIAL_MAGAZINE_DATA.stories[0].image;
              return { ...s, image: defaultMatch };
            }
            return s;
          });
        }
        return {
          ...INITIAL_MAGAZINE_DATA,
          ...parsed,
          flipbook: {
            ...INITIAL_MAGAZINE_DATA.flipbook,
            ...(parsed.flipbook || {}),
          },
          issue02: {
            ...INITIAL_MAGAZINE_DATA.issue02,
            ...(parsed.issue02 || {}),
            targetWord: parsed.issue02?.targetWord || INITIAL_MAGAZINE_DATA.issue02.targetWord,
            clue: parsed.issue02?.clue || INITIAL_MAGAZINE_DATA.issue02.clue,
            revealedIndices: parsed.issue02?.revealedIndices || INITIAL_MAGAZINE_DATA.issue02.revealedIndices,
            successMessage: parsed.issue02?.successMessage || INITIAL_MAGAZINE_DATA.issue02.successMessage,
          },
        };
      }
    } catch (e) {
      console.error('Failed to load saved magazine data:', e);
    }
    return INITIAL_MAGAZINE_DATA;
  });

  // Edit mode permanently disabled - live site in visitor/reader presentation mode
  const editMode = false;
  const setEditMode = () => {};
  const toggleEditMode = () => {};
  const [hasCustomEdits, setHasCustomEdits] = useState<boolean>(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Auto-save on data change
  useEffect(() => {
    safeSaveToLocalStorage(STORAGE_KEY, data);
    setHasCustomEdits(JSON.stringify(data) !== JSON.stringify(INITIAL_MAGAZINE_DATA));
  }, [data]);

  const updateData = <K extends keyof MagazineData>(section: K, update: Partial<MagazineData[K]>) => {
    setData((prev) => {
      const currentSection = prev[section];
      if (typeof currentSection === 'object' && !Array.isArray(currentSection) && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            ...update,
          },
        };
      }
      return {
        ...prev,
        [section]: update as MagazineData[K],
      };
    });
  };

  const updateStory = (id: string, updatedFields: Partial<MagazineData['stories'][0]>) => {
    setData((prev) => ({
      ...prev,
      stories: prev.stories.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)),
    }));
  };

  const addStory = () => {
    const newStory = {
      id: Date.now().toString(),
      title: "New Perspective",
      teaser: "A novel visual discovery awaiting commentary.",
      photographer: "Dev Pedhadia",
      tag: "Exploration",
      exif: "50mm · ƒ/2.0 · 1/250s · ISO 200",
      image: INITIAL_MAGAZINE_DATA.hero.coverImage,
      storyBody: "Describe the atmosphere, lighting, and story behind this photograph here.",
    };
    setData((prev) => ({
      ...prev,
      stories: [...prev.stories, newStory],
    }));
  };

  const deleteStory = (id: string) => {
    setData((prev) => ({
      ...prev,
      stories: prev.stories.filter((item) => item.id !== id),
    }));
  };

  const resetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all content back to Issue 01 original editorial state? Any inline edits will be discarded.")) {
      setData(INITIAL_MAGAZINE_DATA);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `parallel_perspectives_issue01_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const openLightbox = (index: number) => setActiveLightboxIndex(index);
  const closeLightbox = () => setActiveLightboxIndex(null);

  return (
    <EditorContext.Provider
      value={{
        data,
        editMode,
        setEditMode,
        toggleEditMode,
        updateData,
        updateStory,
        addStory,
        deleteStory,
        resetToDefaults,
        exportJSON,
        hasCustomEdits,
        activeLightboxIndex,
        openLightbox,
        closeLightbox,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
