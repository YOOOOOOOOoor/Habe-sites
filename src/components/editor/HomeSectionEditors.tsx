import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  ImagePlus,
  Info,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react';
import {
  CafeWebsiteData,
  EditorSection,
  GalleryItem,
  MediaAsset,
} from '../../types/editor';
import { formatPrice, resolveMediaAsset } from '../../utils/siteHelpers';
import {
  ConfirmDialog,
  EditorSectionHeader,
  ExpandableSection,
  ImageFieldControl,
  SafeImage,
} from '../ui/EditorPrimitives';

interface SharedHomeEditorProps {
  data: CafeWebsiteData;
  onChange: (updater: (prev: CafeWebsiteData) => CafeWebsiteData) => void;
  mediaAssets: MediaAsset[];
  onRequestImagePick: (
    title: string,
    currentId: string | null | undefined,
    onPick: (asset: MediaAsset) => void
  ) => void;
  onNavigateSection: (section: EditorSection) => void;
}

export function HomeOverviewEditor({
  data,
  onNavigateSection,
}: {
  data: CafeWebsiteData;
  onNavigateSection: (section: EditorSection) => void;
}) {
  const featuredCount = data.menuItems.filter((m) => m.featured).length;
  const sections: Array<{
    id: EditorSection;
    title: string;
    summary: string;
  }> = [
    {
      id: 'home-hero',
      title: '1. Hero',
      summary: data.hero.headline || 'Set your café name, headline, and main welcome photo.',
    },
    {
      id: 'home-featured',
      title: '2. Featured Menu Items',
      summary:
        !data.featuredMenu.enabled
          ? 'Hidden on homepage'
          : featuredCount === 0
          ? '0 items featured — hidden until at least 1 menu item is featured'
          : `${featuredCount} featured menu ${featuredCount === 1 ? 'item' : 'items'} shown on homepage`,
    },
    {
      id: 'home-about',
      title: '3. About',
      summary: data.about.heading || 'Share your café story and roasting philosophy.',
    },
    {
      id: 'home-gallery',
      title: '4. Gallery',
      summary: `${data.gallery.items.length} ${
        data.gallery.items.length === 1 ? 'photograph' : 'photographs'
      } in your café showcase`,
    },
    {
      id: 'home-contact',
      title: '5. Contact',
      summary: data.contact.address || 'Address, phone, email, and opening hours',
    },
  ];

  return (
    <div className="space-y-6">
      <EditorSectionHeader
        title="Home Page Structure"
        description="Your homepage is organized into five calm, scannable sections. Choose any section below to update its text or photos."
      />

      <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-[#F9FAFB] transition-colors"
          >
            <div className="min-w-0 space-y-0.5">
              <h2 className="text-sm font-semibold text-[#111827]">{sec.title}</h2>
              <p className="text-xs text-[#6B7280] truncate">{sec.summary}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection(sec.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#111827] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6] transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
            >
              Edit Section
              <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroEditor({
  data,
  onChange,
  mediaAssets,
  onRequestImagePick,
}: SharedHomeEditorProps) {
  const heroAsset = resolveMediaAsset(mediaAssets, data.hero.imageId);
  const missingBusinessName = !data.hero.businessName.trim();
  const missingHeadline = !data.hero.headline.trim();

  return (
    <div className="space-y-6">
      <EditorSectionHeader
        title="Hero Section"
        description="This is the first impression visitors see when opening your website. Keep the headline clear and welcoming."
      />

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="hero-business-name" className="block text-sm font-medium text-[#111827]">
            Business name
          </label>
          <input
            id="hero-business-name"
            type="text"
            value={data.hero.businessName}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                hero: { ...prev.hero, businessName: e.target.value },
              }))
            }
            placeholder="e.g. Zema Buna & Kitchen"
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] ${
              missingBusinessName ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
            }`}
          />
          {missingBusinessName && (
            <p className="text-xs text-[#DC2626]">
              Please enter your café or restaurant name so it appears in the website header.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hero-headline" className="block text-sm font-medium text-[#111827]">
            Main headline
          </label>
          <input
            id="hero-headline"
            type="text"
            value={data.hero.headline}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                hero: { ...prev.hero, headline: e.target.value },
              }))
            }
            placeholder="e.g. Single-origin Ethiopian coffee, roasted daily."
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] ${
              missingHeadline ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
            }`}
          />
          {missingHeadline && (
            <p className="text-xs text-[#DC2626]">Add a short main headline for your homepage.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hero-description" className="block text-sm font-medium text-[#111827]">
            Supporting description
          </label>
          <textarea
            id="hero-description"
            rows={3}
            value={data.hero.description}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                hero: { ...prev.hero, description: e.target.value },
              }))
            }
            placeholder="Describe your café atmosphere, signature roasts, or kitchen offerings..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] leading-relaxed"
          />
        </div>

        <ImageFieldControl
          label="Hero image"
          helperText="Recommended landscape photo"
          asset={heroAsset}
          onOpenPicker={() =>
            onRequestImagePick('Select Hero Image', data.hero.imageId, (asset) =>
              onChange((prev) => ({
                ...prev,
                hero: { ...prev.hero, imageId: asset.id },
              }))
            )
          }
          onRemove={() =>
            onChange((prev) => ({
              ...prev,
              hero: { ...prev.hero, imageId: null },
            }))
          }
        />

        <div className="space-y-1.5">
          <label htmlFor="hero-primary-btn" className="block text-sm font-medium text-[#111827]">
            Primary button text
          </label>
          <input
            id="hero-primary-btn"
            type="text"
            value={data.hero.primaryButtonText}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                hero: { ...prev.hero, primaryButtonText: e.target.value },
              }))
            }
            placeholder="e.g. Explore the Menu"
            className="w-full sm:max-w-xs px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
          <p className="text-xs text-[#6B7280]">Takes visitors straight to your Menu page.</p>
        </div>

        {/* Progressive disclosure for optional secondary button & supporting info */}
        <div className="space-y-3 pt-2">
          <ExpandableSection
            title="Optional secondary button"
            subtitle={
              data.hero.secondaryButton.enabled
                ? `Showing "${data.hero.secondaryButton.text || 'Visit Us'}"`
                : 'Currently hidden'
            }
          >
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.hero.secondaryButton.enabled}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      secondaryButton: {
                        ...prev.hero.secondaryButton,
                        enabled: e.target.checked,
                      },
                    },
                  }))
                }
                className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E3A2F] focus:ring-[#1E3A2F]"
              />
              <span className="text-sm text-[#111827]">Show secondary button next to primary CTA</span>
            </label>
            {data.hero.secondaryButton.enabled && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#374151]">Button label</label>
                <input
                  type="text"
                  value={data.hero.secondaryButton.text}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        secondaryButton: {
                          ...prev.hero.secondaryButton,
                          text: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="e.g. Visit Our Café"
                  className="w-full sm:max-w-xs px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
            )}
          </ExpandableSection>

          <ExpandableSection
            title="Optional supporting note"
            subtitle={
              data.hero.supportingInfo.enabled
                ? 'Shown above your main headline'
                : 'Currently hidden'
            }
          >
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.hero.supportingInfo.enabled}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      supportingInfo: {
                        ...prev.hero.supportingInfo,
                        enabled: e.target.checked,
                      },
                    },
                  }))
                }
                className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E3A2F] focus:ring-[#1E3A2F]"
              />
              <span className="text-sm text-[#111827]">Display short neighborhood or roast note</span>
            </label>
            {data.hero.supportingInfo.enabled && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#374151]">Note text</label>
                <input
                  type="text"
                  value={data.hero.supportingInfo.text}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        supportingInfo: {
                          ...prev.hero.supportingInfo,
                          text: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="e.g. Freshly roasted Yirgacheffe · Bole Medhanialem"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
            )}
          </ExpandableSection>
        </div>
      </div>
    </div>
  );
}

export function FeaturedMenuEditor({
  data,
  onChange,
  mediaAssets,
  onNavigateSection,
}: SharedHomeEditorProps) {
  const featuredItems = data.menuItems.filter((item) => item.featured);

  const toggleFeatured = (itemId: string) => {
    onChange((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) =>
        item.id === itemId ? { ...item, featured: !item.featured } : item
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <EditorSectionHeader
        title="Featured Menu Items"
        description="Highlight signature drinks and dishes on your homepage. Only items marked as featured appear here."
        action={
          <button
            type="button"
            onClick={() => onNavigateSection('menu')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#111827] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors whitespace-nowrap shrink-0"
          >
            Open Menu Editor
            <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
        }
      />

      {/* Enable/disable toggle */}
      <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-[#111827]">Show Featured Menu on homepage</p>
          <p className="text-xs text-[#6B7280]">
            Turn off to keep your homepage focused solely on story, photos, and contact info.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={data.featuredMenu.enabled}
          onClick={() =>
            onChange((prev) => ({
              ...prev,
              featuredMenu: {
                ...prev.featuredMenu,
                enabled: !prev.featuredMenu.enabled,
              },
            }))
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] ${
            data.featuredMenu.enabled ? 'bg-[#1E3A2F]' : 'bg-[#D1D5DB]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
              data.featuredMenu.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {data.featuredMenu.enabled && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="featured-heading" className="block text-sm font-medium text-[#111827]">
                Section heading
              </label>
              <input
                id="featured-heading"
                type="text"
                value={data.featuredMenu.heading}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    featuredMenu: { ...prev.featuredMenu, heading: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="featured-desc" className="block text-sm font-medium text-[#111827]">
                Short introduction
              </label>
              <textarea
                id="featured-desc"
                rows={2}
                value={data.featuredMenu.description}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    featuredMenu: { ...prev.featuredMenu, description: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
              />
            </div>
          </div>

          {featuredItems.length === 0 && (
            <div className="p-4 rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] flex items-start gap-3">
              <Info className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <div className="text-xs text-[#92400E] leading-relaxed">
                <span className="font-semibold">No featured items selected.</span> Your public
                homepage will automatically hide the Featured Menu section until at least one item
                below is selected.
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-[#111827]">
                Select items from your Menu
              </h2>
              <span className="text-xs text-[#6B7280] tabular-nums">
                {featuredItems.length} of {data.menuItems.length} featured
              </span>
            </div>

            {data.menuItems.length === 0 ? (
              <div className="border border-dashed border-[#D1D5DB] rounded-xl p-8 text-center bg-white space-y-3">
                <p className="text-sm font-medium text-[#111827]">Your menu is currently empty</p>
                <p className="text-xs text-[#6B7280]">
                  Add categories and menu items in the Menu editor first, then choose favorites to
                  showcase here.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateSection('menu')}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
                >
                  Go to Menu Editor
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
                {data.menuItems.map((item) => {
                  const asset = resolveMediaAsset(mediaAssets, item.imageId);
                  const category = data.menuCategories.find((c) => c.id === item.categoryId);
                  return (
                    <label
                      key={item.id}
                      className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E5E7EB] shrink-0 bg-[#F3F4F6]">
                          <SafeImage
                            src={asset?.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            fallbackLabel="Item"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#111827] truncate">{item.name}</p>
                          <p className="text-xs text-[#6B7280] truncate">
                            {category?.name || 'Menu'} ·{' '}
                            <span className="tabular-nums">
                              {formatPrice(item.price, item.currency)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1E3A2F]">
                            <Star className="w-3.5 h-3.5 fill-[#1E3A2F]" />
                            Featured
                          </span>
                        )}
                        <input
                          type="checkbox"
                          checked={item.featured}
                          onChange={() => toggleFeatured(item.id)}
                          className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E3A2F] focus:ring-[#1E3A2F]"
                        />
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AboutEditor({
  data,
  onChange,
  mediaAssets,
  onRequestImagePick,
}: SharedHomeEditorProps) {
  const aboutAsset = resolveMediaAsset(mediaAssets, data.about.imageId);

  return (
    <div className="space-y-6">
      <EditorSectionHeader
        title="About Section"
        description="Tell visitors who you are, how you source and roast your coffee, and what makes your kitchen feel like home."
      />

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="about-heading" className="block text-sm font-medium text-[#111827]">
            Section heading
          </label>
          <input
            id="about-heading"
            type="text"
            value={data.about.heading}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                about: { ...prev.about, heading: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="about-story" className="block text-sm font-medium text-[#111827]">
            Business story
          </label>
          <textarea
            id="about-story"
            rows={4}
            value={data.about.story}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                about: { ...prev.about, story: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="about-support" className="block text-sm font-medium text-[#111827]">
            Supporting description
          </label>
          <textarea
            id="about-support"
            rows={2}
            value={data.about.supportingDescription}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                about: { ...prev.about, supportingDescription: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] leading-relaxed"
          />
        </div>

        <ImageFieldControl
          label="Story photograph"
          aspectClass="aspect-[4/3]"
          asset={aboutAsset}
          onOpenPicker={() =>
            onRequestImagePick('Select About Section Image', data.about.imageId, (asset) =>
              onChange((prev) => ({
                ...prev,
                about: { ...prev.about, imageId: asset.id },
              }))
            )
          }
          onRemove={() =>
            onChange((prev) => ({
              ...prev,
              about: { ...prev.about, imageId: null },
            }))
          }
        />

        <ExpandableSection
          title="Additional story details (optional)"
          subtitle={
            data.about.additionalInfo.enabled
              ? 'Showing founding year & sourcing note'
              : 'Add founding year or coffee origin highlights'
          }
        >
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={data.about.additionalInfo.enabled}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  about: {
                    ...prev.about,
                    additionalInfo: {
                      ...prev.about.additionalInfo,
                      enabled: e.target.checked,
                    },
                  },
                }))
              }
              className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E3A2F] focus:ring-[#1E3A2F]"
            />
            <span className="text-sm text-[#111827]">Display heritage callout under story</span>
          </label>

          {data.about.additionalInfo.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#374151]">Founded year</label>
                <input
                  type="text"
                  value={data.about.additionalInfo.foundedYear}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        additionalInfo: {
                          ...prev.about.additionalInfo,
                          foundedYear: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="2021"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-medium text-[#374151]">
                  Sourcing or kitchen note
                </label>
                <input
                  type="text"
                  value={data.about.additionalInfo.originNote}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        additionalInfo: {
                          ...prev.about.additionalInfo,
                          originNote: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="100% traceable washed & natural lots..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
            </div>
          )}
        </ExpandableSection>
      </div>
    </div>
  );
}

export function GalleryEditor({
  data,
  onChange,
  mediaAssets,
  onRequestImagePick,
}: SharedHomeEditorProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const selectedItem = data.gallery.items.find((item) => item.id === selectedItemId);

  const handleAddPhoto = () => {
    onRequestImagePick('Add Photo to Gallery', null, (asset) => {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        imageId: asset.id,
        caption: asset.title,
        alt: asset.alt,
      };
      onChange((prev) => ({
        ...prev,
        gallery: {
          ...prev.gallery,
          items: [...prev.gallery.items, newItem],
        },
      }));
      setSelectedItemId(newItem.id);
    });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= data.gallery.items.length) return;
    onChange((prev) => {
      const copy = [...prev.gallery.items];
      const [moved] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, moved);
      return {
        ...prev,
        gallery: { ...prev.gallery, items: copy },
      };
    });
  };

  const updateSelectedItem = (patch: Partial<GalleryItem>) => {
    if (!selectedItemId) return;
    onChange((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.map((item) =>
          item.id === selectedItemId ? { ...item, ...patch } : item
        ),
      },
    }));
  };

  const confirmRemove = () => {
    if (!pendingDeleteId) return;
    onChange((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.filter((i) => i.id !== pendingDeleteId),
      },
    }));
    if (selectedItemId === pendingDeleteId) setSelectedItemId(null);
    setPendingDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <EditorSectionHeader
        title="Gallery"
        description="Showcase your space, coffee bar, and signature dishes. Click any photo to edit its caption or reorder."
        action={
          <button
            type="button"
            onClick={handleAddPhoto}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23] transition-colors whitespace-nowrap shrink-0"
          >
            <ImagePlus className="w-4 h-4" />
            Add Photo
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="gallery-heading" className="block text-sm font-medium text-[#111827]">
            Section heading
          </label>
          <input
            id="gallery-heading"
            type="text"
            value={data.gallery.heading}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                gallery: { ...prev.gallery, heading: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="gallery-desc" className="block text-sm font-medium text-[#111827]">
            Short subtitle
          </label>
          <input
            id="gallery-desc"
            type="text"
            value={data.gallery.description}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                gallery: { ...prev.gallery, description: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>
      </div>

      {/* Progressive disclosure: Edit panel only shown when an image is selected */}
      {selectedItem && (
        <div className="p-4 rounded-xl border border-[#1E3A2F]/30 bg-white space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-[#111827]">Editing Selected Photo</h2>
            <button
              type="button"
              onClick={() => setSelectedItemId(null)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1E3A2F] bg-[#1E3A2F]/10 rounded-lg hover:bg-[#1E3A2F]/15"
            >
              <Check className="w-3.5 h-3.5" />
              Done
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="space-y-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E7EB]">
                <SafeImage
                  src={resolveMediaAsset(mediaAssets, selectedItem.imageId)?.url}
                  alt={selectedItem.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  onRequestImagePick('Replace Gallery Photo', selectedItem.imageId, (asset) =>
                    updateSelectedItem({
                      imageId: asset.id,
                      alt: asset.alt,
                    })
                  )
                }
                className="w-full px-3 py-1.5 text-xs font-medium text-[#111827] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB]"
              >
                Replace Image
              </button>
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#374151]">
                  Photo caption (shown beneath image)
                </label>
                <textarea
                  rows={2}
                  value={selectedItem.caption}
                  onChange={(e) => updateSelectedItem({ caption: e.target.value })}
                  placeholder="Describe this moment or dish..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#374151]">
                  Alt description (for accessibility)
                </label>
                <input
                  type="text"
                  value={selectedItem.alt}
                  onChange={(e) => updateSelectedItem({ alt: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {data.gallery.items.length === 0 ? (
        <div className="border border-dashed border-[#D1D5DB] rounded-xl p-10 text-center bg-white space-y-3">
          <p className="text-sm font-medium text-[#111827]">No gallery photos yet</p>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            Add photos of your dining room, coffee ceremony, or signature dishes. When empty, the
            gallery section stays hidden on your public site.
          </p>
          <button
            type="button"
            onClick={handleAddPhoto}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            Add First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.gallery.items.map((item, idx) => {
            const asset = resolveMediaAsset(mediaAssets, item.imageId);
            const isSelected = selectedItemId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-xl border bg-white overflow-hidden transition-colors ${
                  isSelected
                    ? 'border-[#1E3A2F] ring-2 ring-[#1E3A2F]/15'
                    : 'border-[#E5E7EB]'
                }`}
              >
                <div className="aspect-[4/3] bg-[#F3F4F6] overflow-hidden">
                  <SafeImage
                    src={asset?.url}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 space-y-2.5">
                  <p className="text-xs text-[#374151] line-clamp-2 min-h-[2rem]">
                    {item.caption || 'No caption added'}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F3F4F6]">
                    <button
                      type="button"
                      onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#111827] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-lg transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      {isSelected ? 'Close' : 'Edit'}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, -1)}
                        aria-label="Move photo earlier"
                        className="p-1.5 rounded-lg text-[#4B5563] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === data.gallery.items.length - 1}
                        onClick={() => moveItem(idx, 1)}
                        aria-label="Move photo later"
                        className="p-1.5 rounded-lg text-[#4B5563] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(item.id)}
                        aria-label="Remove photo from gallery"
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Remove photo from gallery?"
        description="This removes the photo from your homepage gallery. The original file remains in your Image Library."
        confirmLabel="Remove Photo"
        tone="danger"
        onConfirm={confirmRemove}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}

export function ContactEditor({ data, onChange }: SharedHomeEditorProps) {
  const emailValue = data.contact.email.trim();
  const invalidEmail = emailValue.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  return (
    <div className="space-y-6">
      <EditorSectionHeader
        title="Contact & Hours"
        description="Help guests find your café, call ahead, or check today’s opening hours."
      />

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="contact-heading" className="block text-sm font-medium text-[#111827]">
            Section heading
          </label>
          <input
            id="contact-heading"
            type="text"
            value={data.contact.heading}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                contact: { ...prev.contact, heading: e.target.value },
              }))
            }
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-address" className="block text-sm font-medium text-[#111827]">
            Street address
          </label>
          <input
            id="contact-address"
            type="text"
            value={data.contact.address}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                contact: { ...prev.contact, address: e.target.value },
              }))
            }
            placeholder="e.g. Cameroon Street, Bole Sub-City, Addis Ababa"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="contact-phone" className="block text-sm font-medium text-[#111827]">
              Phone number
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={data.contact.phone}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phone: e.target.value },
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="block text-sm font-medium text-[#111827]">
              Email address
            </label>
            <input
              id="contact-email"
              type="email"
              value={data.contact.email}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: e.target.value },
                }))
              }
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] ${
                invalidEmail ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
              }`}
            />
            {invalidEmail && (
              <p className="text-xs text-[#DC2626]">Please enter a valid email address.</p>
            )}
          </div>
        </div>

        {/* Progressive disclosure for Opening Hours & Social Links */}
        <div className="space-y-3 pt-2">
          <ExpandableSection
            title="Opening hours (optional)"
            subtitle={
              data.contact.openingHours.enabled
                ? `Weekdays ${data.contact.openingHours.weekdays}`
                : 'Currently hidden on site'
            }
          >
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.contact.openingHours.enabled}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      openingHours: {
                        ...prev.contact.openingHours,
                        enabled: e.target.checked,
                      },
                    },
                  }))
                }
                className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E3A2F] focus:ring-[#1E3A2F]"
              />
              <span className="text-sm text-[#111827]">Show opening hours in Contact section</span>
            </label>

            {data.contact.openingHours.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#374151]">Mon – Fri</label>
                  <input
                    type="text"
                    value={data.contact.openingHours.weekdays}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          openingHours: {
                            ...prev.contact.openingHours,
                            weekdays: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#374151]">Saturday</label>
                  <input
                    type="text"
                    value={data.contact.openingHours.saturday}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          openingHours: {
                            ...prev.contact.openingHours,
                            saturday: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#374151]">Sunday</label>
                  <input
                    type="text"
                    value={data.contact.openingHours.sunday}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          openingHours: {
                            ...prev.contact.openingHours,
                            sunday: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                  />
                </div>
              </div>
            )}
          </ExpandableSection>

          <ExpandableSection
            title="Social links (optional)"
            subtitle={
              data.contact.socialLinks.enabled
                ? 'Showing Instagram, Facebook & WhatsApp'
                : 'Currently hidden on site'
            }
          >
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.contact.socialLinks.enabled}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      socialLinks: {
                        ...prev.contact.socialLinks,
                        enabled: e.target.checked,
                      },
                    },
                  }))
                }
                className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E3A2F] focus:ring-[#1E3A2F]"
              />
              <span className="text-sm text-[#111827]">Show social handles in Contact section</span>
            </label>

            {data.contact.socialLinks.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#374151]">Instagram</label>
                  <input
                    type="text"
                    value={data.contact.socialLinks.instagram}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          socialLinks: {
                            ...prev.contact.socialLinks,
                            instagram: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="@yourcafe"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#374151]">Facebook</label>
                  <input
                    type="text"
                    value={data.contact.socialLinks.facebook}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          socialLinks: {
                            ...prev.contact.socialLinks,
                            facebook: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="facebook.com/yourcafe"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#374151]">WhatsApp</label>
                  <input
                    type="text"
                    value={data.contact.socialLinks.whatsapp}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          socialLinks: {
                            ...prev.contact.socialLinks,
                            whatsapp: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="+251 91..."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                  />
                </div>
              </div>
            )}
          </ExpandableSection>
        </div>
      </div>
    </div>
  );
}
