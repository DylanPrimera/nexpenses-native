export const DEFAULT_CATEGORY_COLOR = "#6366f1";

export function withAlpha(hex: string, alpha: number): string {
  const normalized = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : DEFAULT_CATEGORY_COLOR;
  const channel = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${normalized}${channel}`;
}

export function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase();
}

function rgb(hex: string) {
  return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
}

function mix(from: string, to: string, amount: number) {
  const base = rgb(from);
  return `#${rgb(to)
    .map((channel, index) =>
      Math.round(base[index] + (channel - base[index]) * amount)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function luminance(hex: string) {
  const [red, green, blue] = rgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

export function categoryBadgeForeground(hex: string, card: string) {
  const color = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : DEFAULT_CATEGORY_COLOR;
  const background = luminance(mix(card, color, 31 / 255));
  const contrast = (tone: string) => {
    const foreground = luminance(tone);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  };
  const target = contrast("#000000") > contrast("#ffffff") ? "#000000" : "#ffffff";
  for (let step = 0; step <= 20; step++) {
    const tone = mix(color, target, step / 20);
    if (contrast(tone) >= 4.6) return tone;
  }
  return target;
}
