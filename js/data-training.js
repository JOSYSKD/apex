/* APEX – Heim-Trainingsplan (ohne Geräte, Klimmzugstange vorhanden)
   ZWEI Einheiten pro Tag: 06:00 (Früh) + 16:00 (Nachmittag).
   2-Tage-Zyklus deckt alle Muskelgruppen ab. Beine dediziert nur an
   NICHT-Fußballtagen (Mi/Fr/Sa/So) – Mo/Di übernimmt Fußball die Beinlast.
   Format je Tag: { day, football, am:{Session}, pm:{Session} }
   Session: { focus, sub, emoji, type, minutes, kcal, warmup[], blocks[], finisher } */

window.TRAINING = {
  meta: {
    name: "APEX 2× täglich – Ganzkörper alle 2 Tage",
    goal: "Muskelaufbau & Fettabbau · Körpergewicht + Klimmzugstange · 06:00 & 16:00",
    progression: [
      "Zwei Einheiten pro Tag: morgens 06:00, nachmittags 16:00. Jede Muskelgruppe wird spätestens alle 2 Tage getroffen.",
      "Fußball (Mo & Di) = deine Bein-/Ausdauer-Einheit am Abend – deshalb an diesen Tagen KEIN schwerer Beintag, nur Oberkörper & Core.",
      "Klimmzüge sauber aus dem vollen Hang: unten komplett strecken, oben Kinn über die Stange. Schaffst du keine sauberen? Negativ-Klimmzüge (langsam 3–5 Sek. ablassen).",
      "Ab Woche 3: +1–2 Wiederholungen pro Satz ODER Tempo verlangsamen (3 Sek. runter, 1 Sek. hoch).",
      "1–2 Wiederholungen „im Tank“ lassen – außer beim Finisher, da gibst du alles. Sonntag bewusst leicht = da wächst der Muskel."
    ]
  },
  days: [
    {
      day: "Montag", football: true,
      am: {
        focus: "Brust · Schulter · Trizeps", sub: "Push", emoji: "💪",
        type: "kraft", minutes: 30, kcal: 240,
        warmup: ["30 Sek. Armkreisen vor/zurück", "20 Hampelmänner", "10 langsame Liegestütze"],
        blocks: [
          { name: "Liegestütze (Standard)", sets: 4, reps: "10–15", rest: 60, tip: "Körper bretthart, Ellbogen ca. 45° am Körper." },
          { name: "Pike-Liegestütze", sets: 3, reps: "8–12", rest: 75, tip: "Hüfte hoch (umgekehrtes V), Kopf Richtung Boden – Schultern." },
          { name: "Enge Liegestütze (Diamant)", sets: 3, reps: "8–12", rest: 60, tip: "Hände unter der Brust – maximaler Trizeps-Reiz." },
          { name: "Schräge Liegestütze (Füße erhöht)", sets: 3, reps: "8–12", rest: 60, tip: "Füße auf Stuhl/Bett – obere Brust." }
        ],
        finisher: { name: "Liegestütz-Burnout", detail: "1 Satz Liegestütze bis zum Muskelversagen. Alles geben!" }
      },
      pm: {
        focus: "Rücken · Bizeps", sub: "Pull · Klimmzüge", emoji: "🎽",
        type: "kraft", minutes: 35, kcal: 280,
        warmup: ["Schulterkreisen je 15", "Katze-Kuh 10×", "Dead Hang an der Stange 20 Sek."],
        blocks: [
          { name: "Klimmzüge (Obergriff)", sets: 4, reps: "5–10", rest: 90, tip: "Aus vollem Hang, Kinn über die Stange, kontrolliert ablassen." },
          { name: "Chin-ups (Untergriff)", sets: 3, reps: "6–10", rest: 90, tip: "Enger Untergriff – trifft Bizeps + Rücken." },
          { name: "Negativ-Klimmzüge", sets: 3, reps: "5", rest: 75, tip: "Oben starten, 3–5 Sek. langsam ablassen. Baut Klimmzug-Kraft." },
          { name: "Superman", sets: 3, reps: "15", rest: 45, tip: "Arme & Beine gleichzeitig heben, oben kurz halten – unterer Rücken." }
        ],
        finisher: { name: "Dead Hang", detail: "2× so lange wie möglich an der Stange hängen – Griffkraft & Rücken." }
      }
    },
    {
      day: "Dienstag", football: true,
      am: {
        focus: "Core · Bauch", sub: "Core", emoji: "🧱",
        type: "kraft", minutes: 25, kcal: 200,
        warmup: ["Katze-Kuh 10×", "Beckenkippen 15×", "30 Sek. leichter Unterarmstütz"],
        blocks: [
          { name: "Unterarmstütz (Plank)", sets: 4, reps: "45–60 Sek.", rest: 45, tip: "Gerade Linie Kopf–Ferse, Bauch fest." },
          { name: "Crunches", sets: 4, reps: "20", rest: 30, tip: "Langsam, oben ausatmen, unteren Rücken am Boden." },
          { name: "Beinheben (liegend)", sets: 4, reps: "15", rest: 45, tip: "Beine gestreckt, unteren Rücken angedrückt lassen." },
          { name: "Russian Twists", sets: 3, reps: "20", rest: 30, tip: "Oberkörper zurück, von Seite zu Seite drehen." },
          { name: "Seitstütz (Side Plank)", sets: 3, reps: "30 Sek. / Seite", rest: 30, tip: "Hüfte hoch, Körper in einer Linie." }
        ],
        finisher: { name: "Plank-Rekord", detail: "1× Plank auf Zeit – schlag deinen persönlichen Rekord!" }
      },
      pm: {
        focus: "Schulter · Arme · Brust", sub: "Push/Arms · Klimmzüge", emoji: "🦾",
        type: "kraft", minutes: 32, kcal: 255,
        warmup: ["Armkreisen je 15", "Schultern lockern", "Dead Hang 15 Sek."],
        blocks: [
          { name: "Chin-ups (Bizeps-Fokus)", sets: 4, reps: "6–10", rest: 90, tip: "Untergriff, bewusst mit dem Bizeps ziehen." },
          { name: "Dips an der Stuhlkante", sets: 4, reps: "10–15", rest: 60, tip: "Zwei stabile Stühle / Sofakante, Ellbogen nach hinten – Trizeps." },
          { name: "Pike-Liegestütze", sets: 3, reps: "8–12", rest: 60, tip: "Schulter-Drücken mit dem eigenen Gewicht." },
          { name: "Breite Liegestütze", sets: 3, reps: "10–15", rest: 60, tip: "Hände weiter als schulterbreit – hält die Brust im 2-Tages-Rhythmus." },
          { name: "Handtuch-Bizeps-Curl (isometrisch)", sets: 3, reps: "30 Sek. / Arm", rest: 30, tip: "Auf ein Handtuch-Ende steigen, mit dem Arm dagegen ziehen." }
        ],
        finisher: { name: "Arm-Pump-Zirkel", detail: "2 Runden: max. Chin-ups + max. Dips, direkt hintereinander." }
      }
    },
    {
      day: "Mittwoch", football: false,
      am: {
        focus: "Beine · Po · Waden", sub: "Legs", emoji: "🦵",
        type: "kraft", minutes: 35, kcal: 320,
        warmup: ["30 Hampelmänner", "Hüftkreisen je 10", "15 langsame Kniebeugen"],
        blocks: [
          { name: "Kniebeugen (Air Squats)", sets: 4, reps: "20", rest: 60, tip: "Ferse am Boden, Brust auf, tief runter." },
          { name: "Ausfallschritte (Lunges)", sets: 4, reps: "12 / Bein", rest: 60, tip: "Vorderes Knie über dem Fußgelenk, aufrecht bleiben." },
          { name: "Bulgarian Split Squat", sets: 3, reps: "10 / Bein", rest: 75, tip: "Hinterer Fuß auf dem Stuhl – der Bein-Härtetest." },
          { name: "Beckenheben (Glute Bridge)", sets: 3, reps: "20", rest: 45, tip: "Oben den Po 1 Sek. fest anspannen." },
          { name: "Wadenheben (einbeinig)", sets: 4, reps: "20 / Bein", rest: 30, tip: "Ganz hoch auf die Zehenspitzen, langsam ab." }
        ],
        finisher: { name: "100er-Kniebeugen", detail: "100 Kniebeugen auf Zeit – so wenig Pausen wie möglich." }
      },
      pm: {
        focus: "HIIT · Fatburn", sub: "Cardio", emoji: "🔥",
        type: "hiit", minutes: 25, kcal: 360,
        warmup: ["60 Sek. lockeres Laufen auf der Stelle", "Arme & Hüfte mobilisieren"],
        blocks: [
          { name: "Burpees", sets: 4, reps: "40 Sek.", rest: 20, tip: "Tempo hoch – Ganzkörper-Fettkiller Nr. 1." },
          { name: "Mountain Climbers", sets: 4, reps: "40 Sek.", rest: 20, tip: "Knie schnell zur Brust, Rumpf stabil." },
          { name: "Hampelmänner", sets: 4, reps: "40 Sek.", rest: 20, tip: "Durchgehend, gleichmäßig atmen." },
          { name: "High Knees (Knieheben)", sets: 4, reps: "40 Sek.", rest: 20, tip: "Knie auf Hüfthöhe, schnelle Füße." },
          { name: "Squat Jumps", sets: 4, reps: "40 Sek.", rest: 60, tip: "Explosiv hoch, weich landen. 60 Sek. Rundenpause danach." }
        ],
        finisher: { name: "Tabata-Finish", detail: "8× (20 Sek. Burpees / 10 Sek. Pause) = 4 Minuten Vollgas." }
      }
    },
    {
      day: "Donnerstag", football: false,
      am: {
        focus: "Brust · Schulter · Trizeps", sub: "Push", emoji: "💪",
        type: "kraft", minutes: 30, kcal: 245,
        warmup: ["Armkreisen 30 Sek.", "25 Hampelmänner", "10 langsame Liegestütze"],
        blocks: [
          { name: "Liegestütze (Standard)", sets: 4, reps: "12–18", rest: 60, tip: "Volle Range, Brust fast zum Boden." },
          { name: "Breite Liegestütze", sets: 3, reps: "10–15", rest: 60, tip: "Hände weiter als schulterbreit – äußere Brust." },
          { name: "Dips an der Stuhlkante", sets: 4, reps: "10–15", rest: 60, tip: "Trizeps-Killer – Ellbogen eng nach hinten." },
          { name: "Pike-Liegestütze", sets: 3, reps: "8–12", rest: 75, tip: "Schultern – Kopf tief zwischen die Hände." }
        ],
        finisher: { name: "Diamant-Burnout", detail: "1 Satz enge Liegestütze bis zum Versagen – Trizeps brennt." }
      },
      pm: {
        focus: "Rücken · Bizeps", sub: "Pull · Klimmzüge", emoji: "🎽",
        type: "kraft", minutes: 35, kcal: 285,
        warmup: ["Schulterkreisen je 15", "Dead Hang 20 Sek.", "20 Superman-Pulses"],
        blocks: [
          { name: "Klimmzüge (Obergriff)", sets: 5, reps: "5–8", rest: 90, tip: "5 Sätze, sauber – heute Fokus auf Kraft im Rücken." },
          { name: "Handtuch-Rudern an der Stange", sets: 4, reps: "12", rest: 60, tip: "Unter die tiefe Stange legen, Brust heranziehen (Australian Pull-up)." },
          { name: "Chin-ups (Untergriff)", sets: 3, reps: "6–10", rest: 75, tip: "Bizeps + unterer Latissimus." },
          { name: "Reverse Snow Angels", sets: 3, reps: "15", rest: 45, tip: "In Bauchlage Arme wie ein Schneeengel – hintere Schulter." }
        ],
        finisher: { name: "Klimmzug-Leiter", detail: "1, 2, 3, 4 … Klimmzüge mit kurzer Pause hochzählen, bis nichts mehr geht." }
      }
    },
    {
      day: "Freitag", football: false,
      am: {
        focus: "Beine · Po · Waden", sub: "Legs", emoji: "🦵",
        type: "kraft", minutes: 35, kcal: 320,
        warmup: ["30 Hampelmänner", "Ausfallschritt-Walk 10 Schritte", "Hüftöffner"],
        blocks: [
          { name: "Sumo-Kniebeugen", sets: 4, reps: "20", rest: 60, tip: "Breiter Stand, Zehen nach außen – innere Oberschenkel & Po." },
          { name: "Rückwärts-Ausfallschritte", sets: 4, reps: "12 / Bein", rest: 60, tip: "Nach hinten ausfallen, schont das Knie, trifft den Po." },
          { name: "Step-ups (auf Stuhl)", sets: 3, reps: "12 / Bein", rest: 60, tip: "Ganze Fußsohle auf den Stuhl, kraftvoll hochdrücken." },
          { name: "Einbeiniges Beckenheben", sets: 3, reps: "12 / Bein", rest: 45, tip: "Ein Bein gestreckt, Po einseitig hochdrücken." },
          { name: "Wadenheben", sets: 4, reps: "25", rest: 30, tip: "Voller Bewegungsumfang, oben 1 Sek. halten." }
        ],
        finisher: { name: "Wall Sit auf Zeit", detail: "So lange wie möglich in der Wandsitz-Position halten." }
      },
      pm: {
        focus: "Core · Bauch", sub: "Core", emoji: "🧱",
        type: "kraft", minutes: 28, kcal: 220,
        warmup: ["Katze-Kuh 10×", "Beckenkippen 15×", "Dead Hang 15 Sek."],
        blocks: [
          { name: "Hängendes Beinheben (an der Stange)", sets: 4, reps: "10", rest: 45, tip: "Knie zur Brust ziehen – unterer Bauch + Griffkraft." },
          { name: "Unterarmstütz (Plank)", sets: 4, reps: "60 Sek.", rest: 45, tip: "Bauch und Po fest, nicht durchhängen." },
          { name: "Bicycle Crunches", sets: 4, reps: "20", rest: 30, tip: "Ellbogen zum gegenüberliegenden Knie – seitliche Bauchmuskeln." },
          { name: "Russian Twists", sets: 3, reps: "24", rest: 30, tip: "Kontrolliert drehen, Blick folgt den Händen." },
          { name: "Hollow Hold", sets: 3, reps: "30 Sek.", rest: 30, tip: "Schulterblätter & Beine leicht vom Boden, unterer Rücken bleibt unten." }
        ],
        finisher: { name: "Plank-Rekord", detail: "1× Plank auf Zeit – schlag deinen Rekord von Dienstag!" }
      }
    },
    {
      day: "Samstag", football: false,
      am: {
        focus: "Ganzkörper-Power", sub: "Full Body", emoji: "⚡",
        type: "kraft", minutes: 40, kcal: 380,
        warmup: ["40 Hampelmänner", "dynamisches Dehnen 2 Min.", "Dead Hang 15 Sek."],
        blocks: [
          { name: "Klimmzüge", sets: 4, reps: "6–10", rest: 60, tip: "Zirkel-Modus: eine Übung nach der anderen, wenig Pause." },
          { name: "Liegestütze", sets: 4, reps: "15", rest: 30, tip: "Sauber und zügig." },
          { name: "Kniebeugen", sets: 4, reps: "20", rest: 30, tip: "Tief und gleichmäßig." },
          { name: "Ausfallschritte", sets: 3, reps: "10 / Bein", rest: 30, tip: "Abwechselnd links/rechts." },
          { name: "Burpees", sets: 4, reps: "10", rest: 30, tip: "Der Herzschlag-Booster im Zirkel." },
          { name: "Plank", sets: 3, reps: "45 Sek.", rest: 30, tip: "Rundenabschluss – Rumpf hält alles zusammen." }
        ],
        finisher: { name: "Ganzkörper-Zirkel", detail: "3–4 komplette Runden. Wer mehr will: 5 Runden." }
      },
      pm: {
        focus: "HIIT & Core", sub: "Cardio · Core", emoji: "🔥",
        type: "hiit", minutes: 25, kcal: 350,
        warmup: ["60 Sek. Laufen auf der Stelle", "Hüfte & Schultern mobilisieren"],
        blocks: [
          { name: "Burpees", sets: 4, reps: "40 Sek.", rest: 20, tip: "Explosiv, sauber landen." },
          { name: "Plank-to-Push-up", sets: 4, reps: "40 Sek.", rest: 20, tip: "Vom Unterarmstütz in den Liegestütz und zurück." },
          { name: "Mountain Climbers", sets: 4, reps: "40 Sek.", rest: 20, tip: "Schnelle Knie, Hüfte tief." },
          { name: "High Knees", sets: 4, reps: "40 Sek.", rest: 20, tip: "Knie hoch, Arme mitnehmen." },
          { name: "Russian Twists", sets: 4, reps: "40 Sek.", rest: 45, tip: "Bauch-Abschluss, dann 45 Sek. Rundenpause." }
        ],
        finisher: { name: "Tabata Burpees", detail: "8× (20 Sek. Vollgas / 10 Sek. Pause) – der Wochen-Peak." }
      }
    },
    {
      day: "Sonntag", football: false,
      am: {
        focus: "Mobilität & Core", sub: "Recovery", emoji: "🧘",
        type: "rest", minutes: 25, kcal: 150,
        warmup: ["Katze-Kuh 10×", "tiefe Atmung 1 Min."],
        blocks: [
          { name: "Leichter Plank", sets: 3, reps: "30 Sek.", rest: 30, tip: "Locker halten, nur Rumpf aktivieren." },
          { name: "Dead Bug", sets: 3, reps: "12 / Seite", rest: 30, tip: "Gegenüberliegender Arm & Bein, Rücken flach." },
          { name: "Hüft-Mobilität", sets: 1, reps: "5 Min.", rest: 0, tip: "Tiefe Hocke, Hüftöffner – hält dich beweglich." },
          { name: "Ganzkörper-Dehnen", sets: 1, reps: "8 Min.", rest: 0, tip: "Nacken, Schultern, Hüfte, Beinrückseite – je 30 Sek. halten." }
        ],
        finisher: { name: "Reflexion", detail: "Erholung ist, wo der Muskel wächst. Kurz die Woche durchgehen. 🌱" }
      },
      pm: {
        focus: "Leichtes Ganzkörper & Dehnen", sub: "Active Recovery", emoji: "🌱",
        type: "rest", minutes: 30, kcal: 160,
        warmup: [],
        blocks: [
          { name: "Spaziergang", sets: 1, reps: "20–30 Min.", rest: 0, tip: "Lockeres Gehen an der frischen Luft – Fettverbrennung ohne Muskelstress." },
          { name: "Dead Hang (Dekompression)", sets: 3, reps: "20 Sek.", rest: 40, tip: "Locker an der Stange hängen – streckt Wirbelsäule & Schultern." },
          { name: "Ganzkörper-Dehnen", sets: 1, reps: "10 Min.", rest: 0, tip: "Bewusst atmen, in die Dehnung entspannen." }
        ],
        finisher: { name: "Woche planen", detail: "Nächste Woche kurz durchdenken – Essen & Termine im Blick. 📅" }
      }
    }
  ]
};
