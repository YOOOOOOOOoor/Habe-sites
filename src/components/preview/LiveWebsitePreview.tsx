import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Globe, RotateCcw } from 'lucide-react';
import {
  CafeWebsiteData,
  MediaAsset,
  PreviewDevice,
  PreviewRoute,
} from '../../types/editor';
import { CafeWebsiteRenderer } from './CafeWebsiteRenderer';

interface LiveWebsitePreviewProps {
  siteData: CafeWebsiteData;
  mediaAssets: MediaAsset[];
  device: PreviewDevice;
  route: PreviewRoute;
  onRouteChange: (route: PreviewRoute) => void;
  previewMode: 'draft' | 'published';
  onPreviewModeChange: (mode: 'draft' | 'published') => void;
  hasPublishedVersion: boolean;
  onOpenPublishedSite?: (path: string) => void;
}

export function LiveWebsitePreview({
  siteData,
  mediaAssets,
  device,
  route,
  onRouteChange,
  previewMode,
  onPreviewModeChange,
  hasPublishedVersion,
  onOpenPublishedSite,
}: LiveWebsitePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(460);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const availableWidth = Math.max(containerWidth - 24, 280);
  const targetViewportWidth =
    device === 'desktop'
      ? 1120
      : device === 'tablet'
      ? 768
      : Math.min(375, availableWidth);

  const scale = Math.min(1, availableWidth / targetViewportWidth);
  const isCompactViewport = device === 'mobile';
  const isTabletViewport = device === 'tablet';

  const slug = siteData.settings.slug || 'sample-cafe';
  const currentUrlPath =
    route.page === 'home'
      ? `/site/${slug}`
      : route.page === 'menu'
      ? `/site/${slug}/menu`
      : `/site/${slug}/menu/${route.itemSlug}`;

  return (
    <div className="flex flex-col h-full bg-[#F1F3F5] select-text">
      {/* Preview Browser Chrome */}
      <div className="px-3 py-2.5 bg-white border-b border-[#E5E7EB] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {route.page !== 'home' && (
            <button
              type="button"
              onClick={() =>
                onRouteChange(
                  route.page === 'menu-item' ? { page: 'menu' } : { page: 'home' }
                )
              }
              className="p-1 rounded-md text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors shrink-0"
              title="Go back"
              aria-label="Go back in preview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[11px] text-[#374151] font-mono truncate flex-1 min-w-0">
            <Globe className="w-3 h-3 text-[#6B7280] shrink-0" />
            <span className="truncate">{currentUrlPath}</span>
          </div>
          <button
            type="button"
            onClick={() => onRouteChange({ page: 'home' })}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors shrink-0"
            title="Reset preview to homepage"
            aria-label="Reset preview to homepage"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {hasPublishedVersion && onOpenPublishedSite && (
            <button
              type="button"
              onClick={() => onOpenPublishedSite(currentUrlPath)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-[#1E3A2F] hover:bg-[#1E3A2F]/10 transition-colors shrink-0 whitespace-nowrap"
              title={`Open live published page at ${currentUrlPath}`}
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Draft vs Published preview switcher */}
        <div className="flex items-center gap-0.5 p-0.5 bg-[#F3F4F6] rounded-md shrink-0">
          <button
            type="button"
            onClick={() => onPreviewModeChange('draft')}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
              previewMode === 'draft'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Draft
          </button>
          <button
            type="button"
            disabled={!hasPublishedVersion}
            onClick={() => onPreviewModeChange('published')}
            title={
              hasPublishedVersion
                ? 'View the currently published live website'
                : 'Publish your website first to compare live version'
            }
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
              previewMode === 'published'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            Live
          </button>
        </div>
      </div>

      {/* Scaled Viewport Frame */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-3 flex justify-center items-start"
      >
        <div
          style={{
            width: `${targetViewportWidth * scale}px`,
            minHeight: '100%',
          }}
          className="relative shrink-0"
        >
          <div
            style={{
              width: `${targetViewportWidth}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            className="rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden"
          >
            <CafeWebsiteRenderer
              siteData={siteData}
              mediaAssets={mediaAssets}
              route={route}
              onRouteChange={onRouteChange}
              isCompactViewport={isCompactViewport}
              isTabletViewport={isTabletViewport}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
