export const DEFAULT_BRAND_COLORS = {
  primaryColor: '#E55555',
  secondaryColor: '#1E2530',
} as const;

export function shadeHex(hex: string, amount: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.max(0, Math.min(255, Math.round(((value >> shift) & 255) * (1 + amount))));
  return `#${[channel(16), channel(8), channel(0)].map((part) => part.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

export function hexToRgba(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

export function contrastText(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return luminance > 0.45 ? '#111827' : '#FFFFFF';
}
