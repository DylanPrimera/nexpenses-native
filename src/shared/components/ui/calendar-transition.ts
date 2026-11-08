export type CalendarTransition = {
  month: string;
  target: string;
  phase: "idle" | "slide";
  direction: number;
  position: number;
  revision: number;
  publish: boolean;
};

type Action =
  | { type: "navigate"; target: string; publish: boolean }
  | { type: "jump"; target: string; publish: boolean; revision?: number }
  | { type: "finish" | "cancel"; revision: number };

export function initialCalendarTransition(month: string): CalendarTransition {
  return {
    month,
    target: month,
    phase: "idle",
    direction: 0,
    position: 0,
    revision: 0,
    publish: false,
  };
}

export function calendarTransition(state: CalendarTransition, action: Action): CalendarTransition {
  if (action.type === "jump") {
    if (action.revision !== undefined && action.revision !== state.revision) return state;
    const direction = action.target === state.month ? 0 : action.target > state.month ? 1 : -1;
    return {
      ...initialCalendarTransition(action.target),
      position: state.position + direction,
      revision: state.revision + 1,
      publish: action.publish,
    };
  }
  if (action.type === "navigate") {
    if (action.target === state.target) return state;
    const direction = action.target === state.month ? 0 : action.target > state.month ? 1 : -1;
    return {
      ...state,
      target: action.target,
      phase: "slide",
      direction,
      revision: state.revision + 1,
      publish: action.publish,
    };
  }
  if (action.revision !== state.revision || state.phase !== "slide") return state;
  if (action.type === "finish") {
    return {
      ...state,
      month: state.target,
      position: state.position + state.direction,
      phase: "idle",
    };
  }
  return { ...state, target: state.month, phase: "idle", publish: false };
}
