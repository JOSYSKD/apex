/* APEX – Heim-Trainingsplan (ohne Geräte, Klimmzugstange vorhanden)
   ZWEI Einheiten pro Tag: 06:00 (Früh) + 16:00 (Nachmittag).
   Strikter OBER-/UNTERKÖRPER-WECHSEL → an keinem Tag überschneidet sich
   etwas mit dem Vortag. Fußball MONTAG & MITTWOCH abends = Oberkörpertage
   (KEINE Beine an Fußballtagen). Jede Muskelgruppe wird 3× pro Woche getroffen.
   Ober = Brust/Rücken/Schulter/Arme (Push am + Pull pm) · Unter = Beine (am) + Core (pm).
   Format je Tag: { day, football, am:{Session}, pm:{Session} }
   Session: { focus, sub, emoji, type, minutes, kcal, warmup[], blocks[], finisher } */

window.TRAINING = {
  meta: {
    name: "APEX 2× täglich – Ober/Unter im Wechsel",
    goal: "Muskelaufbau & Fettabbau · Körpergewicht + Klimmzugstange · 06:00 & 16:00",
    progression: [
      "Ober- und Unterkörper wechseln sich Tag für Tag ab – so überschneidet sich NIE etwas mit dem Vortag und alles ist zwischen den Einheiten erholt.",
      "Fußball (Mo & Mi) fällt auf Oberkörpertage → an Fußballtagen keine Beine, die ruhen fürs Spiel.",
      "Klimmzüge sauber aus dem vollen Hang: unten strecken, Kinn über die Stange. Noch keine sauberen? Negativ-Klimmzüge (3–5 Sek. langsam ablassen).",
      "Ab Woche 3: +1–2 Wiederholungen pro Satz ODER Tempo verlangsamen (3 Sek. runter, 1 Sek. hoch).",
      "1–2 Wiederholungen „im Tank“ lassen – außer beim Finisher. Sonntag ist bewusst locker: da wächst der Muskel."
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
      day: "Dienstag", football: false,
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
      }
    },
    {
      day: "Mittwoch", football: true,
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
      day: "Donnerstag", football: false,
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
        focus: "Core & Cardio", sub: "Bauch · Fatburn", emoji: "🔥",
        type: "hiit", minutes: 26, kcal: 330,
        warmup: ["Katze-Kuh 10×", "60 Sek. Laufen auf der Stelle"],
        blocks: [
          { name: "Hängendes Beinheben (an der Stange)", sets: 4, reps: "10", rest: 45, tip: "Knie zur Brust ziehen – unterer Bauch + Griffkraft." },
          { name: "Mountain Climbers", sets: 4, reps: "40 Sek.", rest: 20, tip: "Knie schnell zur Brust, Rumpf stabil." },
          { name: "High Knees (Knieheben)", sets: 4, reps: "40 Sek.", rest: 20, tip: "Knie auf Hüfthöhe, schnelle Füße." },
          { name: "Squat Jumps", sets: 4, reps: "40 Sek.", rest: 20, tip: "Explosiv hoch, weich landen." },
          { name: "Unterarmstütz (Plank)", sets: 3, reps: "45 Sek.", rest: 30, tip: "Bauch fest, nicht durchhängen." }
        ],
        finisher: { name: "Bauch-Tabata", detail: "8× (20 Sek. Mountain Climbers / 10 Sek. Pause) = 4 Min Vollgas." }
      }
    },
    {
      day: "Freitag", football: false,
      am: {
        focus: "Brust · Schulter · Arme", sub: "Push/Arms", emoji: "💪",
        type: "kraft", minutes: 32, kcal: 255,
        warmup: ["Armkreisen je 15", "20 Hampelmänner", "10 langsame Liegestütze"],
        blocks: [
          { name: "Liegestütze (Standard)", sets: 4, reps: "12", rest: 60, tip: "Sauber und tief – Brust fast zum Boden." },
          { name: "Pike-Liegestütze", sets: 3, reps: "10", rest: 60, tip: "Schulter-Drücken mit dem eigenen Gewicht." },
          { name: "Dips an der Stuhlkante", sets: 4, reps: "12", rest: 60, tip: "Trizeps – Ellbogen eng nach hinten." },
          { name: "Breite Liegestütze", sets: 3, reps: "12", rest: 60, tip: "Hände weiter außen – äußere Brust." },
          { name: "Handtuch-Bizeps-Curl (isometrisch)", sets: 3, reps: "30 Sek. / Arm", rest: 30, tip: "Auf ein Handtuch-Ende steigen, mit dem Arm dagegen ziehen." }
        ],
        finisher: { name: "Arm-Pump-Zirkel", detail: "2 Runden: max. Liegestütze + max. Dips, direkt hintereinander." }
      },
      pm: {
        focus: "Rücken · Bizeps", sub: "Pull · Klimmzüge", emoji: "🎽",
        type: "kraft", minutes: 33, kcal: 275,
        warmup: ["Schulterkreisen je 15", "Dead Hang 20 Sek.", "Katze-Kuh 10×"],
        blocks: [
          { name: "Klimmzüge (Obergriff)", sets: 4, reps: "6–10", rest: 90, tip: "Voller Hang, Kinn über die Stange." },
          { name: "Chin-ups (Untergriff)", sets: 3, reps: "6–10", rest: 90, tip: "Bizeps-Fokus, sauber ziehen." },
          { name: "Handtuch-Rudern an der Stange", sets: 4, reps: "12", rest: 60, tip: "Australian Pull-up – Brust zur tiefen Stange ziehen." },
          { name: "Superman", sets: 3, reps: "15", rest: 45, tip: "Arme & Beine heben, oben 1 Sek. halten." }
        ],
        finisher: { name: "Klimmzug-Leiter", detail: "1, 2, 3 … hochzählen, bis nichts mehr geht." }
      }
    },
    {
      day: "Samstag", football: false,
      am: {
        focus: "Beine · Po · Waden", sub: "Legs", emoji: "🦵",
        type: "kraft", minutes: 38, kcal: 340,
        warmup: ["40 Hampelmänner", "Hüftkreisen je 10", "15 langsame Kniebeugen"],
        blocks: [
          { name: "Kniebeugen (Air Squats)", sets: 4, reps: "22", rest: 60, tip: "Tief, gleichmäßig, Ferse am Boden." },
          { name: "Ausfallschritte (Lunges)", sets: 4, reps: "12 / Bein", rest: 60, tip: "Abwechselnd links/rechts, aufrecht bleiben." },
          { name: "Bulgarian Split Squat", sets: 3, reps: "10 / Bein", rest: 75, tip: "Hinterer Fuß auf dem Stuhl." },
          { name: "Beckenheben (Glute Bridge)", sets: 3, reps: "20", rest: 45, tip: "Po oben fest anspannen." },
          { name: "Wall Sit", sets: 3, reps: "45 Sek.", rest: 45, tip: "Oberschenkel parallel zum Boden." },
          { name: "Wadenheben", sets: 4, reps: "20", rest: 30, tip: "Ganz hoch, langsam ab." }
        ],
        finisher: { name: "Kniebeugen-Sprünge", detail: "3× 15 explosive Squat Jumps – Beine ausbrennen." }
      },
      pm: {
        focus: "Core & Kondition", sub: "Bauch · Core", emoji: "🧱",
        type: "kraft", minutes: 28, kcal: 240,
        warmup: ["Katze-Kuh 10×", "Beckenkippen 15×", "Dead Hang 15 Sek."],
        blocks: [
          { name: "Unterarmstütz (Plank)", sets: 4, reps: "60 Sek.", rest: 45, tip: "Bauch und Po fest, gerade Linie." },
          { name: "Bicycle Crunches", sets: 4, reps: "20", rest: 30, tip: "Ellbogen zum gegenüberliegenden Knie." },
          { name: "Beinheben (liegend)", sets: 4, reps: "15", rest: 45, tip: "Unteren Rücken angedrückt lassen." },
          { name: "Russian Twists", sets: 4, reps: "24", rest: 30, tip: "Kontrolliert von Seite zu Seite." },
          { name: "Hollow Hold", sets: 3, reps: "30 Sek.", rest: 30, tip: "Schulterblätter & Beine leicht vom Boden." }
        ],
        finisher: { name: "Plank-Rekord", detail: "1× Plank auf Zeit – schlag deinen Rekord von Dienstag!" }
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
