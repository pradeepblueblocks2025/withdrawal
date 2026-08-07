const SOUND_SRC = "/notification.wav";

let audioEl: HTMLAudioElement | null = null;
let unlocked = false;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  if (!audioEl) {
    audioEl = new Audio(SOUND_SRC);
    audioEl.preload = "auto";
    audioEl.volume = 0.85;
  }

  return audioEl;
}

/** Must run inside a user gesture (click/key) so browsers allow later playback. */
export async function unlockNotificationSound(): Promise<void> {
  const audio = getAudio();
  if (!audio) return;

  try {
    audio.muted = true;
    audio.currentTime = 0;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    unlocked = true;
  } catch {
    // Still mark unlocked attempt; play may work on next gesture.
    unlocked = false;
  }
}

export async function playNewWithdrawalSound(): Promise<void> {
  const audio = getAudio();
  if (!audio) return;

  try {
    if (!unlocked) {
      await unlockNotificationSound();
    }

    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    await audio.play();
  } catch (err) {
    console.error("Failed to play notification sound", err);
  }
}

export function isNotificationSoundUnlocked(): boolean {
  return unlocked;
}
