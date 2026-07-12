/* APEX – Heim-Trainingsplan (ohne Geräte)
   Ziel: schneller, effizienter Muskelaufbau + Fettabbau.
   Push/Pull/Legs-Split kombiniert mit HIIT-Fatburn.                              */

window.TRAINING = {
  meta: {
    name: "APEX 7-Tage-Split",
    goal: "Muskelaufbau & Fettabbau · nur Körpergewicht",
    progression: [
      "Woche 1–2: Sätze & Wiederholungen wie angegeben. Sauber vor schnell.",
      "Ab Woche 3: +1–2 Wiederholungen pro Satz ODER Tempo verlangsamen (3 Sek. runter, 1 Sek. hoch).",
      "Ab Woche 5: +1 Satz bei den Hauptübungen.",
      "Immer 1–2 Wiederholungen „im Tank“ lassen – außer beim Finisher, da gibst du alles.",
      "Pausen kurz halten (siehe Übung). Kurze Pause = mehr Fettverbrennung."
    ]
  },
  days: [
    {
      day: "Montag", focus: "Brust · Schulter · Trizeps", sub: "Push", emoji: "💪",
      type: "kraft", minutes: 40, kcal: 300,
      warmup: ["30 Sek. Armkreisen", "20 Hampelmänner", "10 langsame Liegestütze", "Schultern lockern"],
      blocks: [
        { name: "Liegestütze (Standard)", sets: 4, reps: "10–15", rest: 60, tip: "Körper bleibt bretthart, Ellbogen ca. 45° am Körper." },
        { name: "Enge Liegestütze (Diamant)", sets: 3, reps: "8–12", rest: 60, tip: "Hände unter der Brust – maximaler Trizeps-Reiz." },
        { name: "Pike-Liegestütze", sets: 3, reps: "8–12", rest: 75, tip: "Hüfte hoch (umgekehrtes V), Kopf Richtung Boden – trifft die Schultern." },
        { name: "Dips an der Stuhlkante", sets: 3, reps: "10–15", rest: 60, tip: "Zwei stabile Stühle oder die Sofakante. Ellbogen nach hinten." },
        { name: "Schräge Liegestütze (Füße erhöht)", sets: 3, reps: "8–12", rest: 60, tip: "Füße auf Stuhl/Bett – obere Brust." }
      ],
      finisher: { name: "Liegestütz-Burnout", detail: "1 Satz Liegestütze bis zum Muskelversagen. Alles geben!" }
    },
    {
      day: "Dienstag", focus: "Beine · Po · Waden", sub: "Legs", emoji: "🦵",
      type: "kraft", minutes: 45, kcal: 340,
      warmup: ["30 Hampelmänner", "Hüftkreisen je 10", "15 langsame Kniebeugen"],
      blocks: [
        { name: "Kniebeugen (Air Squats)", sets: 4, reps: "20", rest: 60, tip: "Ferse bleibt am Boden, Brust auf, tief runter." },
        { name: "Ausfallschritte (Lunges)", sets: 4, reps: "12 / Bein", rest: 60, tip: "Vorderes Knie über dem Fußgelenk, Oberkörper aufrecht." },
        { name: "Bulgarian Split Squat", sets: 3, reps: "10 / Bein", rest: 75, tip: "Hinterer Fuß auf dem Stuhl – der Bein-Härtetest." },
        { name: "Beckenheben (Glute Bridge)", sets: 3, reps: "20", rest: 45, tip: "Oben den Po 1 Sek. fest anspannen." },
        { name: "Wadenheben (einbeinig)", sets: 4, reps: "20 / Bein", rest: 30, tip: "Ganz hoch auf die Zehenspitzen, langsam ab." },
        { name: "Wall Sit", sets: 3, reps: "45 Sek.", rest: 45, tip: "Rücken an der Wand, Oberschenkel parallel zum Boden." }
      ],
      finisher: { name: "100er-Kniebeugen", detail: "100 Kniebeugen auf Zeit – so wenig Pausen wie möglich." }
    },
    {
      day: "Mittwoch", focus: "HIIT · Fatburn", sub: "Cardio", emoji: "🔥",
      type: "hiit", minutes: 25, kcal: 380,
      warmup: ["60 Sek. lockeres Laufen auf der Stelle", "Arme & Hüfte mobilisieren"],
      blocks: [
        { name: "Burpees", sets: 4, reps: "40 Sek.", rest: 20, tip: "Tempo hoch – Ganzkörper-Fettkiller Nr. 1." },
        { name: "Mountain Climbers", sets: 4, reps: "40 Sek.", rest: 20, tip: "Knie schnell zur Brust, Rumpf stabil." },
        { name: "Hampelmänner", sets: 4, reps: "40 Sek.", rest: 20, tip: "Durchgehend, gleichmäßig atmen." },
        { name: "High Knees (Knieheben)", sets: 4, reps: "40 Sek.", rest: 20, tip: "Knie auf Hüfthöhe, schnelle Füße." },
        { name: "Squat Jumps", sets: 4, reps: "40 Sek.", rest: 60, tip: "Explosiv hoch, weich landen. 60 Sek. Rundenpause danach." }
      ],
      finisher: { name: "Tabata-Finish", detail: "8× (20 Sek. Burpees / 10 Sek. Pause) = 4 Minuten Vollgas." }
    },
    {
      day: "Donnerstag", focus: "Rücken · Bizeps", sub: "Pull", emoji: "🎽",
      type: "kraft", minutes: 40, kcal: 300,
      warmup: ["Schulterkreisen je 15", "Katze-Kuh 10×", "20 Superman-Pulses"],
      blocks: [
        { name: "Handtuch-Rudern an der Tür", sets: 4, reps: "12", rest: 60, tip: "Handtuch um beide Türgriffe, zurücklehnen und heranziehen. Schulterblätter zusammen." },
        { name: "Rucksack-Rudern", sets: 4, reps: "12", rest: 60, tip: "Rucksack mit Büchern/Wasserflaschen füllen, vorgebeugt rudern." },
        { name: "Umgekehrte Liegestütze unter dem Tisch", sets: 3, reps: "8–12", rest: 60, tip: "Unter einen stabilen Tisch legen, Brust zur Tischkante ziehen." },
        { name: "Superman", sets: 4, reps: "15", rest: 45, tip: "Arme & Beine gleichzeitig heben, oben kurz halten." },
        { name: "Reverse Snow Angels", sets: 3, reps: "15", rest: 45, tip: "In Bauchlage Arme wie ein Schneeengel führen – hintere Schulter." },
        { name: "Handtuch-Bizeps-Curl (isometrisch)", sets: 3, reps: "30 Sek. / Arm", rest: 30, tip: "Mit einem Bein aufs Handtuch stehen, mit dem Arm dagegen ziehen." }
      ],
      finisher: { name: "Superman-Hold", detail: "3× 30 Sek. Superman halten – unterer Rücken brennt." }
    },
    {
      day: "Freitag", focus: "Core · Bauch", sub: "Core", emoji: "🧱",
      type: "kraft", minutes: 30, kcal: 260,
      warmup: ["Katze-Kuh 10×", "Beckenkippen 15×", "30 Sek. leichter Unterarmstütz"],
      blocks: [
        { name: "Unterarmstütz (Plank)", sets: 4, reps: "45–60 Sek.", rest: 45, tip: "Gerade Linie von Kopf bis Ferse, Bauch fest." },
        { name: "Crunches", sets: 4, reps: "20", rest: 30, tip: "Langsam, oben ausatmen, unteren Rücken am Boden." },
        { name: "Beinheben (liegend)", sets: 4, reps: "15", rest: 45, tip: "Beine gestreckt, unteren Rücken angedrückt lassen." },
        { name: "Russian Twists", sets: 3, reps: "20", rest: 30, tip: "Oberkörper zurück, von Seite zu Seite drehen." },
        { name: "Seitstütz (Side Plank)", sets: 3, reps: "30 Sek. / Seite", rest: 30, tip: "Hüfte hoch, Körper in einer Linie." },
        { name: "Käfer (Dead Bug)", sets: 3, reps: "12 / Seite", rest: 30, tip: "Gegenüberliegender Arm & Bein, Rücken flach." }
      ],
      finisher: { name: "Plank-Rekord", detail: "1× Plank auf Zeit – schlag deinen persönlichen Rekord!" }
    },
    {
      day: "Samstag", focus: "Ganzkörper-Power", sub: "Full Body", emoji: "⚡",
      type: "kraft", minutes: 40, kcal: 360,
      warmup: ["40 Hampelmänner", "dynamisches Dehnen 2 Min."],
      blocks: [
        { name: "Liegestütze", sets: 4, reps: "15", rest: 30, tip: "Zirkel-Modus: eine Übung nach der anderen, wenig Pause." },
        { name: "Kniebeugen", sets: 4, reps: "20", rest: 30, tip: "Sauber tief, Tempo gleichmäßig." },
        { name: "Ausfallschritte", sets: 4, reps: "10 / Bein", rest: 30, tip: "Abwechselnd links/rechts." },
        { name: "Burpees", sets: 4, reps: "10", rest: 30, tip: "Der Herzschlag-Booster im Zirkel." },
        { name: "Plank", sets: 4, reps: "45 Sek.", rest: 30, tip: "Rumpf hält alles zusammen." },
        { name: "Superman", sets: 4, reps: "15", rest: 60, tip: "Rundenabschluss – dann 60 Sek. Pause." }
      ],
      finisher: { name: "Ganzkörper-Zirkel", detail: "3–4 komplette Runden. Wer mehr will: 5 Runden." }
    },
    {
      day: "Sonntag", focus: "Erholung · Mobilität", sub: "Rest", emoji: "🌱",
      type: "rest", minutes: 25, kcal: 120,
      warmup: [],
      blocks: [
        { name: "Spaziergang", sets: 1, reps: "20–30 Min.", rest: 0, tip: "Lockeres Gehen an der frischen Luft – kurbelt die Fettverbrennung an, ohne den Muskel zu stressen." },
        { name: "Ganzkörper-Dehnen", sets: 1, reps: "10 Min.", rest: 0, tip: "Nacken, Schultern, Hüfte, Beinrückseite – je 30 Sek. halten." },
        { name: "Hüft-Mobilität", sets: 1, reps: "5 Min.", rest: 0, tip: "Tiefe Hocke, Hüftöffner – hält dich beweglich." }
      ],
      finisher: { name: "Reflexion", detail: "Erholung ist, wo der Muskel wächst. Plane kurz deine nächste Woche. 🌱" }
    }
  ]
};
