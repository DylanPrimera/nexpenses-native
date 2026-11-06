export const UI_SOUND_SOURCES = {
  open: require("../../../assets/sounds/modal-open.wav"),
  close: require("../../../assets/sounds/modal-close.wav"),
  press: require("../../../assets/sounds/press.wav"),
  success: require("../../../assets/sounds/success.wav"),
  error: require("../../../assets/sounds/error.wav"),
} as const;

export type UiSoundName = keyof typeof UI_SOUND_SOURCES;
