# CURRICULUM.md — Track 4 „Pimsleur-Style" · German A1 → B2

A **fundamentally different approach** from the other 3 tracks — based on Dr. Paul Pimsleur's scientifically proven method. This course is **audio-first, anticipation-driven, and deliberately vocabulary-limited**.

## The 4 Pimsleur Principles (implemented)

| Principle | How this course implements it |
|---|---|
| **Graduated Interval Recall** | Words reappear at precisely timed intervals: same lesson → +1 lesson → +3 → +7 → +14 → +30. No flashcards — the audio itself brings words back. |
| **Principle of Anticipation** | The engine asks *"How do you say [English]?"* → **pauses for you to speak aloud** → plays the German answer → you self-check. This pause-respond-reinforce cycle is the core interaction. |
| **Core Vocabulary** | Maximum **5 new words per lesson**. No overwhelming lists. A small foundation that grows organically — Pimsleur proves that ~500 core words enable basic fluency. |
| **Organic Learning** | Every word is introduced inside a **conversation** — never as an isolated word. Grammar is absorbed through patterns, never explained. No grammar lectures. |

## How Pimsleur-style differs from the other tracks

| | Kursraum / Textkurs / Hybrid | **Pimsleur-Style** |
|---|---|---|
| Primary skill | Reading + Visual | **Listening + Speaking** |
| Grammar | Explicitly taught | **Absorbed through patterns** |
| Vocabulary/lesson | 15-20 words | **5 words maximum** |
| Lesson length | 15-30 min | **30 min** (strict) |
| Review | Flashcards + SRS | **Built into the audio** (words return automatically) |
| Text display | Central | **Hidden by default** (audio-first; text available for reference) |
| Interaction | Quiz, exercises | **"How do you say…?" → pause → answer** |
| Best for | Building literacy | **Building spoken fluency fast** |

## Course Structure

```
Level 1 (A1)     Lessons 1-30    · Survival German: greetings, numbers, directions, basic needs
Level 2 (A2)     Lessons 31-60   · Social German: restaurants, shopping, past tense, opinions
Level 3 (A2+/B1-) Lessons 61-90  · Connected German: extended conversation, arrangements, travel
Level 4 (B1)     Lessons 91-120  · Independent German: complex situations, professional contexts
Level 5 (B1+/B2-) Lessons 121-150 · Fluent German: abstract topics, hypothetical situations
```

**Total: 150 lessons × 30 min = 75 hours**

## Lesson Format (P01-L01.html … P05-L30.html)

Each lesson is a single interactive HTML page with:

### Phase 1: Conversation Introduction (5 min)
- A short dialogue (6-10 lines) plays — all German, no translation yet
- Then the narrator (text prompt) breaks it down line by line
- Each line: German audio → pause → English meaning → German audio again

### Phase 2: Anticipation Drills (15 min)
- The core Pimsleur interaction, repeated ~20 times:
  1. 🔊 Audio: "How do you say: *I would like a coffee.*"
  2. ⏸️ **Pause** (you say it aloud in German)
  3. 🔊 Audio plays: "Ich möchte einen Kaffee."
  4. You self-check: ✓ I said it right / ✗ Not yet
- Prompts mix **new material** with **review from previous lessons** (Graduated Interval Recall)
- Grammatical patterns are embedded in the prompts (e.g., changing "ich" to "Sie" in the same sentence)

### Phase 3: Reading (5 min — from Level 2 onward)
- Short reading passage using ONLY words already learned
- Audio plays while text is shown

### Phase 4: Lesson Summary
- List of today's new words (max 5) with article + plural
- Which previous lesson words returned today (and when they'll return next)
- Link to next lesson

## Key Design Rules

1. **Never show text during Phase 2** — the anticipation pause is the whole point
2. **Max 5 new words per lesson** — resist the urge to add more
3. **Every word reviews at least 3 times across future lessons** before it's "learned"
4. **Grammar is never explained** — patterns are shown through variation:
   - "Ich möchte…" → "Möchten Sie…?" → "Er möchte…" (learner infers the pattern)
5. **30 minutes, one lesson per day** — no skipping ahead, no doubling up
6. **The pause is sacred** — 3-5 seconds minimum for the learner to speak

## Technical Implementation

- Folder: `pimsleur/`
- Files: `P{level}-L{lesson}.html` (e.g., `P01-L01.html`)
- Shared stylesheet: `../assets/styles.css`
- Audio: Browser TTS (🔊 buttons) — same as other tracks
- No grammar cards, no Mermaid diagrams, no flashcards — **pure audio + anticipation**
- Quizzes: Self-assessed only ("Did you say it correctly? ✓ / ✗")

## Relationship to Other Tracks

This track is **complementary**, not a replacement:
- Use Pimsleur-Style for **speaking confidence and listening**
- Use Hybrid/Textkurs for **grammar understanding, reading, and writing**
- They share the same vocabulary database and grammar reference
- You can study both tracks simultaneously (Pimsleur in the morning, Hybrid in the evening)

## Current Status

- 📐 Curriculum designed
- 🔨 First lesson: `pimsleur/P01-L01.html`
- 🚧 Remaining 149 lessons: generated sequentially
