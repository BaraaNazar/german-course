# CURRICULUM.md — Track 3 „Hybrid“ · Deutsch A1 → C2

**Der Hybridkurs vereint die Stärken beider anderen Curricula** — gleiche CEFR-Landkarte A1→C2 (1:1 gespiegelt), aber pro Lektion das beste Format:

| Komponente | Kommt aus | Im Hybrid |
|---|---|---|
| 🔊 Audio & Aussprache-Drills | Kursraum | Browser-Sprachausgabe (normal & 0.7×), Dialoge anhörbar |
| ⚡ Instant-Feedback-Übungen | Kursraum | MCQ, Lückentext, Wortstellung per Klick — sofortige Korrektur mit Erklärung |
| 📖 Bilinguale Erklärungen | Textkurs | A1/A2 englischgeführt, B1 gemischt, B2–C2 deutsch (wie Track-2-Sprachpolitik) |
| 🗺️ Mermaid-Diagramme | Textkurs | Entscheidungsbäume & Landkarten in Grammatik und Results |
| 🃏 Flashcards | beide | Flip-Karten (CSS) + Karteikarten-Decks im Ergebnis-Schritt |
| 📝 Quiz | beide | interaktives Quiz mit Auswertung + Bestehensgrenze 4/6 |
| 🎓 Prüfungen | beide | Unit-/Modul-/Level-Prüfungen im **Chat** (L8-Seiten zeigen den Hinweis) |

## Lektionsformat (H-…-L….html)

Interaktive HTML-Seite (JavaScript erlaubt): Dialog mit Audio → Vokabelkarten → **Grammatik bilingual + Mermaid-Diagramm** → Übungen mit Instant-Feedback → Aussprache-Drills → Hören → Abruf → Sprechen → Schreiben → Quiz (≥70%) → Ergebnis mit Flashcards & Review-Plan → Unit-Ende-Hinweis (Prüfung im Chat). Jede Seite: Kursposition (Level → Modul → Unit → Lektion), Navigation ← Index →, Primärquelle (Nicos Weg/leichtes Deutsch), Rückfrage-Hinweis.

## Struktur & IDs

- Ordner: `hybrid/` · Seiten: `H-A1-M1-U1-L1.html` … `H-C2-M4-U11-L6.html` (+ `H-*-EXAM`)
- 504 Lektionen/Prüfungen, identisch zur [Textkurs-Map](../textkurs/CURRICULUM.md) und zur [Kursraum-Map](../kursraum/CURRICULUM.md) (gleiche Module/Units/Titel)
- Grammatik-Datenbank geteilt: `tools/grammar-data.mjs` (58 Themen) — jede Plan-Seite trägt ihre Grammatik-Karte mit Beispielen & Diagramm
- Generator: `node tools/gen-text-lessons.mjs hybrid` (überschreibt nie autorisierte Lektionen)

## Geteilt mit den anderen Tracks

MISSION · RESOURCES · NOTES · learning-records (SRS-Ledger) · reference/ · advancement criteria (könnensbasiert, siehe Kursraum-Curriculum §Assessment). Track-Wechsel an jeder Unit-Grenze möglich; Records vermerken den Track.

## Selbstlerner-Loop

Lektion öffnen (audio-gestützt) → Übungen mit Instant-Feedback → Quiz ≥70% → im Chat „weiter“ → nächste Lektion wird generiert → Unit-Ende (L8): **Unit-Prüfung im Chat** (≥75%) → nächste Unit frei.

## Aktueller Stand

- ✅ `H-A1-M1-U1-L1.html` — **Guten Tag! – Sich vorstellen** (komplette Merged-Lektion: interaktiv + bilingual + Mermaid + Flashcards)
- 🏁 **KOMPLETT: A1–C2 — alle 498 interaktiven Lektionen sind fertig** (C2: deutsche Dialoge, Audio + Instant-Feedback). A1-M1 kuratiert; M2–C2 via Auto-Engine (`tools/lesson-packs*.mjs`)
- 📌 Die 6 Level-Prüfungen (A1–C2) finden als **Chat-Sitzungen** statt
