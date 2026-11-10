import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Phone,
  X,
} from 'lucide-react';
import { CafeWebsiteData, MediaAsset, PreviewRoute } from '../../types/editor';
import { TYPOGRAPHY_OPTIONS } from '../../data/initialSiteData';
import { formatPrice, isColorDark, resolveMediaAsset } from '../../utils/siteHelpers';
import { SafeImage } from '../ui/EditorPrimitives';

interface CafeWebsiteRendererProps {
  siteData: CafeWebsiteData;
  mediaAssets: MediaAsset[];
  route: PreviewRoute;
  onRouteChange: (route: PreviewRoute) => void;
  isCompactViewport: boolean;
  isTabletViewport?: boolean;
  onBackToEditor?: () => void;
  fullPage?: boolean;
}

export function CafeWebsiteRenderer({
  siteData,
  mediaAssets,
  route,
  onRouteChange,
  isCompactViewport,
  isTabletViewport = false,
  onBackToEditor,
  fullPage = false,
}: CafeWebsiteRendererProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const aboutRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    if (route.page === 'home' && route.anchor) {
      const target =
        route.anchor === 'about'
          ? aboutRef.current
          : route.anchor === 'gallery'
          ? galleryRef.current
          : contactRef.current;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (fullPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [route, fullPage]);

  const typo = useMemo(
    () =>
      TYPOGRAPHY_OPTIONS.find((t) => t.id === siteData.design.typographyId) ||
      TYPOGRAPHY_OPTIONS[0],
    [siteData.design.typographyId]
  );

  const {
    primaryColor,
    secondaryColor,
    backgroundColor,
    textColor,
    cornerStyle,
    heroLayout,
    headerStyle,
  } = siteData.design;

  const isDarkBg = isColorDark(backgroundColor);
  const surfaceBg = isDarkBg ? 'rgba(255,255,255,0.04)' : 'rgba(17,24,39,0.03)';
  const subtleBorder = isDarkBg ? 'rgba(255,255,255,0.12)' : 'rgba(17,24,39,0.1)';
  const mutedText = isDarkBg ? 'rgba(243,239,234,0.72)' : 'rgba(28,27,24,0.68)';

  const radiusClass =
    cornerStyle === 'sharp'
      ? 'rounded-none'
      : cornerStyle === 'soft'
      ? 'rounded-2xl'
      : 'rounded-lg';

  const buttonRadiusClass =
    cornerStyle === 'sharp'
      ? 'rounded-none'
      : cornerStyle === 'soft'
      ? 'rounded-full'
      : 'rounded-lg';

  const slug = siteData.settings.slug || 'sample-cafe';

  const heroImage = resolveMediaAsset(mediaAssets, siteData.hero.imageId);
  const aboutImage = resolveMediaAsset(mediaAssets, siteData.about.imageId);

  const featuredItems = siteData.menuItems.filter((item) => item.featured);
  const showFeaturedSection = siteData.featuredMenu.enabled && featuredItems.length > 0;

  const selectedMenuItem =
    route.page === 'menu-item'
      ? siteData.menuItems.find((item) => item.slug === route.itemSlug) ||
        siteData.menuItems[0]
      : undefined;

  const selectedItemCategory = selectedMenuItem
    ? siteData.menuCategories.find((c) => c.id === selectedMenuItem.categoryId)
    : undefined;

  const navigateAnchor = (anchor?: 'about' | 'gallery' | 'contact') => {
    setMobileMenuOpen(false);
    onRouteChange({ page: 'home', anchor });
  };

  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: typo.bodyFont,
      }}
      className={`${fullPage ? 'min-h-screen flex flex-col' : ''} transition-colors duration-150`}
    >
      {/* Public Café Top Navigation */}
      <header
        style={{ borderColor: subtleBorder }}
        className="border-b px-6 md:px-10 py-4 relative"
      >
        <div
          className={`max-w-6xl mx-auto flex items-center justify-between gap-6 ${
            headerStyle === 'centered' && !isCompactViewport ? 'flex-col gap-3' : ''
          }`}
        >
          <button
            type="button"
            onClick={() => onRouteChange({ page: 'home' })}
            style={{ fontFamily: typo.displayFont, color: textColor }}
            className="text-lg font-semibold tracking-tight whitespace-nowrap shrink-0 text-left hover:opacity-80 transition-opacity"
          >
            {siteData.hero.businessName || 'Your Café Name'}
          </button>

          {!isCompactViewport ? (
            <nav className="flex items-center gap-6 text-sm font-medium">
              <button
                type="button"
                onClick={() => onRouteChange({ page: 'home' })}
                style={{
                  color: route.page === 'home' && !route.anchor ? primaryColor : textColor,
                }}
                className="hover:opacity-75 transition-opacity whitespace-nowrap shrink-0"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => onRouteChange({ page: 'menu' })}
                style={{
                  color:
                    route.page === 'menu' || route.page === 'menu-item'
                      ? primaryColor
                      : textColor,
                }}
                className="hover:opacity-75 transition-opacity whitespace-nowrap shrink-0"
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => navigateAnchor('about')}
                className="hover:opacity-75 transition-opacity whitespace-nowrap shrink-0"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => navigateAnchor('gallery')}
                className="hover:opacity-75 transition-opacity whitespace-nowrap shrink-0"
              >
                Gallery
              </button>
              <button
                type="button"
                onClick={() => navigateAnchor('contact')}
                className="hover:opacity-75 transition-opacity whitespace-nowrap shrink-0"
              >
                Contact
              </button>
            </nav>
          ) : (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle site navigation"
              className="p-2 rounded-lg"
              style={{ backgroundColor: surfaceBg }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          )}

          {!isCompactViewport && headerStyle === 'left' && (
            <button
              type="button"
              onClick={() => onRouteChange({ page: 'menu' })}
              style={{
                backgroundColor: primaryColor,
                color: isColorDark(primaryColor) ? '#FFFFFF' : '#111827',
              }}
              className={`px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90 whitespace-nowrap shrink-0 ${buttonRadiusClass}`}
            >
              {siteData.hero.primaryButtonText || 'View Menu'}
            </button>
          )}
        </div>

        {isCompactViewport && mobileMenuOpen && (
          <div
            style={{ borderColor: subtleBorder }}
            className="mt-4 pt-3 border-t flex flex-col gap-2 text-sm font-medium"
          >
            <button type="button" onClick={() => navigateAnchor()} className="py-2 text-left">
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onRouteChange({ page: 'menu' });
              }}
              className="py-2 text-left"
            >
              Menu
            </button>
            <button type="button" onClick={() => navigateAnchor('about')} className="py-2 text-left">
              About
            </button>
            <button type="button" onClick={() => navigateAnchor('gallery')} className="py-2 text-left">
              Gallery
            </button>
            <button type="button" onClick={() => navigateAnchor('contact')} className="py-2 text-left">
              Contact
            </button>
          </div>
        )}
      </header>

      <div className={fullPage ? 'flex-1' : ''}>
        {/* ROUTE 1: HOME PAGE */}
        {route.page === 'home' && (
          <div>
            {heroLayout === 'backdrop' && heroImage ? (
              <section className="relative min-h-[460px] flex items-end overflow-hidden">
                <SafeImage
                  src={heroImage.url}
                  alt={heroImage.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 text-white space-y-4">
                  <div className="max-w-3xl space-y-4">
                    {siteData.hero.supportingInfo.enabled && siteData.hero.supportingInfo.text && (
                      <p className="text-xs font-medium tracking-wide text-white/85">
                        {siteData.hero.supportingInfo.text}
                      </p>
                    )}
                    <h1
                      style={{ fontFamily: typo.displayFont }}
                      className={`${
                        isCompactViewport ? 'text-3xl' : 'text-5xl'
                      } font-semibold leading-[1.12] tracking-tight text-balance`}
                    >
                      {siteData.hero.headline || 'Welcome to our café'}
                    </h1>
                    <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-xl">
                      {siteData.hero.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => onRouteChange({ page: 'menu' })}
                        style={{
                          backgroundColor: primaryColor,
                          color: isColorDark(primaryColor) ? '#FFFFFF' : '#111827',
                        }}
                        className={`px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 whitespace-nowrap ${buttonRadiusClass}`}
                      >
                        {siteData.hero.primaryButtonText || 'Explore Menu'}
                      </button>
                      {siteData.hero.secondaryButton.enabled &&
                        siteData.hero.secondaryButton.text && (
                          <button
                            type="button"
                            onClick={() => navigateAnchor('contact')}
                            className={`px-5 py-2.5 text-sm font-medium border border-white/50 text-white hover:bg-white/10 transition-colors whitespace-nowrap ${buttonRadiusClass}`}
                          >
                            {siteData.hero.secondaryButton.text}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="px-6 md:px-12 py-12 md:py-16">
                <div
                  className={`max-w-6xl mx-auto grid gap-8 items-stretch ${
                    isCompactViewport ? 'grid-cols-1' : 'grid-cols-12'
                  }`}
                >
                  <div
                    className={`${
                      isCompactViewport ? '' : 'col-span-6'
                    } flex flex-col justify-center space-y-5`}
                  >
                    {siteData.hero.supportingInfo.enabled && siteData.hero.supportingInfo.text && (
                      <p style={{ color: secondaryColor }} className="text-xs font-medium tracking-wide">
                        {siteData.hero.supportingInfo.text}
                      </p>
                    )}
                    <h1
                      style={{ fontFamily: typo.displayFont }}
                      className={`${
                        isCompactViewport ? 'text-3xl' : 'text-[42px]'
                      } font-semibold leading-[1.12] tracking-tight text-balance`}
                    >
                      {siteData.hero.headline || 'Welcome to our café'}
                    </h1>
                    <p style={{ color: mutedText }} className="text-sm md:text-base leading-relaxed max-w-lg">
                      {siteData.hero.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => onRouteChange({ page: 'menu' })}
                        style={{
                          backgroundColor: primaryColor,
                          color: isColorDark(primaryColor) ? '#FFFFFF' : '#111827',
                        }}
                        className={`px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 whitespace-nowrap ${buttonRadiusClass}`}
                      >
                        {siteData.hero.primaryButtonText || 'Explore Menu'}
                      </button>
                      {siteData.hero.secondaryButton.enabled &&
                        siteData.hero.secondaryButton.text && (
                          <button
                            type="button"
                            onClick={() => navigateAnchor('contact')}
                            style={{ borderColor: subtleBorder }}
                            className={`px-5 py-2.5 text-sm font-medium border hover:opacity-80 transition-opacity whitespace-nowrap ${buttonRadiusClass}`}
                          >
                            {siteData.hero.secondaryButton.text}
                          </button>
                        )}
                    </div>
                  </div>
                  <div className={isCompactViewport ? '' : 'col-span-6'}>
                    <div
                      className={`w-full h-full min-h-[260px] md:min-h-[360px] overflow-hidden border ${radiusClass}`}
                      style={{ borderColor: subtleBorder }}
                    >
                      <SafeImage
                        src={heroImage?.url}
                        alt={heroImage?.alt || siteData.hero.businessName}
                        className="w-full h-full object-cover"
                        fallbackLabel="Add a hero photo"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Featured Menu Items Section */}
            {showFeaturedSection && (
              <section
                style={{ borderColor: subtleBorder, backgroundColor: surfaceBg }}
                className="border-t px-6 md:px-12 py-12 md:py-16"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div className="space-y-1.5 max-w-xl">
                      <h2
                        style={{ fontFamily: typo.displayFont }}
                        className="text-2xl md:text-3xl font-semibold tracking-tight"
                      >
                        {siteData.featuredMenu.heading || 'House Favorites'}
                      </h2>
                      {siteData.featuredMenu.description && (
                        <p style={{ color: mutedText }} className="text-sm leading-relaxed">
                          {siteData.featuredMenu.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRouteChange({ page: 'menu' })}
                      style={{ color: primaryColor }}
                      className="text-sm font-medium underline underline-offset-4 hover:opacity-80 whitespace-nowrap"
                    >
                      View full menu
                    </button>
                  </div>

                  <div
                    className={`grid gap-6 ${
                      isCompactViewport
                        ? 'grid-cols-1'
                        : isTabletViewport
                        ? 'grid-cols-2'
                        : 'grid-cols-3'
                    }`}
                  >
                    {featuredItems.map((item) => {
                      const img = resolveMediaAsset(mediaAssets, item.imageId);
                      const cat = siteData.menuCategories.find((c) => c.id === item.categoryId);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onRouteChange({ page: 'menu-item', itemSlug: item.slug })}
                          style={{ borderColor: subtleBorder, backgroundColor }}
                          className={`text-left border overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 flex flex-col ${radiusClass}`}
                        >
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            <SafeImage
                              src={img?.url}
                              alt={img?.alt || item.name}
                              className="w-full h-full object-cover"
                              fallbackLabel={item.name}
                            />
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                            <div className="space-y-1">
                              {cat && (
                                <p style={{ color: secondaryColor }} className="text-[11px] font-medium">
                                  {cat.name}
                                </p>
                              )}
                              <h3 style={{ fontFamily: typo.displayFont }} className="text-base font-semibold">
                                {item.name}
                              </h3>
                              <p style={{ color: mutedText }} className="text-xs leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <div
                              className="flex items-center justify-between pt-2 border-t text-xs font-semibold tabular-nums"
                              style={{ borderColor: subtleBorder }}
                            >
                              <span>{formatPrice(item.price, item.currency)}</span>
                              <span style={{ color: primaryColor }}>View details</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* About Section */}
            <section
              ref={aboutRef}
              style={{ borderColor: subtleBorder }}
              className="border-t px-6 md:px-12 py-12 md:py-16"
            >
              <div
                className={`max-w-6xl mx-auto grid gap-8 items-stretch ${
                  isCompactViewport ? 'grid-cols-1' : 'grid-cols-12'
                }`}
              >
                <div className={isCompactViewport ? '' : 'col-span-5'}>
                  <div
                    className={`w-full h-full min-h-[240px] md:min-h-[320px] overflow-hidden border ${radiusClass}`}
                    style={{ borderColor: subtleBorder }}
                  >
                    <SafeImage
                      src={aboutImage?.url}
                      alt={aboutImage?.alt || siteData.about.heading}
                      className="w-full h-full object-cover"
                      fallbackLabel="Our story photo"
                    />
                  </div>
                </div>
                <div
                  className={`${
                    isCompactViewport ? '' : 'col-span-7'
                  } flex flex-col justify-center space-y-4`}
                >
                  <h2
                    style={{ fontFamily: typo.displayFont }}
                    className="text-2xl md:text-3xl font-semibold tracking-tight text-balance"
                  >
                    {siteData.about.heading || 'Our Story'}
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed">{siteData.about.story}</p>
                  {siteData.about.supportingDescription && (
                    <p style={{ color: mutedText }} className="text-sm leading-relaxed">
                      {siteData.about.supportingDescription}
                    </p>
                  )}
                  {siteData.about.additionalInfo.enabled && (
                    <div
                      style={{ borderColor: subtleBorder, backgroundColor: surfaceBg }}
                      className={`p-4 border text-xs space-y-1.5 mt-2 ${radiusClass}`}
                    >
                      {siteData.about.additionalInfo.foundedYear && (
                        <p className="font-medium">Established {siteData.about.additionalInfo.foundedYear}</p>
                      )}
                      {siteData.about.additionalInfo.originNote && (
                        <p style={{ color: mutedText }}>{siteData.about.additionalInfo.originNote}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Gallery Section */}
            {siteData.gallery.items.length > 0 && (
              <section
                ref={galleryRef}
                style={{ borderColor: subtleBorder, backgroundColor: surfaceBg }}
                className="border-t px-6 md:px-12 py-12 md:py-16"
              >
                <div className="max-w-6xl mx-auto space-y-6">
                  <div className="max-w-xl space-y-1.5">
                    <h2
                      style={{ fontFamily: typo.displayFont }}
                      className="text-2xl md:text-3xl font-semibold tracking-tight"
                    >
                      {siteData.gallery.heading || 'Gallery'}
                    </h2>
                    {siteData.gallery.description && (
                      <p style={{ color: mutedText }} className="text-sm">
                        {siteData.gallery.description}
                      </p>
                    )}
                  </div>

                  <div
                    className={`grid gap-5 ${
                      isCompactViewport
                        ? 'grid-cols-1'
                        : isTabletViewport
                        ? 'grid-cols-2'
                        : 'grid-cols-3'
                    }`}
                  >
                    {siteData.gallery.items.map((gItem) => {
                      const img = resolveMediaAsset(mediaAssets, gItem.imageId);
                      return (
                        <figure key={gItem.id} className="space-y-2">
                          <div
                            style={{ borderColor: subtleBorder }}
                            className={`aspect-[4/3] overflow-hidden border ${radiusClass}`}
                          >
                            <SafeImage
                              src={img?.url}
                              alt={gItem.alt || gItem.caption || 'Gallery image'}
                              className="w-full h-full object-cover"
                              fallbackLabel="Gallery photo"
                            />
                          </div>
                          {gItem.caption && (
                            <figcaption style={{ color: mutedText }} className="text-xs leading-relaxed">
                              {gItem.caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section */}
            <section
              ref={contactRef}
              style={{ borderColor: subtleBorder }}
              className="border-t px-6 md:px-12 py-12 md:py-16"
            >
              <div
                className={`max-w-6xl mx-auto grid gap-8 ${
                  isCompactViewport ? 'grid-cols-1' : 'grid-cols-3'
                }`}
              >
                <div className="space-y-3">
                  <h2 style={{ fontFamily: typo.displayFont }} className="text-2xl font-semibold tracking-tight">
                    {siteData.contact.heading || 'Visit Us'}
                  </h2>
                  <div className="space-y-2 text-sm">
                    {siteData.contact.address && (
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: secondaryColor }} />
                        <span>{siteData.contact.address}</span>
                      </div>
                    )}
                    {siteData.contact.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 shrink-0" style={{ color: secondaryColor }} />
                        <span className="tabular-nums">{siteData.contact.phone}</span>
                      </div>
                    )}
                    {siteData.contact.email && (
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 shrink-0" style={{ color: secondaryColor }} />
                        <span>{siteData.contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {siteData.contact.openingHours.enabled && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: secondaryColor }} />
                      Opening Hours
                    </h3>
                    <dl className="space-y-1.5 text-sm" style={{ color: mutedText }}>
                      <div className="flex justify-between gap-4">
                        <dt>Mon – Fri</dt>
                        <dd className="tabular-nums">{siteData.contact.openingHours.weekdays}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>Saturday</dt>
                        <dd className="tabular-nums">{siteData.contact.openingHours.saturday}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>Sunday</dt>
                        <dd className="tabular-nums">{siteData.contact.openingHours.sunday}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                {siteData.contact.socialLinks.enabled && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Follow & Connect</h3>
                    <div className="space-y-1.5 text-sm" style={{ color: mutedText }}>
                      {siteData.contact.socialLinks.instagram && (
                        <p>Instagram: {siteData.contact.socialLinks.instagram}</p>
                      )}
                      {siteData.contact.socialLinks.facebook && (
                        <p>Facebook: {siteData.contact.socialLinks.facebook}</p>
                      )}
                      {siteData.contact.socialLinks.whatsapp && (
                        <p className="tabular-nums">WhatsApp: {siteData.contact.socialLinks.whatsapp}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ROUTE 2: DEDICATED MENU PAGE */}
        {route.page === 'menu' && (
          <div className="px-6 md:px-12 py-12 min-h-[540px]">
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="space-y-2 max-w-2xl pb-6 border-b" style={{ borderColor: subtleBorder }}>
                <p style={{ color: secondaryColor }} className="text-xs font-medium">
                  {siteData.hero.businessName}
                </p>
                <h1 style={{ fontFamily: typo.displayFont }} className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Our Menu
                </h1>
                <p style={{ color: mutedText }} className="text-sm leading-relaxed">
                  Select any dish or beverage to view full preparation notes and ingredients.
                </p>
              </div>

              {siteData.menuCategories.length === 0 ? (
                <div
                  style={{ borderColor: subtleBorder }}
                  className={`p-10 border border-dashed text-center ${radiusClass}`}
                >
                  <p className="text-sm font-medium">Menu coming soon</p>
                  <p style={{ color: mutedText }} className="text-xs mt-1">
                    Add categories and menu items in the Menu editor to display them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {siteData.menuCategories.map((category) => {
                    const items = siteData.menuItems.filter((item) => item.categoryId === category.id);
                    return (
                      <section key={category.id} className="space-y-5">
                        <div className="space-y-1">
                          <h2 style={{ fontFamily: typo.displayFont }} className="text-2xl font-semibold tracking-tight">
                            {category.name}
                          </h2>
                          {category.description && (
                            <p style={{ color: mutedText }} className="text-sm">
                              {category.description}
                            </p>
                          )}
                        </div>

                        {items.length === 0 ? (
                          <p style={{ color: mutedText }} className="text-xs italic">
                            No items in this category yet.
                          </p>
                        ) : (
                          <div className={`grid gap-5 ${isCompactViewport ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {items.map((item) => {
                              const img = resolveMediaAsset(mediaAssets, item.imageId);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => onRouteChange({ page: 'menu-item', itemSlug: item.slug })}
                                  style={{ borderColor: subtleBorder, backgroundColor: surfaceBg }}
                                  className={`text-left border p-3.5 flex gap-4 items-center hover:opacity-90 transition-opacity ${radiusClass}`}
                                >
                                  <div
                                    className={`w-24 h-24 shrink-0 overflow-hidden border ${radiusClass}`}
                                    style={{ borderColor: subtleBorder }}
                                  >
                                    <SafeImage
                                      src={img?.url}
                                      alt={img?.alt || item.name}
                                      className="w-full h-full object-cover"
                                      fallbackLabel="Photo"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-baseline justify-between gap-2">
                                      <h3 style={{ fontFamily: typo.displayFont }} className="text-base font-semibold truncate">
                                        {item.name}
                                      </h3>
                                      <span className="text-sm font-semibold tabular-nums shrink-0">
                                        {formatPrice(item.price, item.currency)}
                                      </span>
                                    </div>
                                    <p style={{ color: mutedText }} className="text-xs leading-relaxed line-clamp-2">
                                      {item.description}
                                    </p>
                                    {item.featured && (
                                      <span style={{ color: secondaryColor }} className="inline-block text-[11px] font-medium pt-0.5">
                                        House Favorite
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ROUTE 3: INDIVIDUAL MENU ITEM DETAIL PAGE */}
        {route.page === 'menu-item' && selectedMenuItem && (
          <div className="px-6 md:px-12 py-12 min-h-[540px]">
            <div className="max-w-5xl mx-auto space-y-8">
              <button
                type="button"
                onClick={() => onRouteChange({ page: 'menu' })}
                style={{ color: primaryColor }}
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Menu
              </button>

              <div className={`grid gap-8 items-start ${isCompactViewport ? 'grid-cols-1' : 'grid-cols-12'}`}>
                <div className={isCompactViewport ? '' : 'col-span-6'}>
                  <div
                    style={{ borderColor: subtleBorder }}
                    className={`aspect-[4/3] overflow-hidden border ${radiusClass}`}
                  >
                    <SafeImage
                      src={resolveMediaAsset(mediaAssets, selectedMenuItem.imageId)?.url}
                      alt={selectedMenuItem.name}
                      className="w-full h-full object-cover"
                      fallbackLabel={selectedMenuItem.name}
                    />
                  </div>
                </div>
                <div className={`${isCompactViewport ? '' : 'col-span-6'} space-y-4`}>
                  {selectedItemCategory && (
                    <p style={{ color: secondaryColor }} className="text-xs font-medium">
                      {selectedItemCategory.name}
                    </p>
                  )}
                  <h1 style={{ fontFamily: typo.displayFont }} className="text-3xl font-semibold tracking-tight">
                    {selectedMenuItem.name}
                  </h1>
                  <p className="text-xl font-semibold tabular-nums">
                    {formatPrice(selectedMenuItem.price, selectedMenuItem.currency)}
                  </p>
                  <p
                    style={{ color: mutedText, borderColor: subtleBorder }}
                    className="text-sm md:text-base leading-relaxed pt-3 border-t"
                  >
                    {selectedMenuItem.description || 'Prepared fresh to order at our café.'}
                  </p>
                  <div
                    style={{ borderColor: subtleBorder, backgroundColor: surfaceBg }}
                    className={`p-4 border text-xs space-y-1 mt-4 ${radiusClass}`}
                  >
                    <p className="font-medium">Available in-café</p>
                    <p style={{ color: mutedText }}>
                      {siteData.contact.address} · {siteData.contact.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Public Café Footer */}
      <footer
        style={{ borderColor: subtleBorder, color: mutedText }}
        className="border-t px-6 md:px-12 py-6"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <span>
            © {new Date().getFullYear()} {siteData.hero.businessName}
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">/site/{slug}</span>
            {onBackToEditor && (
              <button
                type="button"
                onClick={onBackToEditor}
                className="underline underline-offset-4 hover:opacity-80 font-medium"
                style={{ color: primaryColor }}
              >
                Edit in Habesha Sites
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
