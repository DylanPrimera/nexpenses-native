export const TOUR_TARGETS = {
  budget: "dashboard-budget",
  recent: "dashboard-recent",
  fab: "nav-add",
  avatar: "header-avatar",
} as const;

export function navTourTarget(route: string) {
  return `nav-${route}`;
}
