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
    unlocked = false;
  }

  // Warm up speech synthesis voices after a gesture
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
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

/** Speak site names, e.g. "New withdrawals in Fortune NFT". */
export function speakNewWithdrawalsAnnouncement(siteTitles: string[]): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (siteTitles.length === 0) return;

  const text =
    siteTitles.length === 1
      ? `New withdrawals in ${siteTitles[0]}`
      : `New withdrawals in ${siteTitles.slice(0, -1).join(", ")}, and ${siteTitles[siteTitles.length - 1]}`;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Failed to speak notification", err);
  }
}

/** Chime + spoken site announcement. */
export async function notifyNewWithdrawals(siteTitles: string[]): Promise<void> {
  if (siteTitles.length === 0) return;

  await playNewWithdrawalSound();

  // Let the chime start before speech
  window.setTimeout(() => {
    speakNewWithdrawalsAnnouncement(siteTitles);
  }, 350);
}

export function isNotificationSoundUnlocked(): boolean {
  return unlocked;
}
