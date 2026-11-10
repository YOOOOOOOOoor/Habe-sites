import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Palette,
  Settings,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { EditorSection } from '../../types/editor';

interface EditorNavRailProps {
  websiteName: string;
  activeSection: EditorSection;
  onSelectSection: (section: EditorSection) => void;
  variant?: 'rail' | 'drawer';
  onCloseDrawer?: () => void;
}

const HOME_SECTIONS: Array<{ id: EditorSection; label: string }> = [
  { id: 'home-hero', label: 'Hero' },
  { id: 'home-featured', label: 'Featured Menu Items' },
  { id: 'home-about', label: 'About' },
  { id: 'home-gallery', label: 'Gallery' },
  { id: 'home-contact', label: 'Contact' },
];

export function EditorNavRail({
  websiteName,
  activeSection,
  onSelectSection,
  variant = 'rail',
  onCloseDrawer,
}: EditorNavRailProps) {
  const [homeExpanded, setHomeExpanded] = useState(true);

  const isHomeActive = activeSection === 'home' || activeSection.startsWith('home-');

  const choose = (sec: EditorSection) => {
    onSelectSection(sec);
    if (onCloseDrawer) onCloseDrawer();
  };

  return (
    <div
      className={`flex flex-col h-full bg-[#FCFCFD] ${
        variant === 'rail' ? 'w-[228px] shrink-0 border-r border-[#E5E7EB]' : 'w-full'
      }`}
    >
      <div className="px-4 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#6B7280]">Website Structure</p>
          <p className="text-sm font-semibold text-[#111827] truncate mt-0.5">
            {websiteName || 'My Café Website'}
          </p>
        </div>
        {variant === 'drawer' && onCloseDrawer && (
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Close website structure drawer"
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav aria-label="Website pages and sections" className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Group 1: Pages */}
        <div className="space-y-1">
          <p className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-wide text-[#6B7280]">
            Pages
          </p>

          {/* Home Expandable Item */}
          <div>
            <div
              className={`flex items-center justify-between rounded-lg transition-colors ${
                activeSection === 'home'
                  ? 'bg-[#1E3A2F]/10 text-[#1E3A2F]'
                  : isHomeActive
                  ? 'text-[#111827]'
                  : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setHomeExpanded(true);
                  choose('home');
                }}
                className="flex-1 flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] rounded-lg"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">Home</span>
              </button>
              <button
                type="button"
                onClick={() => setHomeExpanded((prev) => !prev)}
                aria-expanded={homeExpanded}
                aria-label={homeExpanded ? 'Collapse Home sections' : 'Expand Home sections'}
                className="p-1.5 mr-1 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
              >
                {homeExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {homeExpanded && (
              <div className="mt-1 ml-4 pl-3 border-l border-[#E5E7EB] space-y-0.5">
                {HOME_SECTIONS.map((sub) => {
                  const subActive = activeSection === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => choose(sub.id)}
                      aria-current={subActive ? 'location' : undefined}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[13px] transition-colors truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
                        subActive
                          ? 'bg-[#1E3A2F] text-white font-medium'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Menu Dedicated Page */}
          <button
            type="button"
            onClick={() => choose('menu')}
            aria-current={activeSection === 'menu' ? 'page' : undefined}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
              activeSection === 'menu'
                ? 'bg-[#1E3A2F] text-white'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 shrink-0" />
            <span className="truncate">Menu</span>
          </button>
        </div>

        {/* Group 2: Appearance & Setup */}
        <div className="space-y-1">
          <p className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-wide text-[#6B7280]">
            Appearance & Setup
          </p>

          <button
            type="button"
            onClick={() => choose('design')}
            aria-current={activeSection === 'design' ? 'page' : undefined}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
              activeSection === 'design'
                ? 'bg-[#1E3A2F] text-white'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span className="truncate">Design</span>
          </button>

          <button
            type="button"
            onClick={() => choose('settings')}
            aria-current={activeSection === 'settings' ? 'page' : undefined}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
              activeSection === 'settings'
                ? 'bg-[#1E3A2F] text-white'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="truncate">Settings</span>
          </button>

          <button
            type="button"
            onClick={() => choose('media')}
            aria-current={activeSection === 'media' ? 'page' : undefined}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
              activeSection === 'media'
                ? 'bg-[#1E3A2F] text-white'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">Image Library</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
