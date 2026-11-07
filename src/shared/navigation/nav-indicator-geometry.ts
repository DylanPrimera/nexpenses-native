import type { LayoutRectangle } from "react-native";

export type NavMeasurements = {
  pill: LayoutRectangle | null;
  left: LayoutRectangle | null;
  right: LayoutRectangle | null;
  gap: LayoutRectangle | null;
  tabs: Record<string, LayoutRectangle>;
};

export type NavIndicatorGeometry = LayoutRectangle & {
  minX: number;
  maxX: number;
  gapStart: number;
  gapEnd: number;
};

function isValidRect(rect: LayoutRectangle | null | undefined): rect is LayoutRectangle {
  return !!rect && [rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) &&
    rect.width > 0 && rect.height > 0;
}

export function resolveNavIndicatorGeometry(
  measurements: NavMeasurements,
  route: string | undefined,
  leftRoutes: readonly string[],
  rightRoutes: readonly string[],
): NavIndicatorGeometry | null {
  const { pill, left, right, gap, tabs } = measurements;
  if (!route || !isValidRect(pill) || !isValidRect(left) || !isValidRect(right) || !isValidRect(gap)) return null;
  if (!leftRoutes.includes(route) && !rightRoutes.includes(route)) return null;
  if (left.x < 0 || right.x + right.width > pill.width + 0.5 ||
    Math.abs(left.x + left.width - gap.x) > 0.5 ||
    Math.abs(gap.x + gap.width - right.x) > 0.5) return null;

  let selected: LayoutRectangle | null = null;
  for (const routes of [leftRoutes, rightRoutes]) {
    const group = routes === leftRoutes ? left : right;
    for (const name of routes) {
      const tab = tabs[name];
      if (!isValidRect(tab) || tab.x < 0 || tab.y < 0 ||
        tab.x + tab.width > group.width + 0.5 || tab.y + tab.height > group.height + 0.5) return null;
      const rect = { x: group.x + tab.x, y: group.y + tab.y, width: tab.width, height: tab.height };
      if (rect.y < 0 || rect.y + rect.height > pill.height + 0.5 ||
        (rect.x + rect.width > gap.x + 0.5 && rect.x < gap.x + gap.width - 0.5)) return null;
      if (name === route) selected = rect;
    }
  }
  if (!selected) return null;
  const x = leftRoutes.includes(route)
    ? Math.min(selected.x, gap.x - selected.width)
    : Math.max(selected.x, gap.x + gap.width);
  return { ...selected, x, minX: 0, maxX: pill.width - selected.width, gapStart: gap.x, gapEnd: gap.x + gap.width };
}
