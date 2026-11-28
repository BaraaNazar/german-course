/**
 * AuthShell — shared chrome for every auth page (login, signup,
 * forgot/reset password): centered hero + card slot + the demo-mode
 * note. One place to restyle the whole auth family later.
 */
export default function AuthShell({ emoji, title, subtitle, children, note = true }) {
  return (
    <div className="mx-auto mt-8 w-full max-w-[420px]">
      <div className="mb-6 text-center">
        <div className="text-[40px]">{emoji}</div>
        <h1 className="mt-2 mb-1 text-2xl font-black">{title}</h1>
        <p className="m-0 text-sm text-muted">{subtitle}</p>
      </div>

      {children}

      {note && (
        <p className="mt-3.5 rounded-[10px] border border-gold-line bg-gold-soft px-3.5 py-2.5 text-[12.5px] leading-relaxed text-muted">
          ℹ️ Demo mode: accounts live in this browser (localStorage). When the backend goes online,
          existing accounts will be migrated — your learning progress is saved locally either way.
        </p>
      )}
    </div>
  )
}
