/**
 * Text-to-speech for German words and sentences.
 *
 * Strategy (same as the original app):
 *  1. Preferred: Google Translate TTS endpoint — a native-sounding German
 *     voice with no setup. It can fail (offline, blocked, CORS) because it
 *     is an undocumented endpoint, so we always keep a fallback.
 *  2. Fallback: the browser's built-in `speechSynthesis` with whichever
 *     German voice the OS provides.
 *
 * Only one utterance plays at a time: starting a new one cancels the old.
 */

let cachedGermanVoice = null
let currentAudio = null

// Voice lists load asynchronously in most browsers — cache the German voice
// once it appears and re-resolve if the list changes later.
function resolveGermanVoice() {
  if (!('speechSynthesis' in window)) return
  const voices = window.speechSynthesis.getVoices()
  cachedGermanVoice =
    voices.find(v => v.lang.startsWith('de') && v.localService) ??
    voices.find(v => v.lang.startsWith('de')) ??
    null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  resolveGermanVoice()
  window.speechSynthesis.onvoiceschanged = resolveGermanVoice
}

export function speakGerman(text) {
  // Stop whatever is currently playing.
  if (currentAudio) { currentAudio.pause(); currentAudio = null }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()

  const url =
    'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=de&q=' +
    encodeURIComponent(text)

  const audio = new Audio(url)
  audio.volume = 1.0
  audio.play()
    .then(() => { currentAudio = audio })
    .catch(() => {
      // Endpoint failed → system voice fallback.
      if (!('speechSynthesis' in window)) return
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'de-DE'
      utterance.rate = 0.85
      if (cachedGermanVoice) utterance.voice = cachedGermanVoice
      window.speechSynthesis.speak(utterance)
    })
}
