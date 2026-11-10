import { CurrencyCode, MediaAsset } from '../types/editor';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatPrice(price: number, currency: CurrencyCode): string {
  const formatted = Number.isInteger(price) ? price.toString() : price.toFixed(2);
  switch (currency) {
    case 'ETB':
      return `${formatted} ETB`;
    case 'USD':
      return `$${formatted}`;
    case 'EUR':
      return `€${formatted}`;
    case 'GBP':
      return `£${formatted}`;
    default:
      return `${formatted} ${currency}`;
  }
}

export function resolveMediaAsset(
  assets: MediaAsset[],
  imageId: string | null | undefined
): MediaAsset | undefined {
  if (!imageId) return undefined;
  return assets.find((asset) => asset.id === imageId);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return [r, g, b];
  }
  return null;
}

function channelLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 4.5;
  const l1 =
    0.2126 * channelLuminance(rgb1[0]) +
    0.7152 * channelLuminance(rgb1[1]) +
    0.0722 * channelLuminance(rgb1[2]);
  const l2 =
    0.2126 * channelLuminance(rgb2[0]) +
    0.7152 * channelLuminance(rgb2[1]) +
    0.0722 * channelLuminance(rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const lum =
    0.2126 * channelLuminance(rgb[0]) +
    0.7152 * channelLuminance(rgb[1]) +
    0.0722 * channelLuminance(rgb[2]);
  return lum < 0.28;
}

export function formatRelativeDate(isoString: string | null): string {
  if (!isoString) return 'Not published yet';
  try {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return 'Recently';
  }
}
