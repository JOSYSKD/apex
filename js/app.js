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
    wake: "06:30", sleep: "22:15",
    times: { breakfast: "07:00", snack: "10:00", lunch: "12:45" },
    dinnerNormal: "19:00", dinnerFootball: "20:00",
    trainNormal: "17:00", trainFootball: "16:15",
    footballStart: "18:00", footballEnd: "19:30", footballDays: [0, 1]
  };
  function diffLevel() { return DIFF_LEVELS[Math.min(DIFF_LEVELS.length - 1, Math.max(0, S.diff | 0))]; }
  function scaleReps(str, f) { return String(str).replace(/\d+/g, (m) => Math.max(1, Math.round(parseInt(m, 10) * f))); }
  function scaledDay(wd) {
    const d = TRAINING.days[wd]; if (!d || d.type === "rest") return d;
    const L = diffLevel();
    const blocks = (d.blocks || []).map((b) => ({ ...b, sets: Math.max(1, b.sets + L.setB), reps: scaleReps(b.reps, L.repF), rest: b.rest ? Math.max(10, b.rest + L.restB) : b.rest }));
    return { ...d, blocks, kcal: Math.round(d.kcal * (0.7 + 0.35 * L.repF)), minutes: Math.round(d.minutes * (0.8 + 0.28 * L.repF)) };
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
      profile: { weight: 72, height: 185, age: 22, sex: "m", activity: "base", deficit: 500 },
      budget: 0, protein: 0, diff: 0,
      plan: {}, days: {},
      stats: {
        workoutsTotal: 0, currentStreak: 0, bestStreak: 0, lastActive: "",
        burnedTotal: 0, deficitDays: 0, proteinDays: 0, perfectDays: 0,
        mealsChecked: 0, weeksPlanned: 0, earlyWorkouts: 0, xp: 0, level: 1
      },
      achievements: {}, shopChecked: {}, seenIntro: false
    };
    recalcTargets(st);
    return st;
  }
  function load() {
    try {
      const r = JSON.parse(localStorage.getItem(LS));
      if (r && r.profile) { r.stats = r.stats || {}; r.days = r.days || {}; r.plan = r.plan || {}; r.achievements = r.achievements || {}; r.shopChecked = r.shopChecked || {}; if (typeof r.diff !== "number") r.diff = 0; return r; }
    } catch (e) {}
    return defaultState();
  }
  function save() { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} }

  function recalcTargets(st) {
    const p = st.profile;
    const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161);
    const maint = bmr * (ACTIVITY[p.activity] || ACTIVITY.base).f;
    st.budget = Math.max(1200, Math.round((maint - p.deficit) / 10) * 10);
    st.protein = Math.round((p.weight * 2.0) / 5) * 5;
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
    if (!S.days[date]) S.days[date] = { burned: 0, manual: [], checked: {}, workoutDone: false };
    const r = S.days[date]; r.manual = r.manual || []; r.checked = r.checked || {};
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
    if (m._key && _kcalCache.has(m._key)) return _kcalCache.get(m._key);
    let k = 0; for (const it of m.i) { const ing = ING[it[0]]; if (ing) k += ing.kcal * it[1] / 100; }
    k = Math.round(k); if (m._key) _kcalCache.set(m._key, k); return k;
  }
  function mealMacro(m, key) { let v = 0; for (const it of m.i) { const ing = ING[it[0]]; if (ing) v += ing[key] * it[1] / 100; } return Math.round(v); }
  // Ein Plan-Slot ist entweder ein String-Verweis ("breakfast:3") oder ein angepasstes Objekt {base,n,i,t}
  function resolveMeal(val) {
    if (!val) return null;
    if (typeof val === "string") return mealByKey(val);
    if (val.i) return { _custom: true, _key: null, _type: val.base ? val.base.slice(0, val.base.indexOf(":")) : "custom", base: val.base || null, n: val.n, i: val.i, t: val.t || [] };
    return null;
  }
  function itemsKcalProt(items) { let k = 0, p = 0; for (const it of items) { const ing = ING[it[0]]; if (ing) { k += ing.kcal * it[1] / 100; p += ing.p * it[1] / 100; } } return [Math.round(k), Math.round(p)]; }
  function sameItems(a, b) { if (!a || !b || a.length !== b.length) return false; const norm = (x) => x.map((e) => e[0] + ":" + e[1]).sort().join("|"); return norm(a) === norm(b); }
  function isCustom(val) { return val && typeof val === "object"; }

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

  function completeWorkout(wd) {
    const rec = dayRec(); const already = rec.workoutDone; rec.workoutDone = true;
    const day = TRAINING.days[wd] || {}; const sd = scaledDay(wd) || day;
    if (!already) {
      S.stats.workoutsTotal = (S.stats.workoutsTotal || 0) + 1;
      if (new Date().getHours() < 9) S.stats.earlyWorkouts = (S.stats.earlyWorkouts || 0) + 1;
      addXp(50);
      pendingCele.push({ ico: day.emoji || "💪", title: "Training geschafft!", sub: (day.focus || "") + " – stark durchgezogen!" });
    }
    refresh(); renderActive(); flushCele();
    if (!already && day.type !== "rest") openWorkoutFeedback(sd.kcal || day.kcal);
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
    const d = scaledDay(wd); const done = rec.workoutDone;
    const items = [];
    items.push({ t: DAYPLAN.wake, ico: "☀️", title: "Aufstehen", sub: "Guten Morgen – erstmal ein großes Glas Wasser." });
    for (const key of ["breakfast", "snack", "lunch"]) {
      const s = SLOTS.find((x) => x.key === key);
      items.push({ t: DAYPLAN.times[key], ico: s.ico, meal: 1, slot: key, m: resolveMeal(plan[key]), on: !!rec.checked[key], label: s.label });
    }
    if (d && d.type !== "rest") items.push({ t: isFb ? DAYPLAN.trainFootball : DAYPLAN.trainNormal, ico: d.emoji, training: 1, done, focus: d.focus, minutes: d.minutes, kcal: d.kcal, optional: isFb });
    else items.push({ t: DAYPLAN.trainNormal, ico: "🌱", title: "Aktive Erholung", sub: "Spaziergang & Dehnen – heute wächst der Muskel." });
    if (isFb) items.push({ t: DAYPLAN.footballStart, ico: "⚽", title: "Fußballtraining", sub: "1:30 Std im Verein (" + DAYPLAN.footballStart + "–" + DAYPLAN.footballEnd + ")" });
    { const s = SLOTS.find((x) => x.key === "dinner"); items.push({ t: isFb ? DAYPLAN.dinnerFootball : DAYPLAN.dinnerNormal, ico: s.ico, meal: 1, slot: "dinner", m: resolveMeal(plan.dinner), on: !!rec.checked.dinner, label: s.label }); }
    items.push({ t: DAYPLAN.sleep, ico: "😴", title: "Schlafen gehen", sub: "~8 Std Schlaf bis 6:30 – Regeneration ist Teil des Trainings." });
    items.sort((a, b) => a.t.localeCompare(b.t));
    return items.map((it) => {
      if (it.meal) return `<div class="tl-row">
        <div class="tl-time">${it.t}</div><div class="tl-ico">${it.ico}</div>
        <div class="tl-body" data-action="view-recipe" data-wd="${wd}" data-slot="${it.slot}">
          <div class="tl-title ${it.m ? "" : "muted"}">${it.m ? esc(it.m.n) : "Gericht wählen"}</div>
          <div class="tl-sub">${it.label}${it.m ? " · " + mealKcal(it.m) + " kcal" : " · antippen"}</div>
        </div>
        ${it.m ? `<div class="check ${it.on ? "on" : ""}" data-action="toggle-meal" data-slot="${it.slot}">${it.on ? "✓" : ""}</div>` : `<div style="color:var(--acc);font-size:20px;padding-right:6px">＋</div>`}
      </div>`;
      if (it.training) return `<div class="tl-row" data-action="start-workout" data-wd="${wd}">
        <div class="tl-time">${it.t}</div><div class="tl-ico">${it.ico}</div>
        <div class="tl-body"><div class="tl-title">APEX-Training${it.done ? " ✓" : ""}</div>
          <div class="tl-sub">${esc(it.focus)} · ~${it.minutes} Min · ~${it.kcal} kcal${it.optional ? " · optional (heute Fußball)" : ""}</div></div>
        <div style="color:var(--muted2);font-size:19px;padding-right:6px">${it.done ? "✓" : "▶︎"}</div>
      </div>`;
      return `<div class="tl-row dim">
        <div class="tl-time">${it.t}</div><div class="tl-ico">${it.ico}</div>
        <div class="tl-body"><div class="tl-title">${esc(it.title)}</div><div class="tl-sub">${esc(it.sub || "")}</div></div>
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
            <div class="grow"><div class="slotlabel">${s.label}${isCustom(val) ? ' · <span style="color:var(--acc)">angepasst</span>' : ""}</div>
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

    html += `<div class="card">
      <div class="between">
        <div><div class="mealname">${ids.length} Zutaten</div><div class="wkmeta">für 7 Tage · 1 Portion je Mahlzeit</div></div>
        <div style="text-align:right"><div class="mealname">${Math.round(weekKcal / 7)}</div><div class="wkmeta">Ø kcal/Tag</div></div>
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
      html += `<div class="sectitle">${cat.ico} ${cat.name}</div><div class="card">` +
        catIds.map((id) => {
          const on = !!S.shopChecked[id];
          return `<div class="mealrow" data-action="toggle-shop" data-ing="${id}">
            <div class="check ${on ? "on" : ""}">${on ? "✓" : ""}</div>
            <div class="grow"><div class="mealname" style="${on ? "text-decoration:line-through;opacity:.5" : ""}">${esc(ING[id].n)}</div></div>
            <div class="mealkcal" style="${on ? "opacity:.5" : ""}">${fmtAmount(id, totals[id])}</div>
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
      for (const id of catIds) txt += "  • " + ING[id].n + " – " + fmtAmount(id, totals[id]) + "\n";
      txt += "\n";
    }
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
    for (let wd = 0; wd < TRAINING.days.length; wd++) {
      const d = scaledDay(wd); const isToday = wd === todayWd();
      const done = (S.days[todayStr()] && isToday) ? S.days[todayStr()].workoutDone : false;
      html += `<div class="card wkday" data-action="start-workout" data-wd="${wd}">
        <div class="row">
          <div class="wkicon">${d.emoji}</div>
          <div class="grow">
            <div class="dayhead" style="margin:0">
              <div class="d">${d.day} ${isToday ? '<span class="today-badge">HEUTE</span>' : ""}</div>
              ${done ? '<span class="pill" style="color:var(--good)">✓ erledigt</span>' : ""}
            </div>
            <div class="mealname" style="font-size:14px;color:var(--muted);font-weight:700">${esc(d.focus)}</div>
            <div class="wkmeta">${d.type === "rest" ? "Aktive Erholung" : d.blocks.length + " Übungen · ~" + d.minutes + " Min · ~" + d.kcal + " kcal"}</div>
          </div>
          <div style="font-size:22px;color:var(--muted2)">›</div>
        </div>
      </div>`;
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
    const k = mealKcal(m), p = mealMacro(m, "p"), custom = isCustom(source);
    const eaten = !!dayRec().checked[slot];
    const ingRows = m.i.map((it) => {
      const ing = ING[it[0]]; if (!ing) return "";
      const amt = ing.pieceG ? (Math.max(1, Math.round(it[1] / ing.pieceG)) + "×") : (it[1] + (ing.unit === "ml" ? " ml" : " g"));
      return `<div class="ing-list-row"><span>${esc(ing.n)}</span><b>${amt}</b></div>`;
    }).join("");
    const steps = rec && rec.s && rec.s.length
      ? rec.s.map((st, i) => `<div class="recipe-step"><div class="num">${i + 1}</div><div class="tx">${esc(st)}</div></div>`).join("")
      : `<div class="empty-note">Für dieses Gericht ist noch keine Schritt-Anleitung hinterlegt.<br>Zutaten frisch zubereiten und nach Geschmack anrichten.</div>`;
    const bd = openSheet(`<div class="grip"></div>
      <div class="sheet-head"><h2 style="font-size:17px">${esc(m.n)}</h2><button class="closex" data-close>✕</button></div>
      <div class="sheet-body">
        <div class="recipe-meta"><span class="pill">⏱️ ${esc(rec && rec.t ? rec.t : "—")}</span><span class="pill">🔥 ${k} kcal</span><span class="pill">🥩 ${p} g Eiweiß</span><span class="pill">1 Portion</span></div>
        ${custom ? '<div class="recipe-note">ℹ️ Du hast dieses Grundrezept angepasst – die Schritte beziehen sich aufs Originalgericht, die Mengen unten auf deine Version.</div>' : ""}
        <div class="sectitle" style="margin-top:2px">🧺 Zutaten</div>
        <div class="card">${ingRows}</div>
        <div class="sectitle">👨‍🍳 Zubereitung</div>
        <div class="card">${steps}</div>
        ${rec && rec.tip ? `<div class="recipe-tip"><b>💡 Tipp:</b> ${esc(rec.tip)}</div>` : ""}
        <div style="height:14px"></div>
        <button class="btn ${eaten ? "btn-ghost" : "btn-primary"}" data-eaten>${eaten ? "↩︎ Als „nicht gegessen“ markieren" : "✓ Als gegessen markieren"}</button>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn btn-ghost" style="flex:1" data-adjust>✏️ Zutaten anpassen</button>
          <button class="btn btn-ghost" style="flex:1" data-change>🔄 Anderes Gericht</button>
        </div>
        <div style="height:16px"></div>
      </div>`, { full: true });
    bd.addEventListener("click", (e) => {
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
           <button class="btn btn-ghost btn-sm" style="flex:1" data-random>🎲 Überrasch mich</button>
           <button class="btn btn-ghost btn-sm" style="flex:0 0 auto" data-clear>✕ Entfernen</button>
         </div>
         <div data-list></div>
       </div>`, { full: true });
    const listEl = bd.querySelector("[data-list]");
    function renderList(q) {
      q = (q || "").toLowerCase().trim();
      const items = [];
      for (let i = 0; i < set.length; i++) if (!q || set[i].n.toLowerCase().includes(q)) items.push(i);
      listEl.innerHTML = items.length ? items.slice(0, 250).map((i) => {
        const m = mealByKey(slotKey + ":" + i);
        return `<div class="pickrow" data-pick="${i}">
          <div class="grow"><div class="pn">${esc(set[i].n)}</div>
          <div class="pm">${mealKcal(m)} kcal · ${mealMacro(m, "p")} g Eiweiß</div>${tagsHtml(set[i].t)}</div>
          <div class="mealkcal">${mealKcal(m)}</div></div>`;
      }).join("") : `<div class="empty-note">Nichts gefunden.</div>`;
    }
    renderList("");
    bd.querySelector("[data-search]").addEventListener("input", (e) => renderList(e.target.value));
    bd.addEventListener("click", (e) => {
      const pk = e.target.closest("[data-pick]");
      if (pk) { closeSheet(bd); openCustomize(wd, slotKey, slotKey + ":" + pk.dataset.pick); return; }
      if (e.target.closest("[data-random]")) { setPlan(wd, slotKey, slotKey + ":" + Math.floor(Math.random() * set.length)); vibrate(15); closeSheet(bd); return; }
      if (e.target.closest("[data-clear]")) { setPlan(wd, slotKey, null); closeSheet(bd); return; }
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
  function openWorkout(wd) {
    const d = scaledDay(wd); if (!d) return;
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
         <div class="wkmeta" style="margin:-4px 0 12px">${d.day} · ${d.type === "rest" ? "Aktive Erholung" : "~" + d.minutes + " Min · ~" + d.kcal + " kcal · " + diffLevel().ico + " " + diffLevel().n}</div>
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
      if (e.target.closest("[data-finish]")) { closeSheet(bd); completeWorkout(wd); return; }
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
    else if (a === "change-meal") { const w = +el.dataset.wd, sl = el.dataset.slot, cur = (S.plan[w] || {})[sl]; if (cur) openCustomize(w, sl, cur); else openPicker(w, sl); }
    else if (a === "view-recipe") { const w = +el.dataset.wd, sl = el.dataset.slot, cur = (S.plan[w] || {})[sl]; if (cur) openRecipe(w, sl, cur); else openPicker(w, sl); }
    else if (a === "add-manual") openManual();
    else if (a === "del-manual") delManual(+el.dataset.idx);
    else if (a === "start-workout") openWorkout(+el.dataset.wd);
    else if (a === "set-diff") { S.diff = +el.dataset.i; save(); vibrate(10); renderActive(); }
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
