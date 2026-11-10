import { CafeWebsiteData, MediaAsset, TypographyPairId } from '../types/editor';
import heroCafeImg from '../assets/images/hero_ethiopian_cafe_1794267011565.jpg';
import aboutRoastingImg from '../assets/images/about_coffee_roasting_1794267011138.jpg';
import menuJebenaImg from '../assets/images/menu_jebena_buna_1794267011333.jpg';
import menuMacchiatoImg from '../assets/images/menu_macchiato_spiced_1794267012393.jpg';
import menuChechebsaImg from '../assets/images/menu_dabo_breakfast_1794267012585.jpg';
import galleryBaristaImg from '../assets/images/gallery_cafe_counter_1794267013521.jpg';

export const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'img-hero-cafe',
    url: heroCafeImg,
    title: 'Sunlit Café Dining Room & Espresso Bar',
    alt: 'Modern Ethiopian specialty coffee house interior with warm oak tables and traditional clay jebena pots on a stone counter',
    category: 'Interior',
  },
  {
    id: 'img-about-roasting',
    url: aboutRoastingImg,
    title: 'Freshly Roasted Yirgacheffe & Jebena',
    alt: 'Freshly roasted Ethiopian coffee beans in a woven basket beside a black clay jebena pot and porcelain cini cups',
    category: 'Coffee',
  },
  {
    id: 'img-menu-jebena',
    url: menuJebenaImg,
    title: 'Traditional Jebena Buna Ceremony',
    alt: 'Ethiopian jebena coffee ceremony served on a slate tray with two porcelain cini cups and toasted barley snack',
    category: 'Coffee',
  },
  {
    id: 'img-menu-macchiato',
    url: menuMacchiatoImg,
    title: 'Cardamom Spiced Macchiato & Pastry',
    alt: 'Layered Ethiopian spiced macchiato in a ribbed glass cup beside a honey sesame pastry on a stoneware saucer',
    category: 'Coffee',
  },
  {
    id: 'img-menu-chechebsa',
    url: menuChechebsaImg,
    title: 'Honey Niter Kibbeh Chechebsa',
    alt: 'Warm Ethiopian chechebsa flatbread pieces glazed with spiced butter and honey in a clay bowl',
    category: 'Food',
  },
  {
    id: 'img-gallery-barista',
    url: galleryBaristaImg,
    title: 'Pour-Over Coffee Counter',
    alt: 'Barista preparing single-origin pour-over coffee at a minimalist walnut and brushed stone bar',
    category: 'Interior',
  },
];

export interface TypographyOption {
  id: TypographyPairId;
  name: string;
  description: string;
  displayFont: string;
  bodyFont: string;
}

export const TYPOGRAPHY_OPTIONS: TypographyOption[] = [
  {
    id: 'editorial-serif',
    name: 'Editorial Serif & Clean Sans',
    description: 'Warm, expressive serif headings paired with clear modern body text.',
    displayFont: '"Fraunces", Georgia, serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
  },
  {
    id: 'classic-bistro',
    name: 'Classic Bistro Heritage',
    description: 'Timeless café display lettering with approachable reading comfort.',
    displayFont: '"Playfair Display", Georgia, serif',
    bodyFont: '"DM Sans", sans-serif',
  },
  {
    id: 'modern-geometric',
    name: 'Modern Contemporary',
    description: 'Clean architectural sans-serif hierarchy for urban coffee bars.',
    displayFont: '"Plus Jakarta Sans", sans-serif',
    bodyFont: '"Manrope", sans-serif',
  },
  {
    id: 'refined-heritage',
    name: 'Refined Hospitality',
    description: 'Graceful high-contrast display serif suited to dining rooms.',
    displayFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"DM Sans", sans-serif',
  },
];

export interface DesignPreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  typographyId: TypographyPairId;
}

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'addis-forest',
    name: 'Addis Forest & Stone',
    description: 'Deep botanical forest green with warm limestone paper surfaces.',
    primaryColor: '#1E3A2F',
    secondaryColor: '#9A6B3B',
    backgroundColor: '#FAF9F6',
    textColor: '#1C1B18',
    typographyId: 'editorial-serif',
  },
  {
    id: 'yirgacheffe-espresso',
    name: 'Yirgacheffe Roast',
    description: 'Rich dark espresso tones balanced against crisp warm alabaster.',
    primaryColor: '#4A2C1D',
    secondaryColor: '#B8834A',
    backgroundColor: '#FFFFFF',
    textColor: '#181412',
    typographyId: 'classic-bistro',
  },
  {
    id: 'bole-minimal',
    name: 'Bole Architectural Slate',
    description: 'Modern charcoal slate and muted brass for city cafés.',
    primaryColor: '#1F2937',
    secondaryColor: '#8B6F47',
    backgroundColor: '#F7F7F5',
    textColor: '#111827',
    typographyId: 'modern-geometric',
  },
  {
    id: 'highland-night',
    name: 'Highland Evening Lounge',
    description: 'Atmospheric obsidian canvas with warm amber highlights.',
    primaryColor: '#D4A359',
    secondaryColor: '#8C6239',
    backgroundColor: '#161513',
    textColor: '#F3EFEA',
    typographyId: 'refined-heritage',
  },
];

export const INITIAL_SITE_DATA: CafeWebsiteData = {
  hero: {
    businessName: 'Zema Buna & Kitchen',
    headline: 'Single-origin Ethiopian coffee, roasted daily in small batches.',
    description:
      'Rooted in traditional jebena hospitality and crafted for calm mornings. Join us for heirloom Yirgacheffe brews, spiced macchiatos, and warm kitchen plates.',
    imageId: 'img-hero-cafe',
    primaryButtonText: 'Explore the Menu',
    secondaryButton: {
      enabled: true,
      text: 'Visit Our Café',
    },
    supportingInfo: {
      enabled: true,
      text: 'Freshly roasted Yirgacheffe & Sidama harvests · Bole Medhanialem',
    },
  },
  featuredMenu: {
    enabled: true,
    heading: 'House Favorites',
    description:
      'Prepared to order each morning from direct-trade highland beans and house-blended spices.',
  },
  about: {
    heading: 'From Highland Harvest to Your Morning Cup',
    story:
      'Zema Buna & Kitchen began as a neighborhood roastery celebrating the farmers of Gedeb and Guji. Every morning, we wash, roast, and brew beans in small batches—honoring centuries of Ethiopian coffee ceremony while welcoming travelers, remote creatives, and families.',
    supportingDescription:
      'Our kitchen pairs each pour with freshly baked dabo, wildflower honey chechebsa, and house-steeped herbal teas.',
    imageId: 'img-about-roasting',
    additionalInfo: {
      enabled: false,
      foundedYear: '2021',
      originNote: '100% traceable washed & natural lots from Yirgacheffe, Sidama, and Harrar.',
    },
  },
  gallery: {
    heading: 'Inside Zema Buna',
    description: 'A quiet space of warm timber, sunlight, and the aroma of freshly ground buna.',
    items: [
      {
        id: 'gal-1',
        imageId: 'img-hero-cafe',
        caption: 'Morning light across our main dining room and stone espresso counter.',
        alt: 'Sunlit dining tables inside Zema Buna cafe',
      },
      {
        id: 'gal-2',
        imageId: 'img-gallery-barista',
        caption: 'Hand-poured single-origin filters brewed to highlight floral jasmine notes.',
        alt: 'Barista crafting pour-over coffee at walnut counter',
      },
      {
        id: 'gal-3',
        imageId: 'img-about-roasting',
        caption: 'Daily small-batch roasting before the first traditional jebena service.',
        alt: 'Roasted coffee beans in woven basket beside clay jebena',
      },
    ],
  },
  contact: {
    heading: 'Visit & Hours',
    address: 'Cameroon Street, Bole Sub-City, Addis Ababa',
    phone: '+251 11 667 4820',
    email: 'hello@zemabuna.com',
    openingHours: {
      enabled: true,
      weekdays: '7:00 AM – 8:30 PM',
      saturday: '7:30 AM – 9:30 PM',
      sunday: '8:00 AM – 7:00 PM',
    },
    socialLinks: {
      enabled: true,
      instagram: '@zemabuna.cafe',
      facebook: 'facebook.com/zemabuna',
      whatsapp: '+251 91 124 8800',
    },
  },
  menuCategories: [
    {
      id: 'cat-coffee',
      name: 'Signature Coffee & Ceremony',
      description: 'Traditional jebena pours and espresso drinks crafted from seasonal single-origin lots.',
    },
    {
      id: 'cat-breakfast',
      name: 'Morning Plates & Bakery',
      description: 'Warm Ethiopian breakfast classics and freshly baked pastries served all day.',
    },
    {
      id: 'cat-tea',
      name: 'Spiced Teas & Refreshers',
      description: 'House-steeped botanical infusions and cold-pressed fruit drinks.',
    },
  ],
  menuItems: [
    {
      id: 'item-jebena-buna',
      categoryId: 'cat-coffee',
      name: 'Traditional Jebena Buna',
      slug: 'traditional-jebena-buna',
      description:
        'Slow-brewed in a seasoned black clay jebena using dark-roasted Yirgacheffe beans, served in porcelain cini cups with toasted barley kolo.',
      price: 180,
      currency: 'ETB',
      imageId: 'img-menu-jebena',
      featured: true,
    },
    {
      id: 'item-spiced-macchiato',
      categoryId: 'cat-coffee',
      name: 'Cardamom Spiced Macchiato',
      slug: 'cardamom-spiced-macchiato',
      description:
        'Double ristretto layered beneath velvety steamed milk, lightly infused with green korarima cardamom and raw forest honey.',
      price: 220,
      currency: 'ETB',
      imageId: 'img-menu-macchiato',
      featured: true,
    },
    {
      id: 'item-chechebsa-bowl',
      categoryId: 'cat-breakfast',
      name: 'Honey & Niter Kibbeh Chechebsa',
      slug: 'honey-niter-kibbeh-chechebsa',
      description:
        'Crisp shredded house flatbread tossed in warm spiced niter kibbeh butter and gentle berbere, finished with Tigray white honey and cool yogurt.',
      price: 420,
      currency: 'ETB',
      imageId: 'img-menu-chechebsa',
      featured: true,
    },
    {
      id: 'item-pourover-gedeb',
      categoryId: 'cat-coffee',
      name: 'Gedeb Washed Pour-Over',
      slug: 'gedeb-washed-pour-over',
      description:
        'Bright, tea-like filter coffee with tasting notes of bergamot, white peach, and sweet honeyed finish.',
      price: 260,
      currency: 'ETB',
      imageId: 'img-gallery-barista',
      featured: false,
    },
    {
      id: 'item-sesame-pastry',
      categoryId: 'cat-breakfast',
      name: 'Toasted Sesame & Honey Twist',
      slug: 'toasted-sesame-honey-twist',
      description:
        'Flaky laminated morning pastry brushed with blossom honey and roasted black and white sesame seeds.',
      price: 195,
      currency: 'ETB',
      imageId: 'img-menu-macchiato',
      featured: false,
    },
    {
      id: 'item-spiced-chai',
      categoryId: 'cat-tea',
      name: 'Shai Beshenna (Spiced Black Tea)',
      slug: 'shai-beshenna',
      description:
        'Whole-leaf highland black tea simmered with crushed cloves, cinnamon bark, fresh ginger, and lemongrass.',
      price: 140,
      currency: 'ETB',
      imageId: 'img-about-roasting',
      featured: false,
    },
  ],
  design: {
    presetId: 'addis-forest',
    primaryColor: '#1E3A2F',
    secondaryColor: '#9A6B3B',
    backgroundColor: '#FAF9F6',
    textColor: '#1C1B18',
    typographyId: 'editorial-serif',
    cornerStyle: 'rounded',
    heroLayout: 'split',
    headerStyle: 'left',
  },
  settings: {
    websiteName: 'Zema Buna & Kitchen',
    slug: 'sample-cafe',
    seoTitle: 'Zema Buna & Kitchen | Specialty Ethiopian Coffee & Morning Plates',
    seoDescription:
      'Visit Zema Buna & Kitchen in Bole, Addis Ababa for small-batch Yirgacheffe coffee, traditional jebena service, and fresh Ethiopian breakfast plates.',
    socialImageId: 'img-hero-cafe',
    isPublished: true,
    lastPublishedAt: '2026-11-08T09:15:00.000Z',
  },
};
