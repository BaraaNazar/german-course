import { speakGerman } from '../utils/speech'

/** 🔊 button that pronounces German text via the TTS engine. */
export default function SpeakButton({ text, label = '🔊' }) {
  return (
    <button
      type="button"
      className="speak-btn"
      aria-label={`Pronounce: ${text}`}
      onClick={(e) => {
        e.stopPropagation() // do not flip cards / trigger parent click handlers
        speakGerman(text)
      }}
    >
      {label}
    </button>
  )
}
