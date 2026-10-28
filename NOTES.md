# NOTES.md — Teaching preferences & working conventions

**Chat language = ENGLISH (learner request, 2026-09).** The learner is a beginner (A1) — all teacher communication, explanations, status reports and instructions in chat are in English. German lives only inside the lessons themselves (bilingual per track policy).

Learner: Baraa · started from A1 (Sept 2026) · mission in [MISSION.md](MISSION.md) · Track 1 roadmap: [kursraum/CURRICULUM.md](kursraum/CURRICULUM.md) · Track 2 roadmap: [textkurs/CURRICULUM.md](textkurs/CURRICULUM.md) · Track 3 roadmap: [hybrid/CURRICULUM.md](hybrid/CURRICULUM.md)

## How to teach (permanent rules from the learner)

1. **Language mix:** A1/early A2 = German + English explanations → B1/B2 mostly German → C1/C2 almost entirely German.
2. **Curriculum = source of truth.** Never improvise a different structure; remediation is added as extra review/practice nodes, not by restructuring (Track 1: [CURRICULUM-INTERAKTIV.md](CURRICULUM-INTERAKTIV.md) · Track 2: [CURRICULUM-TEXTKURS.md](CURRICULUM-TEXTKURS.md)).
3. **Reviews** every 4–6 lessons + unit/module/level reviews. SRS intervals: same day, +1, +3, +7, +14, +30, +60, then longer. Track in [learning-records/REVIEW-SCHEDULE.md](learning-records/REVIEW-SCHEDULE.md).
4. **Advancement is skill-based**, not lesson-count- or vocab-count-based. Vocab numbers are estimates only.
5. **LERNSTAND after every lesson:** level/module/unit/lesson, completed count, vocab introduced, vocab due, grammar learned, recurring mistakes, weak areas, skill weaknesses, quiz scores, next reviews. Keep it concise; use it to adapt.
6. **Learning loop:** understand → notice → retrieve → produce → feedback → review → reuse. Never mainly-passive lessons.
7. **Vocabulary contextual:** der Termin, die Termine · einen Termin vereinbaren · "Ich möchte einen Termin vereinbaren." Nouns always with article (+ plural when relevant).
8. **All skills progress in parallel:** vocab, grammar, listening, speaking, reading, writing, pronunciation, conversation.
9. **Pronunciation must be exact:** real IPA with length marks (e.g. ich = [ɪç] with SHORT [ɪ]; Tag = [tʰaːk]). Never invent approximate rules; check Wiktionary/Duden when unsure.
10. **Interactive, one step at a time.** Never reveal quiz/exercise answers before the learner attempts.
11. **Lesson end summary:** score, what was learned, mistakes, items added to review, flashcards, optional external practice (e.g. matching Nicos Weg topic), what comes next.

## Session shape

- Essential ~20 min · Standard ~45 min · Optional 60–90 min. One teach-lesson ≈ 15–30 min, one clear win.
- Daily flashcard/SRS review runs on top (see REVIEW-SCHEDULE.md).

## Quizzes (teach-skill rules + learner rules)

- Retrieval, not recognition: MCQ, fill-in, translation, article choice, sentence building, word order, error correction, comprehension, short production.
- **Randomize the correct-answer position**; keep option lengths visually similar so formatting gives no clue.
- Immediate corrective feedback: what was wrong, why, correct version, rule, one more example.

## Workspace conventions (teach skill, adapted)

- Lessons live in `lessons/`, named by **curriculum ID** (`A1-M1-U1-L1.html`) instead of teach's default `0001-…` numbering — agreed deviation, because the curriculum index links by ID. Order is still strictly sequential via the curriculum.
- Every lesson: shows course position (Level → Module → Unit → Lesson), links ← Previous / Index / Next →, recommends one primary source, ends with the followup-question reminder.
- Shared stylesheet: [assets/styles.css](assets/styles.css) — link it from every lesson; add reusable components there, never inline duplicates.
- Reference docs (`reference/*.html`) get extracted from lessons when knowledge is stable (e.g. pronunciation.html after the sound lessons).
- Learning records: written only on **demonstrated** learning (quiz evidence, correct production), per teach-skill format `0001-slug.md`.
- `index.html` (workspace root) = visual A1–C2 curriculum index; update its status data after every completed lesson.
- No React / no app-building. Browser HTML is presentation only.

## Folder layout & three tracks (since restructure)

```
german/  (workspace hub: index.html)
├── kursraum/   Track 1 · interaktive Lektionen (lessons/, CURRICULUM.md, index.html)
├── textkurs/   Track 2 · Text-Lektionen (T-*.html, CURRICULUM.md, index.html)
├── hybrid/     Track 3 · Merged-Curriculum (H-*.html, CURRICULUM.md, index.html)
└── geteilt: MISSION · RESOURCES · NOTES · learning-records · reference · assets · tools
```

- **Track 1 · Kursraum** — interactive HTML lessons in `kursraum/lessons/` (`A1-M1-U1-L1.html`), browser quizzes, German-first language mix.
- **Track 2 · Textkurs** — text-first lessons in `textkurs/` (`T-A1-M1-U1-L1.html`) as **pure HTML/CSS reading pages (no JavaScript, print-friendly)**, bilingual English/German instruction (English-led A1–B1). **Self-learner mode (learner request, 2026-09):** lesson quizzes are **MCQ self-tests** with click-to-reveal answer keys (`<details>`, attempt-first rule); Übungen also carry keys; **unit/module/level exams happen in chat** (every L8 page shows the "come to chat for your Unit-Prüfung" note; ≥75% unlocks the next unit). Spec: [CURRICULUM-TEXTKURS.md](CURRICULUM-TEXTKURS.md).
- **Track 3 · Hybrid** (`hybrid/`, IDs `H-…`) — merges Track 1 interactivity (audio, instant feedback, quiz) with Track 2 bilingual explanations + Mermaid; spec: [hybrid/CURRICULUM.md](hybrid/CURRICULUM.md)
- The tracks are separate curricula with 1:1-mirrored CEFR maps (IDs: `A1-M1-U1-L1` ↔ `T-A1-M1-U1-L1` ↔ `H-A1-M1-U1-L1`), share learning-records, SRS ledger and advancement criteria, and can be switched at unit boundaries. Records note which track delivered a lesson.
- Rule 1 (language mix) applies to Track 1; Track 2 keeps English support longer by design (learner request).

## Open TODOs

- [ ] Choose human tutor / Tandem partner by end of A1-M1.
- [ ] Pick a B1 graded reader when B1 approaches.
- [ ] `npx skills add` failed once due to Xcode license; skill already installed at `~/.agents/skills/teach/` — no action needed unless it must be updated.
