import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Menu as MenuIcon,
  Monitor,
  Save,
  Smartphone,
  Tablet,
  X,
} from 'lucide-react';
import {
  INITIAL_MEDIA_ASSETS,
  INITIAL_SITE_DATA,
} from './data/initialSiteData';
import {
  CafeWebsiteData,
  EditorSection,
  GlobalArea,
  MediaAsset,
  PreviewDevice,
  PreviewRoute,
} from './types/editor';
import { GlobalSidebar } from './components/layout/GlobalSidebar';
import { EditorNavRail } from './components/layout/EditorNavRail';
import {
  AboutEditor,
  ContactEditor,
  FeaturedMenuEditor,
  GalleryEditor,
  HeroEditor,
  HomeOverviewEditor,
} from './components/editor/HomeSectionEditors';
import { MenuEditor } from './components/editor/MenuEditor';
import { DesignEditor } from './components/editor/DesignEditor';
import { SettingsEditor } from './components/editor/SettingsEditor';
import { ImageLibraryContent, ImagePickerModal } from './components/editor/ImageLibrary';
import { LiveWebsitePreview } from './components/preview/LiveWebsitePreview';
import { PublicCafeSitePage } from './components/public/PublicCafeSitePage';
import {
  AccountSettingsView,
  WorkspaceDashboardView,
} from './components/workspace/GlobalAreaViews';
import { ConfirmDialog } from './components/ui/EditorPrimitives';

const STORAGE_KEY_DRAFT = 'habesha_sites_draft_v1';
const STORAGE_KEY_SAVED = 'habesha_sites_saved_v1';
const STORAGE_KEY_PUBLISHED = 'habesha_sites_published_v1';
const STORAGE_KEY_MEDIA = 'habesha_sites_media_v1';

function loadStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadReconciledMediaAssets(): MediaAsset[] {
  const stored = loadStoredJson<MediaAsset[]>(STORAGE_KEY_MEDIA, INITIAL_MEDIA_ASSETS);
  const builtinById = new Map(INITIAL_MEDIA_ASSETS.map((a) => [a.id, a]));
  return stored.map((asset) => {
    const builtin = builtinById.get(asset.id);
    if (builtin && !asset.isCustomUpload) {
      return { ...asset, url: builtin.url };
    }
    return asset;
  });
}

const SECTION_LABELS: Record<EditorSection, string[]> = {
  home: ['Home'],
  'home-hero': ['Home', 'Hero'],
  'home-featured': ['Home', 'Featured Menu Items'],
  'home-about': ['Home', 'About'],
  'home-gallery': ['Home', 'Gallery'],
  'home-contact': ['Home', 'Contact'],
  menu: ['Menu'],
  design: ['Design'],
  settings: ['Settings'],
  media: ['Image Library'],
};

export default function App() {
  // Client-side route state for public /site/:slug URLs
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  // Global layout state
  const [globalArea, setGlobalArea] = useState<GlobalArea>('websites');
  const [globalSidebarExpanded, setGlobalSidebarExpanded] = useState(false);
  const [mobileGlobalDrawerOpen, setMobileGlobalDrawerOpen] = useState(false);
  const [structureDrawerOpen, setStructureDrawerOpen] = useState(false);

  // Editor & Preview state
  const [activeSection, setActiveSection] = useState<EditorSection>('home-hero');
  const [showDesktopPreview, setShowDesktopPreview] = useState(true);
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('edit');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [previewRoute, setPreviewRoute] = useState<PreviewRoute>({ page: 'home' });
  const [previewMode, setPreviewMode] = useState<'draft' | 'published'>('draft');

  // Website content & publishing state
  const [draftData, setDraftData] = useState<CafeWebsiteData>(() =>
    loadStoredJson<CafeWebsiteData>(STORAGE_KEY_DRAFT, INITIAL_SITE_DATA)
  );
  const [savedDraftSnapshot, setSavedDraftSnapshot] = useState<CafeWebsiteData>(() =>
    loadStoredJson<CafeWebsiteData>(STORAGE_KEY_SAVED, INITIAL_SITE_DATA)
  );
  const [publishedData, setPublishedData] = useState<CafeWebsiteData | null>(() =>
    loadStoredJson<CafeWebsiteData | null>(STORAGE_KEY_PUBLISHED, INITIAL_SITE_DATA)
  );
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() =>
    loadReconciledMediaAssets()
  );

  // Feedback & modal states
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [justPublishedUrl, setJustPublishedUrl] = useState<string | null>(null);

  // Reusable Image Picker Modal state
  const [imagePickerState, setImagePickerState] = useState<{
    open: boolean;
    title: string;
    currentId?: string | null;
    onPick?: (asset: MediaAsset) => void;
  }>({ open: false, title: 'Choose Image' });

  const navigateToPath = (path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_PUBLISHED) {
        setPublishedData(loadStoredJson<CafeWebsiteData | null>(STORAGE_KEY_PUBLISHED, null));
      } else if (e.key === STORAGE_KEY_MEDIA) {
        setMediaAssets(loadReconciledMediaAssets());
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  // Persist draft & media assets locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draftData));
    } catch {
      // ignore quota errors
    }
  }, [draftData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(mediaAssets));
    } catch {
      // ignore quota errors
    }
  }, [mediaAssets]);

  const draftSerialized = useMemo(() => JSON.stringify(draftData), [draftData]);
  const savedSerialized = useMemo(
    () => JSON.stringify(savedDraftSnapshot),
    [savedDraftSnapshot]
  );
  const publishedSerialized = useMemo(
    () => (publishedData ? JSON.stringify(publishedData) : ''),
    [publishedData]
  );

  const hasUnsavedChanges = draftSerialized !== savedSerialized;
  const hasUnpublishedChanges =
    !publishedData || draftSerialized !== publishedSerialized;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const handleSaveDraft = () => {
    setSavedDraftSnapshot(draftData);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(draftData));
    } catch {
      // ignore
    }
    showToast('Draft saved');
  };

  const handleConfirmPublish = () => {
    const nowIso = new Date().toISOString();
    const cleanSlug = draftData.settings.slug.trim() || 'sample-cafe';
    const nextPublished: CafeWebsiteData = {
      ...draftData,
      settings: {
        ...draftData.settings,
        slug: cleanSlug,
        isPublished: true,
        lastPublishedAt: nowIso,
      },
    };
    setDraftData(nextPublished);
    setSavedDraftSnapshot(nextPublished);
    setPublishedData(nextPublished);
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(nextPublished));
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(nextPublished));
      localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(nextPublished));
    } catch {
      // ignore
    }
    setPublishDialogOpen(false);
    setJustPublishedUrl(`/site/${cleanSlug}`);
    showToast('Website published live');
  };

  const handleUnpublish = () => {
    const nextDraft: CafeWebsiteData = {
      ...draftData,
      settings: {
        ...draftData.settings,
        isPublished: false,
      },
    };
    setDraftData(nextDraft);
    setSavedDraftSnapshot(nextDraft);
    setPublishedData(null);
    setPreviewMode('draft');
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(nextDraft));
      localStorage.setItem(STORAGE_KEY_PUBLISHED, 'null');
    } catch {
      // ignore
    }
    showToast('Website unpublished');
  };

  const handleResetSampleData = () => {
    setDraftData(INITIAL_SITE_DATA);
    setSavedDraftSnapshot(INITIAL_SITE_DATA);
    setPublishedData(INITIAL_SITE_DATA);
    setMediaAssets(INITIAL_MEDIA_ASSETS);
    setPreviewRoute({ page: 'home' });
    setPreviewMode('draft');
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(INITIAL_SITE_DATA));
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(INITIAL_SITE_DATA));
      localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(INITIAL_SITE_DATA));
      localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(INITIAL_MEDIA_ASSETS));
    } catch {
      // ignore
    }
    showToast('Sample café restored');
  };

  const handleSelectEditorSection = (section: EditorSection) => {
    setActiveSection(section);
    setPreviewMode('draft');
    if (section === 'home' || section === 'home-hero' || section === 'home-featured') {
      setPreviewRoute({ page: 'home' });
    } else if (section === 'home-about') {
      setPreviewRoute({ page: 'home', anchor: 'about' });
    } else if (section === 'home-gallery') {
      setPreviewRoute({ page: 'home', anchor: 'gallery' });
    } else if (section === 'home-contact') {
      setPreviewRoute({ page: 'home', anchor: 'contact' });
    } else if (section === 'menu') {
      setPreviewRoute({ page: 'menu' });
    }
  };

  const handleRequestImagePick = (
    title: string,
    currentId: string | null | undefined,
    onPick: (asset: MediaAsset) => void
  ) => {
    setImagePickerState({
      open: true,
      title,
      currentId,
      onPick,
    });
  };

  const handleAddMediaAsset = (asset: MediaAsset) => {
    setMediaAssets((prev) => [asset, ...prev]);
  };

  const handleUpdateMediaAsset = (updated: MediaAsset) => {
    setMediaAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteMediaAsset = (id: string) => {
    setMediaAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const activePreviewData =
    previewMode === 'published' && publishedData ? publishedData : draftData;

  const breadcrumbTrail = SECTION_LABELS[activeSection] || ['Home'];

  const renderStatusText = () => {
    if (hasUnsavedChanges) {
      return <span className="text-xs font-medium text-[#B45309]">Unsaved changes</span>;
    }
    if (!draftData.settings.isPublished) {
      return <span className="text-xs font-medium text-[#6B7280]">Saved draft · Not published</span>;
    }
    if (hasUnpublishedChanges) {
      return (
        <span className="text-xs font-medium text-[#4B5563]">
          Draft saved · Unpublished edits
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#15803D]">
        <Check className="w-3.5 h-3.5" />
        Published
      </span>
    );
  };

  const renderActiveSectionForm = () => {
    switch (activeSection) {
      case 'home':
        return (
          <HomeOverviewEditor
            data={draftData}
            onNavigateSection={handleSelectEditorSection}
          />
        );
      case 'home-hero':
        return (
          <HeroEditor
            data={draftData}
            onChange={setDraftData}
            mediaAssets={mediaAssets}
            onRequestImagePick={handleRequestImagePick}
            onNavigateSection={handleSelectEditorSection}
          />
        );
      case 'home-featured':
        return (
          <FeaturedMenuEditor
            data={draftData}
            onChange={setDraftData}
            mediaAssets={mediaAssets}
            onRequestImagePick={handleRequestImagePick}
            onNavigateSection={handleSelectEditorSection}
          />
        );
      case 'home-about':
        return (
          <AboutEditor
            data={draftData}
            onChange={setDraftData}
            mediaAssets={mediaAssets}
            onRequestImagePick={handleRequestImagePick}
            onNavigateSection={handleSelectEditorSection}
          />
        );
      case 'home-gallery':
        return (
          <GalleryEditor
            data={draftData}
            onChange={setDraftData}
            mediaAssets={mediaAssets}
            onRequestImagePick={handleRequestImagePick}
            onNavigateSection={handleSelectEditorSection}
          />
        );
      case 'home-contact':
        return (
          <ContactEditor
            data={draftData}
            onChange={setDraftData}
            mediaAssets={mediaAssets}
            onRequestImagePick={handleRequestImagePick}
            onNavigateSection={handleSelectEditorSection}
          />
        );
      case 'menu':
        return (
          <MenuEditor
            data={draftData}
            onChange={setDraftData}
            mediaAssets={mediaAssets}
            onRequestImagePick={handleRequestImagePick}
            onPreviewMenuItem={(itemSlug) => {
              setPreviewRoute({ page: 'menu-item', itemSlug });
              setShowDesktopPreview(true);
              setMobileViewMode('preview');
            }}
          />
        );
      case 'design':
        return <DesignEditor data={draftData} onChange={setDraftData} />;
      case 'settings':
        return (
          <SettingsEditor
            data={draftData}
            onChange={setDraftData}
            mediaAssets={mediaAssets}
            onRequestImagePick={handleRequestImagePick}
            onRequestPublish={() => setPublishDialogOpen(true)}
            onUnpublish={handleUnpublish}
            hasUnpublishedChanges={hasUnpublishedChanges}
          />
        );
      case 'media':
        return (
          <ImageLibraryContent
            assets={mediaAssets}
            onAddAsset={handleAddMediaAsset}
            onUpdateAsset={handleUpdateMediaAsset}
            onDeleteAsset={handleDeleteMediaAsset}
            mode="standalone"
          />
        );
      default:
        return null;
    }
  };

  const siteOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://habeshasites.com';
  const liveSlug = draftData.settings.slug.trim() || 'sample-cafe';
  const liveSitePath = `/site/${liveSlug}`;
  const fullLiveUrl = `${siteOrigin}${liveSitePath}`;

  // If browsing a public published route (/site/:slug...), render the public café site directly
  if (currentPath.startsWith('/site/')) {
    return (
      <PublicCafeSitePage
        pathname={currentPath}
        publishedData={publishedData}
        mediaAssets={mediaAssets}
        onNavigatePath={navigateToPath}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F8F9FA] text-[#111827]">
      {/* Area A: Global Admin Sidebar */}
      <GlobalSidebar
        activeArea={globalArea}
        onSelectArea={setGlobalArea}
        expanded={globalSidebarExpanded}
        onToggleExpand={() => setGlobalSidebarExpanded((prev) => !prev)}
        mobileOpen={mobileGlobalDrawerOpen}
        onCloseMobile={() => setMobileGlobalDrawerOpen(false)}
      />

      {/* Right Main Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* Global / Editor Top Header Bar */}
        <header className="h-14 shrink-0 bg-white border-b border-[#E5E7EB] px-3 sm:px-5 flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile Global Nav trigger */}
            <button
              type="button"
              onClick={() => setMobileGlobalDrawerOpen(true)}
              aria-label="Open workspace menu"
              className="md:hidden p-2 -ml-1 rounded-lg text-[#4B5563] hover:bg-[#F3F4F6] shrink-0"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {globalArea === 'websites' ? (
              <>
                {/* Tablet/Mobile Structure Drawer Trigger */}
                <button
                  type="button"
                  onClick={() => setStructureDrawerOpen(true)}
                  className="xl:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#111827] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Layers className="w-3.5 h-3.5 text-[#4B5563]" />
                  <span>Pages</span>
                </button>

                {/* Contextual Breadcrumb */}
                <div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
                  <span className="font-medium text-[#6B7280] truncate max-w-[140px]">
                    {draftData.settings.websiteName || 'My Website'}
                  </span>
                  {breadcrumbTrail.map((crumb, idx) => (
                    <React.Fragment key={crumb}>
                      <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                      <span
                        className={`truncate ${
                          idx === breadcrumbTrail.length - 1
                            ? 'font-semibold text-[#111827]'
                            : 'text-[#6B7280]'
                        }`}
                      >
                        {crumb}
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                {/* Status Indicator */}
                <div className="hidden lg:flex items-center pl-3 ml-1 border-l border-[#E5E7EB] whitespace-nowrap">
                  {saveToast ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1E3A2F]">
                      <Check className="w-3.5 h-3.5" />
                      {saveToast}
                    </span>
                  ) : (
                    renderStatusText()
                  )}
                </div>
              </>
            ) : (
              <span className="text-sm font-semibold text-[#111827]">
                {globalArea === 'dashboard' ? 'Habesha Sites Dashboard' : 'Account & Settings'}
              </span>
            )}
          </div>

          {/* Right Action Controls (Website Editor Only) */}
          {globalArea === 'websites' && (
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile Edit / Preview Switch */}
              <div className="flex md:hidden items-center gap-0.5 p-0.5 bg-[#F3F4F6] rounded-lg">
                <button
                  type="button"
                  onClick={() => setMobileViewMode('edit')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    mobileViewMode === 'edit'
                      ? 'bg-white text-[#111827] shadow-xs'
                      : 'text-[#4B5563]'
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setMobileViewMode('preview')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    mobileViewMode === 'preview'
                      ? 'bg-white text-[#111827] shadow-xs'
                      : 'text-[#4B5563]'
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Desktop & Tablet Device Selector + Hide/Show Preview */}
              {showDesktopPreview && (
                <div
                  className="hidden md:flex items-center gap-0.5 p-1 bg-[#F3F4F6] rounded-lg"
                  role="group"
                  aria-label="Preview device size"
                >
                  {(
                    [
                      { id: 'desktop', label: 'Desktop preview', icon: Monitor },
                      { id: 'tablet', label: 'Tablet preview', icon: Tablet },
                      { id: 'mobile', label: 'Mobile preview', icon: Smartphone },
                    ] as const
                  ).map((dev) => {
                    const Icon = dev.icon;
                    const active = previewDevice === dev.id;
                    return (
                      <button
                        key={dev.id}
                        type="button"
                        onClick={() => setPreviewDevice(dev.id)}
                        title={dev.label}
                        aria-label={dev.label}
                        aria-pressed={active}
                        className={`p-1.5 rounded-md transition-colors ${
                          active
                            ? 'bg-white text-[#111827] shadow-xs'
                            : 'text-[#6B7280] hover:text-[#111827]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowDesktopPreview((prev) => !prev)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors whitespace-nowrap shrink-0"
              >
                {showDesktopPreview ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span className="hidden lg:inline">Hide Preview</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>Show Preview</span>
                  </>
                )}
              </button>

              {/* Save Draft */}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={!hasUnsavedChanges}
                aria-label="Save Draft"
                title="Save Draft"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 disabled:opacity-45 disabled:cursor-not-allowed bg-white border-[#D1D5DB] text-[#111827] hover:bg-[#F9FAFB]"
              >
                <Save className="w-3.5 h-3.5 text-[#4B5563]" />
                <span className="hidden sm:inline">Save Draft</span>
              </button>

              {/* Publish Website */}
              <button
                type="button"
                onClick={() => setPublishDialogOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-medium rounded-lg text-white bg-[#1E3A2F] hover:bg-[#162C23] transition-colors whitespace-nowrap shrink-0"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="sm:hidden">Publish</span>
                <span className="hidden sm:inline">
                  {draftData.settings.isPublished ? 'Publish' : 'Publish Website'}
                </span>
              </button>
            </div>
          )}
        </header>

        {/* Sub-bar on mobile showing current section + draft status */}
        {globalArea === 'websites' && (
          <div className="sm:hidden px-3 py-2 bg-[#FCFCFD] border-b border-[#E5E7EB] flex items-center justify-between gap-2 text-xs shrink-0">
            <span className="font-semibold text-[#111827] truncate">
              {breadcrumbTrail.join(' / ')}
            </span>
            <span className="shrink-0">
              {saveToast ? (
                <span className="text-[#1E3A2F] font-medium">{saveToast}</span>
              ) : (
                renderStatusText()
              )}
            </span>
          </div>
        )}

        {/* Active Global Area Content */}
        {globalArea === 'dashboard' && (
          <WorkspaceDashboardView
            siteData={draftData}
            mediaAssets={mediaAssets}
            hasUnsavedChanges={hasUnsavedChanges}
            hasUnpublishedChanges={hasUnpublishedChanges}
            isLive={Boolean(publishedData && publishedData.settings.isPublished)}
            onVisitLiveSite={(path) => navigateToPath(path)}
            onOpenEditor={(sec) => {
              if (sec) handleSelectEditorSection(sec);
              setGlobalArea('websites');
            }}
          />
        )}

        {globalArea === 'account' && (
          <AccountSettingsView
            businessName={draftData.hero.businessName}
            onResetSampleData={handleResetSampleData}
          />
        )}

        {globalArea === 'websites' && (
          <div className="flex-1 min-h-0 flex overflow-hidden relative">
            {/* Area B: Website Editor Navigation (docked on xl+, slide-over drawer below xl) */}
            <div className="hidden xl:flex h-full">
              <EditorNavRail
                websiteName={draftData.settings.websiteName}
                activeSection={activeSection}
                onSelectSection={handleSelectEditorSection}
              />
            </div>

            {structureDrawerOpen && (
              <div className="fixed inset-0 z-50 xl:hidden flex">
                <div
                  className="fixed inset-0 bg-[#111827]/40 backdrop-blur-[1px]"
                  onClick={() => setStructureDrawerOpen(false)}
                />
                <div className="relative w-72 max-w-[82vw] h-full bg-[#FCFCFD] border-r border-[#E5E7EB] shadow-xl z-10 flex flex-col">
                  <EditorNavRail
                    websiteName={draftData.settings.websiteName}
                    activeSection={activeSection}
                    onSelectSection={handleSelectEditorSection}
                    variant="drawer"
                    onCloseDrawer={() => setStructureDrawerOpen(false)}
                  />
                </div>
              </div>
            )}

            {/* Area C + Live Preview Workspace */}
            <div className="flex-1 min-w-0 flex flex-col lg:flex-row h-full overflow-hidden">
              {/* Main Editing Area (~65% desktop width when preview shown) */}
              <main
                className={`overflow-y-auto bg-[#F8F9FA] ${
                  mobileViewMode === 'preview' ? 'hidden md:block' : 'block'
                } ${
                  showDesktopPreview
                    ? 'md:flex-1 lg:flex-[1.85] lg:min-w-0 md:border-b lg:border-b-0 lg:border-r border-[#E5E7EB]'
                    : 'flex-1'
                }`}
              >
                <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
                  {renderActiveSectionForm()}
                </div>
              </main>

              {/* Live Website Preview (~35% desktop width, min-width 320px; below on tablet; full screen switch on mobile) */}
              <section
                aria-label="Live website preview"
                className={`${
                  mobileViewMode === 'preview'
                    ? 'flex-1 flex md:hidden'
                    : showDesktopPreview
                    ? 'hidden md:flex md:h-[46%] lg:h-full lg:flex-1 lg:min-w-[320px] lg:max-w-[42%]'
                    : 'hidden'
                } flex-col min-h-0 overflow-hidden bg-[#F1F3F5]`}
              >
                <LiveWebsitePreview
                  siteData={activePreviewData}
                  mediaAssets={mediaAssets}
                  device={mobileViewMode === 'preview' ? 'mobile' : previewDevice}
                  route={previewRoute}
                  onRouteChange={setPreviewRoute}
                  previewMode={previewMode}
                  onPreviewModeChange={setPreviewMode}
                  hasPublishedVersion={publishedData !== null}
                  onOpenPublishedSite={(path) => navigateToPath(path)}
                />
              </section>
            </div>
          </div>
        )}
      </div>

      {/* Reusable Image Library Picker Modal */}
      <ImagePickerModal
        open={imagePickerState.open}
        title={imagePickerState.title}
        selectedId={imagePickerState.currentId}
        assets={mediaAssets}
        onSelect={(asset) => {
          if (imagePickerState.onPick) {
            imagePickerState.onPick(asset);
          }
        }}
        onClose={() => setImagePickerState({ open: false, title: 'Choose Image' })}
        onAddAsset={handleAddMediaAsset}
        onUpdateAsset={handleUpdateMediaAsset}
        onDeleteAsset={handleDeleteMediaAsset}
      />

      {/* Publish Confirmation Dialog */}
      <ConfirmDialog
        open={publishDialogOpen}
        title="Publish website changes?"
        description="Publishing makes your current draft content, menu updates, and design settings visible to visitors on your public website."
        confirmLabel="Publish Live"
        onConfirm={handleConfirmPublish}
        onCancel={() => setPublishDialogOpen(false)}
        extraContent={
          <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-xs space-y-1">
            <p className="font-medium text-[#111827] break-all">
              Live URL: <span className="font-mono text-[#1E3A2F]">{fullLiveUrl}</span>
            </p>
            <p className="text-[#6B7280]">
              {hasUnsavedChanges
                ? 'Your unsaved draft edits will be saved and published together.'
                : 'Your latest saved draft will go live immediately.'}
            </p>
          </div>
        }
      />

      {/* Published Confirmation Modal with direct Live URL links */}
      {justPublishedUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/45 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="published-live-title"
        >
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <h2 id="published-live-title" className="text-base font-semibold text-[#111827]">
                  Your website is live
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setJustPublishedUrl(null)}
                className="p-1 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 pb-5 space-y-3">
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Your latest changes are now published and ready to view at:
              </p>
              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-mono text-[#1E3A2F] break-all">
                {siteOrigin}
                {justPublishedUrl}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setJustPublishedUrl(null)}
                className="px-3.5 py-2 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6]"
              >
                Continue Editing
              </button>
              <a
                href={justPublishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#111827] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6]"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  const target = justPublishedUrl;
                  setJustPublishedUrl(null);
                  navigateToPath(target);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
              >
                <span>View Live Site</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
