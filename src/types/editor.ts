export type GlobalArea = 'dashboard' | 'websites' | 'account';

export type EditorSection =
  | 'home'
  | 'home-hero'
  | 'home-featured'
  | 'home-about'
  | 'home-gallery'
  | 'home-contact'
  | 'menu'
  | 'design'
  | 'settings'
  | 'media';

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export type CurrencyCode = 'ETB' | 'USD' | 'EUR' | 'GBP';

export interface MediaAsset {
  id: string;
  url: string;
  title: string;
  alt: string;
  category: 'Interior' | 'Coffee' | 'Food' | 'Upload';
  isCustomUpload?: boolean;
}

export interface GalleryItem {
  id: string;
  imageId: string;
  caption: string;
  alt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: CurrencyCode;
  imageId: string | null;
  featured: boolean;
}

export type TypographyPairId =
  | 'editorial-serif'
  | 'classic-bistro'
  | 'modern-geometric'
  | 'refined-heritage';

export interface DesignSettings {
  presetId: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  typographyId: TypographyPairId;
  cornerStyle: 'sharp' | 'rounded' | 'soft';
  heroLayout: 'split' | 'backdrop';
  headerStyle: 'left' | 'centered';
}

export interface WebsiteSettings {
  websiteName: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  socialImageId: string | null;
  isPublished: boolean;
  lastPublishedAt: string | null;
}

export interface CafeWebsiteData {
  hero: {
    businessName: string;
    headline: string;
    description: string;
    imageId: string | null;
    primaryButtonText: string;
    secondaryButton: {
      enabled: boolean;
      text: string;
    };
    supportingInfo: {
      enabled: boolean;
      text: string;
    };
  };
  featuredMenu: {
    enabled: boolean;
    heading: string;
    description: string;
  };
  about: {
    heading: string;
    story: string;
    supportingDescription: string;
    imageId: string | null;
    additionalInfo: {
      enabled: boolean;
      foundedYear: string;
      originNote: string;
    };
  };
  gallery: {
    heading: string;
    description: string;
    items: GalleryItem[];
  };
  contact: {
    heading: string;
    address: string;
    phone: string;
    email: string;
    openingHours: {
      enabled: boolean;
      weekdays: string;
      saturday: string;
      sunday: string;
    };
    socialLinks: {
      enabled: boolean;
      instagram: string;
      facebook: string;
      whatsapp: string;
    };
  };
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  design: DesignSettings;
  settings: WebsiteSettings;
}

export type PreviewRoute =
  | { page: 'home'; anchor?: 'about' | 'gallery' | 'contact' }
  | { page: 'menu' }
  | { page: 'menu-item'; itemSlug: string };
