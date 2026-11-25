import { useMemo } from 'react'

/**
 * Splits a conjugated form into stem + ending so the ending can be
 * color-coded (the core learning device of the Konjugation trainer):
 *
 *   -e  → green   ·  -st → yellow   ·  -t → blue   ·  -en → purple
 *
 * Priority order matters: longer endings are checked first so "sprichst"
 * is split as sprich|st, not sprichs|t.
 */
const ENDINGS = [
  { suffix: 'st', className: 'end-st' },
  { suffix: 'en', className: 'end-en' },
  { suffix: 'e',  className: 'end-e'  },
  { suffix: 't',  className: 'end-t'  },
]

/**
 * @returns {{stem: string, suffix: string, className: string}|null}
 */
export function splitEnding(form) {
  if (!form) return null
  for (const { suffix, className } of ENDINGS) {
    if (form.endsWith(suffix) && form.length > suffix.length) {
      return { stem: form.slice(0, -suffix.length), suffix, className }
    }
  }
  return null
}

/** React node version of the old `colorEnd` string helper. */
export function EndingSpan({ form }) {
  const parts = useMemo(() => splitEnding(form), [form])
  if (!parts) return <>{form ?? ''}</>
  return (
    <>
      {parts.stem}
      <span className={`ending ${parts.className}`}>{parts.suffix}</span>
    </>
  )
}

/** Separable prefixes ("stehst auf") are drawn in the flag red. */
export function EndingWithPrefix({ form }) {
  if (!form) return null
  const [verb, prefix] = form.includes(' ') ? form.split(/ (?=\S+$)/) : [form, null]
  return (
    <>
      <EndingSpan form={verb} />
      {prefix && <span className="sep-prefix"> {prefix}</span>}
    </>
  )
}
