# 🇩🇪 Deutschkurs A1 → C2 — Interactive German Learning Platform

A complete, self-contained German learning system covering **A1 (absolute beginner) through C2 (mastery)** — no server, no database, no accounts required. Works in any browser.

## 📚 What's Inside

### 5 Learning Tracks

| Track | Approach | Lessons |
|---|---|---|
| 🏛️ **Kursraum** | Interactive HTML (audio + instant-feedback exercises) | 498 lessons |
| 📖 **Textkurs** | Text-based, bilingual (print-friendly) | 498 lessons |
| ⚡ **Hybrid** | Best of both (audio + interactive + bilingual) | 498 lessons |
| 🎧 **Pimsleur-Style** | Audio-first, anticipation-driven | 5 lessons (growing) |
| 🧠 **Vocab Trainer** | 5,000 words + flashcards + quizzes + 32 stories | 193 questions |

### Vocab Trainer Highlights
- **5,000 curated words** with article, plural, example sentence, and CEFR level (A1–C2)
- **32 reading comprehension stories** with multiple-choice questions
- **Flashcards** with spaced repetition (Again / Hard / Good / Easy)
- **MCQ quizzes** (10 / 25 / 50 questions)
- **7 milestones** from "First Words" (50 words) to "Master" (3,000+ words)
- **Audio pronunciation** via native German text-to-speech
- Progress tracked in your browser (no account needed)

## 🚀 How to Use

### Online (recommended)
Visit the hosted version:
```
https://YOURNAME.github.io/german-course/
```

### Offline
1. Download this repo as a ZIP
2. Unzip it
3. Open `index.html` in any browser

That's it. No installation, no dependencies, no build step.

## 📖 Where to Start

| If you're... | Start here |
|---|---|
| Complete beginner | `hybrid/H-A1-M1-U1-L1.html` |
| Want vocabulary practice | `vocab/index.html` → Deck 1 |
| Prefer reading | `textkurs/T-A1-M1-L1.html` (or the Textkurs index) |
| Want audio-first | `pimsleur/P01-L01.html` |
| Just exploring | Open the root `index.html` |

## 🗂️ Project Structure

```
german/
├── index.html           ← Landing page (links to everything)
├── CURRICULUM files    ← Academic source of truth (A1→C2 specs)
├── kursraum/           ← Track 1: Interactive HTML lessons
├── textkurs/           ← Track 2: Text-based lessons
├── hybrid/             ← Track 3: Combined approach
├── pimsleur/           ← Track 4: Audio-first lessons
├── vocab/              ← Track 5: 5,000-word trainer
│   ├── index.html      ← The app
│   ├── data.js         ← 5,000 words database
│   └── stories.js      ← 32 stories + 193 questions
├── assets/             ← Shared stylesheet
├── reference/          ← Grammar reference (A1)
├── learning-records/   ← Review schedule (SRS ledger)
└── tools/              ← Content generators (for maintainer)
```

## 🎨 Design System

- **Colors:** German flag (Schwarz · Rot · Gold)
- **Typography:** System font stack (no web fonts needed)
- **Article colors:** `der` = blue · `die` = red · `das` = green
- **Dark mode:** Disabled by design (light theme only)

## 🔊 Audio

Pronunciation uses Google Translate's German TTS (native-sounding) with fallback to the browser's speech synthesis. Requires internet.

## 💾 Progress & Privacy

- All progress is stored in your browser's `localStorage`
- No data is sent to any server
- No cookies, no tracking, no analytics
- Clearing browser data resets progress

## 📋 CEFR Coverage

| Level | Words | Lessons | Grammar |
|---|---|---|---|
| A1 | 855 | 64 | Present, Perfekt, Akkusativ, Modal verbs |
| A2 | 843 | 64 | Dativ, Präteritum, Adjektivendungen |
| B1 | 1,304 | 96 | Passive, Konjunktiv II, Relativsätze |
| B2 | 911 | 112 | Konjunktiv I, Nominalstil, Passiversatz |
| C1 | 969 | 96 | Erweiterte Attribute, FVG, Register |
| C2 | 118 | 66 | Idiomatik, Modalpartikel, Stilkontrolle |

## 🛠️ For Maintainers

### Updating vocabulary
1. Edit `vocab/data.js` (follow the existing format)
2. Run `node tools/gen-text-lessons.mjs` to regenerate lesson pages
3. Push to GitHub

### Updating stories
1. Edit `vocab/stories.js`
2. Push to GitHub

### Adding new lesson content
1. Edit `tools/lesson-packs*.mjs`
2. Run `node tools/gen-auto-lessons.mjs`
3. Push to GitHub

## 📄 License

MIT License — free to use, modify, and share.

## 🤝 Contributing

Found a bug? Spotted a German mistake? Open an issue or submit a pull request.
