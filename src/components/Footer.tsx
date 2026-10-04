import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';
import { Logo } from './Logo';
import { Instagram, Mail, ArrowUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NavLinkItem } from '../types';

export const Footer: React.FC = () => {
  const { data, updateData, editMode } = useEditor();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const defaultNavLinks: NavLinkItem[] = [
    { id: '1', label: 'Issue 01: Monsoon', target: 'hero' },
    { id: '2', label: "Founders' Note", target: 'founders-note' },
    { id: '3', label: 'Featured Stories', target: 'featured-stories' },
    { id: '4', label: 'Flipbook', target: 'flipbook' },
    { id: '5', label: 'Submissions', target: 'submissions' },
  ];

  const navLinks = data.siteInfo.navLinks || defaultNavLinks;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top: Newsletter & Quarterly Edition Dispatch */}
        {(data.footer.newsletterTitle || data.footer.newsletterDesc || editMode) && (
          <div className="border-b border-neutral-800 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 block">
                Dispatches from Dev & Khushal
              </span>
              {(data.footer.newsletterTitle || editMode) && (
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  <EditableText
                    value={data.footer.newsletterTitle}
                    onSave={(val) => updateData('footer', { newsletterTitle: val })}
                    label="Newsletter Heading"
                  />
                </h3>
              )}
              {(data.footer.newsletterDesc || editMode) && (
                <div className="text-neutral-400 text-xs sm:text-sm font-light max-w-lg">
                  <EditableText
                    value={data.footer.newsletterDesc}
                    onSave={(val) => updateData('footer', { newsletterDesc: val })}
                    multiline
                    label="Newsletter Description"
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="p-4 bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-300 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-white" />
                  <span>Perspective invitation dispatched. Welcome to the quarterly registry.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md lg:ml-auto">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-black text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Middle: Brand, Nav links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-xs">
          {/* Col 1: Brand & Manifesto (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="py-1">
              <Logo inverted size="md" placement="footer" />
            </div>

            {(data.footer.editorialManifesto || editMode) && (
              <div className="text-neutral-400 text-xs font-light leading-relaxed max-w-sm">
                <EditableText
                  value={data.footer.editorialManifesto}
                  onSave={(val) => updateData('footer', { editorialManifesto: val })}
                  className="text-neutral-400 hover:bg-neutral-800"
                  multiline
                  label="Editorial Manifesto"
                />
              </div>
            )}

            {(data.footer.address || editMode) && (
              <div className="pt-2 text-neutral-400 font-mono text-[11px] space-y-1">
                <EditableText
                  value={data.footer.address}
                  onSave={(val) => updateData('footer', { address: val })}
                  className="text-neutral-500 hover:bg-neutral-800"
                  label="Publisher Location"
                />
              </div>
            )}
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            {(data.footer.directoryHeading || editMode) && (
              <h4 className="font-mono uppercase tracking-widest text-[11px] text-neutral-400 font-bold">
                <EditableText
                  value={data.footer.directoryHeading || ''}
                  onSave={(val) => updateData('footer', { directoryHeading: val })}
                  label="Directory Heading"
                />
              </h4>
            )}
            <ul className="space-y-2.5 text-neutral-300 font-mono text-xs uppercase tracking-wider">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.target}`} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Connect & Social (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            {(data.footer.connectHeading || editMode) && (
              <h4 className="font-mono uppercase tracking-widest text-[11px] text-neutral-400 font-bold">
                <EditableText
                  value={data.footer.connectHeading || ''}
                  onSave={(val) => updateData('footer', { connectHeading: val })}
                  label="Connect Heading"
                />
              </h4>
            )}

            <div className="space-y-3 font-mono text-xs text-neutral-300">
              {(data.siteInfo.instagramHandle || editMode) && (
                <a
                  href={data.siteInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors py-1 group"
                >
                  <Instagram size={14} className="group-hover:scale-110 transition-transform" />
                  <span>{data.siteInfo.instagramHandle}</span>
                </a>
              )}

              {(data.siteInfo.email || editMode) && (
                <a
                  href={`mailto:${data.siteInfo.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors py-1 group"
                >
                  <Mail size={14} className="group-hover:scale-110 transition-transform" />
                  <EditableText
                    value={data.siteInfo.email}
                    onSave={(val) => updateData('siteInfo', { email: val })}
                    className="text-neutral-300 hover:text-white hover:bg-neutral-800"
                    label="Contact Email"
                  />
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUp size={13} />
                <EditableText
                  value={data.footer.returnToTopText || ''}
                  onSave={(val) => updateData('footer', { returnToTopText: val })}
                  label="Return to Top Text"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          {(data.footer.copyright || editMode) && (
            <div>
              <EditableText
                value={data.footer.copyright}
                onSave={(val) => updateData('footer', { copyright: val })}
                className="text-neutral-500 hover:bg-neutral-800"
                label="Copyright notice"
              />
            </div>
          )}
          {(data.footer.footerTagline || editMode) && (
            <div className="flex items-center gap-4">
              <EditableText
                value={data.footer.footerTagline || ''}
                onSave={(val) => updateData('footer', { footerTagline: val })}
                label="Footer Tagline"
              />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
