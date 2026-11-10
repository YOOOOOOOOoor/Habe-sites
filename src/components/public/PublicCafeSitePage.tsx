import React, { useEffect, useState } from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { CafeWebsiteData, MediaAsset, PreviewRoute } from '../../types/editor';
import { CafeWebsiteRenderer } from '../preview/CafeWebsiteRenderer';

interface PublicCafeSitePageProps {
  pathname: string;
  publishedData: CafeWebsiteData | null;
  mediaAssets: MediaAsset[];
  onNavigatePath: (path: string) => void;
}

function parsePublicRoute(
  pathname: string,
  expectedSlug: string
): { slug: string; route: PreviewRoute; matchesSlug: boolean } {
  const clean = pathname.replace(/\/+$/, '');
  const parts = clean.split('/').filter(Boolean);
  // Expect ['site', slug, ...]
  const slug = parts[1] || '';
  const matchesSlug = slug === expectedSlug;

  if (parts[2] === 'menu' && parts[3]) {
    return {
      slug,
      route: { page: 'menu-item', itemSlug: decodeURIComponent(parts[3]) },
      matchesSlug,
    };
  }
  if (parts[2] === 'menu') {
    return {
      slug,
      route: { page: 'menu' },
      matchesSlug,
    };
  }
  return {
    slug,
    route: { page: 'home' },
    matchesSlug,
  };
}

export function PublicCafeSitePage({
  pathname,
  publishedData,
  mediaAssets,
  onNavigatePath,
}: PublicCafeSitePageProps) {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [anchorOverride, setAnchorOverride] = useState<
    'about' | 'gallery' | 'contact' | undefined
  >(undefined);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const activeSlug = publishedData?.settings.slug || 'sample-cafe';
  const parsed = parsePublicRoute(pathname, activeSlug);

  useEffect(() => {
    if (publishedData && parsed.matchesSlug) {
      document.title =
        publishedData.settings.seoTitle ||
        publishedData.hero.businessName ||
        publishedData.settings.websiteName;
    } else {
      document.title = 'Habesha Sites';
    }
    return () => {
      document.title = 'Habesha Sites — Website Content Editor';
    };
  }, [publishedData, parsed.matchesSlug]);

  if (!publishedData || !publishedData.settings.isPublished) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center space-y-4">
          <div className="w-11 h-11 rounded-xl bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center mx-auto">
            <Globe className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold text-[#111827]">
              This website is not published yet
            </h1>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              The owner is currently working on a draft. Return to the editor and click{' '}
              <span className="font-medium text-[#111827]">Publish Website</span> to make it live at{' '}
              <span className="font-mono text-xs">/site/{parsed.slug || activeSlug}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigatePath('/')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Website Editor
          </button>
        </div>
      </div>
    );
  }

  if (!parsed.matchesSlug) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center space-y-4">
          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold text-[#111827]">Website not found</h1>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              No published website matches <span className="font-mono">/site/{parsed.slug}</span>.
              Your published site is currently available at{' '}
              <span className="font-mono text-[#111827]">/site/{activeSlug}</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onNavigatePath(`/site/${activeSlug}`)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
            >
              Visit /site/{activeSlug}
            </button>
            <button
              type="button"
              onClick={() => onNavigatePath('/')}
              className="px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB]"
            >
              Back to Editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  const effectiveRoute: PreviewRoute =
    parsed.route.page === 'home' && anchorOverride
      ? { page: 'home', anchor: anchorOverride }
      : parsed.route;

  const handleRouteChange = (next: PreviewRoute) => {
    if (next.page === 'home') {
      setAnchorOverride(next.anchor);
      if (pathname !== `/site/${activeSlug}`) {
        onNavigatePath(`/site/${activeSlug}`);
      }
    } else if (next.page === 'menu') {
      setAnchorOverride(undefined);
      onNavigatePath(`/site/${activeSlug}/menu`);
    } else if (next.page === 'menu-item') {
      setAnchorOverride(undefined);
      onNavigatePath(`/site/${activeSlug}/menu/${encodeURIComponent(next.itemSlug)}`);
    }
  };

  return (
    <CafeWebsiteRenderer
      siteData={publishedData}
      mediaAssets={mediaAssets}
      route={effectiveRoute}
      onRouteChange={handleRouteChange}
      isCompactViewport={windowWidth < 768}
      isTabletViewport={windowWidth >= 768 && windowWidth < 1024}
      onBackToEditor={() => onNavigatePath('/')}
      fullPage
    />
  );
}
