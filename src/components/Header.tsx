import React, { useState } from 'react';
import { Logo } from './Logo';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';
import { Instagram, ArrowUpRight, Menu, X, BookOpen, Plus, Trash2 } from 'lucide-react';
import { NavLinkItem } from '../types';

export const Header: React.FC = () => {
  const { data, updateData, editMode } = useEditor();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultNavLinks: NavLinkItem[] = [
    { id: '1', label: 'Issue 01: Monsoon', target: 'hero' },
    { id: '2', label: "Founders' Note", target: 'founders-note' },
    { id: '3', label: 'Featured Stories', target: 'featured-stories' },
    { id: '4', label: 'Flipbook', target: 'flipbook' },
    { id: '5', label: 'Submissions', target: 'submissions' },
  ];

  const navLinks = data.siteInfo.navLinks || defaultNavLinks;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateNavLink = (id: string, newLabel: string) => {
    if (!newLabel.trim()) {
      // Remove link if emptied
      const filtered = navLinks.filter((item) => item.id !== id);
      updateData('siteInfo', { ...data.siteInfo, navLinks: filtered });
    } else {
      const updated = navLinks.map((item) => (item.id === id ? { ...item, label: newLabel } : item));
      updateData('siteInfo', { ...data.siteInfo, navLinks: updated });
    }
  };

  const addNavLink = () => {
    const newId = String(Date.now());
    const newLink: NavLinkItem = {
      id: newId,
      label: 'New Link',
      target: 'featured-stories',
    };
    updateData('siteInfo', { ...data.siteInfo, navLinks: [...navLinks, newLink] });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Logo & Brand Lockup */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="flex items-center group py-2 focus:outline-none"
            aria-label="Parallel Perspectives Home"
          >
            <Logo size="sm" placement="header" className="transition-opacity group-hover:opacity-80" />
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-[0.16em] font-medium text-neutral-600">
          {navLinks.map((link) => (
            <div key={link.id} className="relative group/nav flex items-center">
              <button
                onClick={() => scrollToSection(link.target)}
                className="hover:text-black transition-colors py-1 cursor-pointer"
              >
                <EditableText
                  value={link.label}
                  onSave={(val) => updateNavLink(link.id, val)}
                  label="Navigation Link"
                />
              </button>
            </div>
          ))}

          {editMode && (
            <button
              onClick={addNavLink}
              className="p-1 text-neutral-400 hover:text-black border border-dashed border-neutral-300 hover:border-black rounded-xs text-[10px] font-mono flex items-center gap-1 cursor-pointer"
              title="Add a new navigation link"
            >
              <Plus size={10} />
              <span>+ Link</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Instagram badge & Read Issue 01 action */}
        <div className="hidden sm:flex items-center gap-4">
          {(data.siteInfo.instagramHandle || editMode) && (
            <a
              href={data.siteInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black transition-colors font-mono tracking-tight"
              title="Follow on Instagram"
            >
              <Instagram size={14} className="stroke-[1.8]" />
              <EditableText
                value={data.siteInfo.instagramHandle}
                onSave={(val) => updateData('siteInfo', { instagramHandle: val })}
                className="text-xs"
                label="Instagram Handle"
              />
              <ArrowUpRight size={12} className="opacity-40" />
            </a>
          )}

          {(data.siteInfo.headerCtaText || editMode) && (
            <button
              onClick={() => scrollToSection('flipbook')}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-black hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <BookOpen size={13} />
              <EditableText
                value={data.siteInfo.headerCtaText || ''}
                onSave={(val) => updateData('siteInfo', { headerCtaText: val })}
                label="Header Action Button"
                className="text-white hover:text-white"
              />
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-800 hover:text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-neutral-200 bg-white px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-3 text-xs uppercase tracking-widest font-medium text-neutral-700">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.target)}
                className="text-left py-2 hover:text-black border-b border-neutral-100"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-200 flex flex-col gap-3">
            {(data.siteInfo.instagramHandle || editMode) && (
              <a
                href={data.siteInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs text-neutral-600 hover:text-black font-mono py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Instagram size={14} />
                  {data.siteInfo.instagramHandle}
                </span>
                <ArrowUpRight size={13} />
              </a>
            )}

            {(data.siteInfo.headerCtaText || editMode) && (
              <button
                onClick={() => scrollToSection('flipbook')}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-black hover:bg-neutral-800 transition-colors text-center"
              >
                {data.siteInfo.headerCtaText}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
