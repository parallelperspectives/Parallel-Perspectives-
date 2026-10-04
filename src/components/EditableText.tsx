import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '../context/EditorContext';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div' | 'blockquote';
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  label?: string;
  removable?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  as: Component = 'span',
  className = '',
  multiline = false,
  placeholder = 'Click to edit...',
  label,
  removable = true,
}) => {
  const { editMode } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentText(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // place cursor at end
      if ('setSelectionRange' in inputRef.current) {
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleFinish = () => {
    setIsEditing(false);
    const trimmed = currentText.trim();
    if (trimmed !== (value || '').trim()) {
      onSave(trimmed);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setCurrentText('');
    onSave('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCurrentText(value || '');
      setIsEditing(false);
    } else if (e.key === 'Enter') {
      if (!multiline || (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleFinish();
      }
    }
  };

  const isEmpty = !value || value.trim() === '';

  // In Preview Mode (editMode = false)
  if (!editMode) {
    if (isEmpty) {
      return null; // Completely remove from the layout when empty!
    }
    return <Component className={className}>{value}</Component>;
  }

  // In Edit Mode, but element is empty / deleted
  if (isEmpty && !isEditing) {
    return (
      <span
        onClick={handleStartEdit}
        className="inline-flex items-center gap-1 px-2 py-0.5 border border-dashed border-neutral-300 hover:border-black text-[11px] font-mono text-neutral-400 hover:text-black transition-colors cursor-pointer rounded-xs select-none my-0.5 group/add"
        title={`Click to add ${label || 'text'}`}
      >
        <Plus size={11} className="group-hover/add:scale-110 transition-transform" />
        <span>+ Add {label || 'Text'}</span>
      </span>
    );
  }

  // Active Editing State
  if (isEditing) {
    return (
      <span className="relative inline-block w-full my-0.5" onClick={(e) => e.stopPropagation()}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleFinish}
            onKeyDown={handleKeyDown}
            rows={Math.max(2, Math.min(8, currentText.split('\n').length + 1))}
            className={`w-full bg-white text-black p-2 border-2 border-black rounded-none shadow-sm focus:outline-none resize-y ${className}`}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleFinish}
            onKeyDown={handleKeyDown}
            className={`w-full bg-white text-black px-2 py-0.5 border-2 border-black rounded-none shadow-sm focus:outline-none ${className}`}
            placeholder={placeholder}
          />
        )}
        <span className="absolute right-1 -bottom-5 text-[9px] font-mono uppercase tracking-wider text-neutral-500 bg-white px-1.5 py-0.5 border border-neutral-200 z-10 select-none flex items-center gap-2 shadow-xs">
          <span>Enter save · Esc cancel</span>
          {removable && (
            <>
              <span className="text-neutral-300">·</span>
              <button
                type="button"
                onMouseDown={handleRemove}
                className="text-red-600 hover:underline cursor-pointer flex items-center gap-0.5 font-bold"
                title="Remove this element completely"
              >
                <Trash2 size={9} />
                <span>Remove</span>
              </button>
            </>
          )}
        </span>
      </span>
    );
  }

  // Default Edit Mode Display (with content)
  return (
    <Component
      onClick={handleStartEdit}
      className={`group/edit cursor-pointer transition-all duration-150 relative inline-block rounded-xs hover:bg-neutral-100/80 hover:outline hover:outline-dashed hover:outline-neutral-400 ${className}`}
      title={label ? `Click to edit ${label}` : 'Click to edit text'}
    >
      {value}
      <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity ml-1.5 inline-flex items-center gap-1 text-neutral-400 align-middle">
        <span className="hover:text-black">
          <Pencil size={11} className="inline stroke-[2]" />
        </span>
        {removable && (
          <span
            onClick={handleRemove}
            className="hover:text-red-600 p-0.5 cursor-pointer rounded"
            title={label ? `Remove ${label} completely` : "Remove element completely"}
          >
            <Trash2 size={11} className="inline stroke-[2]" />
          </span>
        )}
      </span>
    </Component>
  );
};
