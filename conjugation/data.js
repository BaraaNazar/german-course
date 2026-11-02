// German verb conjugation database A1-C2
// Each verb: {inf, en, type, level, praesens:{...}, praeteritum:{...}, partizip, aux}

function reg(inf, en, level) {
  const stem = inf.replace(/en$/, "");
  const needsE = /(t|d|n|m)$/.test(stem);
  const e = needsE ? "e" : "";
  return { inf, en, type:"regular", level,
    praesens:{ich:stem+"e", du:stem+e+"st", er:stem+e+"t", wir:inf, ihr:stem+e+"t", sie:inf},
    praeteritum:{ich:stem+e+"te", du:stem+e+"test", er:stem+e+"te", wir:stem+e+"ten", ihr:stem+e+"tet", sie:stem+e+"ten"},
    partizip:"ge"+stem+e+"t", aux:"haben"};
}
function sep(inf, en, level, part) {
  const parts = inf.split(" ");
  const prefix = parts[0]; const stem = parts[1].replace(/en$/, "");
  const needsE = /(t|d|n|m)$/.test(stem);
  const e = needsE ? "e" : "";
  const p = part || prefix + "ge" + stem + e + "t";
  return { inf, en, type:"separable", level,
    praesens:{ich:stem+"e "+prefix, du:stem+e+"st "+prefix, er:stem+e+"t "+prefix, wir:inf, ihr:stem+e+"t "+prefix, sie:inf},
    praeteritum:{ich:stem+e+"te "+prefix, du:stem+e+"test "+prefix, er:stem+e+"te "+prefix, wir:stem+e+"ten "+prefix, ihr:stem+e+"tet "+prefix, sie:stem+e+"ten "+prefix},
    partizip:p, aux:"haben"};
}
function strong(inf, en, level, du2, er3, prat, part, aux) {
  const stem = inf.replace(/en$/, "");
  const du = du2 || stem; const er = er3 || du2 || stem;
  return { inf, en, type:"strong", level,
    praesens:{ich:stem+"e", du:du+"st", er:er+"t", wir:inf, ihr:stem+"t", sie:inf},
    praeteritum:{ich:prat, du:prat+"st", er:prat, wir:prat+"en", ihr:prat+"t", sie:prat+"en"},
    partizip:part, aux:aux||"haben"};
}
function irr(inf, en, level, pr, pt, part, aux) {
  return {inf, en, type:"irregular", level, praesens:pr, praeteritum:pt, partizip:part, aux:aux||"haben"};
}
function modal(inf, en, level, pr, pt) {
  return {inf, en, type:"modal", level, praesens:pr, praeteritum:pt, partizip:"–", aux:"haben"};
}
function refl(inf, en, level, pr, pt, part) {
  return {inf, en, type:"reflexive", level, praesens:pr, praeteritum:pt, partizip:part, aux:"haben"};
}

const ALL = [];
ALL.push(reg("machen","to do/make","A1"));
ALL.push(reg("wohnen","to live","A1"));
ALL.push(reg("lernen","to learn","A1"));
ALL.push(reg("kaufen","to buy","A1"));
ALL.push(reg("arbeiten","to work","A1"));
ALL.push(reg("spielen","to play","A1"));
ALL.push(reg("fragen","to ask","A1"));
ALL.push(reg("antworten","to answer","A1"));
ALL.push(reg("brauchen","to need","A1"));
ALL.push(reg("schenken","to give","A1"));
ALL.push(reg("öffnen","to open","A1"));
ALL.push(reg("suchen","to search","A1"));
ALL.push(reg("bezahlen","to pay","A1"));
ALL.push(reg("mieten","to rent","A1"));
ALL.push(reg("putzen","to clean","A1"));
ALL.push(reg("sammeln","to collect","A1"));
ALL.push(reg("bestellen","to order","A1"));
ALL.push(reg("passen","to fit","A1"));
ALL.push(reg("warten","to wait","A1"));
ALL.push(reg("zeigen","to show","A1"));
ALL.push(reg("hören","to hear","A1"));
ALL.push(reg("lieben","to love","A1"));
ALL.push(reg("glauben","to believe","A1"));
ALL.push(reg("schicken","to send","A1"));
ALL.push(reg("erzählen","to tell","A1"));
ALL.push(reg("kosten","to cost","A1"));
ALL.push(reg("danken","to thank","A1"));
ALL.push(reg("meldet","to report","A1"));
ALL.push(reg("versuchen","to try","A1"));
ALL.push(strong("sein","to be","A1",null,null,"war","gewesen","sein"));
ALL.push(strong("haben","to have","A1",null,null,"hatte","gehabt","haben"));
ALL.push(strong("werden","to become","A1","wirst","wird","wurde","geworden","sein"));
ALL.push(strong("gehen","to go","A1",null,null,"ging","gegangen","sein"));
ALL.push(strong("kommen","to come","A1",null,null,"kam","gekommen","sein"));
ALL.push(strong("sehen","to see","A1","sieh","sieht","sah","gesehen","haben"));
ALL.push(strong("sprechen","to speak","A1","sprich","spricht","sprach","gesprochen","haben"));
ALL.push(strong("essen","to eat","A1","iss","isst","aß","gegessen","haben"));
ALL.push(strong("trinken","to drink","A1",null,null,"trank","getrunken","haben"));
ALL.push(strong("fahren","to drive","A1","fahr","fährt","fuhr","gefahren","sein"));
ALL.push(strong("lesen","to read","A1","lies","liest","las","gelesen","haben"));
ALL.push(strong("schreiben","to write","A1",null,null,"schrieb","geschrieben","haben"));
ALL.push(strong("schlafen","to sleep","A1","schläf","schläft","schlief","geschlafen","haben"));
ALL.push(strong("nehmen","to take","A1","nimm","nimmt","nahm","genommen","haben"));
ALL.push(strong("bleiben","to stay","A1",null,null,"blieb","geblieben","sein"));
ALL.push(strong("tragen","to carry","A1","träg","trägt","trug","getragen","haben"));
ALL.push(strong("treffen","to meet","A1","triff","trifft","traf","getroffen","haben"));
ALL.push(strong("verstehen","to understand","A1",null,null,"verstand","verstanden","haben"));
ALL.push(strong("finden","to find","A1",null,null,"fand","gefunden","haben"));
ALL.push(strong("geben","to give","A1","gib","gibt","gab","gegeben","haben"));
ALL.push(strong("helfen","to help","A1","hilf","hilft","half","geholfen","haben"));
ALL.push(strong("denken","to think","A1",null,null,"dachte","gedacht","haben"));
ALL.push(strong("wissen","to know (fact)","A1",null,null,"wusste","gewusst","haben"));
ALL.push(strong("kennen","to know (person)","A1",null,null,"kannte","gekannt","haben"));
ALL.push(modal("können","can","A1",{ich:"kann",du:"kannst",er:"kann",wir:"können",ihr:"könnt",sie:"können"},{ich:"konnte",du:"konntest",er:"konnte",wir:"konnten",ihr:"konntet",sie:"konnten"}));
ALL.push(modal("müssen","must","A1",{ich:"muss",du:"musst",er:"muss",wir:"müssen",ihr:"müsst",sie:"müssen"},{ich:"musste",du:"musstest",er:"musste",wir:"mussten",ihr:"musstet",sie:"mussten"}));
ALL.push(modal("wollen","to want","A1",{ich:"will",du:"willst",er:"will",wir:"wollen",ihr:"wollt",sie:"wollen"},{ich:"wollte",du:"wolltest",er:"wollte",wir:"wollten",ihr:"wolltet",sie:"wollten"}));
ALL.push(modal("dürfen","may","A1",{ich:"darf",du:"darfst",er:"darf",wir:"dürfen",ihr:"dürft",sie:"dürfen"},{ich:"durfte",du:"durftest",er:"durfte",wir:"durften",ihr:"durftet",sie:"durften"}));
ALL.push(modal("sollen","should","A1",{ich:"soll",du:"sollst",er:"soll",wir:"sollen",ihr:"sollt",sie:"sollen"},{ich:"sollte",du:"solltest",er:"sollte",wir:"sollten",ihr:"solltet",sie:"sollten"}));
ALL.push(modal("möchten","would like","A1",{ich:"möchte",du:"möchtest",er:"möchte",wir:"möchten",ihr:"möchtet",sie:"möchten"},{ich:"möchte",du:"möchtest",er:"möchte",wir:"möchten",ihr:"möchtet",sie:"möchten"}));
ALL.push(strong("aufstehen","to get up","A1","steh","steht auf","stand auf","aufgestanden","sein"));
ALL.push(strong("anrufen","to call","A1","ruf","ruft an","rief an","angerufen","haben"));
ALL.push(strong("anfangen","to begin","A1","fäng","fängt an","fing an","angefangen","haben"));
ALL.push(reg("einkaufen","to shop","A1")); // handled as regular
ALL.push(reg("aufräumen","to tidy","A1"));
ALL.push(reg("aufmachen","to open","A1"));
ALL.push(reg("zumachen","to close","A1"));
ALL.push(reg("mitkommen","to come along","A1"));
ALL.push(reg("fernsehen","to watch TV","A1"));
ALL.push(reg("abholen","to pick up","A1"));
ALL.push(reg("beschreiben","to describe","A2"));
ALL.push(reg("entscheiden","to decide","A2"));
ALL.push(reg("vermeiden","to avoid","A2"));
ALL.push(reg("erledigen","to complete","A2"));
ALL.push(reg("verschieben","to postpone","A2"));
ALL.push(reg("vorbereiten","to prepare","A2"));
ALL.push(reg("erinnern","to remember","A2"));
ALL.push(reg("interessieren","to interest","A2"));
ALL.push(reg("trainieren","to train","A2"));
ALL.push(reg("sparen","to save","A2"));
ALL.push(reg("verdienen","to earn","A2"));
ALL.push(reg("wechseln","to change","A2"));
ALL.push(reg("ausfüllen","to fill out","A2"));
ALL.push(reg("unterschreiben","to sign","A2"));
ALL.push(reg("beantragen","to apply for","A2"));
ALL.push(reg("kündigen","to terminate","A2"));
ALL.push(reg("benachrichtigen","to notify","A2"));
ALL.push(reg("versichern","to insure","A2"));
ALL.push(reg("reparieren","to repair","A2"));
ALL.push(reg("renovieren","to renovate","A2"));
ALL.push(reg("organisieren","to organize","A2"));
ALL.push(reg("reservieren","to reserve","A2"));
ALL.push(reg("buchen","to book","A2"));
ALL.push(reg("empfehlen","to recommend","A2"));
ALL.push(strong("bieten","to offer","A2",null,null,"bot","geboten","haben"));
ALL.push(strong("fallen","to fall","A2","fäl","fällt","fiel","gefallen","sein"));
ALL.push(strong("singen","to sing","A2",null,null,"sang","gesungen","haben"));
ALL.push(strong("vergleichen","to compare","A2",null,null,"verglich","verglichen","haben"));
ALL.push(strong("versprechen","to promise","A2","versprich","verspricht","versprach","versprochen","haben"));
ALL.push(strong("werfen","to throw","A2","wirf","wirft","warf","geworfen","haben"));
ALL.push(strong("ziehen","to pull","A2",null,null,"zog","gezogen","haben"));
ALL.push(strong("bitten","to request","A2",null,null,"bat","gebeten","haben"));
ALL.push(strong("halten","to hold","A2","hält","hält","hielt","gehalten","haben"));
ALL.push(strong("streiten","to argue","A2",null,null,"stritt","gestritten","haben"));
ALL.push(strong("vergessen","to forget","A2","vergiss","vergisst","vergaß","vergessen","haben"));
ALL.push(strong("erscheinen","to appear","A2",null,null,"erschien","erschienen","sein"));
ALL.push(strong("steigen","to climb","A2",null,null,"stieg","gestiegen","sein"));
ALL.push(strong("schneiden","to cut","A2",null,null,"schnitt","geschnitten","haben"));
ALL.push(strong("binden","to bind","A2",null,null,"band","gebunden","haben"));
ALL.push(strong("waschen","to wash","A2","wäsch","wäscht","wusch","gewaschen","haben"));
ALL.push(strong("laufen","to run","A2","läuf","läuft","lief","gelaufen","sein"));
ALL.push(strong("empfehlen","to recommend","A2","empfiehl","empfiehlt","empfahl","empfohlen","haben"));
ALL.push(strong("beginnen","to begin","A2",null,null,"begann","begonnen","haben"));
ALL.push(strong("gewinnen","to win","A2",null,null,"gewann","gewonnen","haben"));
ALL.push(refl("sich freuen","to be happy","A2",{ich:"freue mich",du:"freust dich",er:"freut sich",wir:"freuen uns",ihr:"freut euch",sie:"freuen sich"},{ich:"freute mich",du:"freutest dich",er:"freute sich",wir:"freuten uns",ihr:"freutet euch",sie:"freuten sich"},"gefreut"));
ALL.push(refl("sich treffen","to meet","A2",{ich:"treffe mich",du:"triffst dich",er:"trifft sich",wir:"treffen uns",ihr:"trefft euch",sie:"treffen sich"},{ich:"traf mich",du:"trafst dich",er:"traf sich",wir:"trafen uns",ihr:"traft euch",sie:"trafen sich"},"getroffen"));
ALL.push(refl("sich erinnern","to remember","A2",{ich:"erinnere mich",du:"erinnerst dich",er:"erinnert sich",wir:"erinnern uns",ihr:"erinnert euch",sie:"erinnern sich"},{ich:"erinnerte mich",du:"erinnertest dich",er:"erinnerte sich",wir:"erinnerten uns",ihr:"erinnertet euch",sie:"erinnerten sich"},"erinnert"));
ALL.push(refl("sich interessieren","to be interested","A2",{ich:"interessiere mich",du:"interessierst dich",er:"interessiert sich",wir:"interessieren uns",ihr:"interessiert euch",sie:"interessieren sich"},{ich:"interessierte mich",du:"interessiertest dich",er:"interessierte sich",wir:"interessierten uns",ihr:"interessiertet euch",sie:"interessierten sich"},"interessiert"));
ALL.push(refl("sich duschen","to shower","A2",{ich:"dusche mich",du:"duschst dich",er:"duscht sich",wir:"duschen uns",ihr:"duscht euch",sie:"duschen sich"},{ich:"duschte mich",du:"duschtest dich",er:"duschte sich",wir:"duschten uns",ihr:"duschtet euch",sie:"duschten sich"},"geduscht"));
ALL.push(refl("sich beeilen","to hurry","A2",{ich:"beeile mich",du:"beeilst dich",er:"beeilt sich",wir:"beeilen uns",ihr:"beeilt euch",sie:"beeilen sich"},{ich:"beeilte mich",du:"beeiltest dich",er:"beeilte sich",wir:"beeilten uns",ihr:"beeiltet euch",sie:"beeilten sich"},"beeilt"));
ALL.push(refl("sich bewerben","to apply","A2",{ich:"bewerbe mich",du:"bewirbst dich",er:"bewirbt sich",wir:"bewerben uns",ihr:"bewirbt euch",sie:"bewerben sich"},{ich:"bewarb mich",du:"bewarbst dich",er:"bewarb sich",wir:"bewarben uns",ihr:"bewarbt euch",sie:"bewarben sich"},"beworben"));
ALL.push(reg("beeinflussen","to influence","B1"));
ALL.push(reg("differenzieren","to differentiate","B1"));
ALL.push(reg("dokumentieren","to document","B1"));
ALL.push(reg("evaluieren","to evaluate","B1"));
ALL.push(reg("formulieren","to formulate","B1"));
ALL.push(reg("koordinieren","to coordinate","B1"));
ALL.push(reg("motivieren","to motivate","B1"));
ALL.push(reg("optimieren","to optimize","B1"));
ALL.push(reg("priorisieren","to prioritize","B1"));
ALL.push(reg("reduzieren","to reduce","B1"));
ALL.push(reg("strukturieren","to structure","B1"));
ALL.push(reg("verhandeln","to negotiate","B1"));
ALL.push(reg("vermitteln","to convey","B1"));
ALL.push(reg("wahrnehmen","to perceive","B1"));
ALL.push(reg("berücksichtigen","to consider","B1"));
ALL.push(reg("ermitteln","to investigate","B1"));
ALL.push(reg("durchführen","to carry out","B1"));
ALL.push(reg("einsetzen","to deploy","B1"));
ALL.push(reg("umsetzen","to implement","B1"));
ALL.push(reg("vorantreiben","to drive forward","B1"));
ALL.push(strong("beschließen","to resolve","B1","beschließ","beschließt","beschloss","beschlossen","haben"));
ALL.push(strong("gelingen","to succeed","B1",null,"gelingt","gelang","gelungen","sein"));
ALL.push(strong("geschehen","to happen","B1",null,"geschieht","geschah","geschehen","sein"));
ALL.push(strong("leiden","to suffer","B1",null,null,"litt","gelitten","haben"));
ALL.push(strong("riechen","to smell","B1",null,null,"roch","gerochen","haben"));
ALL.push(strong("schweigen","to be silent","B1",null,null,"schwieg","geschwiegen","haben"));
ALL.push(strong("wachsen","to grow","B1","wächs","wächst","wuchs","gewachsen","sein"));
ALL.push(strong("brechen","to break","B1","brich","bricht","brach","gebrochen","haben"));
ALL.push(strong("brennen","to burn","B1",null,null,"brannte","gebrannt","haben"));
ALL.push(strong("klingen","to sound","B1",null,null,"klang","geklungen","haben"));
ALL.push(strong("scheinen","to shine","B1",null,null,"schien","geschienen","haben"));
ALL.push(strong("verzeihen","to forgive","B1",null,null,"verzieh","verziehen","haben"));
ALL.push(strong("weichen","to yield","B1",null,null,"wich","gewichen","sein"));
ALL.push(strong("treiben","to drive","B1",null,null,"trieb","getrieben","haben"));
ALL.push(strong("braten","to roast","B1","brät","brät","briet","gebraten","haben"));
ALL.push(reg("annektieren","to annex","B2"));
ALL.push(reg("genehmigen","to approve","B2"));
ALL.push(reg("gewaehrleisten","to guarantee","B2"));
ALL.push(reg("legalisieren","to legalize","B2"));
ALL.push(reg("subventionieren","to subsidize","B2"));
ALL.push(reg("verschluesseln","to encrypt","B2"));
ALL.push(reg("drosseln","to throttle","B2"));
ALL.push(reg("mobilmachen","to mobilize","B2"));
ALL.push(reg("haftbar machen","to hold liable","B2"));
ALL.push(reg("beanstanden","to object to","C1"));
ALL.push(reg("gewaehren","to grant","C1"));
ALL.push(reg("erkunden","to explore","C1"));
ALL.push(reg("legalisieren","to legalize","C1"));
ALL.push(reg("kultivieren","to cultivate","C2"));
ALL.push(reg("rekapitulieren","to recapitulate","C2"));
ALL.push(strong("beruhen auf","to be based on","B2",null,"beruht","beruhte","beruht","haben"));
ALL.push(strong("enthuellen","to reveal","B2",null,null,"enthuellte","enthuellt","haben"));
ALL.push(strong("erschliessen","to develop","B2",null,null,"erschloss","erschlossen","haben"));
ALL.push(strong("vorantreiben","to propel","B2","treib","treibt voran","trieb voran","vorangetrieben","haben"));
ALL.push(strong("auseinandersetzen","to examine","B1","setzt","setzt auseinander","setzte auseinander","auseinandergesetzt","haben"));
ALL.push(strong("beruhen","to be based","C1",null,"beruht","beruhte","beruht","haben"));
ALL.push(strong("durchsetzen","to enforce","C1","setzt","setzt durch","setzte durch","durchgesetzt","haben"));
ALL.push(strong("wahrnehmen","to perceive","C1","nimm","nimmt wahr","nahm wahr","wahrgenommen","haben"));
ALL.push(strong("durchdringen","to penetrate","C1","dring","dringt durch","drang durch","durchdrungen","haben"));
ALL.push(strong("sich verinnerlichen","to internalize","C1",null,null,"verinnerlichte","verinnerlicht","haben"));
ALL.push(strong("verschweigen","to conceal","C2",null,null,"verschwieg","verschwiegen","haben"));
ALL.push(strong("beschreiten","to tread","C2",null,null,"beschritt","beschritten","haben"));
ALL.push(strong("entlarven","to expose","C2",null,null,"entlarvte","entlarvt","haben"));

const VERBS = ALL;
const LEVELS = {
  A1: { name: "A1 · Beginner", color: "#16a34a" },
  A2: { name: "A2 · Elementary", color: "#2563eb" },
  B1: { name: "B1 · Intermediate", color: "#ea580c" },
  B2: { name: "B2 · Upper Intermediate", color: "#7c3aed" },
  C1: { name: "C1 · Advanced", color: "#be185d" },
  C2: { name: "C2 · Mastery", color: "#0f172a" },
};
const TYPE_INFO = {
  regular: { name: "Regelmäßig", color: "#16a34a" },
  strong: { name: "Stark", color: "#ea580c" },
  irregular: { name: "Unregelmäßig", color: "#dc2626" },
  modal: { name: "Modal", color: "#7c3aed" },
  separable: { name: "Trennbar", color: "#0891b2" },
  reflexive: { name: "Reflexiv", color: "#be185d" },
};
