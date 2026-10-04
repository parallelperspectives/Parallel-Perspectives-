import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';
import {
  Send,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Settings2,
  KeyRound,
  Check,
  AlertCircle,
} from 'lucide-react';

export const Issue02Teaser: React.FC = () => {
  const { data, updateData, editMode } = useEditor();

  const targetWord = (data.issue02.targetWord || 'SHADOWS').toUpperCase().replace(/[^A-Z]/g, '');
  const letters = targetWord.split('');
  const revealedIndices = data.issue02.revealedIndices || [0, Math.floor(letters.length / 2)];

  // User input letters state
  const [userLetters, setUserLetters] = useState<string[]>(() => {
    return letters.map((char, idx) => (revealedIndices.includes(idx) ? char : ''));
  });

  const [solved, setSolved] = useState<boolean>(false);
  const [attemptedWrong, setAttemptedWrong] = useState<boolean>(false);
  const [showClue, setShowClue] = useState<boolean>(true);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Edit Mode state for configuring target word
  const [newTargetWordInput, setNewTargetWordInput] = useState<string>(targetWord);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset inputs when target word or revealed indices change
  useEffect(() => {
    setUserLetters(letters.map((char, idx) => (revealedIndices.includes(idx) ? char : '')));
    setSolved(false);
    setAttemptedWrong(false);
    setNewTargetWordInput(targetWord);
  }, [targetWord, JSON.stringify(revealedIndices)]);

  // Check if fully solved
  const checkSolution = (currentInputs: string[]) => {
    const guess = currentInputs.join('').toUpperCase();
    if (guess === targetWord && targetWord.length > 0) {
      setSolved(true);
      setAttemptedWrong(false);
    } else {
      const allFilled = currentInputs.every((char) => char.trim().length === 1);
      if (allFilled) {
        setAttemptedWrong(true);
      } else {
        setAttemptedWrong(false);
      }
    }
  };

  const handleLetterChange = (index: number, val: string) => {
    if (revealedIndices.includes(index) || solved) return;

    const char = val.slice(-1).toUpperCase();
    const updated = [...userLetters];
    updated[index] = /^[A-Z]$/.test(char) ? char : '';
    setUserLetters(updated);
    checkSolution(updated);

    // Auto-advance to the next unfilled blank
    if (char) {
      for (let next = index + 1; next < letters.length; next++) {
        if (!revealedIndices.includes(next)) {
          inputRefs.current[next]?.focus();
          break;
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !userLetters[index]) {
      // Move to previous blank input
      for (let prev = index - 1; prev >= 0; prev--) {
        if (!revealedIndices.includes(prev)) {
          inputRefs.current[prev]?.focus();
          break;
        }
      }
    }
  };

  const handleReset = () => {
    setUserLetters(letters.map((char, idx) => (revealedIndices.includes(idx) ? char : '')));
    setSolved(false);
    setAttemptedWrong(false);
    // Focus first blank
    const firstBlank = letters.findIndex((_, idx) => !revealedIndices.includes(idx));
    if (firstBlank !== -1) {
      inputRefs.current[firstBlank]?.focus();
    }
  };

  // Admin: Save new target word
  const handleSaveTargetWord = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTargetWordInput.toUpperCase().replace(/[^A-Z]/g, '').trim();
    if (!clean) return;

    // Pick reasonable default hint indices: first and middle
    const newRevealed = clean.length > 3 ? [0, Math.floor(clean.length / 2)] : [0];
    updateData('issue02', {
      ...data.issue02,
      targetWord: clean,
      revealedIndices: newRevealed,
      successMessage: `Brilliant perspective! You uncovered the theme for Issue 02: ${clean}.`,
    });
    setShowConfig(false);
  };

  // Admin: Toggle hint letter at index
  const toggleHintIndex = (idx: number) => {
    const exists = revealedIndices.includes(idx);
    let updated: number[];
    if (exists) {
      // Keep at least one letter or allow all blanks
      updated = revealedIndices.filter((i) => i !== idx);
    } else {
      updated = [...revealedIndices, idx].sort((a, b) => a - b);
    }
    updateData('issue02', {
      ...data.issue02,
      revealedIndices: updated,
    });
  };

  // Submissions form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolio: '',
    pitch: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="submissions" className="py-20 md:py-28 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top: Issue 02 Teaser Card */}
        <div className="bg-neutral-50 border border-neutral-200 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            {(data.issue02.badge || editMode) && (
              <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-neutral-500">
                {data.issue02.badge && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                <EditableText
                  value={data.issue02.badge}
                  onSave={(val) => updateData('issue02', { badge: val })}
                  label="Issue 02 Badge"
                />
              </div>
            )}

            {(data.issue02.title || editMode) && (
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
                <EditableText
                  value={data.issue02.title}
                  onSave={(val) => updateData('issue02', { title: val })}
                  label="Issue 02 Title"
                />
              </h2>
            )}

            {(data.issue02.description || editMode) && (
              <div className="text-neutral-600 text-sm sm:text-base font-light leading-relaxed">
                <EditableText
                  value={data.issue02.description}
                  onSave={(val) => updateData('issue02', { description: val })}
                  multiline
                  label="Issue 02 Description"
                />
              </div>
            )}

            {/* Complete the Word with Blanks Interactive Game */}
            <div className="pt-6 border-t border-neutral-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <KeyRound size={15} className="text-neutral-600" />
                  <span className="text-xs font-mono uppercase tracking-widest text-black font-bold">
                    <EditableText
                      value={data.issue02.pollPrompt || 'Complete the Word — Fill in the Blanks:'}
                      onSave={(val) => updateData('issue02', { pollPrompt: val })}
                      label="Prompt Heading"
                    />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => setShowConfig(!showConfig)}
                      className="px-2.5 py-1 text-[11px] font-mono uppercase border border-neutral-300 hover:border-black flex items-center gap-1.5 bg-white cursor-pointer"
                    >
                      <Settings2 size={12} />
                      <span>{showConfig ? 'Close Word Settings' : 'Edit Theme Word'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-mono text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer transition-colors py-1"
                    title="Reset entered letters"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Admin configuration drawer in Edit Mode */}
              {editMode && showConfig && (
                <div className="p-4 bg-white border-2 border-black space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="text-xs font-mono uppercase font-bold text-black">
                      Theme Word Configuration (Single Word)
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      Currently: {targetWord} ({targetWord.length} letters)
                    </span>
                  </div>

                  <form onSubmit={handleSaveTargetWord} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newTargetWordInput}
                      onChange={(e) => setNewTargetWordInput(e.target.value.toUpperCase())}
                      placeholder="e.g. SHADOWS, SOLITUDE, HORIZON..."
                      maxLength={16}
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase tracking-widest border border-neutral-300 focus:outline-none focus:border-black"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-neutral-800 cursor-pointer shrink-0"
                    >
                      Set Word
                    </button>
                  </form>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-mono text-neutral-600 block">
                      Click letters below to toggle which characters are revealed as hints:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {letters.map((char, idx) => {
                        const isHint = revealedIndices.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleHintIndex(idx)}
                            className={`w-8 h-8 font-mono text-xs font-bold border transition-colors cursor-pointer ${
                              isHint
                                ? 'bg-black text-white border-black'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-300 hover:border-black'
                            }`}
                            title={`Toggle Hint for letter ${char} at position ${idx + 1}`}
                          >
                            {char}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Letter Tiles Container */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2">
                  {letters.map((char, idx) => {
                    const isHint = revealedIndices.includes(idx);
                    const currentVal = userLetters[idx] || '';

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-11 h-13 sm:w-14 sm:h-16 border-2 flex items-center justify-center font-mono text-xl sm:text-2xl font-extrabold transition-all select-none ${
                            solved
                              ? 'border-black bg-black text-white'
                              : isHint
                              ? 'border-neutral-300 bg-neutral-100 text-neutral-800'
                              : attemptedWrong
                              ? 'border-red-500 bg-red-50 text-red-700 animate-shake'
                              : currentVal
                              ? 'border-black bg-white text-black shadow-xs'
                              : 'border-neutral-300 bg-white text-black hover:border-neutral-500'
                          }`}
                        >
                          {isHint || solved ? (
                            <span>{isHint ? char : currentVal || char}</span>
                          ) : (
                            <input
                              ref={(el) => {
                                inputRefs.current[idx] = el;
                              }}
                              type="text"
                              maxLength={1}
                              value={currentVal}
                              onChange={(e) => handleLetterChange(idx, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(idx, e)}
                              className="w-full h-full text-center bg-transparent focus:outline-none uppercase font-mono font-extrabold"
                              placeholder="_"
                            />
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-neutral-400">
                          {isHint ? 'HINT' : `_${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Editorial Clue */}
                {(data.issue02.clue || editMode) && (
                  <div className="p-3.5 bg-neutral-100 border-l-2 border-black flex items-start justify-between gap-3 text-xs font-mono text-neutral-700">
                    <div className="flex items-start gap-2">
                      <HelpCircle size={15} className="text-neutral-500 shrink-0 mt-0.5" />
                      <EditableText
                        value={data.issue02.clue || ''}
                        onSave={(val) => updateData('issue02', { clue: val })}
                        label="Puzzle Clue"
                      />
                    </div>
                  </div>
                )}

                {/* Solved celebration state */}
                {solved && (
                  <div className="p-4 bg-black text-white text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-300 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={16} className="text-amber-400 shrink-0" />
                      <div className="font-bold">
                        <EditableText
                          value={
                            data.issue02.successMessage ||
                            `Brilliant perspective! You uncovered the theme for Issue 02: ${targetWord}.`
                          }
                          onSave={(val) => updateData('issue02', { successMessage: val })}
                          label="Success Message"
                          className="text-white hover:text-white"
                        />
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-white/10 uppercase tracking-widest text-[10px]">
                      Verified
                    </span>
                  </div>
                )}

                {attemptedWrong && !solved && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-600 shrink-0" />
                      <span>Not quite — that word does not match the upcoming theme. Try another letter combination!</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="underline font-bold hover:text-black cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Submit Your Perspective Section */}
        <div id="submissions" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-8">
          {/* Submission Guidelines (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              {(data.submission.tag || editMode) && (
                <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500 block">
                  <EditableText
                    value={data.submission.tag}
                    onSave={(val) => updateData('submission', { tag: val })}
                    label="Submission Tag"
                  />
                </span>
              )}

              {(data.submission.title || editMode) && (
                <h3 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
                  <EditableText
                    value={data.submission.title}
                    onSave={(val) => updateData('submission', { title: val })}
                    label="Submission Title"
                  />
                </h3>
              )}

              {(data.submission.subtitle || editMode) && (
                <div className="text-neutral-600 text-sm sm:text-base font-light leading-relaxed">
                  <EditableText
                    value={data.submission.subtitle}
                    onSave={(val) => updateData('submission', { subtitle: val })}
                    multiline
                    label="Submission Subtitle"
                  />
                </div>
              )}
            </div>

            {(data.submission.guidelines || editMode) && (
              <div className="p-6 bg-neutral-50 border-l-2 border-black space-y-3">
                {(data.submission.guidelinesTitle || editMode) && (
                  <h4 className="text-xs font-mono uppercase tracking-widest text-black font-bold">
                    <EditableText
                      value={data.submission.guidelinesTitle || ''}
                      onSave={(val) => updateData('submission', { guidelinesTitle: val })}
                      label="Guidelines Heading"
                    />
                  </h4>
                )}
                <div className="text-xs text-neutral-600 font-light leading-relaxed">
                  <EditableText
                    value={data.submission.guidelines}
                    onSave={(val) => updateData('submission', { guidelines: val })}
                    multiline
                    label="Submission Guidelines"
                  />
                </div>
              </div>
            )}

            <div className="text-xs font-mono text-neutral-500 space-y-1">
              {(data.submission.directInquiryPrefix || data.siteInfo.email || editMode) && (
                <p>
                  <EditableText
                    value={data.submission.directInquiryPrefix || ''}
                    onSave={(val) => updateData('submission', { directInquiryPrefix: val })}
                    label="Inquiries Label"
                  />{' '}
                  <span className="text-black">{data.siteInfo.email}</span>
                </p>
              )}
              {(data.submission.instagramPrefix || data.siteInfo.instagramHandle || editMode) && (
                <p>
                  <EditableText
                    value={data.submission.instagramPrefix || ''}
                    onSave={(val) => updateData('submission', { instagramPrefix: val })}
                    label="Instagram Label"
                  />{' '}
                  <span className="text-black">{data.siteInfo.instagramHandle}</span>
                </p>
              )}
            </div>
          </div>

          {/* Form Fields (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 p-8 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-xl font-bold uppercase tracking-tight text-black">
                  Perspective Dispatched
                </h4>
                <p className="text-xs font-mono text-neutral-600 max-w-sm mx-auto">
                  Thank you for submitting your work. Dev & Khushal review each portfolio personally. You will hear back before Issue 02 curation closes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', portfolio: '', pitch: '' });
                  }}
                  className="mt-4 px-4 py-2 border border-neutral-300 text-xs font-mono uppercase tracking-wider hover:border-black transition-colors cursor-pointer"
                >
                  Submit Another Series
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                      Photographer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maya Lin"
                      className="w-full px-3 py-2.5 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-3 py-2.5 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                    Portfolio / Series Link (Google Drive, WeTransfer, Behance, Website) *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2.5 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                    Artist Statement / Series Concept (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.pitch}
                    onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                    placeholder="Describe the intention behind your series, technical approach, or camera equipment used..."
                    className="w-full px-3 py-2.5 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Submitting Portfolio...</span>
                    ) : (
                      <>
                        <span>Submit for Curation Review</span>
                        <Send size={13} />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] font-mono text-neutral-400 text-center mt-3">
                    By submitting, you confirm you hold full copyright to all visual works.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
