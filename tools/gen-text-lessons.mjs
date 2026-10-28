// Generates the Textkurs lesson scaffold: text-lessons/index.html + one plan page
// per lesson/exam from A1 to C2. Authored (non-scaffold) files are never overwritten.
// Run: node tools/gen-text-lessons.mjs            → Textkurs (folder: textkurs/)
//      node tools/gen-text-lessons.mjs hybrid     → Hybridkurs (folder: hybrid/)
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { TOPICS, UNIT_TOPICS, LEVEL_RECAP } from "./grammar-data.mjs";

function diagram(d){
  if(!d) return "";
  if(d.k==="dec") return 'flowchart TD\n    A["'+d.q+'"] -->|Ja| B["'+d.y+'"]\n    A -->|Nein| C["'+d.n+'"]\n    style B fill:#e8f7ef,stroke:#188a4b\n    style C fill:#eef4ff,stroke:#2563eb';
  if(d.k==="two") return 'flowchart TD\n    A["'+d.q+'"] -->|'+d.la+'| B["'+d.a+'"]\n    A -->|'+d.lb+'| C["'+d.b+'"]\n    style B fill:#e8f7ef,stroke:#188a4b\n    style C fill:#eef4ff,stroke:#2563eb';
  if(d.k==="chain"){
    const nodes = d.s.map((x,i)=>'    N'+(i+1)+'["'+x+'"]').join('\n');
    const links = d.s.slice(1).map((_,i)=>'    N'+(i+1)+' --> N'+(i+2)).join('\n');
    return 'flowchart LR\n'+nodes+'\n'+links;
  }
  return "";
}
function topicsFor(e){
  if(e.unit && UNIT_TOPICS[e.unit] && UNIT_TOPICS[e.unit].length) return UNIT_TOPICS[e.unit];
  return LEVEL_RECAP[e.level] || [];
}
function topicCardHTML(id){
  const t = TOPICS[id]; if(!t) return "";
  let h = '  <div class="card">\n    <h3>'+t.t+' <span class="pill pill-lesson" style="margin-left:6px">'+t.lv+'</span></h3>\n';
  h += '    <p>'+t.m+'</p>\n    <p class="pattern-note">Muster: '+t.p+'</p>\n';
  (t.ex||[]).forEach(x=>{
    h += '    <div class="ex-line"><div><div class="de">'+x[0]+'</div>'+(x[1]?'<div class="en">'+x[1]+'</div>':'')+'</div></div>\n';
  });
  if(t.ms) h += '    <div class="mistake-box"><span class="wrong">✗ '+t.ms.w+'</span> → <span class="right">'+t.ms.r+'</span><div class="small">'+t.ms.why+'</div></div>\n';
  if(t.d) h += '    <div class="mermaid-box"><div class="cap">Diagramm</div>\n      <pre class="mermaid">\n'+diagram(t.d)+'\n      </pre>\n    </div>\n';
  h += '  </div>\n';
  return h;
}
function topicCards(e){
  return topicsFor(e).map(topicCardHTML).join("");
}

const TREE = [
{id:"A1",name:"Beginner · Durchstarten",modules:[
 {id:"A1-M1",title:"Modul 1 · Erste Schritte",units:[
  {id:"A1-M1-U1",title:"Unit 1 · Hallo! Sich vorstellen",ls:["Guten Tag! – Sich vorstellen","Das Alphabet – Wie schreibt man das?","Zahlen 0–12 & Telefonnummern","Wie geht's?","du oder Sie?","Ich, du, wir – sein komplett","Wer bist du? – Konsolidierung","Review + Unit Test"]},
  {id:"A1-M1-U2",title:"Unit 2 · Woher? Regelmäßige Verben",ls:["Woher kommst du?","Ich wohne in Berlin","Ich spreche Deutsch","Wie alt bist du? – Zahlen 13–100","Fahren, lesen, essen – starke Verben","Wer? Was? Wo? – Fragen","Steckbrief: Wer bin ich?","Review + Unit Test"]}]},
 {id:"A1-M2",title:"Modul 2 · Alltag & Familie",units:[
  {id:"A1-M2-U3",title:"Unit 3 · Familie & Freizeit",ls:["Meine Familie","mein, dein, Ihr","haben & Negation kein","Hobbys & gern","Essen & Trinken","Im Café","Einkaufen & Preise","Review + Unit Test"]},
  {id:"A1-M2-U4",title:"Unit 4 · Bestellen & Akkusativ",ls:["Im Restaurant","Akkusativ: den & einen","mögen & möchten","Zahlen bis 1.000","Beim Bäcker","Supermarkt & Mengen","Grüße aus dem Café (Schreiben)","Review + Unit Test"]}]},
 {id:"A1-M3",title:"Modul 3 · Zeit & Stadt",units:[
  {id:"A1-M3-U5",title:"Unit 5 · Uhrzeit & Termine",ls:["Wie spät ist es?","Uhrzeit: halb & Viertel","Tage, Wochen, Monate","Trennbare Verben","Mein Tag – Wortstellung","Termine machen & anrufen","dürfen & sollen","Review + Unit Test"]},
  {id:"A1-M3-U6",title:"Unit 6 · Stadt & Wege",ls:["In der Stadt – Orte","Wegbeschreibung","Imperativ","Verkehrsmittel","Am Bahnhof – Ticket kaufen","wollen & Pläne","Stadt-Rallye (Konsolidierung)","Review + Unit Test"]}]},
 {id:"A1-M4",title:"Modul 4 · Was hast du gemacht?",units:[
  {id:"A1-M4-U7",title:"Unit 7 · Perfekt – Freizeit früher",ls:["Perfekt mit haben","Partizip II (regelmäßig)","Perfekt mit sein","Bewegungsverben","Was hast du gemacht? (unregelmäßig)","Wochenende erzählen","SMS & kurze Nachrichten","Review + Unit Test"]},
  {id:"A1-M4-U8",title:"Unit 8 · Gesundheit & Abschluss",ls:["Beim Arzt – der Körper","Symptome & Ratschläge","gesund & ungesund","war & hatte","Dialog beim Arzt","Prüfungstraining: Lesen","Prüfungstraining: Hören & Sprechen","Review + Unit Test"]}]},
 {exam:"A1-EXAM",title:"A1 Abschlussexamen (Goethe-Format)"}]},

{id:"A2",name:"Elementary · Alltag meistern",modules:[
 {id:"A2-M1",title:"Modul 1 · Wohnen & Stadt",units:[
  {id:"A2-M1-U1",title:"Unit 1 · Wohnung & Möbel (Dativ)",ls:["Wohnungsanzeigen","Möbel & Räume","Dativ: bestimmter Artikel","Dativ: mein / kein","mit, bei, nach, aus, zu, von, seit","Beschwerden & Wünsche","Wohnung beschreiben","Review + Unit Test"]},
  {id:"A2-M1-U2",title:"Unit 2 · Wechselpräpositionen & Alltag",ls:["Wo? wohin? (in, an, auf)","Dativ vs. Akkusativ","Positionsangaben","Präteritum: sein & haben","Präteritum: Modalverben","Im Haushalt","Weg und Lage erklären","Review + Unit Test"]}]},
 {id:"A2-M2",title:"Modul 2 · Reisen & Erfahrungen",units:[
  {id:"A2-M2-U3",title:"Unit 3 · Reisen, Wetter, Perfekt",ls:["Reiseträume","Wetter heute","Wetterbericht","weil-Sätze","dass-Sätze","Urlaubsstory erzählen","Reisetagebuch (Schreiben)","Review + Unit Test"]},
  {id:"A2-M2-U4",title:"Unit 4 · Wünsche & Vergleiche (Konjunktiv II, Komparativ)",ls:["hätte / wäre / könnte","möchte & Wünsche","wenn-Sätze (real)","Komparativ","Superlativ","Ordinalzahlen & Daten","Geschenke & Pläne","Review + Unit Test"]}]},
 {id:"A2-M3",title:"Modul 3 · Menschen & Gefühle",units:[
  {id:"A2-M3-U5",title:"Unit 5 · Aussehen & Kleidung (Adjektivendungen)",ls:["Kleidungsstücke","Farben & Muster","Adjektivendungen: der/die/das","Adjektive nach ein-","Einkaufen (Kleidung)","Personen beschreiben","Modenschau (Sprechen)","Review + Unit Test"]},
  {id:"A2-M3-U6",title:"Unit 6 · Einladungen & Gefühle (Reflexive, Dativ-Verben)",ls:["Gefühle & Gemüt","Reflexive Verben","Dativ-Pronomen","gefallen, passen, fehlen","Infinitiv mit zu","Einladen & absagen (doch!)","Dialog: Verabredung","Review + Unit Test"]}]},
 {id:"A2-M4",title:"Modul 4 · Arbeit & Ämter",units:[
  {id:"A2-M4-U7",title:"Unit 7 · Arbeitswelt & Bewerbung",ls:["Berufe & Arbeitsorte","Bewerbung (Textsorte)","Telefonieren","Termin ändern","be-, ver-, er- (Präfixe)","Verb + Präposition (Chunks)","Vorstellungsgespräch-Rollenspiel","Review + Unit Test"]},
  {id:"A2-M4-U8",title:"Unit 8 · Ämter & Alltag + A2-Examen",ls:["Bank & Post","Formulare ausfüllen","Beim Amt","Indirekte Fragen (Chunks)","Zahlen & Daten schnell","Kundenverkehr","A2-Prüfungstraining","Review + Unit Test"]}]},
 {exam:"A2-EXAM",title:"A2 Abschlussexamen (Goethe-Format)"}]},

{id:"B1",name:"Intermediate · Selbstständig kommunizieren",modules:[
 {id:"B1-M1",title:"Modul 1 · Beruf & Kommunikation",units:[
  {id:"B1-M1-U1",title:"Unit 1 · Büro & Small Talk (Relativsätze)",ls:["Büro & Kollegen","Small Talk","Relativsätze: Nominativ & Akkusativ","Relativsätze: Dativ & Präpositionen","ob-Fragen & indirekte Fragen","E-Mails im Job","Meetings-Sprache","Review + Unit Test"]},
  {id:"B1-M1-U2",title:"Unit 2 · Probleme & Ratschläge (Konjunktiv II)",ls:["Probleme schildern","Konjunktiv II: würde","Ratschläge: hätte / könnte / wäre","An deiner Stelle …","Beschwerden höflich","Konfliktgespräch","Höflichkeit im Beruf","Review + Unit Test"]},
  {id:"B1-M1-U3",title:"Unit 3 · Genitiv & Präpositionalverben",ls:["Genitiv: Grundformen","wegen / trotz + Genitiv","Verben mit Präpositionen","Worauf wartest du? (Präp.-Fragen)","Nominalisierung (leicht)","Texte verknüpfen","Konsolidierung: Bürofall","Review + Unit Test"]}]},
 {id:"B1-M2",title:"Modul 2 · Konsum, Gesundheit & Umwelt",units:[
  {id:"B1-M2-U4",title:"Unit 4 · Verbraucher & Reklamation (Passiv)",ls:["Reklamation","Passiv: Präsens","Passiv: Präteritum","von & durch","Zustandspassiv (hören/lesen)","Rechte als Verbraucher","Verbraucher-Debatte","Review + Unit Test"]},
  {id:"B1-M2-U5",title:"Unit 5 · Ernährung & Körper",ls:["Körper & Gesundheit","Ernährung","Beim Arzt (B1)","Ratschläge mit sollen","um … zu","damit","Gesund leben – Diskussion","Review + Unit Test"]},
  {id:"B1-M2-U6",title:"Unit 6 · Umwelt & Prozesse (um…zu / damit)",ls:["Umwelt im Alltag","Recycling & Prozesse","Prozesse beschreiben (Passiv)","Passiv mit Modalverben (rezeptiv)","Grafik beschreiben","Nachhaltigkeit diskutieren","Projekt: Umwelt-Tipp","Review + Unit Test"]}]},
 {id:"B1-M3",title:"Modul 3 · Geschichten & Medien",units:[
  {id:"B1-M3-U7",title:"Unit 7 · Erzählen (Präteritum, Plusquamperfekt)",ls:["Geschichten eröffnen","Präteritum erzählen","Plusquamperfekt","als / wann / wenn","Zeitmarker: danach, schließlich","Anekdote erzählen","Schreiben: Ein Erlebnis","Review + Unit Test"]},
  {id:"B1-M3-U8",title:"Unit 8 · Nachrichten & Futur",ls:["Nachrichten verstehen","Futur I: Pläne","Futur I: Vermutungen","Schlagzeilen & Medien-Vokabular","Nachrichten vergleichen","Podcast hören","Nachrichten zusammenfassen","Review + Unit Test"]},
  {id:"B1-M3-U9",title:"Unit 9 · Bildung & obwohl/trotzdem",ls:["Schule & Ausbildung","obwohl","trotzdem / deshalb","Stellung nehmen","Bildung in D-A-CH","Diskussion: Bildung","Präsentation halten","Review + Unit Test"]}]},
 {id:"B1-M4",title:"Modul 4 · Gesellschaft & B1-Prüfung",units:[
  {id:"B1-M4-U10",title:"Unit 10 · Engagement & Zusammenleben",ls:["Ehrenamt & Engagement","Generationen","Zusammenleben","Konjunktiv II: Vergangenheit","Redemittel Diskussion","Debatte moderieren","Projekt: Mein Thema","Review + Unit Test"]},
  {id:"B1-M4-U11",title:"Unit 11 · D-A-CH & Landeskunde",ls:["Landeskunde D-A-CH","Höflichkeitsunterschiede","Alltagskultur vergleichen","Dialekte hören (Überblick)","Interkulturelle Missverständnisse","Rollenspiel Alltag","Kultur-Quiz","Review + Unit Test"]},
  {id:"B1-M4-U12",title:"Unit 12 · Prüfungstraining B1",ls:["Goethe B1: Lesen","Lesen: Strategien","Hören: Format","Schreiben: Format","Sprechen: Teil 1","Sprechen: Teil 2+3","Vollsimulation","Review + Unit Test"]}]},
 {exam:"B1-EXAM",title:"B1 Abschlussexamen (Goethe-Zertifikat B1)"}]},

{id:"B2",name:"Upper Intermediate · Fließend argumentieren",modules:[
 {id:"B2-M1",title:"Modul 1 · Meinung & Argumentation",units:[
  {id:"B2-M1-U1",title:"Unit 1 · Konjunktiv II komplett & Konnektoren",ls:["Meinung äußern","Konjunktiv II: System","Irreale Wünsche","als ob / als wenn","dennoch, hingegen, allerdings","Argumente wiedergeben","Debatte I","Review + Unit Test"]},
  {id:"B2-M1-U2",title:"Unit 2 · Debatten-Sprache",ls:["Diskussionsrunde","Argumente strukturieren","These – Antithese – Beleg","Genaues Hören: Meinungen","Podcast diskutieren","Zusammenfassen & widersprechen","Debatte II","Review + Unit Test"]},
  {id:"B2-M1-U3",title:"Unit 3 · Passiversatz & Genitivpräpositionen",ls:["Passiversatz: sein zu","sich lassen","aufgrund / infolge / hinsichtlich","Nominalstil erkennen","Texte „entrumpeln“ (Verbalstil)","Fachtext lesen","Anwendung: Kommentar","Review + Unit Test"]}]},
 {id:"B2-M2",title:"Modul 2 · Arbeitswelt & Verhandlung",units:[
  {id:"B2-M2-U4",title:"Unit 4 · Bewerbung & Vorstellungsgespräch",ls:["Arbeitsmarkt-Wortschatz","Anschreiben perfekt","Vorstellungsgespräch","Stärken & Schwächen","Gehalt verhandeln","sowohl … als auch / weder … noch","Bewerbungs-Simulation","Review + Unit Test"]},
  {id:"B2-M2-U5",title:"Unit 5 · Verhandeln & Korrelativ-Konnektoren",ls:["Verhandlungssprache","Konditionalsätze","Zugeständnisse: zwar … aber","ohne … zu / statt … zu","Meetings leiten","Protokoll schreiben","Verhandlungs-Rollenspiel","Review + Unit Test"]},
  {id:"B2-M2-U6",title:"Unit 6 · Nominalstil ↔ Verbalstil",ls:["Nominalisierung gezielt","Nominalstil ↔ Verbalstil","Funktionsverbgefüge I","Funktionsverbgefüge II","Business-E-Mails","Berichte schreiben","Projekt: Reportage","Review + Unit Test"]}]},
 {id:"B2-M3",title:"Modul 3 · Wissenschaft & Technik",units:[
  {id:"B2-M3-U7",title:"Unit 7 · Grafikbeschreibung & Daten",ls:["Zahlen & Statistiken","Grafik beschreiben","Trends & Prognosen","Wissenschaftssprache","Studien verstehen","Vortrag halten I","Vortrag halten II","Review + Unit Test"]},
  {id:"B2-M3-U8",title:"Unit 8 · Akademische Texte",ls:["Akademische Textsorten","Zitieren & Paraphrasieren","Erweiterte Partizipien (lesen)","Sachtexte analysieren","Lesestrategien B2","Podcast: Wissenschaft","Zusammenfassung schreiben","Review + Unit Test"]},
  {id:"B2-M3-U9",title:"Unit 9 · Zukunftsthemen",ls:["Technikutopien","KI & Alltag","Energie & Klima","Pro/Contra-Essay","Essay schreiben II","Feedback & Revision","Diskussion: Zukunft","Review + Unit Test"]}]},
 {id:"B2-M4",title:"Modul 4 · Kultur, Psychologie & Medien",units:[
  {id:"B2-M4-U10",title:"Unit 10 · Konjunktiv I & Redewiedergabe",ls:["Konjunktiv I: Grundlagen","Redewiedergabe Presse","Indirekte Fragen & Zweifel","Nachrichten analysieren","Partizip I/II attributiv","Idiome: Alltag","Feuilleton lesen","Review + Unit Test"]},
  {id:"B2-M4-U11",title:"Unit 11 · Emotionen & Literatur",ls:["Emotionen benennen","Psychologie-Vokabular","Nuancierte Meinungen","Ironie erkennen","Literarisches Lesen","Film diskutieren","Buchkreis","Review + Unit Test"]},
  {id:"B2-M4-U12",title:"Unit 12 · Interkulturelles",ls:["Interkulturelle Kommunikation","Missverständnisse analysieren","Höflichkeitssysteme","Streit schlichten","Redewendungen: Emotionen","Rollenspiel: Konflikt","Projekt: Kulturvergleich","Review + Unit Test"]}]},
 {id:"B2-M5",title:"Modul 5 · Prüfungstraining B2",units:[
  {id:"B2-M5-U13",title:"Unit 13 · Lesen & Hören (Modulformat)",ls:["Goethe B2: Lesen I","Lesen II","Hören I","Hören II","Zeitmanagement","Schreiben I: Stellungnahme","Schreiben II","Review + Unit Test"]},
  {id:"B2-M5-U14",title:"Unit 14 · Schreiben & Sprechen (Modulformat)",ls:["Sprechen: Vortrag","Sprechen: Diskussion","Moderieren","Vollsimulation I","Fehleranalyse","Vollsimulation II","Finetuning","Review + Unit Test"]}]},
 {exam:"B2-EXAM",title:"B2 Abschlussexamen (Goethe-Zertifikat B2)"}]},

{id:"C1",name:"Advanced · Studium, Beruf & Stil",modules:[
 {id:"C1-M1",title:"Modul 1 · Stil & Ausdruck",units:[
  {id:"C1-M1-U1",title:"Unit 1 · Register & Kollokationen",ls:["Register: gehoben – neutral – umgangssprachlich","Kollokationen I","Kollokationen II","Synonymnuancen","Wortbildung: -ung/-heit/-keit","Präfixsemantik","Stiltagebuch","Review + Unit Test"]},
  {id:"C1-M1-U2",title:"Unit 2 · Erweiterte Attribute & Satzarchitektur",ls:["Erweiterte Attribute lesen","Erweiterte Attribute schreiben","Schachtelsätze entwirren","Partizipialattribute","Nominal ↔ Verbal (meisterlich)","Stilkritik","Projekt: Stilvolles Übersetzen","Review + Unit Test"]},
  {id:"C1-M1-U3",title:"Unit 3 · Funktionsverbgefüge & Klarheit",ls:["Funktionsverbgefüge meistern","Nomen-Verb-Kombinationen","Angebots- & Berichtssprache","Idiomatik vs. Klarheit","Redundanzen streichen","Lektorat eigener Texte","Projekt: Textwerkstatt","Review + Unit Test"]}]},
 {id:"C1-M2",title:"Modul 2 · Studium & Beruf",units:[
  {id:"C1-M2-U4",title:"Unit 4 · Wissenschaftliche Textsorten",ls:["Hausarbeit strukturieren","Quellen & Zitierweisen","Paraphrasieren & Plagiat","Exposé schreiben","Rezension","Bericht","Projekt: Mini-Paper I","Review + Unit Test"]},
  {id:"C1-M2-U5",title:"Unit 5 · Präsentieren & Verhandeln",ls:["Präsentieren: Aufbau","Folien & Sprache","Frei sprechen mit Notizen","Q&A meistern","Verhandeln: Strategien","Konjunktiv I perfekt","Projekt: Mini-Paper II + Vortrag","Review + Unit Test"]},
  {id:"C1-M2-U6",title:"Unit 6 · Konjunktiv I & Amtssprache",ls:["Konjunktiv I: System","Indirekte Rede nuanciert","Höflichkeit & Distanz","Presse-Deutsch","Behördendeutsch","Vertrags- & Verwaltungssprache","Projekt: Fallstudie","Review + Unit Test"]}]},
 {id:"C1-M3",title:"Modul 3 · Politik, Wirtschaft & Medien",units:[
  {id:"C1-M3-U7",title:"Unit 7 · Rhetorik & Argumentation",ls:["Rhetorische Mittel","Argumentationsanalyse","Speechwriting","Debatten-Formate","Wirtschaftsdeutsch I","Wirtschaftsdeutsch II","Debatte live","Review + Unit Test"]},
  {id:"C1-M3-U8",title:"Unit 8 · Wirtschaftsdeutsch & Verhandlung",ls:["Wirtschaftsthemen","Berichte & Kennzahlen","Verhandlungspraxis","Vertragsverhandlungen","Professioneller Small Talk","Netzwerken","Simulation: Boardmeeting","Review + Unit Test"]},
  {id:"C1-M3-U9",title:"Unit 9 · Feuilleton & Essayistik",ls:["Feuilleton & Essayistik","Ironie & Satire","Kommentar schreiben","Longform-Podcasts","Film-Analyse","Humor verstehen","Projekt: Eigener Essay","Review + Unit Test"]}]},
 {id:"C1-M4",title:"Modul 4 · Literatur & C1-Prüfung",units:[
  {id:"C1-M4-U10",title:"Unit 10 · Kurzprosa & Stilmittel",ls:["Kurzgeschichte lesen","Erzähltechnik","Stilmittel","Interpretation schreiben","Gedichte: Einstieg","Literaturgespräch","Projekt: Interpretation","Review + Unit Test"]},
  {id:"C1-M4-U11",title:"Unit 11 · D-A-CH-Variationen",ls:["Standarddeutsch & Variation","Österreichisches Deutsch","Schweizerdeutsch verstehen","Regionales Wörterbuch","Jugendsprache vs. Amtssprache","Dialektproben hören","Quiz D-A-CH","Review + Unit Test"]},
  {id:"C1-M4-U12",title:"Unit 12 · Prüfungstraining C1",ls:["Goethe C1: Lesen","Hören","Schreiben","Sprechen","Strategien & Zeit","Vollsimulation I","Vollsimulation II + Analyse","Review + Unit Test"]}]},
 {exam:"C1-EXAM",title:"C1 Abschlussexamen (Goethe-Zertifikat C1)"}]},

{id:"C2",name:"Mastery · Meisterschaft",modules:[
 {id:"C2-M1",title:"Modul 1 · Feinheiten des Ausdrucks",units:[
  {id:"C2-M1-U1",title:"Unit 1 · Synonymik & Konnotation",ls:["Synonymik & Konnotation","Feinbedeutungen","Wortfeldarbeit","Registerfehler erkennen","Stilübungen","Review + Unit Test"]},
  {id:"C2-M1-U2",title:"Unit 2 · Modalpartikel & Präfixverben",ls:["Modalpartikel: System","doch, ja, mal, eben, halt","Präfixverben präzise","er-/ver-/ent- Nuancen","Produktive Übungen","Review + Unit Test"]},
  {id:"C2-M1-U3",title:"Unit 3 · Idiomatische Meisterschaft",ls:["Kernredewendungen","Sprichwörter heute","Kollokationen fortgeschritten","Metaphernfelder","Idiomatik produzieren","Review + Unit Test"]}]},
 {id:"C2-M2",title:"Modul 2 · Diskurs & Rhetorik",units:[
  {id:"C2-M2-U4",title:"Unit 4 · Debatte & Moderation",ls:["Debatten-Formate","Argumentieren meisterhaft","Moderation","Podiumsdiskussion","Nachgespräch analysieren","Review + Unit Test"]},
  {id:"C2-M2-U5",title:"Unit 5 · Humor & schnelle Gespräche",ls:["Humor & Timing","Ironie produzieren","Schnellverstehen","Slang & Umgangssprache","Film ohne Untertitel","Review + Unit Test"]},
  {id:"C2-M2-U6",title:"Unit 6 · Regionale Varietäten verstehen",ls:["Bairisch verstehen","Schwäbisch & Alemannisch","Österreichische Varietäten","Schweizer Alltagssprache","Dialekt-Lesung","Review + Unit Test"]}]},
 {id:"C2-M3",title:"Modul 3 · Literatur, Wissenschaft & Feuilleton",units:[
  {id:"C2-M3-U7",title:"Unit 7 · Romanlektüre & Essays",ls:["Romanlektüre I","Romanlektüre II","Essay-Kanon lesen","Feuilleton-Klassiker","Literarische Debatte","Review + Unit Test"]},
  {id:"C2-M3-U8",title:"Unit 8 · Stilanalyse & Übersetzungsvergleich",ls:["Übersetzen als Training","Stilvergleich DE/EN","Stilanalyse schreiben","Parodie & Pastiche","Werkstatt-Gespräch","Review + Unit Test"]},
  {id:"C2-M3-U9",title:"Unit 9 · Wissenschaftliche Artikel",ls:["Fachartikel lesen","Akademische Vorträge","Abstract & Paper","Forschung diskutieren","Kolloquium","Review + Unit Test"]}]},
 {id:"C2-M4",title:"Modul 4 · Meisterprojekt & C2-Prüfung",units:[
  {id:"C2-M4-U10",title:"Unit 10 · Meisterprojekt: Portfolio",ls:["Portfolio: Essay planen","Essay schreiben","Vortrag erarbeiten","Diskussion vorbereiten","Generalprobe","Review + Unit Test"]},
  {id:"C2-M4-U11",title:"Unit 11 · Prüfungssimulation C2",ls:["Goethe C2: Lesen","Hören","Schreiben","Sprechen","Vollsimulation","Review + Unit Test"]}]},
 {exam:"C2-EXAM",title:"C2 Abschlussexamen (Goethe-Zertifikat C2 · GDS)"}]}
];

const TRACK = process.argv[2] === "hybrid" ? "hybrid" : "textkurs";
const OUT = TRACK;                                   // Ausgabe-Ordner
const PFX = TRACK === "hybrid" ? "H-" : "T-";        // ID-Präfix
const LBL = TRACK === "hybrid" ? "Hybrid" : "Textkurs";
const CUR_ID = PFX + "A1-M1-U1-L1";
const CUR_HREF = CUR_ID + ".html";
const LOOP = TRACK === "hybrid"
  ? "Loop: Lektion lesen & hören (🔊) → Instant-Feedback-Übungen → Quiz → im Chat „weiter“ → … → Unit-Ende (L8): <b>Unit-Prüfung im Chat</b>."
  : "${LOOP}";

const entries = [];
for (const lv of TREE) {
  for (const m of lv.modules) {
    if (m.exam) { entries.push({ id: PFX + m.exam, title: m.title, level: lv.id, unit: null, modTitle: m.title, type: "exam", num: 0, unitN: 0 }); continue; }
    for (const u of m.units) {
      u.ls.forEach((title, i) => {
        entries.push({
          id: PFX + u.id + "-L" + (i + 1), title,
          level: lv.id, levelName: lv.name, unit: u.id, unitTitle: u.title, modTitle: m.title,
          type: i === u.ls.length - 1 ? "review" : "lesson",
          num: i + 1, unitN: u.ls.length
        });
      });
    }
  }
}

const MERMAID_HEAD = `<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
<script>if(window.mermaid){mermaid.initialize({startOnLoad:true,theme:"neutral",flowchart:{curve:"basis"}})}<\/script>`;

function journey(levelId) {
  const idx = TREE.findIndex(l => l.id === levelId) + 1;
  let g = "flowchart LR\n";
  TREE.forEach((l, i) => { g += '    N' + (i + 1) + '["' + l.id + ' ' + (i === 0 ? "· Start" : "") + (l.id === "C2" ? " · Ziel" : "") + '"]\n'; if (i) g += "    N" + i + " --> N" + (i + 1) + "\n"; });
  g += '    style N' + idx + ' fill:#f5b301,stroke:#b98700,color:#1a1a1a,stroke-width:3px\n';
  g += '    style N1 fill:#e8f7ef,stroke:#188a4b\n';
  return g;
}

function isAuthored(file) {
  if (!existsSync(file)) return false;
  return !readFileSync(file, "utf8").includes("<!-- scaffold:1 -->");
}

let made = 0, kept = 0, authored = 0;
entries.forEach((e, i) => {
  const file = OUT + "/" + e.id + ".html";
  if (isAuthored(file)) { authored++; kept++; return; }
  const prev = entries[i - 1], next = entries[i + 1];
  const typeLabel = e.type === "exam" ? "Prüfung" : e.type === "review" ? "Review + Unit Test" : "Lektion " + e.num + " von " + e.unitN;
  const html = `<!doctype html>
<!-- scaffold:1 -->
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${LBL} · ${e.id} · ${e.title}</title>
<link rel="stylesheet" href="../assets/styles.css">
${MERMAID_HEAD}
</head>
<body>
<main class="tx-main">
  <div class="tx-crumb">${LBL} · <b>${e.level}</b> → ${e.modTitle}${e.unit ? " → " + e.unitTitle : ""} · <a href="index.html">${LBL}-Index</a></div>
  <h1 class="tx-headline">${e.title}</h1>
  <div class="tx-meta">${e.id} · ${typeLabel} · geplante Dauer: 15–25 Min</div>

  <div class="status-banner">🚧 <b>Grammatik-Karte:</b> Die Grammatik dieser Lektion ist unten schon <b>komplett erklärt</b> — Muster · Beispiele · typischer Fehler · Diagramm. ${TRACK === "hybrid" ? "Die volle interaktive Lektion (🔊 Audio, Instant-Feedback-Übungen, Flip-Flashcards, Quiz mit Auswertung) folgt per <i>/teach</i>" : "Dialog, Vokabeln, Flashcards, Übungen &amp; MCQ-Selbsttest folgen per <i>/teach</i>"}: sag im Chat „generiere ${e.id}“.</div>
${e.type === "review" ? '  <div class="challenge-box">📌 <b>Unit-Ende:</b> L1–L7 geschafft? Dann komm jetzt in den Chat und mach deine <b>Unit-Prüfung</b> — erst danach startet die nächste Unit.</div>\n' : ""}
${e.type === "exam" ? '  <div class="challenge-box">🎓 <b>Level-Prüfung:</b> Dieses Examen findet als Chat-Sitzung statt. Sag im Chat: <i>„Ich bin bereit für ' + e.id + '“</i>.</div>\n' : ""}

  <div class="tx-sec">Deine Reise</div>
  <div class="card">
    <div class="mermaid-box"><div class="cap">German Journey — du bist hier: ${e.level}</div>
      <pre class="mermaid">
${journey(e.level)}
      </pre>
    </div>
    <p class="small muted">${e.levelName} — ${e.unit ? e.unitTitle : e.modTitle}</p>
  </div>

  <div class="tx-sec">📖 ${e.type === "review" ? "Grammatik der Unit — Wiederholung" : e.type === "exam" ? "Level-Grammatik im Überblick" : "Grammatik dieser Lektion — komplett erklärt"}</div>
${topicCards(e)}  <div class="tx-sec">Was dich in der vollen Lektion sonst erwartet</div>
  <div class="card plan-sec">
    <ul>
      <li><b>Dialog</b> — zweisprachig (jede Zeile übersetzt)</li>
      <li><b>Vokabeln</b> — mit Artikel + Plural + Beispielsatz</li>
      <li><b>Flashcards</b> — Klick-zum-Umdrehen, druckbar als Schnittbogen</li>
      <li><b>Grammatik</b> — meaning → pattern → Beispiele → typische Fehler</li>
      <li><b>Mermaid-Diagramm</b> — Landkarte oder Entscheidungsbaum zum Thema</li>
      <li><b>Aussprache</b> — präzise IPA + Forvo-Links</li>
      <li><b>Fun &amp; Kultur</b> — Rätsel, Kulturtipp, Mini-Challenge, Badges</li>
      <li><b>Übungen + Quiz</b> — Selbsttest: MCQs mit Lösungsschlüssel zum Aufdecken (erst versuchen, dann aufdecken!)</li>
      <li><b>Externe Praxis</b> — passender Nicos-Weg-/Easy-German-Auftrag${e.type === "review" ? " · Unit Test (≥75%)" : ""}${e.type === "exam" ? " · Level-Prüfung (Chat, Goethe-Format)" : ""}</li>
    </ul>
  </div>

  <div class="tx-nav">
    ${prev ? '<a class="btn btn-ghost btn-sm" href="' + prev.id + '.html">← ' + prev.id + "</a>" : '<span class="muted small">← Anfang der Reise</span>'}
    <span class="row"><a class="btn btn-ghost btn-sm" href="index.html">📚 ${LBL}-Index</a> <a class="btn btn-ghost btn-sm" href="../index.html">🏛️ Gesamt-Index</a></span>
    ${next ? '<a class="btn btn-ghost btn-sm" href="' + next.id + '.html">' + next.id + " →</a>" : '<span class="muted small">Ziel erreicht → C2 🎓</span>'}
  </div>

  <div class="foot-note">${LBL} = ${TRACK === "hybrid" ? "interaktive Lektionen (Audio, Instant-Feedback) + bilingual + Mermaid-Diagramme" : "pure HTML/CSS + Mermaid-Diagramme (laden online; offline siehst du den Quellcode) · MCQ-Selbsttests"} · Unit-/Level-Prüfungen im Chat.</div>
</main>
</body>
</html>
`;
  writeFileSync(file, html);
  made++;
});

// ---------- Hub index ----------
function statusOf(e) {
  const f = OUT + "/" + e.id + ".html";
  return isAuthored(f) ? "ready" : "planned";
}
function stIcon(e) {
  const n = e.id.includes("-EXAM") ? "EX" : "L" + (e.id.split("-L")[1] || "?");
  return statusOf(e) === "ready"
    ? '<span class="st-num ready">' + n + '</span>'
    : '<span class="st-num planned">' + n + '</span>';
}
let hub = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${LBL} · Index A1–C2</title>
<link rel="stylesheet" href="../assets/styles.css">
<style>
body{padding-bottom:60px}
.hub{max-width:1000px;margin:0 auto;padding:26px 20px}
.lvl{margin:30px 0 8px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;scroll-margin-top:64px}
.lvl-nav{position:sticky;top:0;z-index:30;display:flex;gap:8px;padding:12px 0;overflow-x:auto;
  background:color-mix(in srgb, var(--bg) 88%, transparent);backdrop-filter:blur(8px);
  border-bottom:1px solid var(--border);margin:14px 0 4px}
.lvl-nav a{flex:0 0 auto;border:1.5px solid var(--border-2);background:var(--surface);color:var(--ink);
  font-weight:900;font-size:13px;border-radius:99px;padding:6px 16px;text-decoration:none;transition:all .18s}
.lvl-nav a:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-1px)}
.lvl b{background:var(--ink);color:#fff;border-radius:10px;padding:6px 14px;font-size:17px}
.mrow{display:flex;align-items:center;gap:10px;padding:9px 14px;border-top:1px solid #eef0f5;font-size:13.5px}
.mrow .lid{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--muted);width:118px;flex:0 0 118px}
.mrow a{color:inherit;text-decoration:none;font-weight:600}
.mrow a:hover{color:var(--primary)}
.st-num{display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:24px;
  border-radius:7px;font:800 11.5px ui-monospace,Menlo,monospace;letter-spacing:.03em}
.st-num.ready{background:var(--flag-black);color:var(--gold);border:1px solid #000}
.st-num.planned{background:var(--surface-3);color:var(--muted);border:1px solid var(--border-2)}
.ublock{border:1px solid var(--border);border-radius:10px;margin:10px 0;overflow:hidden}
.uhead{background:#f7f8fc;padding:8px 14px;font-weight:800;font-size:13px}
</style>
</head>
<body>
<div class="hub">
  <div class="tx-crumb"><a href="../index.html">← Gesamt-Index</a> · <b>${LBL}</b> · <a href="CURRICULUM.md">Curriculum</a></div>
  <h1 class="tx-headline">${TRACK === "hybrid" ? "⚡" : "📖"} ${LBL} · Lektionen A1 → C2</h1>
  <div class="tx-meta">${entries.length} Lektionen + Prüfungen · zweisprachig, Flashcards, Mermaid, MCQ-Selbsttests · Prüfungen im Chat</div>
  <div class="card">
    <div class="tx-sec" style="margin-top:0">Aktueller Stand</div>
    <p style="margin:4px 0"><b>Aktuelle Lektion:</b> ${CUR_ID} — ${entries.find(x => x.id === CUR_ID).title}</p>
    <p class="small muted" style="margin:4px 0">${LOOP}</p>
    <a class="btn btn-primary" href="${CUR_HREF}">▶ Weiter lernen</a>
    <span class="small muted" style="margin-left:8px">Fertig generiert: <b>${entries.filter(e => statusOf(e) === "ready").length}</b> von ${entries.length}</span>
    <p class="small" style="margin:10px 0 0">📚 <a href="../reference/grammar-a1.html">A1-Grammatik-Referenz</a> — alle Themen mit Beispielen &amp; Diagrammen · wächst mit dem Kurs</p>
  </div>
  <div class="lvl-nav">${TREE.map(l=>'<a href="#lvl-'+l.id+'">'+l.id+'</a>').join("")}</div>
  <div class="card">
    <div class="mermaid-box"><div class="cap">Die ganze Reise</div>
      <pre class="mermaid">
${journey("A1")}
      </pre>
    </div>
    <div class="legend" style="display:flex;gap:16px;flex-wrap:wrap;font-size:12.5px;color:var(--muted)">
      <span class="st-num ready">L1</span> fertige Lektion &nbsp;·&nbsp; <span class="st-num planned">L1</span> Plan-Seite (Grammatik-Karte, volle Lektion per /teach) &nbsp;·&nbsp; <span class="st-num planned">EX</span> Level-Prüfung im Chat
    </div>
  </div>
`;
for (const lv of TREE) {
  hub += '<div class="lvl" id="lvl-'+lv.id+'"><b>' + lv.id + '</b><span class="muted small">' + lv.name + '</span></div>\n<div class="ublock">\n';
  for (const m of lv.modules) {
    if (m.exam) {
      const e = entries.find(x => x.id === PFX + m.exam);
      hub += '<div class="mrow">' + stIcon(e) + '<span class="lid">' + e.id + '</span><a href="' + e.id + '.html">' + e.title + '</a><span class="pill pill-exam" style="margin-left:auto">Examen</span></div>\n';
      continue;
    }
    for (const u of m.units) {
      hub += '<div class="uhead">' + u.title + '</div>\n';
      u.ls.forEach((t, i) => {
        const id = PFX + u.id + "-L" + (i + 1);
        const isRev = i === u.ls.length - 1;
        hub += '<div class="mrow">' + stIcon(entries.find(x => x.id === id)) + '<span class="lid">' + id + '</span><a href="' + id + '.html">' + t + '</a>' + (isRev ? '<span class="pill pill-review" style="margin-left:auto">Test</span>' : "") + '</div>\n';
      });
    }
  }
  hub += '</div>\n';
}
hub += `<div class="foot-note">Inhalte werden der Reihe nach generiert (eine Lektion nach der anderen, per <b>/teach</b>) — diese Seiten zeigen dir jetzt schon den ganzen Weg.</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
<script>if(window.mermaid){mermaid.initialize({startOnLoad:true,theme:"neutral",flowchart:{curve:"basis"}})}<\/script>
</body>
</html>
`;
writeFileSync(OUT + "/index.html", hub);

console.log("entries:", entries.length, "| scaffold pages written:", made, "| authored kept:", authored);
