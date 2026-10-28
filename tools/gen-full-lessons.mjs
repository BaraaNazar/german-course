// Full-lesson composer: renders authored lesson data into all three tracks.
// Run: node tools/gen-full-lessons.mjs            (currently: A1 · Modul 1)
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { LESSONS } from "./lesson-data-a1-m1.mjs";
import { TOPICS, UNIT_TOPICS } from "./grammar-data.mjs";

const tpl = readFileSync("tools/templates/interactive-lesson.html", "utf8");
const pick = (a, n) => a.slice().sort(() => Math.random() - 0.5).slice(0, n);

function diagram(d){
  if(!d) return "";
  if(d.k==="dec") return 'flowchart TD\n    A["'+d.q+'"] -->|Ja| B["'+d.y+'"]\n    A -->|Nein| C["'+d.n+'"]\n    style B fill:#e8f7ef,stroke:#188a4b\n    style C fill:#eef4ff,stroke:#2563eb';
  if(d.k==="two") return 'flowchart TD\n    A["'+d.q+'"] -->|'+d.la+'| B["'+d.a+'"]\n    A -->|'+d.lb+'| C["'+d.b+'"]\n    style B fill:#e8f7ef,stroke:#188a4b\n    style C fill:#eef4ff,stroke:#2563eb';
  if(d.k==="chain"){ const nodes=d.s.map((x,i)=>'    N'+(i+1)+'["'+x+'"]').join('\n');
    const links=d.s.slice(1).map((_,i)=>'    N'+(i+1)+' --> N'+(i+2)).join('\n');
    return 'flowchart LR\n'+nodes+'\n'+links; }
  return "";
}
function topicCard(id){
  const t = TOPICS[id]; if(!t) return null;
  return { title: t.t, meaning: t.m + '<br><span class="pattern-note">Pattern: ' + t.p + '</span>',
    table: null, examples: t.ex, mistakes: t.ms ? [[t.ms.w, t.ms.r, t.ms.why]] : [], diagram: diagram(t.d) };
}
function resolveGrammar(g){
  if(g.topic){ const c = topicCard(g.topic); return c ? [c] : []; }
  const i = g.inline;
  return [{ title: i.title, meaning: i.meaning, table: i.table || null, examples: i.ex || [], mistakes: (i.ms||[]).map(m=>[m[0],m[1],m[2]]), diagram: "" }];
}

const ORDER = [];
["A1-M1-U1","A1-M1-U2"].forEach(u => { for(let i=1;i<=8;i++) ORDER.push({unit:u, n:i, id:u+"-L"+i}); });

function nextOf(id){ const i = ORDER.findIndex(o=>o.id===id); return ORDER[i+1] || null; }

// ---------- build normalized LESSON objects ----------
const built = {};
for(const [id, d] of Object.entries(LESSONS)){
  built[id] = {
    id, title: d.t, level: "A1 · Modul 1", time: 25, isReview: false,
    objectives: ["Topic & vocabulary: " + d.t,
                 "Use the grammar actively: " + d.g.map(g=>g.topic ? TOPICS[g.topic].t : g.inline.title).join(" · "),
                 "Pass the quiz (≥ 4/6) and speak aloud"],
    vocab: d.voc, dialogue: d.dlg, grammar: d.g.flatMap(resolveGrammar),
    pron: { focus: d.pron[0], tips: d.pron.slice(1, -0).slice(0, 0).concat(d.pron.slice(1, d.pron.length - (d.pron.length-1-0)) && d.pron.slice(1).filter(x=>x.startsWith("<")||x.length>40)).slice(0,2), drills: d.pron.slice(1).filter(x=>x.length<40).slice(0,5) },
    listen: d.listen, quiz: d.quiz,
    exs: { fills: d.exsF || [], corrections: d.exsC || [] },
    speak: { prompt: "Roleplay out loud — use today's words and grammar.",
             model: d.dlg.slice(0,3).map(l=>l[1]).join(" · "),
             phrases: d.dlg.slice(0,3).map(l=>[l[1], l[2]]) },
    write: { prompt: "Write 3–5 sentences about „" + d.t + "“ — use the new grammar.",
             model: d.voc.slice(0,3).map(v=>v[3]).join(" "),
             check: ["Verb conjugated correctly?","Nouns with article + capitalized?","Word order: verb in position 2?"] },
    fun: { riddle: d.riddle, culture: d.culture, challenge: d.challenge },
    ext: d.ext,
    next: nextOf(id) ? { id: nextOf(id).id, title: (LESSONS[nextOf(id).id]||{}).t || "Review + Unit Test" } : null
  };
}
// L8 reviews
for(const unit of ["A1-M1-U1","A1-M1-U2"]){
  const id = unit + "-L8";
  const unitLessonIds = Object.keys(LESSONS).filter(k=>k.startsWith(unit));
  const quizPool = unitLessonIds.flatMap(k=>LESSONS[k].quiz);
  const listenPool = unitLessonIds.flatMap(k=>LESSONS[k].listen);
  const vocabPool = unitLessonIds.flatMap(k=>LESSONS[k].voc);
  built[id] = {
    id, title: "Review + Unit Test · " + unit, level: "A1 · Modul 1", time: 30, isReview: true,
    objectives: ["Recall the unit actively (vocabulary + grammar)","Pass the unit test (≥ 75%)","then: unit exam in the chat"],
    vocab: pick(vocabPool, 8), dialogue: null,
    grammar: (UNIT_TOPICS[unit]||[]).map(t=>topicCard(t)).filter(Boolean).concat([{title:"Unit-Wiederholung",meaning:"Lies die Karten laut mit und erkläre jede Regel dir selbst auf Englisch — dann teste dich im Quiz.",table:null,examples:[],mistakes:[],diagram:""}]),
    pron: { focus: "Quick recall", tips:["Read every example table aloud once."], drills: quizPool.slice(0,2).map(q=>q[0]) },
    listen: pick(listenPool, 2), quiz: pick(quizPool, 10),
    exs: { fills: [], corrections: [] },
    speak: { prompt: "Talk aloud for one minute about the unit — topic, favorite word, hardest rule.",
             model: unitLessonIds.map(k=>LESSONS[k].t).join(" · "), phrases: [["Ich heiße … und ich lerne Deutsch!","intro line"]] },
    write: { prompt: "Write 4 sentences: two about you, two with unit grammar.",
             model: LESSONS[unitLessonIds[0]].voc[0][3] + " " + (LESSONS[unitLessonIds[1]] ? LESSONS[unitLessonIds[1]].voc[0][3] : ""),
             check: ["Everything from the unit correct?","Article + plural correct?"] },
    fun: null, ext: "DW · Nicos Weg A1 · Unit-Review zu „Erste Schritte“.",
    next: nextOf(id) ? { id: nextOf(id).id, title: (LESSONS[nextOf(id).id]||{}).t || "Review + Unit Test" } : null
  };
}

// ---------- renderers ----------
function renderInteractive(built, track){
  const id = built.id;
  const file = track === "hybrid" ? "hybrid/H-" + id + ".html" : "kursraum/lessons/" + id + ".html";
  if(existsSync(file) && !readFileSync(file,"utf8").includes("scaffold:1") && !track) {}
  const isK = track === "kursraum";
  const lbl = isK ? "Kursraum" : "Hybrid";
  const prefix = isK ? "" : "H-";
  const nxt = built.next ? (isK ? built.next.id + ".html" : "H-" + built.next.id + ".html") : null;
  const data = Object.assign({}, built, { nextId: nxt, next: null });
  let html = tpl
    .replace("__TITLE__", lbl + " · " + prefix + id + " · " + built.title)
    .replace("__CSS__", isK ? "../../assets/styles.css" : "../assets/styles.css")
    .replace("__CRUMB__", (isK ? "🏛️ Kursraum · <b>" + id + "</b>" : "⚡ Hybrid · <b>H-" + id + "</b>") + " · " + built.title)
    .replace("__TRACKHUB__", isK ? "../index.html" : "index.html")
    .replace("__ROOTHUB__", isK ? "../../index.html" : "../index.html")
    .replace("__TRACKLBL__", lbl)
    .replace("__LESSON_JSON__", JSON.stringify(data));
  writeFileSync(file, html);
  return file;
}

function renderTextkurs(b){
  const id = b.id;
  const nxt = b.next ? { id: b.next.id, title: b.next.title, file: "T-" + b.next.id + ".html" } : null;
  const prevN = ORDER.findIndex(o=>o.id===id);
  const prev = prevN > 0 ? { id: ORDER[prevN-1].id, title: (LESSONS[ORDER[prevN-1].id]||{}).t || "Review + Unit Test", file: "T-" + ORDER[prevN-1].id + ".html" } : null;
  let h = '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n';
  h += '<title>Textkurs · T-' + id + ' · ' + b.title + '</title>\n<link rel="stylesheet" href="../assets/styles.css">\n';
  h += '<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>\n<script>if(window.mermaid){mermaid.initialize({startOnLoad:true,theme:"neutral",flowchart:{curve:"basis"}})}</script>\n</head>\n<body>\n<main class="tx-main">\n';
  h += '<div class="tx-crumb">Textkurs · <b>A1</b> → Modul 1 → ' + id.replace(/-L\d+$/,"") + ' · <a href="index.html">Textkurs-Index</a></div>\n';
  h += '<h1 class="tx-headline">' + b.title + '</h1><div class="tx-meta">T-' + id + ' · ca. ' + b.time + ' Min' + (b.isReview?' · Review + Unit Test':'') + ' · MCQ-Selbsttest</div>\n';
  h += '<div class="tx-nav"><span class="muted small">' + (prev ? '← ' + prev.id : '← Start') + '</span><span class="row"><a class="btn btn-ghost btn-sm" href="index.html">📖 Textkurs-Index</a><a class="btn btn-ghost btn-sm" href="../index.html">🏛️ Gesamt-Index</a></span>' + (nxt ? '<a class="btn btn-primary btn-sm" href="' + nxt.file + '">' + nxt.id + ' →</a>' : '<span class="muted small">Unit-Ende → Prüfung im Chat</span>') + '</div>\n';

  let sec = 0; const S = t => { sec++; return '<div class="tx-sec">' + sec + ' · ' + t + '</div>'; };
  h += '<div class="card"><b>Lernziele</b><ul style="margin:6px 0 0;padding-left:20px">' + b.objectives.map(o=>'<li>'+o+'</li>').join("") + '</ul><p class="small muted">📖 Read every German line aloud before reading the translation.</p></div>\n';

  if(b.dialogue){ h += S("Dialogue") + '<div class="card tx-dialog">';
    b.dialogue.forEach(l=>{ h += '<div class="tx-line"><div class="who">'+l[0]+'</div><div class="body"><div class="tx-de">'+l[1]+'</div><div class="tx-en">'+l[2]+'</div></div></div>'; });
    h += '</div>\n'; }

  if(b.vocab.length){ h += S("Vocabulary") + '<div class="card"><table class="tx-vocab"><tr><th>German</th><th>Plural</th><th>English</th><th>Example</th></tr>';
    b.vocab.forEach(v=>{ h += '<tr><td>'+artColorS(v[0])+'</td><td>'+(v[1]?artColorS(v[1]):"–")+'</td><td>'+v[2]+'</td><td>'+v[3]+(v[4]?' <span class="muted">('+v[4]+')</span>':'')+'</td></tr>'; });
    h += '</table></div>\n';

    h += S("Flashcards — click to flip") + '<div class="card"><div class="fc-deck">';
    b.vocab.forEach((v,j)=>{ const front = v[1] ? artColorS(v[0].split(" ")[0]+" ___ "+v[0].split(" ").slice(1).join(" ")) : v[2];
      h += '<div class="fcflip"><input type="checkbox" id="f'+j+'"><label for="f'+j+'"><div class="inner"><div class="face front"><div class="s">'+(v[1]?"Artikel + Plural":"Bedeutung")+'</div><div class="t">'+front+'</div></div><div class="face back"><div class="s">Antwort</div><div class="t">'+artColorS(v[0])+(v[1]?' <span class="muted">· '+artColorS(v[1])+'</span>':'')+'</div></div></div></label></div>'; });
    h += '</div><p class="fc-hint">Print = cut-out sheet.</p></div>\n'; }

  if(b.grammar.length){ h += S("Grammar") ;
    b.grammar.forEach(g=>{ h += '<div class="card"><h2>'+g.title+'</h2>';
      if(g.meaning) h += '<div class="pron-tip">'+g.meaning+'</div>';
      if(g.table){ h += '<table class="gram-tbl"><tr>'+g.table[0].map(x=>'<th>'+x+'</th>').join("")+'</tr>'+g.table.slice(1).map(r=>'<tr>'+r.map((c,ci)=>'<td'+(ci===0?' style="font-weight:800;background:#fbfbfd"':'')+'>'+c+'</td>').join("")+'</tr>').join("")+'</table>'; }
      if(g.examples.length) h += g.examples.map(e=>'<div class="ex-line"><div><div class="de">'+e[0]+'</div><div class="en">'+e[1]+'</div></div></div>').join("");
      g.mistakes.forEach(m=>{ if(m[0]) h += '<div class="mistake-box"><span class="wrong">✗ '+m[0]+'</span> → <span class="right">'+m[1]+'</span><div class="small">'+m[2]+'</div></div>'; });
      if(g.diagram) h += '<div class="mermaid-box"><div class="cap">Diagramm</div><pre class="mermaid">\n'+g.diagram+'\n</pre></div>';
      h += '</div>'; }); }

  if(b.pron && !b.isReview){ h += S("Aussprache") + '<div class="card">';
    b.pron.tips.forEach(t=>h+='<div class="tx-speak">'+t+'</div>');
    h += '<p><b>Drills — 3× laut:</b></p>' + b.pron.drills.map(d=>'<div class="drill-line"><div class="txt">'+d+'</div></div>').join("");
    h += '<p class="small muted">🔊 Native-Beispiele: <a href="https://forvo.com/languages/de/" target="_blank">Forvo Deutsch</a></p></div>\n'; }

  if(b.listen && b.listen.length){ h += S("Hör-/Leseverständnis") + '<div class="card"><p class="small muted">Lies (oder hör es im Hybrid/Kursraum mit Audio) und wähle die richtige Antwort — Transkripte im Lösungsschlüssel.</p><ol>';
    b.listen.forEach(x=>{ h += '<li style="margin:10px 0">'+x[1]+'<br><span class="mcq">a) '+x[2][0]+' &nbsp; b) '+x[2][1]+' &nbsp; c) '+x[2][2]+'</span></li>'; });
    h += '</ol></div>\n'; }

  if(b.fun){ h += S("Fun &amp; Culture") + '<div class="card"><div class="riddle-box">🧩 <b>'+b.fun.riddle[0]+'</b><details class="akey" style="margin-top:8px"><summary>Show solution</summary>'+b.fun.riddle[1]+'</details></div><div class="kultur-box">🇩🇪 <b>Culture tip:</b> '+b.fun.culture+'</div><div class="challenge-box">🎯 <b>'+b.fun.challenge+'</b></div></div>\n'; }

  const fills = b.exs.fills, corr = b.exs.corrections;
  if(fills.length || corr.length){ h += S("Übungen") + '<div class="card tx-exblock">';
    if(fills.length){ h += '<h4>A. Ergänze:</h4><ol>'; fills.forEach(f=>{ h += '<li>'+f[0]+'____'+(f[1]||"")+(f[2]?' <span class="muted">('+f[2]+')</span>':'')+'</li>'; }); h += '</ol>'; }
    if(corr.length){ h += '<h4>B. Korrigiere:</h4><ol start="'+(fills.length+1)+'">'; corr.forEach(c=>{ h += '<li><i>'+c[0]+'</i></li>'; }); h += '</ol>'; }
    h += '<details class="akey"><summary>Solutions — open only after trying!</summary><ul>';
    fills.forEach((f,j)=>{ h += '<li><b>A'+(j+1)+':</b> <u>'+f[2]+'</u>'+(f[4]?' <span class="muted">— '+f[4]+'</span>':'')+'</li>'; });
    corr.forEach((c,j)=>{ h += '<li><b>B'+(fills.length+j+1)+':</b> <u>'+c[1][0]+'</u> <span class="muted">— '+c[2]+'</span></li>'; });
    b.listen.forEach((x,j)=>{ h += '<li><b>Hör'+(j+1)+':</b> <u>"'+ ["a","b","c"][x[3]] +'"</u> — Transkript: „'+x[0]+'“ ('+x[4]+')</li>'; });
    h += '</ul></details></div>\n'; }

  h += S("Quiz — self-test") + '<div class="tx-quiz"><p style="margin:0 0 4px"><b>Multiple Choice.</b></p><p class="small muted" style="margin:0">Decide first, then open the key. '+(b.isReview?'Unit test: pass at 8/12.':'Pass at 4/6.')+'</p><ol>';
  b.quiz.forEach(x=>{ h += '<li>'+x[0]+'<span class="mcq">a) '+x[1][0]+' &nbsp; b) '+x[1][1]+' &nbsp; c) '+x[1][2]+' &nbsp; d) '+x[1][3]+'</span></li>'; });
  h += '</ol><details class="akey"><summary>Answers &amp; explanations — open only after trying!</summary><ol>';
  b.quiz.forEach(x=>{ h += '<li><b>'+"abcd"[x[2]]+') '+x[1][x[2]]+'</b> <span class="why">— '+x[3]+'</span></li>'; });
  h += '</ol></details></div>\n';

  h += S("Review &amp; next steps") + '<div class="card"><div class="schedule">Words return: <b>+1 · +3 · +7 · +14 · +30 days</b> — flashcards above and in the chat review plan.</div>';
  if(b.ext) h += '<div class="pron-tip"><b>Externe Praxis:</b> '+b.ext+'</div>';
  h += '<p class="small">'+(b.isReview
    ? '📌 <b>Unit complete!</b> Come to the chat now for your <b>unit exam</b> — the next unit starts after that.'
    : (nxt ? '➡️ Next: <b>'+nxt.id+' · '+nxt.title+"</b> — or say \'next\' in the chat." : 'Module review next session.'))+'</p></div>\n';
  h += '<div class="foot-note">❓ Fragen? Frag deinen Lehrer im Chat · Audio-Version dieser Lektion: <a href="../hybrid/H-'+id+'.html">Hybrid</a> oder <a href="../kursraum/lessons/'+id+'.html">Kursraum</a></div>\n</main>\n</body>\n</html>\n';
  writeFileSync("textkurs/T-" + id + ".html", h);
}
function artColorS(s){ return String(s).replace(/\b(der|die|das)\b/g, m=>'<span class="art-'+m.toLowerCase()+'">'+m+'</span>'); }

let n = 0;
for(const b of Object.values(built)){
  const skipText = "textkurs/T-" + b.id + ".html";
  if(!(existsSync(skipText) && !readFileSync(skipText,"utf8").includes("scaffold:1"))){ renderTextkurs(b); n++; }
  if(!(b.id==="A1-M1-U1-L1")){
    renderInteractive(b, "hybrid"); renderInteractive(b, "kursraum"); n += 2;
  }
}
console.log("full lessons rendered:", n, "| lessons in data:", Object.keys(LESSONS).length, "| incl. reviews:", Object.keys(built).length);
