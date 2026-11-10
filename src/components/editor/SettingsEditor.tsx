import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { CafeWebsiteData, MediaAsset } from '../../types/editor';
import { formatRelativeDate, resolveMediaAsset, slugify } from '../../utils/siteHelpers';
import {
  ConfirmDialog,
  EditorSectionHeader,
  ImageFieldControl,
} from '../ui/EditorPrimitives';

interface SettingsEditorProps {
  data: CafeWebsiteData;
  onChange: (updater: (prev: CafeWebsiteData) => CafeWebsiteData) => void;
  mediaAssets: MediaAsset[];
  onRequestImagePick: (
    title: string,
    currentId: string | null | undefined,
    onPick: (asset: MediaAsset) => void
  ) => void;
  onRequestPublish: () => void;
  onUnpublish: () => void;
  hasUnpublishedChanges: boolean;
}

export function SettingsEditor({
  data,
  onChange,
  mediaAssets,
  onRequestImagePick,
  onRequestPublish,
  onUnpublish,
  hasUnpublishedChanges,
}: SettingsEditorProps) {
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);

  const { settings } = data;
  const socialImage = resolveMediaAsset(mediaAssets, settings.socialImageId);
  const seoTitleLen = settings.seoTitle.length;
  const seoDescLen = settings.seoDescription.length;
  const invalidSlug = !settings.slug.trim();

  return (
    <div className="space-y-8">
      <EditorSectionHeader
        title="Website Settings"
        description="Manage your public web address, search engine appearance, social sharing preview, and publishing status."
      />

      {/* Group 1: General Website Identity */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#111827]">Website Name & Public Address</h2>

        <div className="space-y-1.5">
          <label htmlFor="settings-name" className="block text-sm font-medium text-[#111827]">
            Website name
          </label>
          <input
            id="settings-name"
            type="text"
            value={settings.websiteName}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                settings: { ...prev.settings, websiteName: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
          <p className="text-xs text-[#6B7280]">
            Shown inside your Habesha Sites workspace and browser tab defaults.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settings-slug" className="block text-sm font-medium text-[#111827]">
            Website slug (public URL)
          </label>
          <div className="flex items-stretch rounded-lg border border-[#D1D5DB] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#1E3A2F]">
            <span className="px-3 py-2.5 text-xs font-mono text-[#6B7280] bg-[#F9FAFB] border-r border-[#E5E7EB] flex items-center whitespace-nowrap">
              habeshasites.com/site/
            </span>
            <input
              id="settings-slug"
              type="text"
              value={settings.slug}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '-')
                      .replace(/-+/g, '-'),
                  },
                }))
              }
              onBlur={() => {
                if (settings.slug) {
                  onChange((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      slug: slugify(prev.settings.slug) || 'sample-cafe',
                    },
                  }));
                }
              }}
              className="flex-1 px-3 py-2.5 text-sm font-mono text-[#111827] focus:outline-none min-w-0"
            />
          </div>
          {invalidSlug ? (
            <p className="text-xs text-[#DC2626]">
              Please enter a short URL slug using letters, numbers, and hyphens.
            </p>
          ) : (
            <p className="text-xs text-[#6B7280]">
              Your menu page will live at{' '}
              <span className="font-mono text-[#374151]">/site/{settings.slug}/menu</span>.
            </p>
          )}
        </div>
      </section>

      {/* Group 2: Search Engine Optimization (SEO) */}
      <section className="space-y-4 pt-6 border-t border-[#E5E7EB]">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Search Engine Optimization (SEO)</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Control how your café appears in Google search results.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="settings-seo-title" className="text-sm font-medium text-[#111827]">
              SEO title
            </label>
            <span
              className={`text-xs tabular-nums ${
                seoTitleLen > 60 ? 'text-[#B45309]' : 'text-[#6B7280]'
              }`}
            >
              {seoTitleLen} / 60 recommended
            </span>
          </div>
          <input
            id="settings-seo-title"
            type="text"
            value={settings.seoTitle}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                settings: { ...prev.settings, seoTitle: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
          <p className="text-xs text-[#6B7280]">
            Include your café name and city or specialty so local guests can find you easily.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="settings-seo-desc" className="text-sm font-medium text-[#111827]">
              SEO description
            </label>
            <span
              className={`text-xs tabular-nums ${
                seoDescLen > 160 ? 'text-[#B45309]' : 'text-[#6B7280]'
              }`}
            >
              {seoDescLen} / 160 recommended
            </span>
          </div>
          <textarea
            id="settings-seo-desc"
            rows={3}
            value={settings.seoDescription}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                settings: { ...prev.settings, seoDescription: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        {/* Clean Search Snippet Preview */}
        <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] mb-1">
            <Search className="w-3 h-3" />
            <span>Search Result Preview</span>
          </div>
          <p className="text-xs text-[#1E3A2F] font-mono truncate">
            habeshasites.com/site/{settings.slug || 'sample-cafe'}
          </p>
          <p className="text-sm font-medium text-[#1D4ED8] truncate">
            {settings.seoTitle || settings.websiteName || 'Your Café Website'}
          </p>
          <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
            {settings.seoDescription ||
              'Add a short description to summarize your coffee, food, and neighborhood.'}
          </p>
        </div>
      </section>

      {/* Group 3: Social Sharing Image */}
      <section className="space-y-4 pt-6 border-t border-[#E5E7EB]">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Social Sharing Preview</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            This photo appears when you share your website link on WhatsApp, Instagram, or Telegram.
          </p>
        </div>

        <ImageFieldControl
          label="Social sharing image"
          helperText="Recommended 1200 × 630 landscape"
          asset={socialImage}
          onOpenPicker={() =>
            onRequestImagePick('Choose Social Sharing Image', settings.socialImageId, (asset) =>
              onChange((prev) => ({
                ...prev,
                settings: { ...prev.settings, socialImageId: asset.id },
              }))
            )
          }
          onRemove={() =>
            onChange((prev) => ({
              ...prev,
              settings: { ...prev.settings, socialImageId: null },
            }))
          }
        />
      </section>

      {/* Group 4: Publishing Status */}
      <section className="space-y-4 pt-6 border-t border-[#E5E7EB]">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Publishing Status</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Draft changes remain private to you until you publish them live.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#1E3A2F]" />
              <span className="text-sm font-semibold text-[#111827]">
                {settings.isPublished ? 'Website is Published' : 'Website is Unpublished (Draft Only)'}
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              {settings.isPublished
                ? hasUnpublishedChanges
                  ? `Last published ${formatRelativeDate(settings.lastPublishedAt)} · You have unpublished draft edits`
                  : `Live and up to date · Last published ${formatRelativeDate(settings.lastPublishedAt)}`
                : 'Visitors cannot view this site publicly until you click Publish Website.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {settings.isPublished && (
              <button
                type="button"
                onClick={() => setConfirmUnpublish(true)}
                className="px-3.5 py-2 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] whitespace-nowrap"
              >
                Unpublish
              </button>
            )}
            <button
              type="button"
              onClick={onRequestPublish}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23] whitespace-nowrap"
            >
              {settings.isPublished ? 'Publish Changes' : 'Publish Website'}
            </button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={confirmUnpublish}
        title="Unpublish your website?"
        description="Your café website will be taken offline for public visitors, while all of your content and draft changes remain safely saved in the editor."
        confirmLabel="Unpublish Website"
        tone="danger"
        onConfirm={() => {
          onUnpublish();
          setConfirmUnpublish(false);
        }}
        onCancel={() => setConfirmUnpublish(false)}
      />
    </div>
  );
}
