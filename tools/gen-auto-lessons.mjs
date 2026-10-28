// Auto full-lesson engine: builds complete lessons for every pack unit (L1–L7 + L8 review)
// and renders all 3 tracks. Grammar from grammar-data.mjs, quizzes auto-built from pack vocab
// + grammar examples. Run: node tools/gen-auto-lessons.mjs
import { writeFileSync, readFileSync } from "node:fs";
import { PACKS as PACKS_A } from "./lesson-packs.mjs";
import { PACKS as PACKS_B1 } from "./lesson-packs-b1.mjs";
import { PACKS as PACKS_B2 } from "./lesson-packs-b2.mjs";
import { PACKS as PACKS_C1 } from "./lesson-packs-c1.mjs";
import { PACKS as PACKS_C2 } from "./lesson-packs-c2.mjs";
const PACKS = [...PACKS_A, ...PACKS_B1, ...PACKS_B2, ...PACKS_C1, ...PACKS_C2];
import { TOPICS, UNIT_TOPICS } from "./grammar-data.mjs";

const tpl = readFileSync("tools/templates/interactive-lesson.html", "utf8");
const ALLVOC = PACKS.flatMap(p => p.voc);

function diagram(d){
  if(!d) return "";
  if(d.k==="dec") return 'flowchart TD\n    A["'+d.q+'"] -->|Ja| B["'+d.y+'"]\n    A -->|Nein| C["'+d.n+'"]\n    style B fill:#e8f7ef,stroke:#188a4b\n    style C fill:#eef4ff,stroke:#2563eb';
  if(d.k==="two") return 'flowchart TD\n    A["'+d.q+'"] -->|'+d.la+'| B["'+d.a+'"]\n    A -->|'+d.lb+'| C["'+d.b+'"]\n    style B fill:#e8f7ef,stroke:#188a4b\n    style C fill:#eef4ff,stroke:#2563eb';
  if(d.k==="chain"){ const nodes=d.s.map((x,i)=>'    N'+(i+1)+'["'+x+'"]').join('\n');
    const links=d.s.slice(1).map((_,i)=>'    N'+(i+1)+' --> N'+(i+2)).join('\n');
    return 'flowchart LR\n'+nodes+'\n'+links; }
  return "";
}
const isEN = lv => /^(A1|A2)/.test(lv||"");
function topicCard(id){
  const t = TOPICS[id]; if(!t) return null;
  return { title: t.t, meaning: t.m + '<br><span class="pattern-note">' + (isEN(t.lv)?"Pattern: ":"Muster: ") + t.p + '</span>',
    table: null, examples: t.ex, mistakes: t.ms ? [[t.ms.w, t.ms.r, t.ms.why]] : [], diagram: diagram(t.d) };
}
function rot(opts, a, k){ const n=opts.length; const r=opts.slice(k%n).concat(opts.slice(0,k%n)); return { o:r, a:(a-k%n+n)%n }; }

function buildQuiz(voc, topicIds, seed, lv){
  const items = [];
  const EN = isEN(lv);
  const nouns = voc.filter(v=>v[1]);
  nouns.slice(0,2).forEach((v,j)=>{
    const art = v[0].split(" ")[0], noun = v[0].split(" ").slice(1).join(" ").replace(/\(Pl\.\)/,"").trim();
    if(!["der","die","das"].includes(art)) return;
    const r = rot(["der","die","das"], ["der","die","das"].indexOf(art), seed+j);
    items.push({ q:"der / die / das? ___ " + noun, opts:r.o, a:r.a, expl:art+" "+noun+" — " + (EN?"always learn nouns with their article.":"lerne Nomen immer mit Artikel.") });
  });
  if(nouns.length>2 && nouns[2][1]){
    const v = nouns[2];
    const others = ALLVOC.filter(x=>x[1]&&x[1]!==v[1]).slice(seed,seed+2).map(x=>x[1]);
    const r = rot([v[1], others[0]||"Tage", others[1]||"Namen"], 0, seed);
    items.push({ q:"Plural: "+v[0]+" → die ___", opts:r.o, a:r.a, expl:v[0]+" → "+v[1]+"." });
  }
  voc.slice(0,2).forEach((v,j)=>{
    const others = ALLVOC.filter(x=>x[2]!==v[2]).slice(seed+j,seed+j+3).map(x=>x[2]);
    const r = rot([v[2], others[0], others[1], others[2]].filter(Boolean), 0, seed+j);
    items.push({ q:"Was bedeutet „"+v[0].replace(/\s*\(Pl\.\)/,"")+"“?", opts:r.o, a:r.a, expl:v[0]+" = "+v[2]+"." });
  });
  const t = TOPICS[topicIds[seed % topicIds.length]];
  if(t && t.ex && t.ex.length>=2){
    const exs = t.ex.slice(0,4);
    const pickIdx = seed % exs.length;
    const r = rot(exs.map(e=>e[0]), pickIdx, seed);
    items.push({ q:"Translate: „"+exs[pickIdx][1]+"“", opts:r.o, a:r.a, expl:(EN?"Pattern: ":"Muster: ")+exs[pickIdx][0] });
  }
  let k = 2, guard = 0;
  while(items.length < 6 && guard++ < 24 && voc.length){
    const v = voc[k % voc.length]; k++;
    const others = ALLVOC.filter(x=>x[2]!==v[2]).slice(seed,seed+3).map(x=>x[2]);
    if(others.length<3 || items.some(i=>i.q.includes(v[0]))) continue;
    const r = rot([v[2], ...others], 0, seed+k);
    items.push({ q:"Was bedeutet „"+v[0].replace(/\s*\(Pl\.\)/,"")+"“?", opts:r.o, a:r.a, expl:v[0]+" = "+v[2]+"." });
  }
  return items.slice(0,6);
}

const ORDER = [];
const LOOKUP = {};
PACKS.forEach(p=>{ const n=p.n||8; for(let i=1;i<=n;i++){ const id=p.unit+"-L"+i; ORDER.push(id); LOOKUP[id]= i===n ? "Review + Unit Test · "+p.theme : p.theme+" · Lektion "+i; } });
function nextOf(id){ const i=ORDER.indexOf(id); return ORDER[i+1]||null; }

function lessonFor(pack, n){
  const id = pack.unit + "-L" + n;
  const topics = UNIT_TOPICS[pack.unit] || [];
  const total = pack.n || 8;
  const per = Math.max(4, Math.ceil(pack.voc.length/(total-1)));
  const start = (n-1)*per;
  const voc = n===total-1 ? pack.voc.slice(start).concat(pack.voc.slice(0, Math.max(0,6-(pack.voc.length-start))))
                       : pack.voc.slice(start, start+per);
  const topicIds = topics.length ? [topics[(n-1) % topics.length]] : [];
  if(n>=4 && topics.length>1) topicIds.push(topics[n % topics.length]);
  return {
    id, title: LOOKUP[id], level: pack.level + " · Modul", time: 20, isReview: false,
    objectives: (pack.EN ? ["Topic & vocabulary: " + pack.theme + " (" + voc.length + " items)",
                 "Use the grammar actively: " + topicIds.map(t=>TOPICS[t].t).join(" · "),
                 "Pass the quiz (≥ 4/6) and speak aloud"]
                : ["Thema & Wortschatz: " + pack.theme + " (" + voc.length + " Nettos)",
                 "Grammatik aktiv nutzen: " + topicIds.map(t=>TOPICS[t].t).join(" · "),
                 "Quiz bestehen (≥ 4/6) und laut sprechen"]),
    vocab: voc, dialogue: pack.dlg,
    grammar: topicIds.map(topicCard).filter(Boolean),
    pron: { focus: pack.EN ? "Pronounce the topic words clearly" : "Thema-Wörter klar aussprechen",
            tips: [pack.EN ? "Say every new word 2× aloud after listening (Hybrid/Kursraum)." : "Sprich jedes neue Wort nach dem Hören (Hybrid/Kursraum) 2× laut."],
            drills: voc.slice(0,4).map(v=>v[0]) },
    listen: [],
    quiz: buildQuiz(voc, topicIds.length?topicIds:topics.length?[topics[0]]:["sein_haben"], n, pack.level),
    exs: { fills: [], corrections: [] },
    speak: { prompt:(pack.EN ? "Roleplay out loud — use the new words. Topic: " : "Rollenspiel zum Thema „"+pack.theme+"“ — sprich laut mit den neuen Wörtern.") + (pack.EN ? pack.theme : ""),
             model: pack.dlg.slice(0,3).map(l=>l[1]).join(" · "),
             phrases: pack.dlg.slice(0,3).map(l=>[l[1], l[2]||""]) },
    write: { prompt: pack.EN ? "Write 3–5 sentences about „"+pack.theme+"“ — use the lesson's grammar."
                               : "Schreibe 3–5 Sätze zum Thema „"+pack.theme+"“ — nutze die Grammatik der Lektion.",
             model: pack.dlg.slice(0,2).map(l=>l[1]).join(" "),
             check: pack.EN ? ["Verb conjugated correctly?","Nouns with article + capitalized?","Word order: verb in position 2?"]
                            : ["Verb richtig konjugiert?","Nomen mit Artikel + groß?","Wortstellung: Verb Position 2?"] },
    fun: { riddle: pack.riddle, culture: pack.culture, challenge: pack.challenge },
    ext: pack.ext,
    next: null
  };
}
function reviewFor(pack){
  const id = pack.unit + "-L" + (pack.n || 8);
  const topics = UNIT_TOPICS[pack.unit] || [];
  const quizPool = [];
  for(let n=1;n<=(pack.n||8)-1;n++) quizPool.push(...buildQuiz(pack.voc, topics.length?[topics[(n-1)%topics.length]]:[], n+3, pack.level));
  return {
    id, title: LOOKUP[id], level: pack.level + " · Modul", time: 30, isReview: true,
    objectives: pack.EN ? ["Recall the unit actively: „"+pack.theme+"“","Pass the unit test (≥ 9/12)","then: unit exam in the chat"]
                        : ["Unit-Wissen aktiv abrufen: „"+pack.theme+"“","Unit Test bestehen (≥ 9/12)","danach: Unit-Prüfung im Chat"],
    vocab: pack.voc.slice(0,8), dialogue: pack.dlg,
    grammar: topics.map(topicCard).filter(Boolean),
    pron: { focus:"Schnell-Abruf", tips:["Sprich die Grammatik-Tabellen laut."], drills: pack.voc.slice(0,3).map(v=>v[0]) },
    listen: [], quiz: quizPool.slice(0,12),
    exs: { fills: [], corrections: [] },
    speak: { prompt: pack.EN ? "Talk for one minute about the unit — favorite word, hardest rule, best sentence."
                              : "Erzähl laut in 5 Sätzen von der Unit — Lieblingswort, schwerste Regel, bester Satz.",
             model: pack.theme, phrases: [[pack.dlg[0][1], pack.dlg[0][2]||""]] },
    write: { prompt: pack.EN ? "Write 4 sentences about „"+pack.theme+"“." : "Schreibe 4 Sätze zum Thema „"+pack.theme+"“.",
             model: pack.dlg.slice(0,2).map(l=>l[1]).join(" "),
             check: pack.EN ? ["Unit grammar correct?","Article + plural correct?"] : ["Grammatik der Unit korrekt?","Artikel + Plural korrekt?"] },
    fun: null, ext: pack.ext, next: null
  };
}

PACKS.forEach(p=>{ p.EN = isEN(p.level); });

const built = [];
PACKS.forEach(p=>{ const N=p.n||8; for(let n=1;n<N;n++) built.push(lessonFor(p,n)); built.push(reviewFor(p)); });

// ---------- renderers ----------
function artColorS(s){ return String(s).replace(/\b(der|die|das)\b/g, m=>'<span class="art-'+m.toLowerCase()+'">'+m+'</span>'); }
function renderInteractive(b, track){
  const isK = track==="kursraum";
  const lbl = isK ? "Kursraum" : "Hybrid";
  const prefix = isK ? "" : "H-";
  const file = isK ? "kursraum/lessons/"+b.id+".html" : "hybrid/H-"+b.id+".html";
  const nid = nextOf(b.id);
  const data = Object.assign({}, b, { nextId: nid ? (isK ? nid+".html" : "H-"+nid+".html") : null, next: nid ? {id:nid,title:LOOKUP[nid]} : null });
  const html = tpl
    .replace("__TITLE__", lbl+" · "+prefix+b.id+" · "+b.title)
    .replace("__CSS__", isK ? "../../assets/styles.css" : "../assets/styles.css")
    .replace("__CRUMB__", (isK ? "🏛️ Kursraum · <b>"+b.id+"</b>" : "⚡ Hybrid · <b>H-"+b.id+"</b>")+" · "+b.title)
    .replace("__TRACKHUB__", isK ? "../index.html" : "index.html")
    .replace("__ROOTHUB__", isK ? "../../index.html" : "../index.html")
    .replace("__TRACKLBL__", lbl)
    .replace("__LESSON_JSON__", JSON.stringify(data));
  writeFileSync(file, html);
}
function renderTextkurs(b){
  const id=b.id; const EN = isEN(b.level); const nid=nextOf(id); const pid=ORDER[Math.max(0,ORDER.indexOf(id)-1)];
  const prev = ORDER.indexOf(id)>0 ? {id:pid,file:"T-"+pid+".html"} : null;
  let h='<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n';
  h+='<title>Textkurs · T-'+id+' · '+b.title+'</title>\n<link rel="stylesheet" href="../assets/styles.css">\n';
  h+='<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>\n<script>if(window.mermaid){mermaid.initialize({startOnLoad:true,theme:"neutral",flowchart:{curve:"basis"}})}</script>\n</head>\n<body>\n<main class="tx-main">\n';
  h+='<div class="tx-crumb">Textkurs · <b>'+b.level.split(" ")[0]+'</b> · <a href="index.html">Textkurs-Index</a></div>\n';
  h+='<h1 class="tx-headline">'+b.title+'</h1><div class="tx-meta">T-'+id+' · ca. '+b.time+' Min'+(b.isReview?' · Review + Unit Test':'')+' · MCQ-Selbsttest</div>\n';
  h+='<div class="tx-nav"><span class="muted small">'+(prev?'← '+prev.id:'← Unit-Anfang')+'</span><span class="row"><a class="btn btn-ghost btn-sm" href="index.html">📖 Textkurs-Index</a><a class="btn btn-ghost btn-sm" href="../index.html">🏛️ Gesamt-Index</a></span>'+(nid?'<a class="btn btn-primary btn-sm" href="T-'+nid+'.html">T-'+nid+' →</a>':'<span class="muted small">Unit-Ende → Prüfung im Chat</span>')+'</div>\n';
  let sec=0; const S=t=>{sec++;return '<div class="tx-sec">'+sec+' · '+t+'</div>';};
  h+='<div class="card"><b>'+(EN?'Learning goals':'Lernziele')+'</b><ul style="margin:6px 0 0;padding-left:20px">'+b.objectives.map(o=>'<li>'+o+'</li>').join("")+'</ul></div>\n';
  if(b.dialogue){ h+=S(EN?'Dialogue':'Dialog')+'<div class="card tx-dialog">';
    b.dialogue.forEach(l=>{ h+='<div class="tx-line"><div class="who">'+l[0]+'</div><div class="body"><div class="tx-de">'+l[1]+'</div><div class="tx-en">'+(l[2]||"")+'</div></div></div>'; }); h+='</div>\n'; }
  if(b.vocab.length){ h+=S(EN?'Vocabulary':'Vokabeln')+'<div class="card"><table class="tx-vocab"><tr><th>German</th><th>Plural</th><th>English</th></tr>';
    b.vocab.forEach(v=>{ h+='<tr><td>'+artColorS(v[0])+'</td><td>'+(v[1]?artColorS(v[1]):"–")+'</td><td>'+v[2]+'</td></tr>'; }); h+='</table></div>\n';
    h+=S(EN?'Flashcards — click to flip':'Flashcards')+'<div class="card"><div class="fc-deck">';
    b.vocab.forEach((v,j)=>{ const front=v[1]?artColorS(v[0].split(" ")[0]+" ___ "+v[0].split(" ").slice(1).join(" ")):v[2];
      h+='<div class="fcflip"><input type="checkbox" id="f'+j+'"><label for="f'+j+'"><div class="inner"><div class="face front"><div class="s">'+(v[1]?"Artikel + Plural":"Bedeutung")+'</div><div class="t">'+front+'</div></div><div class="face back"><div class="s">Antwort</div><div class="t">'+artColorS(v[0])+(v[1]?' <span class="muted">· '+artColorS(v[1])+'</span>':'')+'</div></div></div></label></div>'; });
    h+='</div><p class="fc-hint">'+(EN?'Print = cut-out sheet.':'Drucken = Schnittbogen.')+'</p></div>\n'; }
  if(b.grammar.length){ h+=S(EN?'Grammar':'Grammatik');
    b.grammar.forEach(g=>{ h+='<div class="card"><h2>'+g.title+'</h2>';
      if(g.meaning)h+='<div class="pron-tip">'+g.meaning+'</div>';
      if(g.examples.length)h+=g.examples.map(e=>'<div class="ex-line"><div><div class="de">'+e[0]+'</div><div class="en">'+e[1]+'</div></div></div>').join("");
      g.mistakes.forEach(m=>{ if(m[0])h+='<div class="mistake-box"><span class="wrong">✗ '+m[0]+'</span> → <span class="right">'+m[1]+'</span><div class="small">'+m[2]+'</div></div>'; });
      if(g.diagram)h+='<div class="mermaid-box"><div class="cap">Diagramm</div><pre class="mermaid">\n'+g.diagram+'\n</pre></div>';
      h+='</div>'; }); }
  if(b.fun){ h+=S(EN?'Fun &amp; Culture':'Fun &amp; Kultur')+'<div class="card"><div class="riddle-box">🧩 <b>'+b.fun.riddle[0]+'</b><details class="akey" style="margin-top:8px"><summary>'+(EN?'Show solution':'Lösung anzeigen')+'</summary>'+b.fun.riddle[1]+'</details></div><div class="kultur-box">🇩🇪 <b>'+(EN?'Culture tip:':'Kulturtipp:')+'</b> '+b.fun.culture+'</div><div class="challenge-box">🎯 <b>'+b.fun.challenge+'</b></div></div>\n'; }
  h+=S(EN?'Quiz — self-test':'Quiz — Selbsttest')+'<div class="tx-quiz"><p style="margin:0 0 4px"><b>Multiple Choice.</b></p><p class="small muted" style="margin:0">'+(EN?'Decide first, then open the key. '+(b.isReview?'Unit test: pass at 9/12.':'Pass at 4/6.'):'Erst entscheiden, dann Schlüssel aufdecken. '+(b.isReview?'Unit Test: bestanden ab 9/12.':'Bestanden ab 4/6.'))+'</p><ol>';
  b.quiz.forEach(x=>{ h+='<li>'+x.q+'<span class="mcq">a) '+x.opts[0]+' &nbsp; b) '+x.opts[1]+' &nbsp; c) '+x.opts[2]+(x.opts[3]?' &nbsp; d) '+x.opts[3]:'')+'</span></li>'; });
  h+='</ol><details class="akey"><summary>'+(EN?'Answers &amp; explanations — open only after trying!':'Antworten &amp; Erklärungen — erst nach dem Versuch öffnen!')+'</summary><ol>';
  b.quiz.forEach(x=>{ h+='<li><b>'+"abcd"[x.a]+') '+x.opts[x.a]+'</b> <span class="why">— '+x.expl+'</span></li>'; });
  h+='</ol></details></div>\n';
  h+=S(EN?'Review &amp; next steps':'Review &amp; nächste Schritte')+'<div class="card"><div class="schedule">'+(EN?'Words return: <b>+1 · +3 · +7 · +14 · +30 days</b>.':'Vokabeln kehren zurück: <b>+1 · +3 · +7 · +14 · +30 Tage</b>.')+'</div>';
  if(b.ext)h+='<div class="pron-tip"><b>Externe Praxis:</b> '+b.ext+'</div>';
  h+='<p class="small">'+(b.isReview?EN?'📌 <b>Unit complete!</b> Come to the chat for your <b>unit exam</b> — the next unit starts after that.':'📌 <b>Unit-Ende!</b> Komm in den Chat: <b>Unit-Prüfung</b> — danach startet die nächste Unit.':(nid?'➡️ '+(EN?'Next: <b>T-'+nid+' · '+LOOKUP[nid]+'</b> — or say \'next\' in the chat.':'Weiter: <b>T-'+nid+' · '+LOOKUP[nid]+'</b> — oder im Chat „weiter“.'):''))+'</p></div>\n';
  h+='<div class="foot-note">❓ Fragen? Frag deinen Lehrer im Chat · Audio-Version: <a href="../hybrid/H-'+id+'.html">Hybrid</a> oder <a href="../kursraum/lessons/'+id+'.html">Kursraum</a><br>Content-Tier: aus kuratierten Paketen generiert — wird beim Erreichen auf Gold-Standard (wie Modul 1) verfeinert.</div>\n</main>\n</body>\n</html>\n';
  writeFileSync("textkurs/T-"+id+".html", h);
}

let n=0;
built.forEach(b=>{ renderTextkurs(b); renderInteractive(b,"hybrid"); renderInteractive(b,"kursraum"); n+=3; });
console.log("auto lessons rendered:", n, "pages | units:", PACKS.length, "| lessons:", built.length);
