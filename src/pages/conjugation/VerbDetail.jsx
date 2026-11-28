import { PRONOUNS, KEYS, TENSES } from './conjugation-table'
import { EndingWithPrefix } from '../../utils/endings'
import { useConjugationProgress } from '../../context/ProgressContext'
import SpeakButton from '../../components/SpeakButton'

/**
 * VerbDetail — the conjugation table for a single verb:
 * Präsens + Präteritum (all 6 persons, endings color-coded) and the
 * Perfekt auxiliary + participle. Includes the "mark as mastered" toggle.
 */
export default function VerbDetail({ verb, known }) {
  const { toggleKnown } = useConjugationProgress()
  if (!verb) return null

  const info = verb.type && TYPE_COLORS[verb.type]

  return (
    <>
      <div className="card">
        <h2 className="m-0 mb-1 text-xl">
          {verb.inf}
          {info && (
            <span
              className="ml-1.5 rounded-[5px] px-2 py-0.5 align-middle text-[10px] font-extrabold tracking-wide uppercase"
              style={{ background: `${info}20`, color: info }}
            >
              {verb.type}
            </span>
          )}
        </h2>
        <p className="m-0 mb-1.5 text-sm text-muted">{verb.en}</p>
        <span className="rounded-full bg-surface-3 px-3 py-1 text-xs font-bold text-muted">
          {verb.level}
        </span>
        <span className="ml-2 inline-block align-middle">
          <SpeakButton text={verb.inf} />
        </span>
      </div>

      {TENSES.map((tense) => (
        <div className="card" key={tense.key}>
          <h3 className="mt-0">{tense.label}</h3>
          <table className="w-full border-collapse overflow-hidden rounded-xl shadow-1">
            <thead>
              <tr className="bg-flag-black text-left text-gold">
                <th className="px-3.5 py-2.5 text-[11px] tracking-wider uppercase">Person</th>
                <th className="px-3.5 py-2.5 text-[11px] tracking-wider uppercase">Form</th>
              </tr>
            </thead>
            <tbody>
              {PRONOUNS.map((pron, i) => (
                <tr key={pron} className="border-b border-line last:border-b-0">
                  <td className="w-[100px] bg-gold-soft px-3.5 py-2.5 text-[13px] font-extrabold text-muted">
                    {pron}
                  </td>
                  <td className="px-3.5 py-2.5 text-[18px] font-bold">
                    <EndingWithPrefix form={tense.get(verb)[KEYS[i]]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Perfekt: auxiliary + participle */}
      <div className="card">
        <h3 className="mt-0">Perfekt</h3>
        <table className="w-full border-collapse overflow-hidden rounded-xl shadow-1">
          <tbody>
            <tr>
              <td className="w-[100px] bg-gold-soft px-3.5 py-2.5 text-[13px] font-extrabold text-muted">
                ich
              </td>
              <td className="px-3.5 py-2.5 text-[18px] font-bold">
                {verb.aux} <span className="text-primary">{verb.partizip}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <button
          className={`btn btn-lg ${known ? 'btn-good' : 'btn-ghost'}`}
          onClick={() => toggleKnown(verb.inf)}
        >
          {known ? '✓ Mastered' : 'Mark as mastered'}
        </button>
      </div>
    </>
  )
}

const TYPE_COLORS = {
  regular: '#16a34a',
  strong: '#ea580c',
  irregular: '#dc2626',
  modal: '#7c3aed',
  separable: '#0891b2',
  inseparable: '#0d9488',
  reflexive: '#be185d',
}
