/* ============================================================
   APEX – App-Logik
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- Datenquellen ---------------- */
  const ING = window.INGREDIENTS || {};
  const MEALSETS = {
    breakfast: window.MEALS_BREAKFAST || [],
    snack:     window.MEALS_SNACK || [],
    lunch:     window.MEALS_LUNCH || [],
    dinner:    window.MEALS_DINNER || []
  };
  const RECIPES = {};
  for (const arr of [window.RECIPES_BREAKFAST, window.RECIPES_SNACK, window.RECIPES_LUNCH, window.RECIPES_DINNER]) {
    if (arr) for (const r of arr) if (r && r.n) RECIPES[r.n] = r;
  }
  const TRAINING = window.TRAINING || { meta: {}, days: [] };
  const ACHIEVEMENTS = window.ACHIEVEMENTS || [];
  const LEVELS = window.LEVELS || [{ level: 1, xp: 0, title: "—" }];

  const SLOTS = [
    { key: "breakfast", label: "Frühstück", ico: "🌅" },
    { key: "snack",     label: "Brotzeit",  ico: "🥪" },
    { key: "lunch",     label: "Mittag",    ico: "🍛" },
    { key: "dinner",    label: "Abend",     ico: "🍽️" }
  ];
  const WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  const CATS = [
    { key: "protein",  name: "Fleisch, Fisch & Eier", ico: "🥩" },
    { key: "milch",    name: "Milchprodukte",         ico: "🥛" },
    { key: "kh",       name: "Getreide & Brot",       ico: "🌾" },
    { key: "gemuese",  name: "Gemüse",                ico: "🥦" },
    { key: "obst",     name: "Obst",                  ico: "🍎" },
    { key: "fett",     name: "Fette, Nüsse & Öle",    ico: "🥑" },
    { key: "sonstiges",name: "Vorrat & Sonstiges",    ico: "🧂" }
  ];
  const ACTIVITY = {
    base:     { f: 1.2,   label: "Nur Alltag (Sport trackt die Watch)" },
    light:    { f: 1.375, label: "Leicht aktiv (1–3×/Woche)" },
    moderate: { f: 1.55,  label: "Moderat aktiv (3–5×/Woche)" }
  };
  // Trainings-Schwierigkeit: repF = Faktor auf Wiederholungen, setB = Sätze extra, restB = Pause ±Sek.
  const DIFF_LEVELS = [
    { n: "Anfänger",        ico: "🌱", repF: 0.60, setB: 0, restB: 20 },
    { n: "Amateur",         ico: "🙂", repF: 0.72, setB: 0, restB: 15 },
    { n: "Fortgeschritten", ico: "💪", repF: 0.85, setB: 0, restB: 10 },
    { n: "Erfahren",        ico: "🔥", repF: 1.00, setB: 0, restB: 5 },
    { n: "Erfahren+",       ico: "🔥", repF: 1.12, setB: 0, restB: 0 },
    { n: "Halbprofi",       ico: "⚡", repF: 1.25, setB: 1, restB: 0 },
    { n: "Profi",           ico: "⚡", repF: 1.40, setB: 1, restB: -5 },
    { n: "Profi+",          ico: "🏆", repF: 1.55, setB: 1, restB: -8 },
    { n: "Experte",         ico: "🏅", repF: 1.72, setB: 2, restB: -10 },
    { n: "Legende",         ico: "👑", repF: 1.90, setB: 2, restB: -12 },
    { n: "Roboter",         ico: "🤖", repF: 2.10, setB: 3, restB: -15 },
    { n: "Hacker",          ico: "💻", repF: 2.30, setB: 3, restB: -18 },
    { n: "God",             ico: "😇", repF: 2.55, setB: 4, restB: -20 },
    { n: "Machine",         ico: "🦾", repF: 2.85, setB: 4, restB: -25 }
  ];
  // Tagesablauf: feste Empfehlungszeiten (Aufstehen 6:30). Mo (0) & Di (1) = Fußball.
  const DAYPLAN = {
    wake: "05:45", sleep: "21:00",
    school: { start: "07:30", end: "13:00", days: [0, 1, 2, 3, 4] },
    times: { breakfast: "07:00", snack: "10:00", lunch: "14:30" },
    dinnerNormal: "18:30", dinnerFootball: "20:15",
    trainAM: "06:00", trainPM: "16:00",
    footballStart: "18:30", footballEnd: "20:00", footballDays: [0, 2],
    cold: { morning: "06:45", sportNormal: "16:55", sportFootball: "20:05" },
    skin: { morning: "06:55", evening: "20:40" }
  };
  function diffLevel() { return DIFF_LEVELS[Math.min(DIFF_LEVELS.length - 1, Math.max(0, S.diff | 0))]; }
  function scaleReps(str, f) { return String(str).replace(/\d+/g, (m) => Math.max(1, Math.round(parseInt(m, 10) * f))); }
  function scaleSession(sess) {
    if (!sess || sess.type === "rest") return sess;
    const L = diffLevel();
    const blocks = (sess.blocks || []).map((b) => ({ ...b, sets: Math.max(1, b.sets + L.setB), reps: scaleReps(b.reps, L.repF), rest: b.rest ? Math.max(10, b.rest + L.restB) : b.rest }));
    return { ...sess, blocks, kcal: Math.round(sess.kcal * (0.7 + 0.35 * L.repF)), minutes: Math.round(sess.minutes * (0.8 + 0.28 * L.repF)) };
  }
  // Liefert die skalierte Session (am|pm) eines Wochentags inkl. Tagesname.
  function scaledSession(wd, slot) {
    const d = TRAINING.days[wd]; if (!d || !d[slot]) return null;
    return Object.assign({}, scaleSession(d[slot]), { day: d.day, slot: slot, football: !!d.football });
  }
  const QUOTES = [
    { t: "Der Körper erreicht, was der Geist glaubt.", a: "Napoleon Hill" },
    { t: "Disziplin ist, das zu tun, was getan werden muss – auch wenn du keine Lust hast.", a: "APEX" },
    { t: "Ein Prozent besser jeden Tag ist in einem Jahr 37× besser.", a: "James Clear" },
    { t: "Schmerz ist vorübergehend. Aufgeben dauert ewig.", a: "Lance Armstrong" },
    { t: "Deine einzige Konkurrenz ist die Person, die du gestern warst.", a: "APEX" },
    { t: "Der Unterschied zwischen wollen und schaffen ist der Wille durchzuhalten.", a: "APEX" },
    { t: "Erfolg ist die Summe kleiner Anstrengungen, Tag für Tag wiederholt.", a: "R. Collier" },
    { t: "Kein Motiv ist stärker als der Beweis an dich selbst, dass du es kannst.", a: "APEX" },
    { t: "Iss für den Körper, den du willst – nicht für den Hunger von jetzt.", a: "APEX" },
    { t: "Der beste Zeitpunkt anzufangen war gestern. Der zweitbeste ist jetzt.", a: "Sprichwort" },
    { t: "Stärke wächst nicht im Komfort. Sie wächst im Widerstand.", a: "APEX" },
    { t: "Motivation bringt dich in Gang. Gewohnheit hält dich am Laufen.", a: "Jim Rohn" },
    { t: "Jede Wiederholung ist eine Investition in dein zukünftiges Ich.", a: "APEX" },
    { t: "Zweifel tötet mehr Träume als Scheitern es je könnte.", a: "Suzy Kassem" },
    { t: "Du musst nicht extrem sein. Nur konsequent.", a: "APEX" },
    { t: "Fett verbrennt in der Küche, Muskeln formt das Training.", a: "APEX" }
  ];

  /* ---------------- State ---------------- */
  const LS = "apex_state_v1";
  let S = load();

  function defaultState() {
    const st = {
      profile: { weight: 72, height: 185, age: 22, sex: "m", activity: "base", deficit: 300 },
      budget: 0, protein: 0, diff: 0,
      plan: {}, days: {}, appointments: [], customDishes: [], favorites: {},
      stats: {
        workoutsTotal: 0, currentStreak: 0, bestStreak: 0, lastActive: "",
        burnedTotal: 0, deficitDays: 0, proteinDays: 0, perfectDays: 0,
        mealsChecked: 0, weeksPlanned: 0, earlyWorkouts: 0, coldShowers: 0, xp: 0, level: 1
      },
      achievements: {}, shopChecked: {}, skinBought: {}, seenIntro: false
    };
    recalcTargets(st);
    return st;
  }
  function load() {
    try {
      const r = JSON.parse(localStorage.getItem(LS));
      if (r && r.profile) {
        r.stats = r.stats || {}; r.days = r.days || {}; r.plan = r.plan || {}; r.achievements = r.achievements || {}; r.shopChecked = r.shopChecked || {}; r.skinBought = r.skinBought || {}; r.appointments = r.appointments || []; r.customDishes = r.customDishes || []; r.favorites = r.favorites || {};
        if (typeof r.diff !== "number") r.diff = 0;
        // Einmalige Umstellung auf die proteinreichen Gerichte: altes Standard-Defizit (−500) auf sanft (−300) senken, damit die kalorienreicheren Gerichte ins Budget passen.
        if (!r.mealsV2) { if (r.profile.deficit === 500) r.profile.deficit = 300; r.mealsV2 = true; }
        return r;
      }
    } catch (e) {}
    return defaultState();
  }
  function save() { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} }

  function recalcTargets(st) {
    const p = st.profile;
    const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161);
    const maint = bmr * (ACTIVITY[p.activity] || ACTIVITY.base).f;
    st.budget = Math.max(1200, Math.round((maint - p.deficit) / 10) * 10);
    st.protein = Math.max(150, Math.round((p.weight * 2.1) / 5) * 5);
  }

  /* ---------------- Datum / Helfer ---------------- */
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const todayStr = () => ymd(new Date());
  const mondayIdx = (d) => ((d || new Date()).getDay() + 6) % 7;
  const todayWd = () => mondayIdx(new Date());
  function daysBetween(a, b) { if (!a) return 999; return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000); }
  function dayRec(date) {
    date = date || todayStr();
    if (!S.days[date]) S.days[date] = { burned: 0, manual: [], checked: {}, workoutDone: false, workout: { am: false, pm: false } };
    const r = S.days[date]; r.manual = r.manual || []; r.checked = r.checked || {}; r.workout = r.workout || { am: !!r.workoutDone, pm: false };
    return r;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function vibrate(p) { if (navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} } }

  /* ---------------- Gerichte ---------------- */
  const _kcalCache = new Map();
  function mealByKey(key) {
    if (!key) return null;
    const idx = key.indexOf(":"); const t = key.slice(0, idx), i = +key.slice(idx + 1);
    const arr = MEALSETS[t]; if (!arr || !arr[i]) return null;
    return Object.assign({ _type: t, _i: i, _key: key }, arr[i]);
  }
  function mealKcal(m) {
    if (!m) return 0;
    if (m._direct) return Math.round(m.kcal || 0);
    if (m._key && _kcalCache.has(m._key)) return _kcalCache.get(m._key);
    let k = 0; for (const it of m.i) { const ing = ING[it[0]]; if (ing) k += ing.kcal * it[1] / 100; }
    k = Math.round(k); if (m._key) _kcalCache.set(m._key, k); return k;
  }
  function mealMacro(m, key) { if (m && m._direct) return Math.round(m[key] || 0); let v = 0; for (const it of m.i) { const ing = ING[it[0]]; if (ing) v += ing[key] * it[1] / 100; } return Math.round(v); }
  // Ein Plan-Slot ist: String-Verweis ("breakfast:3") · {cd:id} (eigenes Gericht) · {base,n,i,t} (angepasst)
  function resolveMeal(val) {
    if (!val) return null;
    if (typeof val === "string") return mealByKey(val);
    if (val.cd) { const d = (S.customDishes || []).find((x) => x.id === val.cd); if (!d) return null; return { _direct: true, _custom: true, _key: "cd:" + d.id, _type: "custom", n: d.n, i: [], kcal: d.kcal || 0, p: d.p || 0, c: d.c || 0, f: d.f || 0, time: d.time || "", steps: d.steps || [], tip: d.tip || "", t: d.t || ["eigenes"] }; }
    if (val.i) return { _custom: true, _key: null, _type: val.base ? val.base.slice(0, val.base.indexOf(":")) : "custom", base: val.base || null, n: val.n, i: val.i, t: val.t || [] };
    return null;
  }
  // Stabiler Schlüssel eines Gerichts für Favoriten
  function mealFavKey(m) { if (!m) return null; if (m._direct) return m._key; if (m._key) return m._key; return null; }
  function isFav(key) { return !!(key && S.favorites && S.favorites[key]); }
  function itemsKcalProt(items) { let k = 0, p = 0; for (const it of items) { const ing = ING[it[0]]; if (ing) { k += ing.kcal * it[1] / 100; p += ing.p * it[1] / 100; } } return [Math.round(k), Math.round(p)]; }
  function sameItems(a, b) { if (!a || !b || a.length !== b.length) return false; const norm = (x) => x.map((e) => e[0] + ":" + e[1]).sort().join("|"); return norm(a) === norm(b); }
  function isCustom(val) { return val && typeof val === "object"; }
  function mealTime(m) { if (m && m._direct) return m.time || null; const r = m && RECIPES[m.n]; return r && r.t ? r.t : null; }

  /* ---------------- Tages-Berechnung ---------------- */
  function computeDay(date) {
    date = date || todayStr();
    const rec = dayRec(date);
    const wd = mondayIdx(new Date(date + "T12:00:00"));
    const plan = S.plan[wd] || {};
    let eaten = 0, prot = 0, carb = 0, fat = 0;
    for (const s of SLOTS) {
      if (rec.checked[s.key] && plan[s.key]) {
        const m = resolveMeal(plan[s.key]);
        if (m) { eaten += mealKcal(m); prot += mealMacro(m, "p"); carb += mealMacro(m, "c"); fat += mealMacro(m, "f"); }
      }
    }
    for (const e of rec.manual) { eaten += e.kcal || 0; prot += e.p || 0; }
    const burned = rec.burned || 0;
    return { eaten: Math.round(eaten), prot: Math.round(prot), carb: Math.round(carb), fat: Math.round(fat), burned, budget: S.budget, room: S.budget + burned - Math.round(eaten), wd };
  }
  function planDayKcal(wd) {
    const plan = S.plan[wd] || {}; let k = 0, p = 0;
    for (const s of SLOTS) { const m = resolveMeal(plan[s.key]); if (m) { k += mealKcal(m); p += mealMacro(m, "p"); } }
    return { k, p };
  }

  /* ---------------- Fortschritt / Erfolge ---------------- */
  const pendingCele = [];
  function registerStreak(date) {
    const st = S.stats; if (st.lastActive === date) return;
    const diff = daysBetween(st.lastActive, date);
    st.currentStreak = diff === 1 ? (st.currentStreak || 0) + 1 : 1;
    st.bestStreak = Math.max(st.bestStreak || 0, st.currentStreak);
    st.lastActive = date;
  }
  function recomputeAggregates() {
    let bt = 0, dd = 0, pd = 0, pf = 0;
    for (const date in S.days) {
      const rec = S.days[date]; bt += rec.burned || 0;
      const c = computeDay(date);
      const def = c.eaten > 0 && c.eaten <= c.budget + c.burned;
      const pro = c.prot > 0 && c.prot >= S.protein;
      if (def) dd++; if (pro) pd++; if (def && pro && rec.workoutDone) pf++;
    }
    S.stats.burnedTotal = Math.round(bt); S.stats.deficitDays = dd; S.stats.proteinDays = pd; S.stats.perfectDays = pf;
  }
  function levelInfo(xp) {
    const last = LEVELS[LEVELS.length - 1];
    if (xp >= last.xp) {
      const extra = Math.floor((xp - last.xp) / 6000);
      const floorXp = last.xp + extra * 6000;
      return { level: last.level + extra, title: extra > 0 ? "Unsterblich +" + extra : last.title, floorXp, ceilXp: floorXp + 6000, prog: (xp - floorXp) / 6000 };
    }
    let cur = LEVELS[0], next = LEVELS[1];
    for (let i = 0; i < LEVELS.length; i++) { if (xp >= LEVELS[i].xp) { cur = LEVELS[i]; next = LEVELS[i + 1] || last; } }
    return { level: cur.level, title: cur.title, floorXp: cur.xp, ceilXp: next.xp, prog: (xp - cur.xp) / (next.xp - cur.xp) };
  }
  function addXp(n) {
    if (!n) return;
    S.stats.xp += n;
    const li = levelInfo(S.stats.xp);
    if (!S.stats.level) S.stats.level = 1;
    if (li.level > S.stats.level) { S.stats.level = li.level; pendingCele.push({ ico: "⭐", title: "Level " + li.level + "!", sub: "Neuer Rang: " + li.title }); }
  }
  function checkAchievements() {
    for (const a of ACHIEVEMENTS) {
      const val = S.stats[a.stat] || 0;
      if (val >= a.target && !(S.achievements[a.id] && S.achievements[a.id].unlocked)) {
        S.achievements[a.id] = { unlocked: true, date: todayStr() };
        addXp(a.xp || 0);
        pendingCele.push({ ico: a.icon, title: "Erfolg: " + a.title, sub: a.desc });
      }
    }
  }
  function refresh() {
    const date = todayStr(), rec = dayRec(date);
    const active = rec.workoutDone || rec.manual.length > 0 || (rec.burned > 0) || Object.keys(rec.checked).some((k) => rec.checked[k]);
    if (active) registerStreak(date);
    recomputeAggregates();
    checkAchievements();
    save();
  }

  /* ---------------- Aktionen ---------------- */
  function toggleMeal(slot) {
    const rec = dayRec(); const on = !rec.checked[slot];
    rec.checked[slot] = on;
    if (on) { S.stats.mealsChecked = (S.stats.mealsChecked || 0) + 1; addXp(5); vibrate(15); }
    refresh(); renderActive(); flushCele();
  }
  function setPlan(wd, slot, key) {
    S.plan[wd] = S.plan[wd] || {};
    if (key) S.plan[wd][slot] = key; else delete S.plan[wd][slot];
    save(); renderActive();
  }
  function setBurned(v) { dayRec().burned = Math.max(0, Math.round(v || 0)); refresh(); renderActive(); }
  function addManual(name, kcal, p) { dayRec().manual.push({ n: name, kcal: Math.round(kcal || 0), p: Math.round(p || 0) }); refresh(); renderActive(); }
  function delManual(i) { dayRec().manual.splice(i, 1); refresh(); renderActive(); }

  /* ---------------- Eigene Termine ---------------- */
  function saveAppointment(ap) {
    S.appointments = S.appointments || [];
    const i = S.appointments.findIndex((x) => x.id === ap.id);
    if (i >= 0) S.appointments[i] = ap; else S.appointments.push(ap);
    save(); renderActive();
  }
  function delAppointment(id) {
    S.appointments = (S.appointments || []).filter((x) => x.id !== id);
    save(); renderActive();
  }

  function autoWeek() {
    const ratios = { breakfast: 0.26, snack: 0.13, lunch: 0.34, dinner: 0.27 };
    const used = { breakfast: new Set(), snack: new Set(), lunch: new Set(), dinner: new Set() };
    for (let wd = 0; wd < 7; wd++) {
      const plan = {};
      for (const s of SLOTS) {
        const set = MEALSETS[s.key]; if (!set.length) continue;
        plan[s.key] = s.key + ":" + pickNear(set, S.budget * ratios[s.key], used[s.key]);
      }
      S.plan[wd] = plan;
    }
    save(); vibrate(20); toast("Woche automatisch geplant! ✨", "✨"); renderActive();
  }
  function pickNear(set, target, usedSet) {
    let best = 0, bestScore = 1e9;
    for (let i = 0; i < set.length; i++) {
      const score = Math.abs(mealKcal(set[i]) - target) + (usedSet.has(i) ? 500 : 0) + Math.random() * 70;
      if (score < bestScore) { bestScore = score; best = i; }
    }
    usedSet.add(best); return best;
  }
  function clearWeek() { S.plan = {}; save(); renderActive(); }

  /* ---------------- Eigene Gerichte & Favoriten ---------------- */
  function addCustomDish(d) {
    const id = "cd" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    S.customDishes = S.customDishes || [];
    S.customDishes.push({ id, n: d.n, kcal: Math.round(d.kcal || 0), p: Math.round(d.p || 0), c: Math.round(d.c || 0), f: Math.round(d.f || 0), time: d.time || "", steps: (d.steps || []).slice(), tip: d.tip || "" });
    save(); return id;
  }
  function delCustomDish(id) {
    S.customDishes = (S.customDishes || []).filter((x) => x.id !== id);
    if (S.favorites) delete S.favorites["cd:" + id];
    for (const wd in S.plan) { const p = S.plan[wd]; for (const k in p) { const v = p[k]; if (v && typeof v === "object" && v.cd === id) delete p[k]; } }
    save();
  }
  function toggleFav(key) {
    if (!key) return;
    S.favorites = S.favorites || {};
    if (S.favorites[key]) delete S.favorites[key]; else S.favorites[key] = true;
    save(); vibrate(10);
  }

  function completeWorkout(wd, slot, skipFeedback) {
    slot = slot || "am";
    const rec = dayRec(); rec.workout = rec.workout || { am: false, pm: false };
    const already = !!rec.workout[slot];
    rec.workout[slot] = true; rec.workoutDone = true;
    const sd = scaledSession(wd, slot) || {};
    if (!already) {
      S.stats.workoutsTotal = (S.stats.workoutsTotal || 0) + 1;
      if (new Date().getHours() < 9) S.stats.earlyWorkouts = (S.stats.earlyWorkouts || 0) + 1;
      addXp(45);
      const both = rec.workout.am && rec.workout.pm;
      pendingCele.push({ ico: sd.emoji || "💪", title: both ? "Beide Einheiten geschafft! 🔥" : "Einheit geschafft!", sub: (sd.focus || "") + " – stark durchgezogen!" });
    }
    refresh(); renderActive(); flushCele();
    if (!already && !skipFeedback && sd.type && sd.type !== "rest") openWorkoutFeedback(sd.kcal);
  }
  // Timeline-Checkbox: Session direkt abhaken (mit XP/Feier, ohne Feedback-Dialog) bzw. wieder abwählen.
  function toggleSession(wd, slot) {
    const rec = dayRec(); rec.workout = rec.workout || { am: false, pm: false };
    if (rec.workout[slot]) { rec.workout[slot] = false; refresh(); renderActive(); }
    else { completeWorkout(wd, slot, true); }
  }
  // Generische Tages-Checkliste (Aufstehen, Kaltdusche, Skincare, Schule, Fußball, Termine, Schlafen).
  function toggleItem(key) {
    const rec = dayRec(); rec.checked[key] = !rec.checked[key];
    if (rec.checked[key]) { addXp(2); vibrate(12); }
    refresh(); renderActive(); flushCele();
  }
  function openWorkoutFeedback(kcal) {
    const cur = diffLevel();
    const bd = openSheet(`<div class="grip"></div>
      <div class="sheet-body" style="padding-bottom:22px">
        <h2 style="margin-bottom:6px">Wie war dieses Training?</h2>
        <p class="muted" style="margin:0 0 16px;line-height:1.5">Dein Feedback passt die Schwierigkeit automatisch an.<br>Aktuelle Stufe: <b style="color:var(--acc)">${cur.ico} ${esc(cur.n)}</b></p>
        <button class="btn btn-ghost" style="margin-bottom:8px" data-fb="easy">😅 Zu leicht – nächstes Mal härter</button>
        <button class="btn btn-primary" style="margin-bottom:8px" data-fb="perfect">✅ Perfekt – genau richtig</button>
        <button class="btn btn-ghost" data-fb="hard">😮‍💨 Zu schwer – nächstes Mal leichter</button>
      </div>`);
    bd.addEventListener("click", (e) => {
      const b = e.target.closest("[data-fb]"); if (!b) return;
      const before = S.diff | 0;
      if (b.dataset.fb === "easy") S.diff = Math.min(DIFF_LEVELS.length - 1, before + 1);
      else if (b.dataset.fb === "hard") S.diff = Math.max(0, before - 1);
      save(); const L = diffLevel();
      toast(S.diff !== before ? "Nächstes Mal: " + L.ico + " " + L.n : "Stufe bleibt: " + L.ico + " " + L.n, "🎚️");
      vibrate(15); closeSheet(bd); renderActive();
      if (kcal) askAddBurned(kcal);
    });
  }
  function markWeekPlanned() {
    S.stats.weeksPlanned = (S.stats.weeksPlanned || 0) + 1;
    addXp(30); vibrate(20);
    pendingCele.push({ ico: "🛒", title: "Wochenplan abgehakt!", sub: "Alles eingekauft – bereit für eine starke Woche." });
    refresh(); renderActive(); flushCele();
  }
  function openColdTherapy() {
    const bd = openSheet(`<div class="grip"></div>
      <div class="sheet-head"><h2>❄️ Kältetherapie</h2><button class="closex" data-close>✕</button></div>
      <div class="sheet-body">
        <div class="recipe-meta"><span class="pill">🌅 06:35 morgens</span><span class="pill">🏋️ nach dem Sport</span><span class="pill">⏱️ 2–3 Min</span></div>
        <div class="sectitle" style="margin-top:2px">🧊 Dusch-Timer</div>
        <div class="card">
          <div class="cold-timer">
            <div class="ct-ring"><svg viewBox="0 0 120 120" width="184" height="184">
              <circle class="bg" cx="60" cy="60" r="52"></circle>
              <circle class="fg warm" cx="60" cy="60" r="52" data-ct-ring stroke-dashoffset="0"></circle>
            </svg><div class="ct-num"><span class="ct-phase" data-ct-phase>🔥 bereit</span><span class="ct-time" data-ct-time>2:00</span></div></div>
            <div class="ct-group"><span class="ct-lbl">🔥 Erst warm duschen</span><div class="ct-presets">
              <button data-warm="0">0:00</button><button data-warm="60">1:00</button><button data-warm="120">2:00</button><button data-warm="180">3:00</button>
            </div></div>
            <div class="ct-group"><span class="ct-lbl">🥶 Dann kalt</span><div class="ct-presets">
              <button data-cold="30">0:30</button><button data-cold="60">1:00</button><button data-cold="90">1:30</button><button data-cold="120">2:00</button><button data-cold="180">3:00</button>
            </div></div>
            <div class="ct-controls">
              <button class="btn btn-primary" data-ct-start>▶︎ Start</button>
              <button class="btn btn-ghost" data-ct-reset>Zurücksetzen</button>
            </div>
          </div>
        </div>
        <div class="sectitle">Warum kalt duschen?</div>
        <div class="card"><ul style="margin:0;padding-left:18px;line-height:1.7;font-size:14px">
          <li>Sofort wach, klar & fokussiert (Dopamin-Kick)</li>
          <li>Schnellere Regeneration nach Training & Fußball</li>
          <li>Stärkt Immunsystem und Kreislauf</li>
          <li>Kurbelt den Stoffwechsel an (braunes Fett)</li>
          <li>Trainiert mentale Härte & Disziplin</li>
        </ul></div>
        <div class="sectitle">So geht's</div>
        <div class="card">
          <div class="recipe-step"><div class="num">1</div><div class="tx">Normal warm duschen und fertig waschen.</div></div>
          <div class="recipe-step"><div class="num">2</div><div class="tx">Wasser auf kalt drehen – ruhig weiteratmen, langsam ein und aus.</div></div>
          <div class="recipe-step"><div class="num">3</div><div class="tx">Zuerst Beine & Arme, dann Brust, zuletzt Nacken – nie direkt am Kopf starten.</div></div>
          <div class="recipe-step"><div class="num">4</div><div class="tx">2–3 Minuten kalt halten, dann abtrocknen und von selbst aufwärmen.</div></div>
        </div>
        <div class="sectitle">Aufbau (langsam steigern)</div>
        <div class="card"><ul style="margin:0;padding-left:18px;line-height:1.7;font-size:14px">
          <li>Woche 1: die letzten 30 Sek. kalt abschließen</li>
          <li>Woche 2–3: auf 1–2 Min steigern</li>
          <li>Ab Woche 4: volle 2–3 Min komplett kalt</li>
        </ul></div>
        <div class="recipe-tip"><b>💡 Tipp:</b> Morgens für Energie, nach dem Sport für die Regeneration. Konsequenz schlägt Dauer – lieber jeden Tag kurz als selten lang.</div>
        <div class="recipe-note" style="margin-top:12px">⚠️ Bei Herz- oder Kreislaufproblemen vorher ärztlich abklären.</div>
        <div style="height:14px"></div>
      </div>`, { full: true });
    bd.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeSheet(bd); });
    wireColdTimer(bd);
  }
  function wireColdTimer(bd) {
    const ring = bd.querySelector("[data-ct-ring]"), timeEl = bd.querySelector("[data-ct-time]"), phaseEl = bd.querySelector("[data-ct-phase]"), startBtn = bd.querySelector("[data-ct-start]");
    if (!ring) return;
    const C = 2 * Math.PI * 52; ring.style.strokeDasharray = C.toFixed(1);
    let warm = 120, cold = 120, phase = "idle", left = warm, total = warm, iv = null;
    const fmt = (s) => Math.floor(Math.max(0, s) / 60) + ":" + String(Math.max(0, s) % 60).padStart(2, "0");
    function paint() {
      bd.querySelectorAll("[data-warm]").forEach((b) => b.classList.toggle("on", +b.dataset.warm === warm));
      bd.querySelectorAll("[data-cold]").forEach((b) => b.classList.toggle("on", +b.dataset.cold === cold));
    }
    function draw() {
      timeEl.textContent = phase === "done" ? "💪" : fmt(left);
      ring.style.strokeDashoffset = (C * (1 - (total ? Math.max(0, left) / total : 0))).toFixed(1);
      ring.classList.toggle("warm", phase !== "cold");
      phaseEl.textContent = phase === "warm" ? "🔥 Warm-Phase" : phase === "cold" ? "🥶 Kalt-Phase – durchhalten!" : phase === "done" ? "Geschafft!" : "🔥 bereit";
    }
    function stop() { if (iv) clearInterval(iv); iv = null; startBtn.textContent = "▶︎ Start"; }
    function reset() { stop(); phase = "idle"; total = left = (warm > 0 ? warm : cold); draw(); }
    function tick() {
      if (!document.body.contains(timeEl)) { stop(); return; }
      left--;
      if (left <= 0) {
        if (phase === "warm") { beep(); vibrate([140, 90, 220]); phase = "cold"; total = left = cold; draw(); return; }
        stop(); phase = "done"; draw();
        beep(); setTimeout(beep, 260); vibrate([90, 60, 90, 60, 160]);
        S.stats.coldShowers = (S.stats.coldShowers || 0) + 1; save(); checkAchievements();
        toast("Kältetherapie geschafft! 🥶💪", "❄️"); flushCele();
        return;
      }
      draw();
    }
    reset(); paint();
    bd.addEventListener("click", (e) => {
      const w = e.target.closest("[data-warm]"); if (w) { warm = +w.dataset.warm; if (phase === "idle" || phase === "done") reset(); paint(); return; }
      const c = e.target.closest("[data-cold]"); if (c) { cold = +c.dataset.cold; if (phase === "idle" || phase === "done") reset(); paint(); return; }
      if (e.target.closest("[data-ct-start]")) {
        if (iv) { stop(); return; }
        if (phase === "idle" || phase === "done") { phase = warm > 0 ? "warm" : "cold"; total = left = (warm > 0 ? warm : cold); }
        draw(); startBtn.textContent = "⏸ Pause"; vibrate(15); beep(); iv = setInterval(tick, 1000); return;
      }
      if (e.target.closest("[data-ct-reset]")) { reset(); paint(); return; }
    });
  }
  function openSkincare() {
    const sc = window.SKINCARE || {};
    const steps = (arr) => (arr || []).map((s, i) => `<div class="recipe-step"><div class="num">${i + 1}</div><div class="tx">${esc(s)}</div></div>`).join("");
    const listUl = (arr) => `<ul style="margin:0;padding-left:18px;line-height:1.7;font-size:14px">${(arr || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    let prodHtml = "";
    for (const cat of ["Basis (täglich)", "Gegen Pickel", "Optional"]) {
      const ps = (sc.products || []).filter((p) => p.cat === cat);
      if (!ps.length) continue;
      prodHtml += `<div class="wkmeta" style="margin:14px 2px 4px;font-weight:800;color:var(--acc);text-transform:uppercase;letter-spacing:.05em">${esc(cat)}</div>` +
        ps.map((p) => {
          const on = !!(S.skinBought && S.skinBought[p.n]);
          return `<div class="mealrow" data-action="toggle-skin" data-p="${esc(p.n)}">
            <div class="check ${on ? "on" : ""}">${on ? "✓" : ""}</div>
            <div class="grow"><div class="mealname" style="font-size:14.5px">${esc(p.n)}</div>
              <div class="wkmeta">${esc(p.use)} · ${esc(p.shop)}</div></div>
            <div class="mealkcal" style="white-space:nowrap">${esc(p.price)}</div>
          </div>`;
        }).join("");
    }
    const bd = openSheet(`<div class="grip"></div>
      <div class="sheet-head"><h2>✨ Skincare</h2><button class="closex" data-close>✕</button></div>
      <div class="sheet-body">
        <div class="recipe-note" style="background:rgba(109,255,143,.08);border-color:rgba(109,255,143,.25)">${esc(sc.intro || "")}</div>
        <div class="sectitle" style="margin-top:2px">☀️ Morgens</div>
        <div class="card">${steps(sc.morning)}</div>
        <div class="sectitle">🌙 Abends</div>
        <div class="card">${steps(sc.evening)}</div>
        <div class="sectitle">📅 1–2× pro Woche</div>
        <div class="card">${listUl(sc.weekly)}</div>
        <div class="sectitle">✅ Grundregeln für reine Haut</div>
        <div class="card">${listUl(sc.rules)}</div>
        <div class="sectitle">🛒 Produkte & Einkauf</div>
        <div class="card">${prodHtml}
          ${(() => {
            const prods = sc.products || [];
            const total = prods.reduce((s, p) => s + (p.eur || 0), 0);
            const open = prods.filter((p) => !(S.skinBought && S.skinBought[p.n])).reduce((s, p) => s + (p.eur || 0), 0);
            return `<div class="card2" style="margin-top:14px;background:var(--card2);border:1px solid var(--line);border-radius:12px;padding:12px">
              <div class="between"><span class="mealname" style="font-size:14px">💶 Alles zusammen</span><b style="color:var(--acc)">ca. ${total} €</b></div>
              <div class="between" style="margin-top:6px"><span class="wkmeta">Noch zu kaufen</span><b>ca. ${open} €</b></div>
            </div>
            <div class="wkmeta" style="margin-top:12px;line-height:1.5">🏪 ${esc(sc.shopsummary || "")}</div>
            <div class="wkmeta" style="margin-top:8px;line-height:1.5">💡 ${esc(sc.budget || "")}</div>`;
          })()}
        </div>
        <div class="recipe-note">⚠️ ${esc(sc.note || "")}</div>
        <div style="height:16px"></div>
      </div>`, { full: true });
    bd.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeSheet(bd); });
  }

  /* ============================================================
     RENDERING
     ============================================================ */
  let current = "home";
  function renderActive() { render(current); }
  function render(tab) {
    if (tab === "home") renderHome();
    else if (tab === "plan") renderPlan();
    else if (tab === "shop") renderShop();
    else if (tab === "train") renderTrain();
    else if (tab === "awards") renderAwards();
  }

  function topbar(title, withGear) {
    const li = levelInfo(S.stats.xp);
    return `<div class="topbar">
      <div class="brand"><span class="logo">A</span>${title}</div>
      <div class="row" style="gap:8px">
        <div class="lvlchip">⭐ Lvl <b>${li.level}</b></div>
        ${withGear ? '<button class="iconbtn" data-action="open-settings">⚙️</button>' : ""}
      </div></div>`;
  }
  function tagsHtml(t) {
    if (!t || !t.length) return "";
    return '<div class="tags">' + t.slice(0, 3).map((x) => `<span class="tag ${x}">${esc(x)}</span>`).join("") + "</div>";
  }

  /* ---------- HEUTE ---------- */
  function buildTimeline(wd) {
    const rec = dayRec(); const plan = S.plan[wd] || {};
    const isFb = DAYPLAN.footballDays.indexOf(wd) >= 0;
    const amS = scaledSession(wd, "am"), pmS = scaledSession(wd, "pm");
    const wdone = rec.workout || { am: false, pm: false };
    const items = [];
    items.push({ t: DAYPLAN.wake, ico: "☀️", key: "wake", title: "Aufstehen", sub: "Guten Morgen – erstmal ein großes Glas Wasser." });
    items.push({ t: DAYPLAN.cold.morning, ico: "❄️", cold: 1, key: "cold:m", title: "Kaltdusche", sub: "2–3 Min · Energie & Fokus für den Tag" });
    items.push({ t: DAYPLAN.skin.morning, ico: "✨", skin: 1, key: "skin:m", title: "Skincare (morgens)", sub: "Reinigen · Creme · Sonnenschutz LSF 50" });
    if (DAYPLAN.school.days.indexOf(wd) >= 0) items.push({ t: DAYPLAN.school.start, ico: "🎒", key: "school", title: "Schule", sub: "bis " + DAYPLAN.school.end + " Uhr · Brotzeit in der Pause um 10:00" });
    for (const key of ["breakfast", "snack", "lunch"]) {
      const s = SLOTS.find((x) => x.key === key);
      items.push({ t: DAYPLAN.times[key], ico: s.ico, meal: 1, slot: key, m: resolveMeal(plan[key]), on: !!rec.checked[key], label: s.label });
    }
    if (amS) items.push({ t: DAYPLAN.trainAM, ico: amS.emoji, training: 1, slot: "am", wd, done: !!wdone.am, focus: amS.focus, sub: amS.sub, minutes: amS.minutes, kcal: amS.kcal, rest: amS.type === "rest" });
    if (pmS) items.push({ t: DAYPLAN.trainPM, ico: pmS.emoji, training: 1, slot: "pm", wd, done: !!wdone.pm, focus: pmS.focus, sub: pmS.sub, minutes: pmS.minutes, kcal: pmS.kcal, rest: pmS.type === "rest" });
    if (isFb) items.push({ t: DAYPLAN.footballStart, ico: "⚽", key: "football", title: "Fußballtraining", sub: "1:30 Std im Verein (" + DAYPLAN.footballStart + "–" + DAYPLAN.footballEnd + ") · deine Bein-/Ausdauer-Einheit" });
    items.push({ t: isFb ? DAYPLAN.cold.sportFootball : DAYPLAN.cold.sportNormal, ico: "❄️", cold: 1, key: "cold:s", title: "Kaltdusche (Regeneration)", sub: "2–3 Min kalt · Regeneration & mentale Härte" });
    { const s = SLOTS.find((x) => x.key === "dinner"); items.push({ t: isFb ? DAYPLAN.dinnerFootball : DAYPLAN.dinnerNormal, ico: s.ico, meal: 1, slot: "dinner", m: resolveMeal(plan.dinner), on: !!rec.checked.dinner, label: s.label }); }
    items.push({ t: DAYPLAN.skin.evening, ico: "🌙", skin: 1, key: "skin:e", title: "Skincare (abends)", sub: "Reinigen · Wirkstoff · Feuchtigkeit" });
    items.push({ t: DAYPLAN.sleep, ico: "😴", key: "sleep", title: "Schlafen gehen", sub: "Früh ins Bett – morgen 06:00 die erste Einheit. Schlaf = Muskelaufbau." });
    for (const ap of (S.appointments || [])) {
      const match = ap.mode === "weekly" ? (ap.days || []).indexOf(wd) >= 0 : ap.date === todayStr();
      if (match) items.push({ t: ap.time || "12:00", ico: ap.ico || "📌", appt: 1, id: ap.id, key: "appt:" + ap.id, title: ap.title || "Termin", sub: ap.sub || (ap.mode === "weekly" ? "Wöchentlicher Termin" : "Eigener Termin") });
    }
    items.sort((a, b) => a.t.localeCompare(b.t));
    const chk = (on, action, attrs) => `<div class="check ${on ? "on" : ""}" data-action="${action}" ${attrs || ""}>${on ? "✓" : ""}</div>`;
    return items.map((it) => {
      if (it.cold) return `<div class="tl-row">
        <div class="tl-time">${it.t}</div><div class="tl-ico" style="background:rgba(92,200,255,.12)">${it.ico}</div>
        <div class="tl-body" data-action="cold-therapy"><div class="tl-title">${esc(it.title)}</div><div class="tl-sub">${esc(it.sub)} · antippen</div></div>
        ${chk(!!rec.checked[it.key], "toggle-item", `data-key="${it.key}"`)}
      </div>`;
      if (it.skin) return `<div class="tl-row">
        <div class="tl-time">${it.t}</div><div class="tl-ico" style="background:rgba(109,255,143,.12)">${it.ico}</div>
        <div class="tl-body" data-action="skincare"><div class="tl-title">${esc(it.title)}</div><div class="tl-sub">${esc(it.sub)} · antippen</div></div>
        ${chk(!!rec.checked[it.key], "toggle-item", `data-key="${it.key}"`)}
      </div>`;
      if (it.appt) return `<div class="tl-row">
        <div class="tl-time">${it.t}</div><div class="tl-ico" style="background:rgba(180,140,255,.16)">${it.ico}</div>
        <div class="tl-body" data-action="open-appointment" data-id="${esc(it.id)}"><div class="tl-title">${esc(it.title)}</div><div class="tl-sub">${esc(it.sub)} · ✎ antippen</div></div>
        ${chk(!!rec.checked[it.key], "toggle-item", `data-key="${it.key}"`)}
      </div>`;
      if (it.meal) return `<div class="tl-row">
        <div class="tl-time">${it.t}</div><div class="tl-ico">${it.ico}</div>
        <div class="tl-body" data-action="view-recipe" data-wd="${wd}" data-slot="${it.slot}">
          <div class="tl-title ${it.m ? "" : "muted"}">${it.m ? esc(it.m.n) : "Gericht wählen"}</div>
          <div class="tl-sub">${it.label}${it.m ? " · " + mealKcal(it.m) + " kcal" + (mealTime(it.m) ? " · ⏱️ " + mealTime(it.m) : "") : " · antippen"}</div>
        </div>
        ${it.m ? chk(it.on, "toggle-meal", `data-slot="${it.slot}"`) : `<div style="color:var(--acc);font-size:20px;padding-right:6px" data-action="view-recipe" data-wd="${wd}" data-slot="${it.slot}">＋</div>`}
      </div>`;
      if (it.training) return `<div class="tl-row">
        <div class="tl-time">${it.t}</div><div class="tl-ico">${it.ico}</div>
        <div class="tl-body" data-action="start-workout" data-wd="${it.wd}" data-slot="${it.slot}"><div class="tl-title">${esc(it.focus)}${it.done ? " ✓" : ""}</div>
          <div class="tl-sub">${it.slot === "am" ? "🌅 Früh-Einheit" : "🏋️ Nachmittag"}${it.rest ? " · locker" : ""} · ~${it.minutes} Min · ~${it.kcal} kcal · ▶︎ antippen</div></div>
        ${chk(it.done, "toggle-session", `data-wd="${it.wd}" data-slot="${it.slot}"`)}
      </div>`;
      return `<div class="tl-row dim">
        <div class="tl-time">${it.t}</div><div class="tl-ico" data-action="toggle-item" data-key="${it.key}">${it.ico}</div>
        <div class="tl-body" data-action="toggle-item" data-key="${it.key}"><div class="tl-title">${esc(it.title)}</div><div class="tl-sub">${esc(it.sub || "")}</div></div>
        ${chk(!!rec.checked[it.key], "toggle-item", `data-key="${it.key}"`)}
      </div>`;
    }).join("");
  }

  function renderHome() {
    const c = computeDay(); const st = S.stats; const rec = dayRec();
    const wd = todayWd();
    const cap = c.budget + c.burned;
    const frac = cap > 0 ? c.eaten / cap : 0;
    const R = 100, C = 2 * Math.PI * R;
    const off = C * (1 - Math.min(frac, 1));
    const over = c.room < 0;
    const q = QUOTES[(new Date().getDate() + new Date().getMonth()) % QUOTES.length];

    const manualHtml = rec.manual.map((e, i) => `<div class="mealrow">
        <div class="check on" style="cursor:default">✓</div>
        <div class="grow"><div class="slotlabel">➕ Manuell</div><div class="mealname">${esc(e.n)}</div></div>
        <div class="mealkcal">${e.kcal}<br><small>kcal</small></div>
        <button class="iconbtn" data-action="del-manual" data-idx="${i}" style="width:32px;height:32px">🗑️</button>
      </div>`).join("");

    document.getElementById("tab-home").innerHTML =
      topbar("APEX", true) +
      `<div class="card ringcard">
        <div class="ringwrap">
          <svg viewBox="0 0 230 230" width="230" height="230">
            <circle class="ring-bg" cx="115" cy="115" r="${R}"></circle>
            <circle class="ring-fg ${over ? "over" : ""}" cx="115" cy="115" r="${R}"
              stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"></circle>
          </svg>
          <div class="ringlabel">
            <div class="big ${over ? "over" : ""}">${c.room}</div>
            <div class="cap">${over ? "kcal drüber" : "kcal Spielraum"}</div>
            <div class="sub">${c.eaten} gegessen · Ziel ${c.budget}</div>
          </div>
        </div>
        <div class="macro-line"><span>Eiweiß <b>${c.prot} g</b></span><span>KH <b>${c.carb} g</b></span><span>Fett <b>${c.fat} g</b></span></div>
        <div class="triple">
          <div class="tri"><div class="v">${c.eaten}</div><div class="k">Gegessen</div></div>
          <div class="tri tap" data-action="edit-burned"><div class="v pos">${c.burned}</div><div class="k">Verbrannt</div></div>
          <div class="tri"><div class="v">${c.budget}</div><div class="k">Budget</div></div>
        </div>
      </div>

      <div class="card tight">
        <div class="barhead"><span>🥩 Eiweiß heute</span><span>${c.prot} / ${S.protein} g</span></div>
        <div class="bar"><div class="bar-fill prot" style="width:${Math.min(100, S.protein ? c.prot / S.protein * 100 : 0)}%"></div></div>
      </div>

      <div class="sectitle">Dein Tag · ${WEEKDAYS[wd]}</div>
      <div class="card">${buildTimeline(wd)}</div>
      <button class="btn btn-ghost btn-sm" data-action="add-appointment" style="margin-bottom:10px">📌 Eigenen Termin hinzufügen</button>
      ${manualHtml ? `<div class="card">${manualHtml}</div>` : ""}
      <button class="btn btn-ghost" data-action="add-manual">➕ Zusätzliches Essen eintragen</button>

      <div class="card streakcard" style="margin-top:14px">
        <div class="flame">🔥</div>
        <div class="grow"><div class="mealname">${st.currentStreak || 0}-Tage-Streak</div>
        <div class="wkmeta">Bester Streak: ${st.bestStreak || 0} · ${st.workoutsTotal || 0} Trainings gesamt</div></div>
      </div>
      <div class="card"><div class="quote">„${esc(q.t)}“<span class="qa">— ${esc(q.a)}</span></div></div>
      <div style="height:8px"></div>`;
  }

  /* ---------- PLAN ---------- */
  function renderPlan() {
    let html = topbar("Wochenplan", false) +
      `<main style="padding:0"></main>
      <div class="card">
        <div class="between"><div><div class="mealname">Deine Woche</div><div class="wkmeta">Wähle für jeden Tag deine Mahlzeiten.</div></div></div>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn btn-primary btn-sm" style="flex:1" data-action="auto-week">✨ Woche füllen</button>
          <button class="btn btn-ghost btn-sm" style="flex:0 0 auto" data-action="clear-week">Leeren</button>
        </div>
      </div>`;
    for (let wd = 0; wd < 7; wd++) {
      const t = planDayKcal(wd); const plan = S.plan[wd] || {};
      const isToday = wd === todayWd();
      html += `<div class="card">
        <div class="dayhead">
          <div class="d">${WEEKDAYS[wd]} ${isToday ? '<span class="today-badge">HEUTE</span>' : ""}</div>
          <div class="t"><b>${t.k}</b> kcal · ${t.p} g Eiweiß</div>
        </div>
        ${SLOTS.map((s) => {
          const val = plan[s.key]; const m = resolveMeal(val);
          return `<div class="slotpick" data-action="change-meal" data-wd="${wd}" data-slot="${s.key}">
            <div class="ico">${s.ico}</div>
            <div class="grow"><div class="slotlabel">${s.label}${val && val.cd ? ' · <span style="color:var(--acc)">eigenes</span>' : (isCustom(val) ? ' · <span style="color:var(--acc)">angepasst</span>' : "")}</div>
              <div class="mealname ${m ? "" : "empty"}">${m ? esc(m.n) : "Antippen zum Wählen"}</div></div>
            <div class="mealkcal">${m ? mealKcal(m) : ""}</div>
          </div>`;
        }).join("")}
      </div>`;
    }
    html += `<div class="empty-note">Tipp: „✨ Woche füllen“ erstellt dir sofort einen ausgewogenen Plan rund um dein Kalorienziel – danach beliebig anpassen.</div><div style="height:8px"></div>`;
    document.getElementById("tab-plan").innerHTML = html;
  }

  /* ---------- EINKAUF ---------- */
  function buildShopping() {
    const totals = {};
    for (let wd = 0; wd < 7; wd++) {
      const plan = S.plan[wd] || {};
      for (const s of SLOTS) { const m = resolveMeal(plan[s.key]); if (!m) continue; for (const it of m.i) totals[it[0]] = (totals[it[0]] || 0) + it[1]; }
    }
    return totals;
  }
  function itemCost(id, g) { const r = (window.PRICES || {})[id]; return r ? r * g / 100 : 0; }
  function eur(v) { return (Math.round(v * 100) / 100).toFixed(2).replace(".", ",") + " €"; }
  function shopTotal(totals) { let s = 0; for (const id in totals) s += itemCost(id, totals[id]); return s; }
  function plural(u, n) { if (n === 1) return u; return ({ "Scheibe": "Scheiben", "Zehe": "Zehen" }[u]) || u; }
  function fmtAmount(id, g) {
    const ing = ING[id]; if (!ing) return Math.round(g) + " g";
    if (ing.pieceG) { const n = Math.max(1, Math.round(g / ing.pieceG)); return n + " " + plural(ing.unit, n); }
    if (ing.unit === "ml") return g >= 1000 ? (g / 1000).toFixed(g % 1000 ? 1 : 0) + " l" : Math.round(g) + " ml";
    return g >= 1000 ? (g / 1000).toFixed(1) + " kg" : Math.max(10, Math.round(g / 10) * 10) + " g";
  }
  function renderShop() {
    const totals = buildShopping();
    const ids = Object.keys(totals);
    let html = topbar("Einkaufsliste", false);
    if (!ids.length) {
      html += `<div class="empty-note">🛒<br><br>Noch kein Wochenplan.<br>Plane zuerst deine Woche – dann steht hier automatisch alles, was du brauchst.</div>
        <button class="btn btn-primary" data-action="go-plan">Zum Wochenplan</button>`;
      document.getElementById("tab-shop").innerHTML = html;
      return;
    }
    let weekKcal = 0;
    for (let wd = 0; wd < 7; wd++) weekKcal += planDayKcal(wd).k;
    const checkedCount = ids.filter((id) => S.shopChecked[id]).length;
    const total = shopTotal(totals);
    const openTotal = ids.filter((id) => !S.shopChecked[id]).reduce((s, id) => s + itemCost(id, totals[id]), 0);

    html += `<div class="card">
      <div class="between">
        <div><div class="mealname">${ids.length} Zutaten</div><div class="wkmeta">für 7 Tage · 1 Portion je Mahlzeit</div></div>
        <div style="text-align:right"><div class="mealname">${Math.round(weekKcal / 7)}</div><div class="wkmeta">Ø kcal/Tag</div></div>
      </div>
      <div class="card2" style="margin-top:12px;background:var(--card2);border:1px solid var(--line);border-radius:12px;padding:12px">
        <div class="between"><span class="mealname" style="font-size:14px">💶 Geschätzt gesamt</span><b style="color:var(--acc);font-size:16px">ca. ${Math.round(total)} €</b></div>
        <div class="between" style="margin-top:6px"><span class="wkmeta">Noch zu kaufen</span><b>ca. ${Math.round(openTotal)} €</b></div>
        <div class="wkmeta" style="margin-top:6px;line-height:1.45">🌱 inkl. Bio bei Fleisch, Fisch & Milchprodukten · nur grobe Schätzung</div>
      </div>
      <div class="bar" style="margin-top:12px"><div class="bar-fill" style="width:${Math.round(checkedCount / ids.length * 100)}%"></div></div>
      <div class="wkmeta" style="margin-top:6px">${checkedCount} / ${ids.length} erledigt</div>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn btn-ghost btn-sm" style="flex:1" data-action="share-shop">📤 Teilen / Kopieren</button>
        <button class="btn btn-primary btn-sm" style="flex:1" data-action="finish-shop">✓ Abgehakt</button>
      </div></div>`;

    for (const cat of CATS) {
      const catIds = ids.filter((id) => (ING[id] ? ING[id].cat : "sonstiges") === cat.key)
        .sort((a, b) => ING[a].n.localeCompare(ING[b].n, "de"));
      if (!catIds.length) continue;
      const catSum = catIds.reduce((s, id) => s + itemCost(id, totals[id]), 0);
      html += `<div class="sectitle">${cat.ico} ${cat.name}<span style="float:right;color:var(--muted);font-weight:700">ca. ${eur(catSum)}</span></div><div class="card">` +
        catIds.map((id) => {
          const on = !!S.shopChecked[id];
          return `<div class="mealrow" data-action="toggle-shop" data-ing="${id}">
            <div class="check ${on ? "on" : ""}">${on ? "✓" : ""}</div>
            <div class="grow"><div class="mealname" style="${on ? "text-decoration:line-through;opacity:.5" : ""}">${esc(ING[id].n)}</div></div>
            <div class="mealkcal" style="text-align:right;${on ? "opacity:.5" : ""}">${fmtAmount(id, totals[id])}<br><small style="color:var(--muted);font-weight:700">${eur(itemCost(id, totals[id]))}</small></div>
          </div>`;
        }).join("") + `</div>`;
    }
    html += `<div style="height:8px"></div>`;
    document.getElementById("tab-shop").innerHTML = html;
  }
  function shareText() {
    const totals = buildShopping(); const ids = Object.keys(totals);
    let txt = "🛒 APEX Einkaufsliste (7 Tage)\n\n";
    for (const cat of CATS) {
      const catIds = ids.filter((id) => (ING[id] ? ING[id].cat : "sonstiges") === cat.key).sort((a, b) => ING[a].n.localeCompare(ING[b].n, "de"));
      if (!catIds.length) continue;
      txt += cat.ico + " " + cat.name + "\n";
      for (const id of catIds) txt += "  • " + ING[id].n + " – " + fmtAmount(id, totals[id]) + " (" + eur(itemCost(id, totals[id])) + ")\n";
      txt += "\n";
    }
    txt += "💶 Geschätzt gesamt: ca. " + Math.round(shopTotal(totals)) + " € (inkl. Bio bei Fleisch, Fisch & Milch)";
    return txt.trim();
  }

  /* ---------- TRAINING ---------- */
  function renderTrain() {
    const L = diffLevel();
    let html = topbar("Training", false) +
      `<div class="card">
        <div class="mealname">${esc(TRAINING.meta.name || "")}</div>
        <div class="wkmeta">${esc(TRAINING.meta.goal || "")}</div>
      </div>
      <div class="card">
        <div class="between"><div class="mealname">🎚️ Schwierigkeit</div><div class="pill" style="color:var(--acc)">${L.ico} ${esc(L.n)}</div></div>
        <div class="wkmeta" style="margin-top:6px">Stufe ${(S.diff | 0) + 1}/${DIFF_LEVELS.length} · passt sich nach jedem Training an dein Feedback an. Höhere Stufe = mehr Wiederholungen & Sätze, kürzere Pausen.</div>
        <div class="diffscroll">${DIFF_LEVELS.map((x, i) => `<button class="diffchip ${i === (S.diff | 0) ? "on" : ""}" data-action="set-diff" data-i="${i}"><span class="di">${x.ico}</span><span>${esc(x.n)}</span></button>`).join("")}</div>
      </div>`;
    const recToday = S.days[todayStr()];
    for (let wd = 0; wd < TRAINING.days.length; wd++) {
      const day = TRAINING.days[wd]; const isToday = wd === todayWd();
      const isFb = DAYPLAN.footballDays.indexOf(wd) >= 0;
      html += `<div class="card">
        <div class="dayhead" style="margin:0 0 6px">
          <div class="d">${day.day} ${isToday ? '<span class="today-badge">HEUTE</span>' : ""}</div>
          ${isFb ? '<span class="pill" style="color:var(--info)">⚽ Fußball 18:30</span>' : ""}
        </div>`;
      for (const slot of ["am", "pm"]) {
        const s = scaledSession(wd, slot); if (!s) continue;
        const done = isToday && recToday && recToday.workout && recToday.workout[slot];
        const time = slot === "am" ? DAYPLAN.trainAM : DAYPLAN.trainPM;
        html += `<div class="wkday" data-action="start-workout" data-wd="${wd}" data-slot="${slot}" style="padding:9px 0;border-top:1px solid var(--line);cursor:pointer">
          <div class="row">
            <div class="wkicon" style="width:40px;height:40px;font-size:20px">${s.emoji}</div>
            <div class="grow">
              <div class="mealname" style="font-size:14px">${time} · ${esc(s.focus)}${done ? ' <span style="color:var(--good)">✓</span>' : ""}</div>
              <div class="wkmeta">${s.sub}${s.type === "rest" ? " · aktive Erholung" : " · " + s.blocks.length + " Übungen · ~" + s.minutes + " Min · ~" + s.kcal + " kcal"}</div>
            </div>
            <div style="font-size:20px;color:var(--muted2)">›</div>
          </div>
        </div>`;
      }
      html += `</div>`;
    }
    html += `<div class="sectitle">So wirst du stärker</div><div class="card"><ul style="margin:0;padding-left:18px;line-height:1.6;color:var(--muted);font-size:14px">` +
      (TRAINING.meta.progression || []).map((p) => `<li>${esc(p)}</li>`).join("") + `</ul></div><div style="height:8px"></div>`;
    document.getElementById("tab-train").innerHTML = html;
    const onChip = document.querySelector("#tab-train .diffchip.on"); if (onChip) onChip.scrollIntoView({ inline: "center", block: "nearest" });
  }

  /* ---------- ERFOLGE ---------- */
  function renderAwards() {
    const li = levelInfo(S.stats.xp); const st = S.stats;
    let html = topbar("Erfolge", false) +
      `<div class="card">
        <div class="lvlbig">
          <div class="lvlbadge">${li.level}</div>
          <div class="grow">
            <div class="mealname" style="font-size:19px">Level ${li.level} · ${esc(li.title)}</div>
            <div class="wkmeta">${st.xp} XP gesamt</div>
            <div class="bar" style="margin-top:8px"><div class="bar-fill" style="width:${Math.round(li.prog * 100)}%"></div></div>
            <div class="wkmeta" style="margin-top:5px">${Math.max(0, Math.round(li.ceilXp - st.xp))} XP bis Level ${li.level + 1}</div>
          </div>
        </div>
      </div>
      <div class="statgrid">
        <div class="statbox"><div class="v">${st.workoutsTotal || 0}</div><div class="k">Trainings</div></div>
        <div class="statbox"><div class="v">${st.bestStreak || 0}</div><div class="k">Bester Streak</div></div>
        <div class="statbox"><div class="v">${(st.burnedTotal || 0).toLocaleString("de")}</div><div class="k">kcal verbrannt</div></div>
        <div class="statbox"><div class="v">${st.deficitDays || 0}</div><div class="k">Defizit-Tage</div></div>
        <div class="statbox"><div class="v">${st.proteinDays || 0}</div><div class="k">Protein-Tage</div></div>
        <div class="statbox"><div class="v">${st.perfectDays || 0}</div><div class="k">Perfekte Tage</div></div>
        <div class="statbox"><div class="v">${st.coldShowers || 0}</div><div class="k">❄️ Kaltduschen</div></div>
      </div>
      <div class="sectitle">Errungenschaften</div>
      <div class="ach-grid">`;
    for (const a of ACHIEVEMENTS) {
      const val = S.stats[a.stat] || 0; const done = val >= a.target;
      const prog = Math.min(1, val / a.target);
      html += `<div class="ach ${done ? "done" : ""}">
        <div class="ai">${a.icon}</div>
        <div class="at">${esc(a.title)}</div>
        <div class="ad">${esc(a.desc)}</div>
        <div class="abar"><i style="width:${Math.round(prog * 100)}%"></i></div>
        <div class="wkmeta" style="margin-top:5px">${done ? "Freigeschaltet ✓" : Math.min(val, a.target) + " / " + a.target}</div>
      </div>`;
    }
    html += `</div><div style="height:8px"></div>`;
    document.getElementById("tab-awards").innerHTML = html;
  }

  /* ============================================================
     SHEETS
     ============================================================ */
  function openSheet(inner, opts) {
    opts = opts || {};
    const root = document.getElementById("sheet-root");
    const bd = document.createElement("div");
    bd.className = "sheet-backdrop";
    bd.innerHTML = `<div class="sheet ${opts.full ? "full" : ""}">${inner}</div>`;
    root.appendChild(bd);
    requestAnimationFrame(() => bd.classList.add("show"));
    bd.addEventListener("click", (e) => { if (e.target === bd) closeSheet(bd); });
    return bd;
  }
  function closeSheet(bd) { bd.classList.remove("show"); setTimeout(() => bd.remove(), 300); }

  // Rezept / Kochanleitung ansehen (von "Heute")
  function openRecipe(wd, slot, source) {
    const m = resolveMeal(source); if (!m) { openPicker(wd, slot); return; }
    const rec = RECIPES[m.n];
    const k = mealKcal(m), p = mealMacro(m, "p"), custom = isCustom(source) && !m._direct;
    const direct = !!m._direct;
    const favKey = mealFavKey(m); const fav = isFav(favKey);
    const eaten = !!dayRec().checked[slot];
    const ingRows = m.i.map((it) => {
      const ing = ING[it[0]]; if (!ing) return "";
      const amt = ing.pieceG ? (Math.max(1, Math.round(it[1] / ing.pieceG)) + "×") : (it[1] + (ing.unit === "ml" ? " ml" : " g"));
      return `<div class="ing-list-row"><span>${esc(ing.n)}</span><b>${amt}</b></div>`;
    }).join("");
    const steps = rec && rec.s && rec.s.length
      ? rec.s.map((st, i) => `<div class="recipe-step"><div class="num">${i + 1}</div><div class="tx">${esc(st)}</div></div>`).join("")
      : `<div class="empty-note">Für dieses Gericht ist noch keine Schritt-Anleitung hinterlegt.<br>Zutaten frisch zubereiten und nach Geschmack anrichten.</div>`;
    const bodyMid = direct
      ? ((m.steps && m.steps.length)
          ? `<div class="recipe-note" style="margin-top:2px">🍽️ Dein eigenes Gericht (${k} kcal · ${p} g Eiweiß).</div>
             <div class="sectitle">👨‍🍳 Zubereitung</div>
             <div class="card">${m.steps.map((st, i) => `<div class="recipe-step"><div class="num">${i + 1}</div><div class="tx">${esc(st)}</div></div>`).join("")}</div>
             ${m.tip ? `<div class="recipe-tip"><b>💡 Tipp:</b> ${esc(m.tip)}</div>` : ""}`
          : `<div class="recipe-note" style="margin-top:2px">🍽️ Dein eigenes Gericht – manuell eingetragen mit <b>${k} kcal</b> und <b>${p} g Eiweiß</b>.</div>`)
      : `<div class="sectitle" style="margin-top:2px">🧺 Zutaten</div>
         <div class="card">${ingRows}</div>
         <div class="sectitle">👨‍🍳 Zubereitung</div>
         <div class="card">${steps}</div>
         ${rec && rec.tip ? `<div class="recipe-tip"><b>💡 Tipp:</b> ${esc(rec.tip)}</div>` : ""}`;
    const bd = openSheet(`<div class="grip"></div>
      <div class="sheet-head"><h2 style="font-size:17px">${esc(m.n)}</h2>
        <div class="row" style="gap:6px">${favKey ? `<button class="iconbtn" data-favbtn style="color:${fav ? "var(--warn)" : "var(--muted2)"}">${fav ? "★" : "☆"}</button>` : ""}<button class="closex" data-close>✕</button></div></div>
      <div class="sheet-body">
        <div class="recipe-meta"><span class="pill">⏱️ ${esc(rec && rec.t ? rec.t : (m.time || "—"))}</span><span class="pill">🔥 ${k} kcal</span><span class="pill">🥩 ${p} g Eiweiß</span><span class="pill">1 Portion</span></div>
        ${custom ? '<div class="recipe-note">ℹ️ Du hast dieses Grundrezept angepasst – die Schritte beziehen sich aufs Originalgericht, die Mengen unten auf deine Version.</div>' : ""}
        ${bodyMid}
        <div style="height:14px"></div>
        <button class="btn ${eaten ? "btn-ghost" : "btn-primary"}" data-eaten>${eaten ? "↩︎ Als „nicht gegessen“ markieren" : "✓ Als gegessen markieren"}</button>
        <div class="btn-row" style="margin-top:8px">
          ${direct ? "" : `<button class="btn btn-ghost" style="flex:1" data-adjust>✏️ Zutaten anpassen</button>`}
          <button class="btn btn-ghost" style="flex:1" data-change>🔄 Anderes Gericht</button>
        </div>
        <div style="height:16px"></div>
      </div>`, { full: true });
    bd.addEventListener("click", (e) => {
      const fb = e.target.closest("[data-favbtn]");
      if (fb) { toggleFav(favKey); const on = isFav(favKey); fb.textContent = on ? "★" : "☆"; fb.style.color = on ? "var(--warn)" : "var(--muted2)"; toast(on ? "Zu Favoriten hinzugefügt ⭐" : "Aus Favoriten entfernt", on ? "⭐" : "☆"); return; }
      if (e.target.closest("[data-eaten]")) { toggleMeal(slot); closeSheet(bd); return; }
      if (e.target.closest("[data-adjust]")) { closeSheet(bd); openCustomize(wd, slot, source); return; }
      if (e.target.closest("[data-change]")) { closeSheet(bd); openPicker(wd, slot); return; }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
  }

  function defaultAmt(id) {
    const ing = ING[id]; if (!ing) return 50;
    if (ing.pieceG) return ing.pieceG;
    if (ing.cat === "fett" && ing.unit === "ml") return 10;
    if (ing.cat === "sonstiges") return 15;
    return 50;
  }
  function stepFor(id, g) {
    const ing = ING[id];
    if (ing && ing.pieceG) return ing.pieceG;
    if (ing && ing.unit === "ml" && ing.cat === "fett") return 5;
    return g < 20 ? 5 : 10;
  }
  function amtLabel(id, g) {
    const ing = ING[id]; if (!ing) return g + " g";
    if (ing.pieceG) { const n = g / ing.pieceG; return g + " g (" + (Math.round(n * 10) / 10) + "×)"; }
    return g + (ing.unit === "ml" ? " ml" : " g");
  }
  // Grundgericht antippen -> Zutaten anpassen (weglassen, Menge ändern, ergänzen)
  function openCustomize(wd, slot, source) {
    const base = resolveMeal(source);
    if (!base) { openPicker(wd, slot); return; }
    const originalKey = typeof source === "string" ? source : (source.base || null);
    let items = base.i.map((e) => [e[0], e[1]]);
    const name = base.n, tags = base.t || [];
    let addOpen = false;
    const slotLabel = (SLOTS.find((s) => s.key === slot) || {}).label || "";

    const bd = openSheet(`<div class="grip"></div>
      <div class="sheet-head"><h2 style="font-size:17px">${esc(name)}</h2><button class="closex" data-close>✕</button></div>
      <div class="sheet-body" data-cbody></div>`, { full: true });
    const body = bd.querySelector("[data-cbody]");

    function renderSuggest(q) {
      q = (q || "").toLowerCase().trim();
      const el = body.querySelector("[data-suggest]"); if (!el) return;
      const ids = Object.keys(ING).filter((id) => !q || ING[id].n.toLowerCase().includes(q)).slice(0, 30);
      el.innerHTML = ids.length ? ids.map((id) => `<div class="pickrow" data-addpick="${id}">
        <div class="grow"><div class="pn">${esc(ING[id].n)}</div><div class="pm">${ING[id].kcal} kcal/100 g · ${ING[id].p} g Eiweiß</div></div>
        <div class="mealkcal" style="color:var(--acc);font-size:20px">＋</div></div>`).join("") : `<div class="empty-note">Nichts gefunden.</div>`;
    }
    function rerender() {
      const [k, p] = itemsKcalProt(items);
      body.innerHTML =
        `<div class="wkmeta" style="margin:-4px 0 10px">${slotLabel} · Menge ändern, weglassen (✕) oder ergänzen.</div>
         <div class="card tight cust-sum">
           <div><div class="v">${k}</div><div class="k">kcal</div></div>
           <div><div class="v">${p}</div><div class="k">g Eiweiß</div></div>
         </div>
         <div class="card">
           ${items.map((it, i) => {
             const ing = ING[it[0]]; if (!ing) return "";
             const kc = Math.round(ing.kcal * it[1] / 100);
             return `<div class="ing-edit">
               <div class="grow"><div class="mealname" style="font-size:14.5px">${esc(ing.n)}</div>
                 <div class="wkmeta">${amtLabel(it[0], it[1])} · ${kc} kcal</div></div>
               <div class="stepper"><button data-dec="${i}">−</button><button data-inc="${i}">+</button><button class="del" data-del="${i}">✕</button></div>
             </div>`;
           }).join("")}
           <button class="btn btn-ghost" style="margin-top:12px" data-addtoggle>${addOpen ? "▲ Schließen" : "➕ Zutat hinzufügen"}</button>
           ${addOpen ? `<input class="search" style="margin-top:10px" placeholder="Zutat suchen … (z. B. Apfel)" data-addsearch><div data-suggest></div>` : ""}
         </div>
         <button class="btn btn-ghost" data-changemeal>🔄 Anderes Gericht wählen</button>
         <button class="btn btn-primary" style="margin-top:8px" data-apply>✓ In den Plan übernehmen</button>
         <div style="height:14px"></div>`;
      if (addOpen) { const inp = body.querySelector("[data-addsearch]"); renderSuggest(""); inp.addEventListener("input", (e) => renderSuggest(e.target.value)); setTimeout(() => inp.focus(), 40); }
    }
    function apply() {
      const cleaned = items.filter((it) => ING[it[0]] && it[1] > 0);
      if (!cleaned.length) { toast("Mindestens eine Zutat nötig", "⚠️"); return; }
      const orig = originalKey ? mealByKey(originalKey) : null;
      const value = (originalKey && orig && sameItems(cleaned, orig.i)) ? originalKey : { base: originalKey, n: name, i: cleaned, t: tags };
      setPlan(wd, slot, value); vibrate(15); closeSheet(bd); toast("Gericht übernommen", "✓");
    }
    body.addEventListener("click", (e) => {
      const inc = e.target.closest("[data-inc]"); if (inc) { const i = +inc.dataset.inc; items[i][1] += stepFor(items[i][0], items[i][1]); rerender(); return; }
      const dec = e.target.closest("[data-dec]"); if (dec) { const i = +dec.dataset.dec; const st = stepFor(items[i][0], items[i][1]); items[i][1] = Math.max(st, items[i][1] - st); rerender(); return; }
      const del = e.target.closest("[data-del]"); if (del) { items.splice(+del.dataset.del, 1); rerender(); return; }
      if (e.target.closest("[data-addtoggle]")) { addOpen = !addOpen; rerender(); return; }
      const ap = e.target.closest("[data-addpick]"); if (ap) { const id = ap.dataset.addpick; const ex = items.find((it) => it[0] === id); if (ex) ex[1] += defaultAmt(id); else items.push([id, defaultAmt(id)]); addOpen = false; rerender(); toast(ING[id].n + " hinzugefügt", "➕"); return; }
      if (e.target.closest("[data-changemeal]")) { closeSheet(bd); openPicker(wd, slot); return; }
      if (e.target.closest("[data-apply]")) { apply(); return; }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
    rerender();
  }

  function openPicker(wd, slotKey) {
    const slot = SLOTS.find((s) => s.key === slotKey); const set = MEALSETS[slotKey];
    const bd = openSheet(
      `<div class="grip"></div>
       <div class="sheet-head"><h2>${slot.ico} ${slot.label}</h2><button class="closex" data-close>✕</button></div>
       <div class="sheet-body">
         <input class="search" placeholder="Suchen … (${set.length} Gerichte)" data-search>
         <div class="btn-row" style="margin-bottom:10px">
           <button class="btn btn-primary btn-sm" style="flex:1" data-newdish>➕ Eigenes Gericht</button>
           <button class="btn btn-ghost btn-sm" style="flex:0 0 auto" data-random>🎲</button>
           <button class="btn btn-ghost btn-sm" style="flex:0 0 auto" data-clear>✕</button>
         </div>
         <div data-list></div>
       </div>`, { full: true });
    const listEl = bd.querySelector("[data-list]");
    const star = (favKey) => `<div class="favstar" data-fav="${esc(favKey)}" style="font-size:22px;padding:4px 8px;cursor:pointer;color:${isFav(favKey) ? "var(--warn)" : "var(--muted2)"}">${isFav(favKey) ? "★" : "☆"}</div>`;
    const rowStd = (i) => {
      const m = mealByKey(slotKey + ":" + i), fk = slotKey + ":" + i;
      return `<div class="pickrow">
        <div class="grow" data-pick="${i}"><div class="pn">${esc(set[i].n)}</div>
        <div class="pm">${mealKcal(m)} kcal · ${mealMacro(m, "p")} g Eiweiß${mealTime(m) ? " · ⏱️ " + mealTime(m) : ""}</div>${tagsHtml(set[i].t)}</div>
        ${star(fk)}</div>`;
    };
    const rowCustom = (d) => {
      const m = resolveMeal({ cd: d.id });
      return `<div class="pickrow">
        <div class="grow" data-pickcd="${d.id}"><div class="pn">${esc(d.n)} <span style="color:var(--muted2);font-size:11px">· eigenes</span></div>
        <div class="pm">${mealKcal(m)} kcal · ${mealMacro(m, "p")} g Eiweiß</div></div>
        ${star("cd:" + d.id)}
        <div data-delcd="${d.id}" style="font-size:16px;padding:4px 8px;cursor:pointer;color:var(--bad)">🗑️</div></div>`;
    };
    function favRows() {
      const keys = Object.keys(S.favorites || {}).filter((kk) => kk.indexOf(slotKey + ":") === 0 || kk.indexOf("cd:") === 0);
      return keys.map((kk) => {
        if (kk.indexOf("cd:") === 0) { const d = (S.customDishes || []).find((x) => "cd:" + x.id === kk); return d ? rowCustom(d) : ""; }
        const idx = +kk.slice(slotKey.length + 1); return set[idx] ? rowStd(idx) : "";
      }).filter(Boolean);
    }
    function renderList(q) {
      q = (q || "").toLowerCase().trim();
      let html = "";
      if (!q) {
        const favs = favRows();
        if (favs.length) html += `<div class="sectitle" style="margin-top:2px">⭐ Favoriten</div>` + favs.join("");
        const customs = (S.customDishes || []);
        if (customs.length) html += `<div class="sectitle">🍽️ Eigene Gerichte</div>` + customs.map(rowCustom).join("");
        html += `<div class="sectitle">${slot.ico} Alle ${slot.label}-Gerichte</div>`;
      }
      const idxs = [];
      for (let i = 0; i < set.length; i++) if (!q || set[i].n.toLowerCase().includes(q)) idxs.push(i);
      html += idxs.length ? idxs.slice(0, 250).map(rowStd).join("") : `<div class="empty-note">Nichts gefunden.</div>`;
      listEl.innerHTML = html;
    }
    renderList("");
    const searchEl = bd.querySelector("[data-search]");
    searchEl.addEventListener("input", (e) => renderList(e.target.value));
    bd.addEventListener("click", (e) => {
      const fav = e.target.closest("[data-fav]");
      if (fav) { toggleFav(fav.dataset.fav); renderList(searchEl.value); return; }
      const del = e.target.closest("[data-delcd]");
      if (del) { confirmSheet({ title: "Eigenes Gericht löschen?", msg: "Es wird aus deinen eigenen Gerichten und allen Plänen entfernt.", ok: "Löschen", onOk: () => { delCustomDish(del.dataset.delcd); renderList(searchEl.value); renderActive(); } }); return; }
      const pc = e.target.closest("[data-pickcd]");
      if (pc) { setPlan(wd, slotKey, { cd: pc.dataset.pickcd }); vibrate(15); closeSheet(bd); return; }
      const pk = e.target.closest("[data-pick]");
      if (pk) { closeSheet(bd); openCustomize(wd, slotKey, slotKey + ":" + pk.dataset.pick); return; }
      if (e.target.closest("[data-newdish]")) { closeSheet(bd); openCustomDish(wd, slotKey); return; }
      if (e.target.closest("[data-random]")) { setPlan(wd, slotKey, slotKey + ":" + Math.floor(Math.random() * set.length)); vibrate(15); closeSheet(bd); return; }
      if (e.target.closest("[data-clear]")) { setPlan(wd, slotKey, null); closeSheet(bd); return; }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
  }

  function openCustomDish(wd, slot) {
    const slotObj = SLOTS.find((s) => s.key === slot) || {};
    const stepLine = (val) => `<div class="steplinerow" style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
        <input class="search" style="margin:0;flex:1" data-step placeholder="Schritt beschreiben …" value="${esc(val || "")}">
        <button data-rmstep style="width:40px;height:44px;border-radius:11px;background:var(--card);border:1px solid var(--line2);color:var(--bad);flex:0 0 auto;font-size:15px">✕</button>
      </div>`;
    const bd = openSheet(
      `<div class="grip"></div>
       <div class="sheet-head"><h2>➕ Eigenes Gericht</h2><button class="closex" data-close>✕</button></div>
       <div class="sheet-body">
         <p class="muted" style="margin:0 0 12px;line-height:1.5">Eigenes Gericht mit Kalorien, Eiweiß und optional eigener Schritt-für-Schritt-Anleitung anlegen. Wird gespeichert und ist in jedem Gericht-Menü auswählbar${slotObj.label ? " (jetzt für " + esc(slotObj.label) + ")" : ""}.</p>
         <div class="field"><label>Name des Gerichts</label><input data-n placeholder="z. B. Mamas Lasagne"></div>
         <div class="row" style="gap:12px">
           <div class="field" style="flex:1"><label>Kalorien (kcal)</label><input data-k type="number" inputmode="numeric" placeholder="0"></div>
           <div class="field" style="flex:1"><label>Eiweiß (g)</label><input data-p type="number" inputmode="numeric" placeholder="0"></div>
         </div>
         <div class="row" style="gap:12px">
           <div class="field" style="flex:1"><label>KH (g) – optional</label><input data-c type="number" inputmode="numeric" placeholder="0"></div>
           <div class="field" style="flex:1"><label>Fett (g) – optional</label><input data-f type="number" inputmode="numeric" placeholder="0"></div>
         </div>
         <div class="field"><label>Zubereitungszeit – optional</label><input data-time placeholder="z. B. 25 Min"></div>
         <div class="field"><label>Zubereitung – Schritte (optional)</label>
           <div data-steps>${stepLine("") + stepLine("") + stepLine("")}</div>
           <button class="btn btn-ghost btn-sm" data-addstep>➕ Schritt hinzufügen</button>
         </div>
         <div class="field"><label>Tipp – optional</label><input data-tip placeholder="z. B. Mit frischem Parmesan bestreuen"></div>
         <button class="btn btn-primary" data-save>Gericht erstellen${wd != null ? " & einplanen" : ""}</button>
         <div style="height:10px"></div>
       </div>`, { full: true });
    bd.addEventListener("click", (e) => {
      if (e.target.closest("[data-addstep]")) { bd.querySelector("[data-steps]").insertAdjacentHTML("beforeend", stepLine("")); return; }
      const rm = e.target.closest("[data-rmstep]");
      if (rm) { const rows = bd.querySelectorAll(".steplinerow"); if (rows.length > 1) rm.closest(".steplinerow").remove(); else rm.closest(".steplinerow").querySelector("[data-step]").value = ""; return; }
      if (e.target.closest("[data-save]")) {
        const n = bd.querySelector("[data-n]").value.trim();
        const k = parseInt(bd.querySelector("[data-k]").value || 0, 10);
        if (!n) { toast("Bitte einen Namen eingeben", "⚠️"); return; }
        if (!k) { toast("Bitte Kalorien eingeben", "⚠️"); return; }
        const steps = [].slice.call(bd.querySelectorAll("[data-step]")).map((i) => i.value.trim()).filter(Boolean);
        const id = addCustomDish({ n, kcal: k, p: parseInt(bd.querySelector("[data-p]").value || 0, 10), c: parseInt(bd.querySelector("[data-c]").value || 0, 10), f: parseInt(bd.querySelector("[data-f]").value || 0, 10), time: bd.querySelector("[data-time]").value.trim(), steps: steps, tip: bd.querySelector("[data-tip]").value.trim() });
        if (wd != null && slot) setPlan(wd, slot, { cd: id });
        vibrate(15); toast("Eigenes Gericht gespeichert 🍽️", "🍽️"); closeSheet(bd); renderActive();
        return;
      }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
  }

  function openBurned() {
    const cur = dayRec().burned || 0;
    const bd = openSheet(
      `<div class="grip"></div>
       <div class="sheet-head"><h2>🔥 Verbrannt heute</h2><button class="closex" data-close>✕</button></div>
       <div class="sheet-body">
         <p class="muted" style="margin:0 0 4px">Trag die aktiv verbrannten Kalorien deiner Apple Watch ein (Wert überschreiben).</p>
         <div class="numdisp" data-disp>${cur} <small>kcal</small></div>
         <input class="search" inputmode="numeric" type="number" value="${cur}" data-num style="text-align:center;font-size:20px">
         <div class="btn-row" style="margin:10px 0 4px">
           <button class="btn btn-ghost btn-sm" style="flex:1" data-plus="50">+50</button>
           <button class="btn btn-ghost btn-sm" style="flex:1" data-plus="100">+100</button>
           <button class="btn btn-ghost btn-sm" style="flex:1" data-plus="200">+200</button>
           <button class="btn btn-ghost btn-sm" style="flex:1" data-plus="-100">−100</button>
         </div>
         <button class="btn btn-primary" style="margin-top:12px" data-save>Speichern</button>
       </div>`);
    const num = bd.querySelector("[data-num]"); const disp = bd.querySelector("[data-disp]");
    const sync = () => { disp.innerHTML = (parseInt(num.value || 0, 10)) + ' <small>kcal</small>'; };
    num.addEventListener("input", sync);
    bd.addEventListener("click", (e) => {
      const pl = e.target.closest("[data-plus]");
      if (pl) { num.value = Math.max(0, (parseInt(num.value || 0, 10)) + parseInt(pl.dataset.plus, 10)); sync(); return; }
      if (e.target.closest("[data-save]")) { setBurned(parseInt(num.value || 0, 10)); closeSheet(bd); return; }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
  }

  function openManual() {
    const bd = openSheet(
      `<div class="grip"></div>
       <div class="sheet-head"><h2>➕ Essen eintragen</h2><button class="closex" data-close>✕</button></div>
       <div class="sheet-body">
         <div class="field"><label>Was hast du gegessen?</label><input data-n placeholder="z. B. Cappuccino, Snack …"></div>
         <div class="field"><label>Kalorien (kcal)</label><input data-k type="number" inputmode="numeric" placeholder="0"></div>
         <div class="field"><label>Eiweiß (g) – optional</label><input data-p type="number" inputmode="numeric" placeholder="0"></div>
         <button class="btn btn-primary" data-save>Hinzufügen</button>
       </div>`);
    bd.addEventListener("click", (e) => {
      if (e.target.closest("[data-save]")) {
        const n = bd.querySelector("[data-n]").value.trim() || "Snack";
        const k = parseInt(bd.querySelector("[data-k]").value || 0, 10);
        const p = parseInt(bd.querySelector("[data-p]").value || 0, 10);
        addManual(n, k, p); closeSheet(bd); return;
      }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
  }

  function openAppointment(existing) {
    const editing = !!existing;
    const ap = existing || { id: "ap" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), title: "", sub: "", ico: "📌", time: "12:00", mode: "once", date: todayStr(), days: [todayWd()] };
    const EMOJIS = ["📌", "📅", "🏫", "⚽", "🎸", "🎮", "👨‍⚕️", "🦷", "🎂", "🛒", "💼", "🚌", "📚", "🎉", "🏋️", "✈️"];
    const bd = openSheet(
      `<div class="grip"></div>
       <div class="sheet-head"><h2>📌 ${editing ? "Termin bearbeiten" : "Neuer Termin"}</h2><button class="closex" data-close>✕</button></div>
       <div class="sheet-body">
         <div class="field"><label>Titel</label><input data-title placeholder="z. B. Zahnarzt, Gitarrenstunde …" value="${esc(ap.title)}"></div>
         <div class="field"><label>Uhrzeit</label><input data-time type="time" value="${esc(ap.time)}"></div>
         <div class="field"><label>Symbol</label><div class="emojipick" data-emojis>${EMOJIS.map((e) => `<button type="button" data-emoji="${e}" class="${e === ap.ico ? "on" : ""}">${e}</button>`).join("")}</div></div>
         <div class="field"><label>Notiz (optional)</label><input data-sub placeholder="Detail oder Ort …" value="${esc(ap.sub)}"></div>
         <div class="field"><label>Wiederholung</label>
           <div class="seg" data-mode>
             <button type="button" data-m="once" class="${ap.mode === "once" ? "on" : ""}">Einmalig</button>
             <button type="button" data-m="weekly" class="${ap.mode === "weekly" ? "on" : ""}">Wöchentlich</button>
           </div>
         </div>
         <div class="field" data-once-wrap style="${ap.mode === "weekly" ? "display:none" : ""}"><label>Datum</label><input data-date type="date" value="${esc(ap.date || todayStr())}"></div>
         <div class="field" data-weekly-wrap style="${ap.mode === "once" ? "display:none" : ""}"><label>Wochentage</label>
           <div class="wdrow" data-days>${WEEKDAYS.map((w, i) => `<button type="button" data-day="${i}" class="${(ap.days || []).indexOf(i) >= 0 ? "on" : ""}">${w.slice(0, 2)}</button>`).join("")}</div>
         </div>
         <button class="btn btn-primary" data-save>${editing ? "Speichern" : "Termin hinzufügen"}</button>
         ${editing ? `<button class="btn btn-ghost" style="margin-top:8px;color:var(--bad)" data-del>Termin löschen</button>` : ""}
         <div style="height:10px"></div>
       </div>`, { full: true });
    let ico = ap.ico, mode = ap.mode, days = (ap.days || []).slice();
    bd.addEventListener("click", (e) => {
      const em = e.target.closest("[data-emoji]");
      if (em) { ico = em.dataset.emoji; bd.querySelectorAll("[data-emoji]").forEach((b) => b.classList.toggle("on", b === em)); return; }
      const md = e.target.closest("[data-m]");
      if (md) { mode = md.dataset.m; bd.querySelectorAll("[data-m]").forEach((b) => b.classList.toggle("on", b === md)); bd.querySelector("[data-once-wrap]").style.display = mode === "weekly" ? "none" : ""; bd.querySelector("[data-weekly-wrap]").style.display = mode === "once" ? "none" : ""; return; }
      const dy = e.target.closest("[data-day]");
      if (dy) { const i = +dy.dataset.day; const at = days.indexOf(i); if (at >= 0) days.splice(at, 1); else days.push(i); dy.classList.toggle("on"); return; }
      if (e.target.closest("[data-del]")) { delAppointment(ap.id); closeSheet(bd); vibrate(15); toast("Termin gelöscht", "🗑️"); return; }
      if (e.target.closest("[data-save]")) {
        const title = bd.querySelector("[data-title]").value.trim();
        if (!title) { toast("Bitte einen Titel eingeben", "⚠️"); return; }
        const time = bd.querySelector("[data-time]").value || "12:00";
        const sub = bd.querySelector("[data-sub]").value.trim();
        const date = bd.querySelector("[data-date]").value || todayStr();
        if (mode === "weekly" && !days.length) { toast("Mindestens einen Wochentag wählen", "⚠️"); return; }
        saveAppointment({ id: ap.id, title, sub, ico, time, mode, date, days: days.slice().sort((a, b) => a - b) });
        closeSheet(bd); vibrate(15); toast(editing ? "Termin gespeichert" : "Termin hinzugefügt", "📌");
        return;
      }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
  }

  function openSettings() {
    const p = S.profile;
    const bd = openSheet(
      `<div class="grip"></div>
       <div class="sheet-head"><h2>⚙️ Dein Profil</h2><button class="closex" data-close>✕</button></div>
       <div class="sheet-body">
         <div class="row" style="gap:12px">
           <div class="field" style="flex:1"><label>Gewicht (kg)</label><input data-w type="number" inputmode="decimal" value="${p.weight}"></div>
           <div class="field" style="flex:1"><label>Größe (cm)</label><input data-h type="number" inputmode="numeric" value="${p.height}"></div>
         </div>
         <div class="row" style="gap:12px">
           <div class="field" style="flex:1"><label>Alter</label><input data-a type="number" inputmode="numeric" value="${p.age}"></div>
           <div class="field" style="flex:1"><label>Geschlecht</label>
             <div class="seg"><button data-sex="m" class="${p.sex === "m" ? "on" : ""}">♂︎</button><button data-sex="w" class="${p.sex === "w" ? "on" : ""}">♀︎</button></div>
           </div>
         </div>
         <div class="field"><label>Aktivität (außerhalb Sport)</label>
           <select data-act>${Object.keys(ACTIVITY).map((k) => `<option value="${k}" ${p.activity === k ? "selected" : ""}>${ACTIVITY[k].label}</option>`).join("")}</select>
         </div>
         <div class="field"><label>Defizit-Stärke</label>
           <div class="seg">
             <button data-def="300" class="${p.deficit === 300 ? "on" : ""}">Sanft<br><small>−300</small></button>
             <button data-def="500" class="${p.deficit === 500 ? "on" : ""}">Standard<br><small>−500</small></button>
             <button data-def="700" class="${p.deficit === 700 ? "on" : ""}">Aggressiv<br><small>−700</small></button>
           </div>
         </div>
         <div class="card tight" style="margin:6px 0 14px;background:var(--card2)">
           <div class="between"><span class="muted">Kalorien-Budget/Tag</span><b data-prev-b>${S.budget} kcal</b></div>
           <div class="between" style="margin-top:6px"><span class="muted">Eiweiß-Ziel/Tag</span><b data-prev-p>${S.protein} g</b></div>
         </div>
         <button class="btn btn-primary" data-save>Speichern</button>
         <button class="btn btn-ghost" style="margin-top:8px;color:var(--bad)" data-reset>Alle Daten zurücksetzen</button>
       </div>`);
    let sex = p.sex, def = p.deficit;
    const preview = () => {
      const tmp = { profile: { weight: +bd.querySelector("[data-w]").value || 0, height: +bd.querySelector("[data-h]").value || 0, age: +bd.querySelector("[data-a]").value || 0, sex, activity: bd.querySelector("[data-act]").value, deficit: def } };
      recalcTargets(tmp);
      bd.querySelector("[data-prev-b]").textContent = tmp.budget + " kcal";
      bd.querySelector("[data-prev-p]").textContent = tmp.protein + " g";
    };
    bd.addEventListener("input", preview);
    bd.addEventListener("click", (e) => {
      const sx = e.target.closest("[data-sex]"); if (sx) { sex = sx.dataset.sex; bd.querySelectorAll("[data-sex]").forEach((b) => b.classList.toggle("on", b === sx)); preview(); return; }
      const df = e.target.closest("[data-def]"); if (df) { def = +df.dataset.def; bd.querySelectorAll("[data-def]").forEach((b) => b.classList.toggle("on", b === df)); preview(); return; }
      if (e.target.closest("[data-save]")) {
        S.profile = { weight: +bd.querySelector("[data-w]").value || 72, height: +bd.querySelector("[data-h]").value || 185, age: +bd.querySelector("[data-a]").value || 22, sex, activity: bd.querySelector("[data-act]").value, deficit: def };
        recalcTargets(S); save(); refresh(); renderActive(); toast("Profil gespeichert", "✓"); closeSheet(bd); return;
      }
      if (e.target.closest("[data-reset]")) { confirmSheet({ title: "Wirklich zurücksetzen?", msg: "Alle Pläne, Erfolge und dein Fortschritt werden gelöscht.", ok: "Ja, alles löschen", onOk: () => { localStorage.removeItem(LS); S = defaultState(); save(); closeSheet(bd); renderActive(); } }); return; }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
  }

  function confirmSheet(o) {
    const bd = openSheet(
      `<div class="grip"></div>
       <div class="sheet-body" style="padding-bottom:22px">
         <h2 style="margin-bottom:8px">${esc(o.title)}</h2>
         <p class="muted" style="margin:0 0 18px;line-height:1.5">${esc(o.msg)}</p>
         <button class="btn btn-primary" data-ok>${esc(o.ok || "OK")}</button>
         <button class="btn btn-ghost" style="margin-top:8px" data-cancel>${esc(o.cancel || "Abbrechen")}</button>
       </div>`);
    bd.addEventListener("click", (e) => {
      if (e.target.closest("[data-ok]")) { closeSheet(bd); o.onOk && o.onOk(); }
      else if (e.target.closest("[data-cancel]")) closeSheet(bd);
    });
  }
  function askAddBurned(kcal) {
    confirmSheet({
      title: "Training eintragen?", msg: "Möchtest du ca. " + kcal + " kcal aus diesem Training zu deinen verbrannten Kalorien addieren? (Wenn deine Apple Watch das schon zählt, überspringe das.)",
      ok: "Ja, +" + kcal + " kcal", cancel: "Überspringen",
      onOk: () => { const r = dayRec(); r.burned = (r.burned || 0) + kcal; refresh(); renderActive(); }
    });
  }

  /* ---------- WORKOUT-PLAYER ---------- */
  function openWorkout(wd, slot) {
    slot = slot || "am";
    const d = scaledSession(wd, slot); if (!d) return;
    const timeLbl = slot === "am" ? "🌅 " + DAYPLAN.trainAM : "🏋️ " + DAYPLAN.trainPM;
    const done = new Array((d.blocks || []).length).fill(0);
    const warm = (d.warmup && d.warmup.length) ? `<div class="card tight"><div class="slotlabel">🔥 Aufwärmen</div><ul style="margin:8px 0 0;padding-left:18px;line-height:1.6;font-size:14px">${d.warmup.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div>` : "";
    const blocksHtml = (d.blocks || []).map((b, i) => `
      <div class="exercise">
        <div class="en">${esc(b.name)}</div>
        <div class="es">${b.sets} × ${esc(String(b.reps))}${b.rest ? " · Pause " + b.rest + "s" : ""}</div>
        <div class="et">${esc(b.tip || "")}</div>
        <div class="setdots" data-block="${i}">${Array.from({ length: b.sets }).map((_, j) => `<div class="setdot" data-set="${j}">${j + 1}</div>`).join("")}</div>
      </div>`).join("");
    const fin = d.finisher ? `<div class="card" style="border-color:rgba(255,176,32,.4)"><div class="slotlabel" style="color:var(--warn)">⭐ Finisher</div><div class="mealname" style="margin-top:4px">${esc(d.finisher.name)}</div><div class="et">${esc(d.finisher.detail)}</div></div>` : "";

    const bd = openSheet(
      `<div class="grip"></div>
       <div class="sheet-head"><h2>${d.emoji} ${esc(d.focus)}</h2><button class="closex" data-close>✕</button></div>
       <div class="sheet-body">
         <div class="wkmeta" style="margin:-4px 0 12px">${d.day} · ${timeLbl} · ${d.type === "rest" ? "Aktive Erholung" : "~" + d.minutes + " Min · ~" + d.kcal + " kcal · " + diffLevel().ico + " " + diffLevel().n}</div>
         ${warm}
         ${blocksHtml ? '<div class="card">' + blocksHtml + "</div>" : ""}
         ${fin}
         ${d.type !== "rest" ? restTimerHtml() : ""}
         <button class="btn btn-primary" style="margin-top:12px" data-finish>✓ Training abschließen</button>
         <div style="height:10px"></div>
       </div>`, { full: true });

    // Set-Dots
    bd.addEventListener("click", (e) => {
      const dot = e.target.closest(".setdot");
      if (dot) {
        const blockEl = dot.closest("[data-block]"); const bi = +blockEl.dataset.block; const j = +dot.dataset.set;
        done[bi] = done[bi] === j + 1 ? j : j + 1;
        blockEl.querySelectorAll(".setdot").forEach((el, k) => el.classList.toggle("on", k < done[bi]));
        vibrate(10); return;
      }
      if (e.target.closest("[data-finish]")) { closeSheet(bd); completeWorkout(wd, slot); return; }
      if (e.target.closest("[data-close]")) closeSheet(bd);
    });
    wireRestTimer(bd);
  }
  function restTimerHtml() {
    const r = 24, c = (2 * Math.PI * r).toFixed(1);
    return `<div class="resttimer">
      <div class="rt-ring"><svg viewBox="0 0 56 56" width="56" height="56">
        <circle cx="28" cy="28" r="${r}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="5"></circle>
        <circle cx="28" cy="28" r="${r}" fill="none" stroke="url(#ringgrad)" stroke-width="5" stroke-linecap="round"
          stroke-dasharray="${c}" stroke-dashoffset="0" data-rt-ring></circle>
      </svg><div class="n" data-rt-n>0</div></div>
      <div class="rt-btns">
        <button data-rt="30">30s</button><button data-rt="45">45s</button>
        <button data-rt="60">60s</button><button data-rt="75">75s</button>
        <button data-rt="90">90s</button><button data-rt-stop>■</button>
      </div></div>`;
  }
  function wireRestTimer(bd) {
    const ringEl = bd.querySelector("[data-rt-ring]"); const nEl = bd.querySelector("[data-rt-n]");
    if (!ringEl) return;
    const C = 2 * Math.PI * 24; let iv = null, total = 0, left = 0;
    function stop() { if (iv) clearInterval(iv); iv = null; nEl.textContent = "0"; ringEl.style.strokeDashoffset = 0; }
    function tick() {
      left--; nEl.textContent = left;
      ringEl.style.strokeDashoffset = (C * (1 - left / total)).toFixed(1);
      if (left <= 0) { clearInterval(iv); iv = null; nEl.textContent = "✓"; beep(); vibrate([60, 50, 60]); ringEl.style.strokeDashoffset = 0; }
    }
    bd.addEventListener("click", (e) => {
      const b = e.target.closest("[data-rt]");
      if (b) { total = left = +b.dataset.rt; nEl.textContent = left; ringEl.style.strokeDashoffset = C; if (iv) clearInterval(iv); iv = setInterval(tick, 1000); vibrate(10); return; }
      if (e.target.closest("[data-rt-stop]")) stop();
    });
  }
  function beep() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; const ac = new AC();
      const o = ac.createOscillator(), g = ac.createGain(); o.connect(g); g.connect(ac.destination);
      o.frequency.value = 880; g.gain.setValueAtTime(0.001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.3, ac.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.45);
      o.start(); o.stop(ac.currentTime + 0.47);
    } catch (e) {}
  }

  /* ============================================================
     KONFETTI & FEIER & TOAST
     ============================================================ */
  const cvs = document.getElementById("confetti"), cx = cvs.getContext("2d");
  let parts = [], rafOn = false;
  function sizeCanvas() { cvs.width = innerWidth * devicePixelRatio; cvs.height = innerHeight * devicePixelRatio; }
  function confettiBurst() {
    sizeCanvas(); const dpr = devicePixelRatio;
    const cols = ["#22cfb3", "#6dff8f", "#ffb020", "#ff5d6c", "#5cc8ff", "#ffffff"];
    for (let i = 0; i < 130; i++) parts.push({
      x: cvs.width / 2, y: cvs.height * 0.34,
      vx: (Math.random() - 0.5) * 17 * dpr, vy: (Math.random() * -15 - 4) * dpr, g: 0.55 * dpr,
      s: (6 + Math.random() * 8) * dpr, c: cols[i % cols.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 1
    });
    if (!rafOn) { rafOn = true; requestAnimationFrame(step); }
  }
  function step() {
    cx.clearRect(0, 0, cvs.width, cvs.height);
    for (const p of parts) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.0075;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.globalAlpha = Math.max(0, p.life);
      cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); cx.restore();
    }
    parts = parts.filter((p) => p.life > 0 && p.y < cvs.height + 60);
    if (parts.length) requestAnimationFrame(step); else { rafOn = false; cx.clearRect(0, 0, cvs.width, cvs.height); }
  }
  let celeBusy = false;
  function flushCele() {
    if (celeBusy || !pendingCele.length) return;
    celeBusy = true; const c = pendingCele.shift();
    const el = document.getElementById("celebrate");
    el.querySelector(".cico").textContent = c.ico; el.querySelector(".ctitle").textContent = c.title; el.querySelector(".csub").textContent = c.sub || "";
    el.classList.add("show"); confettiBurst(); vibrate([25, 40, 25]);
    setTimeout(() => { el.classList.remove("show"); celeBusy = false; setTimeout(flushCele, 380); }, 1750);
  }
  let toastT = null;
  function toast(msg, ico) {
    const el = document.getElementById("toast");
    el.querySelector(".ti").textContent = ico || "✓"; el.querySelector(".tt").textContent = msg;
    el.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ============================================================
     NAVIGATION & EVENTS
     ============================================================ */
  function go(tab) {
    current = tab;
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.getElementById("tab-" + tab).classList.add("active");
    document.querySelectorAll("#tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.nav === tab));
    render(tab); window.scrollTo(0, 0);
  }
  document.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-nav]"); if (nav) { go(nav.dataset.nav); return; }
    const el = e.target.closest("[data-action]"); if (!el) return;
    const a = el.dataset.action;
    if (a === "open-settings") openSettings();
    else if (a === "edit-burned") openBurned();
    else if (a === "toggle-meal") toggleMeal(el.dataset.slot);
    else if (a === "change-meal") { const w = +el.dataset.wd, sl = el.dataset.slot, cur = (S.plan[w] || {})[sl]; if (cur && cur.cd) openRecipe(w, sl, cur); else if (cur) openCustomize(w, sl, cur); else openPicker(w, sl); }
    else if (a === "view-recipe") { const w = +el.dataset.wd, sl = el.dataset.slot, cur = (S.plan[w] || {})[sl]; if (cur) openRecipe(w, sl, cur); else openPicker(w, sl); }
    else if (a === "add-manual") openManual();
    else if (a === "del-manual") delManual(+el.dataset.idx);
    else if (a === "add-appointment") openAppointment(null);
    else if (a === "open-appointment") { const ap = (S.appointments || []).find((x) => x.id === el.dataset.id); if (ap) openAppointment(ap); }
    else if (a === "start-workout") openWorkout(+el.dataset.wd, el.dataset.slot || "am");
    else if (a === "toggle-session") toggleSession(+el.dataset.wd, el.dataset.slot);
    else if (a === "toggle-item") toggleItem(el.dataset.key);
    else if (a === "set-diff") { S.diff = +el.dataset.i; save(); vibrate(10); renderActive(); }
    else if (a === "cold-therapy") openColdTherapy();
    else if (a === "skincare") openSkincare();
    else if (a === "toggle-skin") { const n = el.dataset.p; S.skinBought[n] = !S.skinBought[n]; save(); const chk = el.querySelector(".check"); if (chk) { chk.classList.toggle("on", S.skinBought[n]); chk.textContent = S.skinBought[n] ? "✓" : ""; } vibrate(10); }
    else if (a === "auto-week") autoWeek();
    else if (a === "clear-week") confirmSheet({ title: "Woche leeren?", msg: "Alle geplanten Mahlzeiten dieser Woche werden entfernt.", ok: "Leeren", onOk: clearWeek });
    else if (a === "go-plan") go("plan");
    else if (a === "toggle-shop") { const id = el.dataset.ing; S.shopChecked[id] = !S.shopChecked[id]; save(); renderShop(); }
    else if (a === "finish-shop") markWeekPlanned();
    else if (a === "share-shop") doShare();
  });
  function doShare() {
    const txt = shareText();
    if (navigator.share) { navigator.share({ title: "APEX Einkaufsliste", text: txt }).catch(() => {}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(txt).then(() => toast("In Zwischenablage kopiert", "📋")).catch(() => toast("Kopieren nicht möglich", "⚠️")); }
    else toast("Teilen nicht verfügbar", "⚠️");
  }
  window.addEventListener("resize", sizeCanvas);

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    recalcTargets(S); // falls Formel angepasst
    refresh();
    go("home");
    if (!S.seenIntro && !/nointro/.test(location.search)) {
      S.seenIntro = true; save();
      setTimeout(() => { pendingCele.push({ ico: "🏆", title: "Willkommen bei APEX!", sub: "Dein Weg zu Muskeln & Sixpack startet jetzt. Leg los! 💪" }); flushCele(); }, 500);
    }
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  init();
})();
