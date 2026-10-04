import React from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';

export const FoundersStory: React.FC = () => {
  const { data, updateData, editMode } = useEditor();
  const story = data.foundersStory;

  const hasP1 = Boolean(story.p1 && story.p1.trim());
  const hasP2 = Boolean(story.p2 && story.p2.trim());
  const hasP3 = Boolean(story.p3 && story.p3.trim());
  const hasSignoff = Boolean(story.noteSignoff && story.noteSignoff.trim());
  const hasFounder1 = Boolean(story.founder1Name && story.founder1Name.trim());
  const hasFounder2 = Boolean(story.founder2Name && story.founder2Name.trim());

  return (
    <section id="founders-note" className="py-20 md:py-28 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          {(story.tag || editMode) && (
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-neutral-500">
              {story.tag && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
              <EditableText
                value={story.tag}
                onSave={(val) => updateData('foundersStory', { tag: val })}
                label="Founders Tag"
              />
            </div>
          )}

          {(story.title || editMode) && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black text-balance">
              <EditableText
                value={story.title}
                onSave={(val) => updateData('foundersStory', { title: val })}
                label="Founders Title"
              />
            </h2>
          )}

          {(story.subtitle || editMode) && (
            <div className="text-base sm:text-lg text-neutral-600 font-light max-w-2xl">
              <EditableText
                value={story.subtitle}
                onSave={(val) => updateData('foundersStory', { subtitle: val })}
                label="Founders Subtitle"
              />
            </div>
          )}
        </div>

        {/* Narrative & Philosophy Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Story Prose (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-neutral-800 leading-relaxed text-base sm:text-lg font-light">
            {(hasP1 || editMode) && (
              <div className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-black first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                <EditableText
                  value={story.p1}
                  onSave={(val) => updateData('foundersStory', { p1: val })}
                  multiline
                  label="Story Paragraph 1"
                />
              </div>
            )}

            {(hasP2 || editMode) && (
              <div>
                <EditableText
                  value={story.p2}
                  onSave={(val) => updateData('foundersStory', { p2: val })}
                  multiline
                  label="Story Paragraph 2"
                />
              </div>
            )}

            {(hasP3 || editMode) && (
              <div>
                <EditableText
                  value={story.p3}
                  onSave={(val) => updateData('foundersStory', { p3: val })}
                  multiline
                  label="Story Paragraph 3"
                />
              </div>
            )}

            {/* Note Signoff */}
            {(hasSignoff || editMode) && (
              <div className="pt-6 border-t border-neutral-200">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 italic">
                  <EditableText
                    value={story.noteSignoff}
                    onSave={(val) => updateData('foundersStory', { noteSignoff: val })}
                    label="Signoff Line"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Founders Profile & Dual Perspectives Showcase (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-50 border border-neutral-200 p-6 sm:p-8 space-y-8">
              {(story.curatorsSectionTag || story.curatorsSectionTitle || editMode) && (
                <div className="border-b border-neutral-200 pb-4">
                  {(story.curatorsSectionTag || editMode) && (
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500 block mb-1">
                      <EditableText
                        value={story.curatorsSectionTag || ''}
                        onSave={(val) => updateData('foundersStory', { curatorsSectionTag: val })}
                        label="Curators Tag"
                      />
                    </span>
                  )}
                  {(story.curatorsSectionTitle || editMode) && (
                    <h3 className="text-xl font-bold uppercase tracking-tight text-black">
                      <EditableText
                        value={story.curatorsSectionTitle || ''}
                        onSave={(val) => updateData('foundersStory', { curatorsSectionTitle: val })}
                        label="Curators Title"
                      />
                    </h3>
                  )}
                </div>
              )}

              {/* Founder 1 */}
              {(hasFounder1 || editMode) && (
                <div className="space-y-2 border-l-2 border-black pl-4">
                  <div className="text-base font-bold text-black tracking-tight flex items-center justify-between">
                    <EditableText
                      value={story.founder1Name}
                      onSave={(val) => updateData('foundersStory', { founder1Name: val })}
                      label="Founder 1 Name"
                    />
                    {(story.founder1Tag || editMode) && (
                      <span className="text-[10px] font-mono uppercase text-neutral-400">
                        <EditableText
                          value={story.founder1Tag || ''}
                          onSave={(val) => updateData('foundersStory', { founder1Tag: val })}
                          label="Founder 1 Tag"
                        />
                      </span>
                    )}
                  </div>

                  {(story.founder1Role || editMode) && (
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-600">
                      <EditableText
                        value={story.founder1Role}
                        onSave={(val) => updateData('foundersStory', { founder1Role: val })}
                        label="Founder 1 Role"
                      />
                    </div>
                  )}

                  {(story.founder1Bio || editMode) && (
                    <div className="text-xs text-neutral-500 leading-normal pt-1">
                      <EditableText
                        value={story.founder1Bio || ''}
                        onSave={(val) => updateData('foundersStory', { founder1Bio: val })}
                        multiline
                        label="Founder 1 Bio"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Founder 2 */}
              {(hasFounder2 || editMode) && (
                <div className="space-y-2 border-l-2 border-black pl-4">
                  <div className="text-base font-bold text-black tracking-tight flex items-center justify-between">
                    <EditableText
                      value={story.founder2Name}
                      onSave={(val) => updateData('foundersStory', { founder2Name: val })}
                      label="Founder 2 Name"
                    />
                    {(story.founder2Tag || editMode) && (
                      <span className="text-[10px] font-mono uppercase text-neutral-400">
                        <EditableText
                          value={story.founder2Tag || ''}
                          onSave={(val) => updateData('foundersStory', { founder2Tag: val })}
                          label="Founder 2 Tag"
                        />
                      </span>
                    )}
                  </div>

                  {(story.founder2Role || editMode) && (
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-600">
                      <EditableText
                        value={story.founder2Role}
                        onSave={(val) => updateData('foundersStory', { founder2Role: val })}
                        label="Founder 2 Role"
                      />
                    </div>
                  )}

                  {(story.founder2Bio || editMode) && (
                    <div className="text-xs text-neutral-500 leading-normal pt-1">
                      <EditableText
                        value={story.founder2Bio || ''}
                        onSave={(val) => updateData('foundersStory', { founder2Bio: val })}
                        multiline
                        label="Founder 2 Bio"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Editorial Pillar Summary */}
              {(story.foundedLabel || story.foundedValue || story.mediumLabel || story.mediumValue || editMode) && (
                <div className="pt-4 border-t border-neutral-200 grid grid-cols-2 gap-4 text-xs font-mono">
                  {(story.foundedLabel || story.foundedValue || editMode) && (
                    <div>
                      {(story.foundedLabel || editMode) && (
                        <span className="text-neutral-400 block text-[10px] uppercase">
                          <EditableText
                            value={story.foundedLabel || ''}
                            onSave={(val) => updateData('foundersStory', { foundedLabel: val })}
                            label="Founded Label"
                          />
                        </span>
                      )}
                      {(story.foundedValue || editMode) && (
                        <span className="font-bold text-black">
                          <EditableText
                            value={story.foundedValue || ''}
                            onSave={(val) => updateData('foundersStory', { foundedValue: val })}
                            label="Founded Value"
                          />
                        </span>
                      )}
                    </div>
                  )}

                  {(story.mediumLabel || story.mediumValue || editMode) && (
                    <div>
                      {(story.mediumLabel || editMode) && (
                        <span className="text-neutral-400 block text-[10px] uppercase">
                          <EditableText
                            value={story.mediumLabel || ''}
                            onSave={(val) => updateData('foundersStory', { mediumLabel: val })}
                            label="Medium Label"
                          />
                        </span>
                      )}
                      {(story.mediumValue || editMode) && (
                        <span className="font-bold text-black">
                          <EditableText
                            value={story.mediumValue || ''}
                            onSave={(val) => updateData('foundersStory', { mediumValue: val })}
                            label="Medium Value"
                          />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
