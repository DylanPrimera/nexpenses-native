export function controlMinHeight(fontScale: number) {
  return Math.max(48, Math.ceil(24 * fontScale + 24));
}
