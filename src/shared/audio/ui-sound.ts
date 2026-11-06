import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { UI_SOUND_SOURCES, type UiSoundName } from "./ui-sound-assets";

const players: Partial<Record<UiSoundName, AudioPlayer>> = {};
let audioModeReady = false;
let enabled = true;

function ensureAudioMode() {
  if (audioModeReady) return;
  audioModeReady = true;
  void setAudioModeAsync({
    playsInSilentMode: false,
    interruptionMode: "mixWithOthers",
    shouldPlayInBackground: false,
  }).catch(() => {
    audioModeReady = false;
  });
}

function getPlayer(name: UiSoundName) {
  let player = players[name];
  if (!player) {
    player = createAudioPlayer(UI_SOUND_SOURCES[name]);
    players[name] = player;
  }
  return player;
}

export function playUiSound(name: UiSoundName) {
  if (!enabled) return;
  try {
    ensureAudioMode();
    const player = getPlayer(name);
    void player.seekTo(0).then(() => player.play(), () => player.play());
  } catch {
    return;
  }
}

export function setUiSoundEnabled(value: boolean) {
  enabled = value;
}

export const playModalOpen = () => playUiSound("open");
export const playModalClose = () => playUiSound("close");
export const playPressSound = () => playUiSound("press");
export const playSuccessSound = () => playUiSound("success");
export const playErrorSound = () => playUiSound("error");
