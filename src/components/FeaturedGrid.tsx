import React from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { Maximize2, Trash2, Aperture, Plus } from 'lucide-react';

export const FeaturedGrid: React.FC = () => {
  const { data, updateData, updateStory, deleteStory, addStory, editMode, openLightbox } = useEditor();

  return (
    <section id="featured-stories" className="py-20 md:py-28 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-neutral-200">
          <div className="space-y-3 max-w-2xl">
            {(data.featuredSection?.tag || editMode) && (
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500 block">
                <EditableText
                  value={data.featuredSection?.tag || ''}
                  onSave={(val) =>
                    updateData('featuredSection', {
                      ...data.featuredSection,
                      tag: val,
                    })
                  }
                  label="Portfolio Tag"
                />
              </span>
            )}

            {(data.featuredSection?.title || editMode) && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black">
                <EditableText
                  value={data.featuredSection?.title || ''}
                  onSave={(val) =>
                    updateData('featuredSection', {
                      ...data.featuredSection,
                      title: val,
                    })
                  }
                  label="Portfolio Title"
                />
              </h2>
            )}

            {(data.featuredSection?.description || editMode) && (
              <div className="text-sm sm:text-base text-neutral-600 font-light">
                <EditableText
                  value={data.featuredSection?.description || ''}
                  onSave={(val) =>
                    updateData('featuredSection', {
                      ...data.featuredSection,
                      description: val,
                    })
                  }
                  multiline
                  label="Portfolio Description"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {editMode && (
              <button
                onClick={addStory}
                className="px-4 py-2 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Story Card</span>
              </button>
            )}
            <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
              <span>{data.stories.length}</span>
              <EditableText
                value={data.featuredSection?.platesCountSuffix ?? 'Plates Selected'}
                onSave={(val) =>
                  updateData('featuredSection', {
                    ...data.featuredSection,
                    platesCountSuffix: val,
                  })
                }
                label="Count Label"
              />
            </span>
          </div>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {data.stories.map((story, index) => {
            // Asymmetric sizing: cards 0 and 3 are slightly larger or span wider when possible
            const isWide = index === 0 || index === 4;
            const currentPlateLabel = story.plateLabel !== undefined ? story.plateLabel : `PLATE ${String(index + 1).padStart(2, '0')}`;
            const hasPlateLabel = Boolean(currentPlateLabel && currentPlateLabel.trim());

            return (
              <article
                key={story.id}
                className={`bg-white border border-neutral-200 p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300 hover:shadow-xl ${
                  isWide ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                <div>
                  {/* Card Header Metadata (Zero-Pill Discipline) */}
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      {(hasPlateLabel || editMode) && (
                        <span className="font-bold text-black">
                          <EditableText
                            value={currentPlateLabel}
                            onSave={(val) => updateStory(story.id, { plateLabel: val })}
                            label="Plate Word & Number"
                          />
                        </span>
                      )}
                      {(story.tag || editMode) && (
                        <>
                          {hasPlateLabel && story.tag && <span>·</span>}
                          <EditableText
                            value={story.tag}
                            onSave={(val) => updateStory(story.id, { tag: val })}
                            label="Category / Tag"
                          />
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {editMode && (
                        <button
                          onClick={() => deleteStory(story.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Delete this story card completely"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      {!editMode && (
                        <button
                          onClick={() => openLightbox(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-black hover:text-neutral-600 flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                        >
                          <Maximize2 size={12} />
                          <span>Inspect</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Image Container with Lightbox click */}
                  <div className="my-4 aspect-[4/3] bg-neutral-900 overflow-hidden relative">
                    <EditableImage
                      src={story.image}
                      alt={story.title}
                      onSave={(url) => updateStory(story.id, { image: url })}
                      onClickPreview={() => openLightbox(index)}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Title & Teaser */}
                  <div className="space-y-2 mt-4">
                    {(story.title || editMode) && (
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black group-hover:text-neutral-800">
                        <EditableText
                          value={story.title}
                          onSave={(val) => updateStory(story.id, { title: val })}
                          label="Story Title"
                        />
                      </h3>
                    )}

                    {(story.teaser || editMode) && (
                      <div className="text-sm text-neutral-600 font-light leading-relaxed">
                        <EditableText
                          value={story.teaser}
                          onSave={(val) => updateStory(story.id, { teaser: val })}
                          multiline
                          label="Story Teaser"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Metadata */}
                {(story.photographer || story.exif || editMode) && (
                  <div className="pt-4 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    {(story.photographer || editMode) && (
                      <div className="flex items-center gap-1.5">
                        {story.photographer && (
                          <span className="text-neutral-400 text-[10px] uppercase">Lens:</span>
                        )}
                        <span className="font-medium text-black">
                          <EditableText
                            value={story.photographer}
                            onSave={(val) => updateStory(story.id, { photographer: val })}
                            label="Photographer Name"
                          />
                        </span>
                      </div>
                    )}

                    {(story.exif || editMode) && (
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 ml-auto">
                        {story.exif && <Aperture size={11} className="text-neutral-400" />}
                        <EditableText
                          value={story.exif}
                          onSave={(val) => updateStory(story.id, { exif: val })}
                          label="EXIF Camera Info"
                        />
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
