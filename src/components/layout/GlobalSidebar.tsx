import React from 'react';
import {
  ChevronsLeft,
  ChevronsRight,
  Globe,
  LayoutGrid,
  UserCircle,
  X,
} from 'lucide-react';
import { GlobalArea } from '../../types/editor';

interface GlobalSidebarProps {
  activeArea: GlobalArea;
  onSelectArea: (area: GlobalArea) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: GlobalArea;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'websites', label: 'Websites', icon: Globe },
  { id: 'account', label: 'Account & Settings', icon: UserCircle },
];

export function GlobalSidebar({
  activeArea,
  onSelectArea,
  expanded,
  onToggleExpand,
  mobileOpen,
  onCloseMobile,
}: GlobalSidebarProps) {
  const renderNavList = (isExpanded: boolean) => (
    <nav aria-label="Global workspace navigation" className="flex-1 px-3 py-4 space-y-1.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = activeArea === item.id;
        return (
          <div key={item.id} className="relative group">
            <button
              type="button"
              onClick={() => {
                onSelectArea(item.id);
                onCloseMobile();
              }}
              aria-current={active ? 'page' : undefined}
              aria-label={!isExpanded ? item.label : undefined}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
                isExpanded ? 'justify-start' : 'justify-center'
              } ${
                active
                  ? 'bg-[#1E3A2F] text-white'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={1.8} />
              {isExpanded && (
                <span className="truncate whitespace-nowrap">{item.label}</span>
              )}
            </button>

            {/* Accessible tooltip when sidebar is collapsed */}
            {!isExpanded && (
              <div
                role="tooltip"
                className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 px-2.5 py-1.5 rounded-lg bg-[#111827] text-white text-xs font-medium whitespace-nowrap shadow-md"
              >
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Left Global Sidebar (72px collapsed -> 256px expanded) */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-white border-r border-[#E5E7EB] transition-[width] duration-200 ease-out z-30 ${
          expanded ? 'w-[256px]' : 'w-[72px]'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-14 flex items-center border-b border-[#E5E7EB] px-3 ${
            expanded ? 'justify-between' : 'justify-center'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelectArea('websites')}
            className="flex items-center gap-2.5 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] rounded-lg p-1"
            title="Habesha Sites"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] text-white flex items-center justify-center font-semibold text-sm shrink-0">
              H
            </div>
            {expanded && (
              <div className="text-left min-w-0">
                <span className="block text-sm font-semibold tracking-tight text-[#111827] whitespace-nowrap truncate">
                  Habesha Sites
                </span>
              </div>
            )}
          </button>
        </div>

        {renderNavList(expanded)}

        {/* Expand / Collapse Control */}
        <div className="p-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse global sidebar' : 'Expand global sidebar'}
            title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
              expanded ? 'justify-start' : 'justify-center'
            }`}
          >
            {expanded ? (
              <>
                <ChevronsLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Collapse Sidebar</span>
              </>
            ) : (
              <ChevronsRight className="w-4 h-4 shrink-0" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay for Global Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
          />
          <aside className="relative w-64 max-w-[80vw] bg-white h-full border-r border-[#E5E7EB] flex flex-col z-10 shadow-xl">
            <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] text-white flex items-center justify-center font-semibold text-sm">
                  H
                </div>
                <span className="text-sm font-semibold text-[#111827]">Habesha Sites</span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNavList(true)}
          </aside>
        </div>
      )}
    </>
  );
}
