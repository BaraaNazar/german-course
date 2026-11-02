// German verb conjugation database — A1 through C2
// Compact format: [infinitive, en, type, level, stem2du, stem3, prätStem, partizip, aux]
// For regular verbs: stem2du/stem3 = null (auto-generate), prätStem = stem+"te"
// For strong verbs: stem2du = du-form stem, stem3 = er-form stem, prätStem = Präteritum singular stem

// Helpers
function regVerb(inf, en, level, sep) {
  const stem = sep ? inf.split(" ")[0] : inf;
  const prefix = sep ? inf.split(" ").slice(1).join(" ") : "";
  const join = (s) => sep ? s + " " + prefix : s;
  const needsE = /t$|d$|n$|m$/.test(stem) && !/en$/.test(stem);
  const e = needsE ? "e" : "";
  // Handle stem changes (e→i, e→ie, a→ä)
  return {
    inf, en, type: sep ? "separable" : "regular", level,
    praesens: {
      ich: join(stem + "e"), du: join(stem + e + "st"), er: join(stem + e + "t"),
      wir: join(inf), ihr: join(stem + e + "t"), sie: join(inf)
    },
    praeteritum: {
      ich: join(stem + e + "te"), du: join(stem + e + "test"), er: join(stem + e + "te"),
      wir: join(stem + e + "ten"), ihr: join(stem + e + "tet"), sie: join(stem + e + "ten")
    },
    partizip: sep ? (prefix ? prefix + "ge" + stem + e + "t" : "ge" + stem + e + "t") : "ge" + stem + e + "t",
    aux: "haben"
  };
}

function strongVerb(inf, en, level, p2, p3, prat, part, aux, sep) {
  const stem = sep ? inf.split(" ")[0] : inf.replace(/en$/, "");
  const prefix = sep ? inf.split(" ").slice(1).join(" ") : "";
  const join = (s) => sep ? s + " " + prefix : s;
  const du = p2 || stem;
  const er = p3 || p2 || stem;
  return {
    inf, en, type: sep ? "separable" : "strong", level,
    praesens: {
      ich: join(stem + "e"), du: join(du + "st"), er: join(er + "t"),
      wir: join(inf), ihr: join(stem + "t"), sie: join(inf)
    },
    praeteritum: {
      ich: join(prat), du: join(prat + "st"), er: join(prat),
      wir: join(prat + "en"), ihr: join(prat + "t"), sie: join(prat + "en")
    },
    partizip: part, aux: aux || "haben"
  };
}

function irrVerb(inf, en, level, pr, pt, part, aux) {
  return {
    inf, en, type: "irregular", level,
    praesens: pr, praeteritum: pt, partizip: part, aux: aux || "haben"
  };
}

function modalVerb(inf, en, level, pr, pt) {
  return {
    inf, en, type: "modal", level,
    praesens: pr, praeteritum: pt, partizip: "ge" + inf.replace(/ö/,"o").replace(/ü/,"u") + "t", aux: "haben"
  };
}

function reflVerb(inf, en, level, pr, pt, part) {
  return {
    inf, en, type: "reflexive", level,
    praesens: pr, praeteritum: pt, partizip: part || "gesich" + inf.replace("sich ","").replace(/en$/,"") + "t", aux: "haben"
  };
}

const P = { ich:"",du:"",er:"",wir:"",ihr:"",sie:"" }; // pronoun key map

// Build all verbs
const ALL = [];

// ===== A1 LEVEL (90 verbs) =====

// A1 Regular (40)
[["machen","to do/make"],["wohnen","to live"],["lernen","to learn"],["kaufen","to buy"],
["arbeiten","to work"],["spielen","to play"],["fragen","to ask"],["antworten","to answer"],
["brauchen","to need"],["schenken","to give (gift)"],["öffnen","to open"],["suchen","to search"],
["bezahlen","to pay"],["mieten","to rent"],["putzen","to clean"],["packen","to pack"],
["sammeln","to collect"],["bestellen","to order"],["erlauben","to allow"],["passen","to fit"],
["verkaufen","to sell"],["warten","to wait"],["wünschen","to wish"],["zeigen","to show"],
["hören","to hear"],["lieben","to love"],["glauben","to believe"],["danke","to thank"],
["schicken","to send"],["melden","to report"],["zahlen","to pay"],["können","can"],
].forEach(([inf,en]) => ALL.push(regVerb(inf,en,"A1")));

// A1 Strong/Irregular (30)
ALL.push(strongVerb("sein","to be","A1","bist","ist","war","gewesen","sein"));
ALL.push(strongVerb("haben","to have","A1","hast","hat","hatte","gehabt","haben"));
ALL.push(strongVerb("werden","to become","A1","wirst","wird","wurde","geworden","sein"));
ALL.push(strongVerb("gehen","to go","A1",null,null,"ging","gegangen","sein"));
ALL.push(strongVerb("kommen","to come","A1",null,null,"kam","gekommen","sein"));
ALL.push(strongVerb("sehen","to see","A1","siehst","sieht","sah","gesehen","haben"));
ALL.push(strongVerb("sprechen","to speak","A1","sprichst","spricht","sprach","gesprochen","haben"));
ALL.push(strongVerb("essen","to eat","A1","isst","isst","aß","gegessen","haben"));
ALL.push(strongVerb("trinken","to drink","A1",null,null,"trank","getrunken","haben"));
ALL.push(strongVerb("fahren","to drive","A1","fährst","fährt","fuhr","gefahren","sein"));
ALL.push(strongVerb("lesen","to read","A1","liest","liest","las","gelesen","haben"));
ALL.push(strongVerb("schreiben","to write","A1",null,null,"schrieb","geschrieben","haben"));
ALL.push(strongVerb("schlafen","to sleep","A1","schläfst","schläft","schlief","geschlafen","haben"));
ALL.push(strongVerb("nehmen","to take","A1","nimmst","nimmt","nahm","genommen","haben"));
ALL.push(strongVerb("bleiben","to stay","A1",null,null,"blieb","geblieben","sein"));
ALL.push(strongVerb("tragen","to carry/wear","A1","trägst","trägt","trug","getragen","haben"));
ALL.push(strongVerb("treffen","to meet","A1","triffst","trifft","traf","getroffen","haben"));
ALL.push(strongVerb("verstehen","to understand","A1",null,null,"verstand","verstanden","haben"));
ALL.push(strongVerb("finden","to find","A1",null,null,"fand","gefunden","haben"));
ALL.push(strongVerb("geben","to give","A1","gibst","gibt","gab","gegeben","haben"));
ALL.push(strongVerb("helfen","to help","A1","hilfst","hilft","half","geholfen","haben"));
ALL.push(strongVerb("denken","to think","A1",null,null,"dachte","gedacht","haben"));
ALL.push(strongVerb("wissen","to know (fact)","A1",null,null,"wusste","gewusst","haben"));
ALL.push(strongVerb("kennen","to know (person)","A1",null,null,"kannte","gekannt","haben"));
ALL.push(strongVerb("laufen","to walk/run","A1","läufst","läuft","lief","gelaufen","sein"));
ALL.push(strongVerb("waschen","to wash","A1","wäschst","wäscht","wusch","gewaschen","haben"));
ALL.push(strongVerb("beginnen","to begin","A1",null,null,"begann","begonnen","haben"));
ALL.push(strongVerb("gewinnen","to win","A1",null,null,"gewann","gewonnen","haben"));
ALL.push(strongVerb("verlieren","to lose","A1",null,null,"verlor","verloren","haben"));
ALL.push(strongVerb("empfehlen","to recommend","A1","empfiehlst","empfiehlt","empfahl","empfohlen","haben"));

// A1 Modal (6)
ALL.push(modalVerb("können","can / be able to","A1",{ich:"kann",du:"kannst",er:"kann",wir:"können",ihr:"könnt",sie:"können"},{ich:"konnte",du:"konntest",er:"konnte",wir:"konnten",ihr:"konntet",sie:"konnten"}));
ALL.push(modalVerb("müssen","must / have to","A1",{ich:"muss",du:"musst",er:"muss",wir:"müssen",ihr:"müsst",sie:"müssen"},{ich:"musste",du:"musstest",er:"musste",wir:"mussten",ihr:"musstet",sie:"mussten"}));
ALL.push(modalVerb("wollen","to want","A1",{ich:"will",du:"willst",er:"will",wir:"wollen",ihr:"wollt",sie:"wollen"},{ich:"wollte",du:"wolltest",er:"wollte",wir:"wollten",ihr:"wolltet",sie:"wollten"}));
ALL.push(modalVerb("dürfen","may / be allowed","A1",{ich:"darf",du:"darfst",er:"darf",wir:"dürfen",ihr:"dürft",sie:"dürfen"},{ich:"durfte",du:"durftest",er:"durfte",wir:"durften",ihr:"durftet",sie:"durften"}));
ALL.push(modalVerb("sollen","should","A1",{ich:"soll",du:"sollst",er:"soll",wir:"sollen",ihr:"sollt",sie:"sollen"},{ich:"sollte",du:"solltest",er:"sollte",wir:"sollten",ihr:"solltet",sie:"sollten"}));
ALL.push(modalVerb("möchten","would like","A1",{ich:"möchte",du:"möchtest",er:"möchte",wir:"möchten",ihr:"möchtet",sie:"möchten"},{ich:"möchte",du:"möchtest",er:"möchte",wir:"möchten",ihr:"möchtet",sie:"möchten"}));

// A1 Separable (14)
ALL.push(strongVerb("aufstehen","to get up","A1","stehst auf","steht auf","stand auf","aufgestanden","sein","auf"));
ALL.push(strongVerb("anrufen","to call (phone)","A1","rufst an","ruft an","rief an","angerufen","haben","an"));
ALL.push(strongVerb("anfangen","to begin","A1","fängst an","fängt an","fing an","angefangen","haben","an"));
ALL.push(regVerb("einkaufen","to shop","A1","ein"));
ALL.push(strongVerb("fernsehen","to watch TV","A1","siehst fern","sieht fern","sah fern","ferngesehen","haben","fern"));
ALL.push(regVerb("aufräumen","to tidy up","A1","auf"));
ALL.push(strongVerb("mitbringen","to bring along","A1",null,null,"brachte mit","mitgebracht","haben","mit"));
ALL.push(strongVerb("zurückkommen","to come back","A1",null,null,"kam zurück","zurückgekommen","sein","zurück"));
ALL.push(regVerb("abholen","to pick up","A1","ab"));
ALL.push(regVerb("aufmachen","to open up","A1","auf"));
ALL.push(regVerb("zumachen","to close","A1","zu"));
ALL.push(regVerb("einschalten","to turn on","A1","ein"));
ALL.push(regVerb("ausschalten","to turn off","A1","aus"));
ALL.push(regVerb("mitkommen","to come along","A1","mit"));

// ===== A2 LEVEL (70 verbs) =====

// A2 Regular (25)
[["erzählen","to tell"],["beschreiben","to describe"],["entscheiden","to decide"],
["vermeiden","to avoid"],["erledigen","to complete"],["verschieben","to postpone"],
["versuchen","to try"],["vorbereiten","to prepare"],["erinnern","to remember"],
["interessieren","to interest"],["trainieren","to train"],["sparen","to save (money)"],
["ausgeben","to spend"],["verdienen","to earn"],["wechseln","to change"],
["ausfüllen","to fill out"],["unterschreiben","to sign"],["beantragen","to apply for"],
["widerrufen","to revoke"],["kündigen","to terminate"],["benachrichtigen","to notify"],
["versichern","to insure"],["reparieren","to repair"],["renovieren","to renovate"],
["organisieren","to organize"],
].forEach(([inf,en]) => ALL.push(regVerb(inf,en,"A2")));

// A2 Strong (25)
ALL.push(strongVerb("bieten","to offer","A2",null,null,"bot","geboten","haben"));
ALL.push(strongVerb("einladen","to invite","A2","lädst ein","lädt ein","lud ein","eingeladen","haben"));
ALL.push(strongVerb("entschließen","to resolve","A2","entschließt","entschließt","entschloss","entschlossen","haben"));
ALL.push(strongVerb("empfangen","to receive","A2","empfängst","empfängt","empfing","empfangen","haben"));
ALL.push(strongVerb("fallen","to fall","A2","fällst","fällt","fiel","gefallen","sein"));
ALL.push(strongVerb("singen","to sing","A2",null,null,"sang","gesungen","haben"));
ALL.push(strongVerb("verbieten","to forbid","A2","verbietest","verbietet","verbot","verboten","haben"));
ALL.push(strongVerb("vergleichen","to compare","A2",null,null,"verglich","verglichen","haben"));
ALL.push(strongVerb("versprechen","to promise","A2","versprichst","verspricht","versprach","versprochen","haben"));
ALL.push(strongVerb("werfen","to throw","A2","wirfst","wirft","warf","geworfen","haben"));
ALL.push(strongVerb("ziehen","to pull/move","A2",null,null,"zog","gezogen","haben"));
ALL.push(strongVerb("bitten","to request","A2",null,null,"bat","gebeten","haben"));
ALL.push(strongVerb("heißen","to be called","A2",null,null,"hieß","geheißen","haben"));
ALL.push(strongVerb("halten","to hold","A2","hältst","hält","hielt","gehalten","haben"));
ALL.push(strongVerb("treiben","to drive/do","A2",null,null,"trieb","getrieben","haben"));
ALL.push(strongVerb("schneiden","to cut","A2",null,null,"schnitt","geschnitten","haben"));
ALL.push(strongVerb("streiten","to argue","A2",null,null,"stritt","gestritten","haben"));
ALL.push(strongVerb("vergessen","to forget","A2","vergisst","vergisst","vergaß","vergessen","haben"));
ALL.push(strongVerb("erscheinen","to appear","A2",null,null,"erschien","erschienen","sein"));
ALL.push(strongVerb("sinken","to sink","A2",null,null,"sank","gesunken","sein"));
ALL.push(strongVerb("steigen","to climb","A2",null,null,"stieg","gestiegen","sein"));
ALL.push(strongVerb("schreiten","to stride","A2",null,null,"schritt","geschritten","haben"));
ALL.push(strongVerb("biegen","to bend","A2",null,null,"bog","gebogen","haben"));
ALL.push(strongVerb("binden","to bind","A2",null,null,"band","gebunden","haben"));
ALL.push(strongVerb("braten","to roast","A2","brätst","brät","briet","gebraten","haben"));

// A2 Reflexive (10)
ALL.push(reflVerb("sich freuen","to be happy","A2",
  {ich:"freue mich",du:"freust dich",er:"freut sich",wir:"freuen uns",ihr:"freut euch",sie:"freuen sich"},
  {ich:"freute mich",du:"freutest dich",er:"freute sich",wir:"freuten uns",ihr:"freutet euch",sie:"freuten sich"},"gefreut"));
ALL.push(reflVerb("sich treffen","to meet","A2",
  {ich:"treffe mich",du:"triffst dich",er:"trifft sich",wir:"treffen uns",ihr:"trefft euch",sie:"treffen sich"},
  {ich:"traf mich",du:"trafst dich",er:"traf sich",wir:"trafen uns",ihr:"traft euch",sie:"trafen sich"},"getroffen"));
ALL.push(reflVerb("sich interessieren","to be interested","A2",
  {ich:"interessiere mich",du:"interessierst dich",er:"interessiert sich",wir:"interessieren uns",ihr:"interessiert euch",sie:"interessieren sich"},
  {ich:"interessierte mich",du:"interessiertest dich",er:"interessierte sich",wir:"interessierten uns",ihr:"interessiertet euch",sie:"interessierten sich"},"interessiert"));
ALL.push(reflVerb("sich erinnern","to remember","A2",
  {ich:"erinnere mich",du:"erinnerst dich",er:"erinnert sich",wir:"erinnern uns",ihr:"erinnert euch",sie:"erinnern sich"},
  {ich:"erinnerte mich",du:"erinnertest dich",er:"erinnerte sich",wir:"erinnerten uns",ihr:"erinnertet euch",sie:"erinnerten sich"},"erinnert"));
ALL.push(reflVerb("sich duschen","to shower","A2",
  {ich:"dusche mich",du:"duschst dich",er:"duscht sich",wir:"duschen uns",ihr:"duscht euch",sie:"duschen sich"},
  {ich:"duschte mich",du:"duschtest dich",er:"duschte sich",wir:"duschten uns",ihr:"duschtet euch",sie:"duschten sich"},"geduscht"));
ALL.push(reflVerb("sich anziehen","to get dressed","A2",
  {ich:"ziehe mich an",du:"ziehst dich an",er:"zieht sich an",wir:"ziehen uns an",ihr:"zieht euch an",sie:"ziehen sich an"},
  {ich:"zog mich an",du:"zogst dich an",er:"zog sich an",wir:"zogen uns an",ihr:"zogt euch an",sie:"zogen sich an"},"angezogen"));
ALL.push(reflVerb("sich beeilen","to hurry","A2",
  {ich:"beeile mich",du:"beeilst dich",er:"beeilt sich",wir:"beeilen uns",ihr:"beeilt euch",sie:"beeilen sich"},
  {ich:"beeilte mich",du:"beeiltest dich",er:"beeilte sich",wir:"beeilten uns",ihr:"beeiltet euch",sie:"beeilten sich"},"beeilt"));
ALL.push(reflVerb("sich bewerben","to apply","A2",
  {ich:"bewerbe mich",du:"bewirbst dich",er:"bewirbt sich",wir:"bewerben uns",ihr:"bewirbt euch",sie:"bewerben sich"},
  {ich:"bewarb mich",du:"bewarbst dich",er:"bewarb sich",wir:"bewarben uns",ihr:"bewarbt euch",sie:"bewarben sich"},"beworben"));
ALL.push(reflVerb("sich gewöhnen","to get used to","A2",
  {ich:"gewöhne mich",du:"gewöhnst dich",er:"gewöhnt sich",wir:"gewöhnen uns",ihr:"gewöhnt euch",sie:"gewöhnen sich"},
  {ich:"gewöhnte mich",du:"gewöhntest dich",er:"gewöhnte sich",wir:"gewöhnten uns",ihr:"gewöhntet euch",sie:"gewöhnten sich"},"gewöhnt"));
ALL.push(reflVerb("sich verspäten","to be late","A2",
  {ich:"verspäte mich",du:"verspätest dich",er:"verspätet sich",wir:"verspäten uns",ihr:"verspätet euch",sie:"verspäten sich"},
  {ich:"verspäte mich",du:"verspätest dich",er:"verspätet sich",wir:"verspäten uns",ihr:"verspätet euch",sie:"verspäten sich"},"verspätet"));

// A2 Separable (10)
ALL.push(regVerb("anbieten","to offer","A2","an"));
ALL.push(regVerb("aufhören","to stop","A2","auf"));
ALL.push(regVerb("ausgeben (A2)","to spend","A2","aus"));
ALL.push(regVerb("einkaufen (A2)","to shop","A2","ein"));
ALL.push(regVerb("erkundigen","to inquire","A2"));
ALL.push(regVerb("fernsehen (A2)","to watch TV","A2","fern"));
ALL.push(regVerb("teilnehmen","to participate","A2","teil"));
ALL.push(regVerb("vorschlagen","to suggest","A2","vor"));
ALL.push(regVerb("weitergehen","to continue","A2","weiter"));
ALL.push(regVerb("zunehmen","to increase","A2","zu"));

// ===== B1 LEVEL (50 verbs) =====

// B1 Regular (20)
[["beeinflussen","to influence"],["beteiligen","to participate"],["differenzieren","to differentiate"],
["dokumentieren","to document"],["evaluieren","to evaluate"],["formulieren","to formulate"],
["implementieren","to implement"],["interpretieren","to interpret"],["koordinieren","to coordinate"],
["motivieren","to motivate"],["optimieren","to optimize"],["organisieren (B1)","to organize"],
["priorisieren","to prioritize"],["reduzieren","to reduce"],["strukturieren","to structure"],
["verantworten","to be responsible"],["verhandeln","to negotiate"],["vermitteln","to convey"],
["versichern (B1)","to assure"],["wahrnehmen","to perceive"],
].forEach(([inf,en]) => ALL.push(regVerb(inf,en,"B1")));

// B1 Strong (20)
ALL.push(strongVerb("beschließen","to resolve","B1","beschließt","beschließt","beschloss","beschlossen","haben"));
ALL.push(strongVerb("bergen","to rescue","B1",null,null,"barg","geborgen","haben"));
ALL.push(strongVerb("erschrecken","to frighten","B1","erschrickst","erschrickt","erschrak","erschrocken","sein"));
ALL.push(strongVerb("gewinnen (B1)","to win","B1",null,null,"gewann","gewonnen","haben"));
ALL.push(strongVerb("gelingen","to succeed","B1",null,"gelingt","gelang","gelungen","sein"));
ALL.push(strongVerb("geschehen","to happen","B1",null,"geschieht","geschah","geschehen","sein"));
ALL.push(strongVerb("leiden","to suffer","B1",null,null,"litt","gelitten","haben"));
ALL.push(strongVerb("misslingen","to fail","B1",null,"misslingt","misslang","misslungen","sein"));
ALL.push(strongVerb("riechen","to smell","B1",null,null,"roch","gerochen","haben"));
ALL.push(strongVerb("schweigen","to be silent","B1",null,null,"schwieg","geschwiegen","haben"));
ALL.push(strongVerb("stoßen","to push","B1","stößt","stößt","stieß","gestoßen","haben"));
ALL.push(strongVerb("streichen","to stroke/delete","B1",null,null,"strich","gestrichen","haben"));
ALL.push(strongVerb("verzeihen","to forgive","B1",null,null,"verzieh","verziehen","haben"));
ALL.push(strongVerb("weichen","to yield","B1",null,null,"wich","gewichen","sein"));
ALL.push(strongVerb("wachsen","to grow","B1","wächst","wächst","wuchs","gewachsen","sein"));
ALL.push(strongVerb("werben","to advertise","B1","wirbst","wirbt","warb","geworben","haben"));
ALL.push(strongVerb("brechen","to break","B1","brichst","bricht","brach","gebrochen","haben"));
ALL.push(strongVerb("brennen","to burn","B1",null,null,"brannte","gebrannt","haben"));
ALL.push(strongVerb("klingen","to sound","B1",null,null,"klang","geklungen","haben"));
ALL.push(strongVerb("scheinen","to shine/seem","B1",null,null,"schien","geschienen","haben"));

// B1 Separable (10)
ALL.push(strongVerb("aufgeben","to give up","B1","gibst auf","gibt auf","gab auf","aufgegeben","haben","auf"));
ALL.push(regVerb("beitragen","to contribute","B1","bei"));
ALL.push(strongVerb("hinterfragen","to question","B1",null,null,"hinterfragte","hinterfragt","haben"));
ALL.push(regVerb("nachdenken","to reflect","B1","nach"));
ALL.push(regVerb("stattfinden","to take place","B1","statt"));
ALL.push(regVerb("vorbeugen","to prevent","B1","vor"));
ALL.push(strongVerb("vorwerfen","to accuse","B1","wirfst vor","wirft vor","warf vor","vorgeworfen","haben","vor"));
ALL.push(regVerb("weiterbilden","to continue education","B1","weiter"));
ALL.push(regVerb("zusammenarbeiten","to collaborate","B1","zusammen"));
ALL.push(regVerb("zufriedenstellen","to satisfy","B1","zufrieden"));

// ===== B2 LEVEL (40 verbs) =====

// B2 Regular (20)
[["annektieren","to annex"],["beeintraechtigen","to impair"],["begradigen","to straighten"],
["beschraenken","to restrict"],["differenzieren (B2)","to differentiate"],["diskriminieren","to discriminate"],
["drosseln","to throttle"],["genehmigen","to approve"],["gewaehrleisten","to guarantee"],
["legalisieren","to legalize"],["mobilmachen","to mobilize"],["subventionieren","to subsidize"],
["verstaatlichen","to nationalize"],["verschluesseln","to encrypt"],["bevorzugen","to prefer"],
["beruecksichtigen","to consider"],["dokumentieren (B2)","to document"],["ermitteln","to investigate"],
["erstatten","to reimburse"],["verhaengen","to impose (sanctions)"],
].forEach(([inf,en]) => ALL.push(regVerb(inf,en,"B2")));

// B2 Strong/Irregular (15)
ALL.push(strongVerb("anklagen","to accuse","B2",null,null,"anklagte","angeklagt","haben"));
ALL.push(strongVerb("ausloesen","to trigger","B2",null,null,"loeste aus","ausgeloest","haben"));
ALL.push(strongVerb("begleichen","to settle (debt)","B2",null,null,"glich aus","beglichen","haben"));
ALL.push(strongVerb("belasten","to burden","B2",null,null,"belastete","belastet","haben"));
ALL.push(strongVerb("bevormunden","to patronize","B2",null,null,"bevormundete","bevormundet","haben"));
ALL.push(strongVerb("boykottieren","to boycott","B2",null,null,"boykottierte","boykottiert","haben"));
ALL.push(strongVerb("destabilisieren","to destabilize","B2",null,null,"destabilisierte","destabilisiert","haben"));
ALL.push(strongVerb("enthuellen","to reveal","B2",null,null,"enthuellte","enthuellt","haben"));
ALL.push(strongVerb("erschliessen","to develop/access","B2",null,null,"erschloss","erschlossen","haben"));
ALL.push(strongVerb("gebaehren","to be due","B2",null,"gebiert","gebar","geboren","haben"));
ALL.push(strongVerb("haftbar","to hold liable","B2",null,null,"haftete","gehaftet","haben"));
ALL.push(strongVerb("verhaengen","to impose","B2",null,null,"verhaengte","verhaengt","haben"));
ALL.push(strongVerb("vermitteln (B2)","to mediate","B2",null,null,"vermittelte","vermittelt","haben"));
ALL.push(strongVerb("vorantreiben","to drive forward","B2","treibst voran","treibt voran","trieb voran","vorangetrieben","haben","voran"));
ALL.push(strongVerb("wiederlegen","to refute","B2",null,null,"widerlegte","widerlegt","haben"));

// B2 Separable (5)
ALL.push(strongVerb("auseinandersetzen","to examine","B2","setzt auseinander","setzt auseinander","setzte auseinander","auseinandergesetzt","haben","auseinander"));
ALL.push(regVerb("einpraegen","to imprint","B2","ein"));
ALL.push(strongVerb("hervorrufen","to cause","B2","rufst hervor","ruft hervor","rief hervor","hervorgerufen","haben","hervor"));
ALL.push(regVerb("vorbeugen (B2)","to prevent","B2","vor"));
ALL.push(strongVerb("zunichte machen","to thwart","B2",null,null,"machte zunichte","zunichtegemacht","haben","zunichte"));

// ===== C1 LEVEL (30 verbs) =====

ALL.push(strongVerb("abstrahieren","to abstract","C1",null,null,"abstrahierte","abstrahiert","haben"));
ALL.push(strongVerb("auseinandersetzen (C1)","to examine critically","C1",null,null,"setzte auseinander","auseinandergesetzt","haben","auseinander"));
ALL.push(strongVerb("ausformulieren","to elaborate","C1",null,null,"formulierte aus","ausformuliert","haben","aus"));
ALL.push(strongVerb("beeintraechtigen (C1)","to impair","C1",null,null,"beeintraechtigte","beeintraechtigt","haben"));
ALL.push(strongVerb("befuerchten","to fear/apprehend","C1",null,null,"befuerchtete","befuerchtet","haben"));
ALL.push(strongVerb("begruenden","to justify/found","C1",null,null,"begruendete","begruendet","haben"));
ALL.push(strongVerb("beruhen auf","to be based on","C1",null,"beruht","beruhte","beruht","haben"));
ALL.push(strongVerb("beschaeftigen (C1)","to occupy","C1",null,null,"beschaeftigte","beschaeftigt","haben"));
ALL.push(strongVerb("bestreiten (C1)","to deny","C1",null,null,"bestritt","bestritten","haben"));
ALL.push(strongVerb("betraegen","to amount to","C1",null,"beträgt","betrug","betragen","haben"));
ALL.push(strongVerb("bewerkstelligen","to accomplish","C1",null,null,"bewerkstelligte","bewerkstelligt","haben"));
ALL.push(strongVerb("durchsetzen","to enforce","C1","setzt durch","setzt durch","setzte durch","durchgesetzt","haben","durch"));
ALL.push(strongVerb("einschraenken (C1)","to restrict","C1",null,null,"einschraenkte","eingeschraenkt","haben"));
ALL.push(strongVerb("entgegenwirken","to counteract","C1",null,"entgegenwirkt","entgegenwirkte","entgegengewirkt","haben","entgegen"));
ALL.push(strongVerb("erheben (C1)","to raise/collect","C1","erhebst","erhebt","erhob","erhoben","haben"));
ALL.push(strongVerb("erkunden","to explore","C1",null,null,"erkundete","erkundet","haben"));
ALL.push(strongVerb("erschliessen (C1)","to develop","C1",null,null,"erschloss","erschlossen","haben"));
ALL.push(strongVerb("fördern (C1)","to promote","C1",null,null,"foerderte","gefoerdert","haben"));
ALL.push(strongVerb("gegensteuern","to counter-steer","C1",null,"steuert gegen","steuerte gegen","entgegengesteuert","haben","gegen"));
ALL.push(strongVerb("gewaehren","to grant","C1",null,null,"gewaehrte","gewaehrt","haben"));
ALL.push(strongVerb("hervorheben (C1)","to highlight","C1","hebst hervor","hebt hervor","hob hervor","hervorgehoben","haben","hervor"));
ALL.push(strongVerb("missachten (C1)","to disregard","C1",null,null,"missachtete","missachtet","haben"));
ALL.push(strongVerb("nullifizieren","to nullify","C1",null,null,"nullifizierte","nullifiziert","haben"));
ALL.push(strongVerb("vorbeugen (C1)","to prevent","C1",null,null,"vorbeugte","vorgebeugt","haben","vor"));
ALL.push(strongVerb("sich verinnerlichen","to internalize","C1",null,null,"verinnerlichte","verinnerlicht","haben"));
ALL.push(strongVerb("wahrnehmen (C1)","to perceive","C1",null,null,"nahm wahr","wahrgenommen","haben"));
ALL.push(strongVerb("zugaenglich machen","to make accessible","C1",null,null,"machte zugaenglich","zugaenglich gemacht","haben"));
ALL.push(strongVerb("zusehends","to increasingly","C1",null,null,"sah zu","zugesehen","haben"));
ALL.push(strongVerb("sich auseinandersetzen","to grapple with","C1",null,null,"setzte sich auseinander","sich auseinandergesetzt","haben"));
ALL.push(strongVerb("durchdringen","to penetrate","C1",null,"dringt durch","drang durch","durchdrungen","haben","durch"));

// ===== C2 LEVEL (20 verbs) =====

ALL.push(strongVerb("annahen","to approximate","C2",null,"naht an","nahte an","angenähert","haben","an"));
ALL.push(strongVerb("entlarven","to expose","C2",null,null,"entlarvte","entlarvt","haben"));
ALL.push(strongVerb("gebietsweise","to require","C2",null,"gebietet","gebot","geboten","haben"));
ALL.push(strongVerb("rekapitulieren","to recapitulate","C2",null,null,"rekapitulierte","rekapituliert","haben"));
ALL.push(strongVerb("revanchieren","to take revenge","C2",null,null,"revanchierte","revanchiert","haben"));
ALL.push(strongVerb("schmaelern","to diminish","C2",null,null,"schmaelerte","geschmaelert","haben"));
ALL.push(strongVerb("verschachteln","to nest","C2",null,null,"verschachtelte","verschachtelt","haben"));
ALL.push(strongVerb("verschweigen (C2)","to conceal","C2",null,null,"verschwieg","verschwiegen","haben"));
ALL.push(strongVerb("vertnetzen","to network","C2",null,null,"vernetzete","vernetzt","haben"));
ALL.push(strongVerb("zunichte machen (C2)","to thwart","C2",null,null,"machte zunichte","zunichtegemacht","haben","zunichte"));
ALL.push(strongVerb("auseinandersetzen (C2)","to critically examine","C2",null,null,"setzte auseinander","auseinandergesetzt","haben","auseinander"));
ALL.push(strongVerb("sich vergegenwaertigen","to vividly imagine","C2",null,null,"vergegenwaertigte","vergegenwaertigt","haben"));
ALL.push(strongVerb("kultivieren","to cultivate","C2",null,null,"kultivierte","kultiviert","haben"));
ALL.push(strongVerb("sich niederlassen","to settle","C2",null,"laesst sich nieder","liess sich nieder","sich niedergelassen","haben"));
ALL.push(strongVerb("entgegenstemmen","to object","C2",null,null,"entgegenstemmte","entgegengestemmt","haben","entgegen"));
ALL.push(strongVerb("sich herauskristallisieren","to crystallize","C2",null,"kristallisiert sich heraus","kristallisierte sich heraus","sich herauskristallisiert","haben","heraus"));
ALL.push(strongVerb("vorantreiben (C2)","to propel","C2","treibst voran","treibt voran","trieb voran","vorangetrieben","haben","voran"));
ALL.push(strongVerb("sich verinnerlichen (C2)","to internalize deeply","C2",null,null,"verinnerlichte","verinnerlicht","haben"));
ALL.push(strongVerb("wiederlegeln","to refute completely","C2",null,null,"widerlegte","widerlegt","haben"));
ALL.push(strongVerb("beschreiten","to tread/pave","C2",null,null,"beschritt","beschritten","haben"));

// Export
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
