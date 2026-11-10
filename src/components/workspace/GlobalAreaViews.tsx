import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Globe,
  Palette,
  RotateCcw,
  UtensilsCrossed,
} from 'lucide-react';
import { CafeWebsiteData, EditorSection, MediaAsset } from '../../types/editor';
import { formatRelativeDate, resolveMediaAsset } from '../../utils/siteHelpers';
import { ConfirmDialog, SafeImage } from '../ui/EditorPrimitives';

export function WorkspaceDashboardView({
  siteData,
  mediaAssets,
  hasUnsavedChanges,
  hasUnpublishedChanges,
  onOpenEditor,
}: {
  siteData: CafeWebsiteData;
  mediaAssets: MediaAsset[];
  hasUnsavedChanges: boolean;
  hasUnpublishedChanges: boolean;
  onOpenEditor: (section?: EditorSection) => void;
}) {
  const heroImg = resolveMediaAsset(mediaAssets, siteData.hero.imageId);
  const featuredCount = siteData.menuItems.filter((i) => i.featured).length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#6B7280]">Habesha Sites — Websites Made Simple</p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
            Welcome back, {siteData.hero.businessName}
          </h1>
          <p className="text-sm text-[#4B5563]">
            Manage your café website, update today’s menu, and publish changes whenever you are ready.
          </p>
        </div>

        {/* Active Website Card */}
        <div className="border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 aspect-[16/10] md:aspect-auto bg-[#F3F4F6]">
            <SafeImage
              src={heroImg?.url}
              alt={siteData.hero.businessName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-7 p-6 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span>Café & Restaurant Template</span>
                <span aria-hidden="true">·</span>
                <span>
                  {siteData.settings.isPublished
                    ? hasUnpublishedChanges
                      ? 'Published (draft edits pending)'
                      : 'Published live'
                    : 'Draft only'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-[#111827]">
                {siteData.settings.websiteName}
              </h2>
              <p className="text-xs font-mono text-[#4B5563]">
                habeshasites.com/site/{siteData.settings.slug}
              </p>
              <p className="text-xs text-[#6B7280] pt-1">
                {hasUnsavedChanges
                  ? 'You have unsaved changes in your editor.'
                  : `Last published: ${formatRelativeDate(siteData.settings.lastPublishedAt)}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => onOpenEditor('home-hero')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23] transition-colors"
              >
                Open Website Editor
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenEditor('menu')}
                className="px-4 py-2.5 text-sm font-medium text-[#111827] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Edit Menu ({siteData.menuItems.length} items)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#111827]">Common Updates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => onOpenEditor('home-hero')}
              className="p-4 rounded-xl border border-[#E5E7EB] bg-white text-left hover:border-[#9CA3AF] transition-colors space-y-1.5"
            >
              <Globe className="w-4 h-4 text-[#1E3A2F]" />
              <p className="text-sm font-medium text-[#111827]">Homepage Hero & Story</p>
              <p className="text-xs text-[#6B7280]">
                Update your headline, welcome photo, and neighborhood note.
              </p>
            </button>
            <button
              type="button"
              onClick={() => onOpenEditor('menu')}
              className="p-4 rounded-xl border border-[#E5E7EB] bg-white text-left hover:border-[#9CA3AF] transition-colors space-y-1.5"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#1E3A2F]" />
              <p className="text-sm font-medium text-[#111827]">Menu & Prices</p>
              <p className="text-xs text-[#6B7280] tabular-nums">
                {siteData.menuCategories.length} categories · {featuredCount} featured items
              </p>
            </button>
            <button
              type="button"
              onClick={() => onOpenEditor('design')}
              className="p-4 rounded-xl border border-[#E5E7EB] bg-white text-left hover:border-[#9CA3AF] transition-colors space-y-1.5"
            >
              <Palette className="w-4 h-4 text-[#1E3A2F]" />
              <p className="text-sm font-medium text-[#111827]">Colors & Typography</p>
              <p className="text-xs text-[#6B7280]">
                Adjust colors, fonts, and layout style without code.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountSettingsView({
  businessName,
  onResetSampleData,
}: {
  businessName: string;
  onResetSampleData: () => void;
}) {
  const [ownerName, setOwnerName] = useState('Selamawit Bekele');
  const [ownerEmail, setOwnerEmail] = useState('selam@zemabuna.com');
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA] p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-1 pb-6 border-b border-[#E5E7EB]">
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
            Account & Workspace Settings
          </h1>
          <p className="text-sm text-[#4B5563]">
            Manage your Habesha Sites business owner profile and workspace preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5 bg-white p-6 rounded-xl border border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827]">Business Owner Profile</h2>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#374151]">Full name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#374151]">Account email</label>
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#374151]">Primary business</label>
            <input
              type="text"
              disabled
              value={businessName}
              className="w-full px-3.5 py-2 text-sm bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedNotice ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#166534]">
                <Check className="w-4 h-4" />
                Account preferences saved
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
            >
              Save Profile
            </button>
          </div>
        </form>

        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-[#111827]">Reset Sample Café Data</h2>
            <p className="text-xs text-[#6B7280]">
              Restore the original Zema Buna & Kitchen sample content, menu, and photos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Sample
          </button>
        </div>

        <ConfirmDialog
          open={confirmReset}
          title="Reset website to sample café content?"
          description="Any custom text, menu changes, or uploaded photos in your current browser session will be replaced by the original Zema Buna & Kitchen starter site."
          confirmLabel="Reset Sample Site"
          tone="danger"
          onConfirm={() => {
            onResetSampleData();
            setConfirmReset(false);
          }}
          onCancel={() => setConfirmReset(false)}
        />
      </div>
    </div>
  );
}
