# CURRICULUM-INTERAKTIV.md — Deutsch A1 → C2 · Track 1 „Kursraum“ (Source of Truth)

**Approach:** interactive HTML lessons in `lessons/` — browser quizzes with immediate auto-correction, TTS audio buttons, flashcards. German-first language mix. The bilingual text track lives in [../textkurs/CURRICULUM.md](../textkurs/CURRICULUM.md) · Hybrid: [../hybrid/CURRICULUM.md](../hybrid/CURRICULUM.md).

Personal curriculum for Baraa. The `teach` skill delivers these lessons one at a time, in order, as HTML files in `lessons/` named by curriculum ID. `kursraum/index.html` is the visual map of this file (workspace hub: `../index.html`). **This architecture is approved — do not silently restructure it.** Remediation is added as extra review/practice, never by rewriting the roadmap.

Sessions per unit: 8 = 7 lessons + 1 review/unit-test (C2: 6 = 5 + 1). Level exams follow each level. Totals: **498 sessions + 6 level exams**.

---

## 0. Course rules

- Learning loop per lesson: **understand → notice → retrieve → produce → feedback → review → reuse**
- Skills always in parallel: vocab · grammar · listening · speaking · reading · writing · pronunciation
- Reviews every 4–6 lessons (the L8 sessions) + module reviews + level reviews; SRS intervals 1/3/7/14/30/60+ days (ledger: `learning-records/REVIEW-SCHEDULE.md`)
- Vocab contextual: article + noun + plural + chunk + sentence (`der Termin, die Termine — einen Termin vereinbaren — Ich möchte einen Termin vereinbaren.`)
- Language mix: A1 German+English → B1/B2 mostly German → C1/C2 German by default
- Advancement: demonstrated competence (see per-level criteria), never lesson count
- Companions: DW Nicos Weg (A1–B1, topic-mapped per lesson) · Easy German (A2+ listening) · Lingolia/YourDailyGerman (targeted remediation) · tutor/AI conversation (weekly from A1-M1) · Goethe materials (final units of each level only)

## 0.1 Grammar progression (introduction → consolidation)

| Concept | Introduced | Consolidated |
|---|---|---|
| SVO + w-questions; sein/heißen ich-du-Sie | A1-M1-U1 | A1-M1-U2 |
| Alphabet/spelling; numbers 0–100; ja-nein questions | A1-M1-U1 | A1-M1-U2 |
| sein complete; Adjective after sein | A1-M1-U1 | A1-M1-U2 |
| Regular present (all persons); stem-change e→i, e→ie, a→ä | A1-M1-U2 | A1-M2 |
| haben; possessives; negation kein/nicht | A1-M2-U3 | A1-M2-U4 |
| Accusative (den/einen); mögen/möchten | A1-M2-U4 | A1-M3 |
| Modal verbs (möchten, können, müssen → dürfen, sollen, wollen) | A1-M2 → A1-M3 | B1 |
| Separable verbs; imperative; TeKaMoLo basics | A1-M3-U5/U6 | A2 |
| Perfekt (haben/sein, regular → irregular); war/hatte | A1-M4 | A2-M2 |
| Dative (articles/pronouns, mit/bei/nach/aus/zu/von/seit) | A2-M1-U1 | A2-M3 |
| Wechselpräpositionen wo/wohin; Präteritum sein/haben/modals | A2-M1-U2 | B1 |
| weil/dass/wenn; Konjunktiv II intro (hätte/wäre/könnte) | A2-M2 | B1-M1 |
| Comparative/superlative; ordinals | A2-M2-U4 | B1 |
| Adjective endings (definite → indefinite) | A2-M3 | B1-M2 |
| Reflexive verbs; Dativ verbs; Infinitiv zu; doch | A2-M3-U6 | B1 |
| Verb+preposition chunks; unseparable prefixes | A2-M4 | B1-M1 |
| Relative clauses; ob-questions; Genitiv basic | B1-M1 | B2 |
| Konjunktiv II full (Ratschläge) | B1-M1-U2 | B2-M1 |
| Passive (Präsens/Präteritum); um…zu/damit | B1-M2 | B2 |
| Narrative Präteritum; Plusquamperfekt; als/wann/wenn; Futur I; obwohl | B1-M3 | B2 |
| Konjunktiv II Vergangenheit; connectors trotzdem/dennoch/hingegen | B1-M4 → B2-M1 | C1 |
| Passiversatz (sein zu, sich lassen); Genitiv prepositions | B2-M1-U3 | C1 |
| Correlative connectors; Nominalstil ↔ Verbalstil | B2-M2 | C1 |
| Funktionsverbgefüge; extended participial attributes | B2-M3 | C1-M1 |
| Konjunktiv I (reported speech); attributive participles; idioms | B2-M4 | C1 |
| Register/collocation mastery; word formation | C1-M1 | C2 |
| Academic genres; citation; presentation language | C1-M2 | C2 |
| Rhetoric, debate, negotiation | C1-M3 | C2-M2 |
| Stylistic analysis, literature, regional varieties | C1-M4 → C2 | C2 |
| Modal particles; prefix semantics; idiom production | C2-M1 | C2-M4 |

## 0.2 Skill ladder (condensed)

| Level | Listening | Reading | Writing | Speaking |
|---|---|---|---|---|
| A1 | slow clear learner audio | signs, dialogs, forms | 2–5 sentences, SMS | frames + roleplay, self-intro |
| A2 | near-natural dialogs, phone audio | emails, ads, short stories | informal/formal emails | daily life, narration of routines |
| B1 | natural everyday German, simple podcasts | news, graded readers | narratives, formal complaints | opinions, stories, conversation |
| B2 | native news/discussions | journalism, essays | structured essays/reports | presentation, debate, negotiation |
| C1 | lectures, registers | academic/literary | papers, professional docs | fluent discussion, expert talks |
| C2 | fast multi-speaker, humor, dialects | literature, Feuilleton | nuanced, stylistically controlled | near-native nuance & rhetoric |

Pronunciation ladder: A1 alphabet/umlauts/[ç]/vowel length/final devoicing → A2 compounds, -ig/-er, shadowing → B1 rhythm/weak forms → B2 fast speech (ham wa) → C1 precision, rhetorical stress → C2 regional comprehension.

---

# LEVEL A1 — Durchstarten
**Goal:** survive and connect — introduce yourself, spell, order, shop, tell time, ask directions, talk about last weekend.
**~64 sessions + A1 exam · ~70 h guided · 4 modules.**

## A1-M1 · Erste Schritte
### A1-M1-U1 · Hallo! Sich vorstellen *(sein/heißen, alphabet, numbers 0–12, du/Sie)*
L1 Guten Tag! – Sich vorstellen · L2 Das Alphabet – Wie schreibt man das? · L3 Zahlen 0–12 & Telefonnummern · L4 Wie geht's? · L5 du oder Sie? · L6 Ich, du, wir – sein komplett · L7 Wer bist du? (Konsolidierung) · L8 Review + Unit Test
### A1-M1-U2 · Woher? Regelmäßige Verben *(kommen/wohnen paradigm, strong verbs, w-questions, numbers 13–100)*
L1 Woher kommst du? · L2 Ich wohne in Berlin · L3 Ich spreche Deutsch · L4 Wie alt bist du? – Zahlen 13–100 · L5 Fahren, lesen, essen – starke Verben · L6 Wer? Was? Wo? – Fragen · L7 Steckbrief: Wer bin ich? (Modul-Projekt) · L8 Review + Unit Test → **Modul-Review M1**

## A1-M2 · Alltag & Familie
### A1-M2-U3 · Familie & Freizeit *(haben, possessives, kein, modal verbs I)*
L1 Meine Familie · L2 mein, dein, Ihr · L3 haben & Negation kein · L4 Hobbys & gern · L5 Essen & Trinken · L6 Im Café · L7 Einkaufen & Preise · L8 Review + Unit Test
### A1-M2-U4 · Bestellen & Akkusativ *(accusative den/einen, mögen/möchten, numbers to 1000)*
L1 Im Restaurant · L2 Akkusativ: den & einen · L3 mögen & möchten · L4 Zahlen bis 1.000 · L5 Beim Bäcker · L6 Supermarkt & Mengen · L7 Grüße aus dem Café (Schreiben) · L8 Review + Unit Test → **Modul-Review M2**

## A1-M3 · Zeit & Stadt
### A1-M3-U5 · Uhrzeit & Termine *(separable verbs, TeKaMoLo, dürfen/sollen)*
L1 Wie spät ist es? · L2 Uhrzeit: halb & Viertel · L3 Tage, Wochen, Monate · L4 Trennbare Verben · L5 Mein Tag – Wortstellung · L6 Termine machen & anrufen · L7 dürfen & sollen · L8 Review + Unit Test
### A1-M3-U6 · Stadt & Wege *(imperative, transport, wollen)*
L1 In der Stadt – Orte · L2 Wegbeschreibung · L3 Imperativ · L4 Verkehrsmittel · L5 Am Bahnhof – Ticket kaufen · L6 wollen & Pläne · L7 Stadt-Rallye (Konsolidierung) · L8 Review + Unit Test → **Modul-Review M3**

## A1-M4 · Was hast du gemacht?
### A1-M4-U7 · Perfekt – Freizeit früher *(Perfekt haben/sein, participles)*
L1 Perfekt mit haben · L2 Partizip II (regelmäßig) · L3 Perfekt mit sein · L4 Bewegungsverben · L5 Was hast du gemacht? (unregelmäßig) · L6 Wochenende erzählen · L7 SMS & kurze Nachrichten · L8 Review + Unit Test
### A1-M4-U8 · Gesundheit & Abschluss *(doctor, war/hatte, exam training)*
L1 Beim Arzt – der Körper · L2 Symptome & Ratschläge · L3 gesund & ungesund · L4 war & hatte · L5 Dialog beim Arzt · L6 Prüfungstraining: Lesen · L7 Prüfungstraining: Hören & Sprechen · L8 Review + Unit Test

**A1 ABSCHLUSSASSESSMENT** (Goethe Start Deutsch 1 format: Hören, Lesen, Schreiben, Sprechen)
**Aufstieg A1→A2:** ≥80% overall; Perfekt + accusative + modals demonstrably usable; 1–2 min recorded self-presentation; slow A1 audio understood; short messages written; no unremediated weakness.

---

# LEVEL A2 — Alltag meistern
**Goal:** everyday independence — routines, housing, travel, feelings, work basics, offices. **~64 sessions + exam · ~75 h · 4 modules.**

## A2-M1 · Wohnen & Stadt
- **U1 Wohnung & Möbel (Dativ):** L1 Wohnungsanzeigen · L2 Möbel & Räume · L3 Dativ: bestimmter Artikel · L4 Dativ: mein/kein · L5 mit/bei/nach/aus/zu/von/seit · L6 Beschwerden & Wünsche · L7 Wohnung beschreiben · L8 Review+Test
- **U2 Wechselpräpositionen & Alltag:** L1 Wo? wohin? (in/an/auf) · L2 Dativ vs. Akkusativ · L3 Positionsangaben · L4 Präteritum sein/haben · L5 Präteritum Modalverben · L6 Im Haushalt · L7 Weg und Lage erklären · L8 Review+Test

## A2-M2 · Reisen & Erfahrungen
- **U3 Reisen, Wetter, Perfekt:** L1 Reiseträume · L2 Wetter heute · L3 Wetterbericht · L4 weil-Sätze · L5 dass-Sätze · L6 Urlaubsstory erzählen · L7 Reisetagebuch (Schreiben) · L8 Review+Test
- **U4 Wünsche & Vergleiche:** L1 hätte/wäre/könnte · L2 möchte & Wünsche · L3 wenn-Sätze (real) · L4 Komparativ · L5 Superlativ · L6 Ordinalzahlen & Daten · L7 Geschenke & Pläne · L8 Review+Test

## A2-M3 · Menschen & Gefühle
- **U5 Aussehen & Kleidung:** L1 Kleidungsstücke · L2 Farben & Muster · L3 Adjektivendungen (der/die/das) · L4 Adjektive nach ein- · L5 Einkaufen (Kleidung) · L6 Personen beschreiben · L7 Modenschau (Sprechen) · L8 Review+Test
- **U6 Einladungen & Gefühle:** L1 Gefühle & Gemüt · L2 Reflexive Verben · L3 Dativ-Pronomen · L4 gefallen/passen/fehlen · L5 Infinitiv mit zu · L6 Einladen & absagen (doch!) · L7 Dialog: Verabredung · L8 Review+Test

## A2-M4 · Arbeit & Ämter
- **U7 Arbeitswelt:** L1 Berufe & Arbeitsorte · L2 Bewerbung (Textsorte) · L3 Telefonieren · L4 Termin ändern · L5 be-/ver-/er- Präfixe · L6 Verb+Präposition Chunks · L7 Vorstellungsgespräch-Rollenspiel · L8 Review+Test
- **U8 Ämter & Alltag:** L1 Bank & Post · L2 Formulare ausfüllen · L3 Beim Amt · L4 Indirekte Fragen (Chunks) · L5 Zahlen & Daten schnell · L6 Kundenverkehr · L7 A2-Prüfungstraining · L8 Review+Test

**A2 ABSCHLUSSASSESSMENT** (Goethe A2 format) · **Aufstieg:** ≥80%; dative/wechselpräpositionen/weil-wenn-Ketten korrekt produziert; Reisen & Alltag erzählt (2 Min); formelle E-Mails; A2-Hörtexte sicher.

---

# LEVEL B1 — Selbstständig kommunizieren
**Goal:** threshold fluency — opinions, workplace, stories, complaints, media. **~96 sessions + exam · ~110 h · 4 modules / 12 units.**

## B1-M1 · Beruf & Kommunikation
U1 Büro & Small Talk (Relativsätze Nom/Akk → Dativ/Präp; ob-Fragen; E-Mails; Meetings-Sprache; Konsolidierung; Review+Test — L1–L8)
U2 Probleme & Ratschläge (Konjunktiv II: würde, hätte, könnte; An deiner Stelle…; Beschwerden höflich; Konfliktgespräch; Review+Test)
U3 Genitiv & Präpositionalverben (Genitiv; wegen/trotz; Verben+Präpositionen systematisch; Worauf…?; Texte verknüpfen; Review+Test)

## B1-M2 · Konsum, Gesundheit & Umwelt
U4 Verbraucher & Reklamation (Passiv Präsens/Präteritum; von/durch; Zustandspassiv rezeptiv; Verbraucher-Debatte)
U5 Ernährung & Körper (beim Arzt B1; Ratschläge sollen; um…zu; damit; Diskussion)
U6 Umwelt & Prozesse (Prozesse im Passiv; Passiv+Modal rezeptiv; Grafikbeschreibung; Projekt: Umwelt-Tipp)

## B1-M3 · Geschichten & Medien
U7 Erzählen (Präteritum; Plusquamperfekt; als/wann/wenn; Anekdote; Schreiben: Erlebnis)
U8 Nachrichten & Futur (Futur I Pläne/Vermutungen; Schlagzeilen; Podcast; Zusammenfassen)
U9 Bildung & Konzessiv (obwohl/trotzdem/deshalb; Stellung nehmen; Diskussion; Präsentation)

## B1-M4 · Gesellschaft & Prüfung
U10 Engagement & Zusammenleben (Konjunktiv II Vergangenheit light; Redemittel; Debatte moderieren; Projekt: Mein Thema)
U11 D-A-CH & Landeskunde (Höflichkeit; Alltagskultur; Dialekt-Überblick; Rollenspiele)
U12 Prüfungstraining B1 (Goethe-Formate Lesen/Hören/Schreiben/Sprechen; Vollsimulation)

**B1 ABSCHLUSSASSESSMENT** (Goethe-Zertifikat B1 Format) · **Aufstieg:** ≥80%; Sprechen ≥75% (Präsentation + Diskussion); erzählter Text 150 Wörter; native-speed Alltagsaudio; Passiv/relativ/Konjunktiv II produktiv.

---

# LEVEL B2 — Fließend argumentieren
**Goal:** independent argumentation in media, work, science, culture. **~112 sessions + exam · ~140 h + native input · 5 modules / 14 units.**

## B2-M1 · Meinung & Argumentation
U1 Konjunktiv II komplett (irreale Wünsche; als ob; dennoch/hingegen/allerdings; Debatte I)
U2 Debatten-Sprache (These/Antithese/Beleg; Podcast-Diskussion; Widersprechen; Debatte II)
U3 Passiversatz & Genitivpräpositionen (sein zu; sich lassen; aufgrund/infolge/hinsichtlich; Nominalstil↔Verbalstil; Kommentar)

## B2-M2 · Arbeitswelt & Verhandlung
U4 Bewerbung (Anschreiben; Vorstellungsgespräch; Stärken/Schwächen; Gehaltsverhandlung)
U5 Verhandeln & Meetings (Konditionalsätze; zwar…aber; ohne…zu/statt…zu; Protokoll; Rollenspiel)
U6 Nominalstil ↔ Verbalstil (Nominalisierung; Funktionsverbgefüge I+II; Business-E-Mails; Berichte)

## B2-M3 · Wissenschaft & Technik
U7 Daten & Grafiken (Statistiken; Trends; Vortrag halten I+II)
U8 Akademische Texte (Zitieren & Paraphrasieren; erweiterte Partizipien rezeptiv; Lesestrategien)
U9 Zukunftsthemen (KI, Energie; Pro/Contra-Essay; Feedback & Revision)

## B2-M4 · Kultur, Psychologie & Medien
U10 Konjunktiv I & Presse (Redewiedergabe; Nachrichtenanalyse; Partizipialattribute; Idiome)
U11 Emotionen & Literatur (Nuanzierte Meinungen; Ironie; Film & Buchkreis)
U12 Interkulturelles (Höflichkeitssysteme; Konflikt schlichten; Projekt Kulturvergleich)

## B2-M5 · Prüfungstraining B2
U13 Lesen & Hören (Formate I+II; Zeitmanagement) · U14 Schreiben & Sprechen (Stellungnahme; Vortrag & Diskussion; Vollsimulationen I+II)

**B2 ABSCHLUSSASSESSMENT** (Goethe B2 Format) · **Aufstieg:** ≥80%; 250-Wörter-Essay; 10-Min-Präsentation + Verteidigung; native-speed Nachrichten/Debatten; Konjunktiv I/II + Passiversatz produktiv.

---

# LEVEL C1 — Studium, Beruf & Stil
**Goal:** professional & academic German, style control. **~96 sessions + exam · ~130 h + heavy native input · 4 modules / 12 units.**

## C1-M1 · Stil & Ausdruck
U1 Register & Kollokationen (gehoben/neutral/umgangssprachlich; Synonymnuancen; Wortbildung; Stiltagebuch)
U2 Erweiterte Attribute (lesen & schreiben; Schachtelsätze; Partizipialattribute; Übersetzen stilvoll)
U3 Funktionsverbgefüge & Klarheit (Nomen-Verb; Lektorat; Textwerkstatt)

## C1-M2 · Studium & Beruf
U4 Wissenschaftliche Textsorten (Hausarbeit; Zitierweisen; Exposé; Rezension; Mini-Paper I)
U5 Präsentieren & Verhandeln (Vortrag frei; Q&A; Verhandlungsstrategien; Mini-Paper II + Vortrag)
U6 Konjunktiv I & Amtssprache (indirekte Rede nuanciert; Presse; Behörden-/Vertragssprache; Fallstudie)

## C1-M3 · Politik, Wirtschaft & Medien
U7 Rhetorik & Argumentation (rhetorische Mittel; Speechwriting; Debatte live)
U8 Wirtschaftsdeutsch (Berichte & Kennzahlen; Vertragsverhandlungen; Simulation: Boardmeeting)
U9 Feuilleton & Essayistik (Ironie & Satire; Kommentar; Film-Analyse; eigener Essay)

## C1-M4 · Literatur & C1-Prüfung
U10 Kurzprosa (Erzähltechnik; Stilmittel; Interpretation schreiben; Literaturgespräch)
U11 D-A-CH-Variationen (Österreich/Schweiz verstehen; Jugendsprache vs. Amtssprache; Dialektproben)
U12 Prüfungstraining C1 (Formate; Vollsimulationen I+II + Analyse)

**C1 ABSCHLUSSASSESSMENT** (Goethe C1 Format) · **Aufstieg:** ≥80%; 1.500-Wörter-Paper mit Quellen; 15-Min-Expertenvortrag; formelle Debatte; C2-Eingangstest Lesen/Hören bestanden.

---

# LEVEL C2 — Meisterschaft
**Goal:** near-native nuance, rhetoric, style, regional range. **~66 sessions + exam · project-heavy · 4 modules / 11 units.**

## C2-M1 · Feinheiten des Ausdrucks
U1 Synonymik & Konnotation (Wortfeldarbeit; Registerfehler; Stilübungen) · U2 Modalpartikel & Präfixverben (doch/ja/mal/eben/halt; er-/ver-/ent-) · U3 Idiomatik (Kernredewendungen; Sprichwörter; Metaphernfelder; produzieren)

## C2-M2 · Diskurs & Rhetorik
U4 Debatte & Moderation (Podiumsdiskussion; Argumentieren meisterhaft) · U5 Humor & schnelle Gespräche (Ironie produzieren; Film ohne Untertitel) · U6 Regionale Varietäten (Bairisch; Schwäbisch/Alemannisch; Österreich; Schweiz)

## C2-M3 · Literatur, Wissenschaft & Feuilleton
U7 Romanlektüre I+II & Essays (Feuilleton-Klassiker; literarische Debatte) · U8 Stilanalyse & Übersetzungsvergleich (DE/EN; Parodie & Pastiche) · U9 Wissenschaft (Fachartikel; Vorträge; Kolloquium)

## C2-M4 · Meisterprojekt & Prüfung
U10 Portfolio (Essay planen & schreiben; Vortrag erarbeiten; Generalprobe) · U11 Prüfungssimulation C2 (Formate; Vollsimulation)

**C2 ABSCHLUSSASSESSMENT** (Goethe-Zertifikat C2/GDS Format) · **Abschluss:** Portfolio angenommen (2.000+ Wörter Essay, 15-Min-Vortrag, Podiumsdiskussion) + Simulation ≥80% + empfohlene echte Goethe-C2-Prüfung.

---

## Assessment system (all levels)

Lesson quiz (5–10 items, ≥70%) → Unit Test (L8, ≥75% or remediation loop) → Modul-Review → Level Assessment (4 skills, Goethe format, ≥80%). Skills tracked separately: Hören · Sprechen · Lesen · Schreiben · Wortschatz · Grammatik · Aussprache. Remedial lessons are **added**, never restructure the map (#30 rule).

*Companion: `kursraum/index.html` shows this tree with live statuses (FILES-Liste pflegen).* 

**Stand: KOMPLETT — A1–C2.** Alle 498 Lektionen in `kursraum/lessons/` (inkl. Reviews/Unit-Tests; C2 mit 6er-Units und deutschen Dialogen). A1-M1 kuratiert; M2–C2 via `tools/gen-auto-lessons.mjs` (Packs: `tools/lesson-packs*.mjs`). Level-Prüfungen: Chat-Sitzungen.
