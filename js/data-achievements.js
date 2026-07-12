/* APEX – Erfolge & Level
   Erfolge werden gegen `stats` geprüft (type -> Statistik-Schlüssel, target -> Zielwert). */

window.ACHIEVEMENTS = [
  // Training
  { id: "first_workout", icon: "🔥", title: "Der erste Schritt", desc: "Absolviere dein erstes Training", stat: "workoutsTotal", target: 1, xp: 50 },
  { id: "workout_10",  icon: "💪", title: "Durchstarter",   desc: "10 Trainings absolviert",  stat: "workoutsTotal", target: 10, xp: 100 },
  { id: "workout_30",  icon: "🏋️", title: "Eisern",         desc: "30 Trainings absolviert",  stat: "workoutsTotal", target: 30, xp: 200 },
  { id: "workout_75",  icon: "⚡", title: "Maschine",       desc: "75 Trainings absolviert",  stat: "workoutsTotal", target: 75, xp: 400 },
  { id: "workout_150", icon: "👑", title: "Legende",        desc: "150 Trainings absolviert", stat: "workoutsTotal", target: 150, xp: 800 },

  // Streak
  { id: "streak_3",   icon: "✨", title: "Dranbleiben",        desc: "3 Tage in Folge aktiv",  stat: "bestStreak", target: 3,  xp: 60 },
  { id: "streak_7",   icon: "🌟", title: "Eine Woche stark",   desc: "7-Tage-Streak",          stat: "bestStreak", target: 7,  xp: 150 },
  { id: "streak_30",  icon: "🚀", title: "Unaufhaltsam",       desc: "30-Tage-Streak",         stat: "bestStreak", target: 30, xp: 500 },
  { id: "streak_100", icon: "💎", title: "Diamant-Disziplin",  desc: "100-Tage-Streak",        stat: "bestStreak", target: 100, xp: 1500 },

  // Kalorien verbrannt
  { id: "burn_1000",  icon: "🔥", title: "Ofen an",       desc: "1.000 kcal verbrannt (gesamt)", stat: "burnedTotal", target: 1000, xp: 80 },
  { id: "burn_5000",  icon: "🔥", title: "Brennkammer",   desc: "5.000 kcal verbrannt",          stat: "burnedTotal", target: 5000, xp: 200 },
  { id: "burn_20000", icon: "🌋", title: "Vulkan",        desc: "20.000 kcal verbrannt",         stat: "burnedTotal", target: 20000, xp: 600 },

  // Defizit
  { id: "deficit_1",  icon: "📉", title: "Im Minus",         desc: "Ersten Tag im Kaloriendefizit beendet", stat: "deficitDays", target: 1,  xp: 50 },
  { id: "deficit_7",  icon: "📉", title: "Defizit-Woche",    desc: "7 Tage im Defizit",                     stat: "deficitDays", target: 7,  xp: 150 },
  { id: "deficit_30", icon: "🏆", title: "Shredded-Mindset", desc: "30 Tage im Defizit",                    stat: "deficitDays", target: 30, xp: 500 },

  // Protein
  { id: "protein_1",  icon: "🥚", title: "Eiweiß-Start",   desc: "Erstmals dein Protein-Ziel erreicht", stat: "proteinDays", target: 1,  xp: 40 },
  { id: "protein_14", icon: "🥩", title: "Muskel-Futter",  desc: "14 Tage Protein-Ziel erreicht",       stat: "proteinDays", target: 14, xp: 200 },
  { id: "protein_50", icon: "💪", title: "Protein-Profi",  desc: "50 Tage Protein-Ziel erreicht",       stat: "proteinDays", target: 50, xp: 500 },

  // Perfekte Tage
  { id: "perfect_1",  icon: "🎯", title: "Perfekter Tag",   desc: "Training + Defizit + Protein an einem Tag", stat: "perfectDays", target: 1,  xp: 100 },
  { id: "perfect_7",  icon: "🎯", title: "Perfekte Woche",  desc: "7 perfekte Tage gesammelt",                 stat: "perfectDays", target: 7,  xp: 300 },
  { id: "perfect_30", icon: "🌈", title: "Perfektionist",   desc: "30 perfekte Tage gesammelt",                stat: "perfectDays", target: 30, xp: 900 },

  // Planung & Ernährung
  { id: "plan_1",     icon: "🛒", title: "Vorbereitet",       desc: "Ersten Wochenplan erstellt",   stat: "weeksPlanned", target: 1, xp: 50 },
  { id: "plan_8",     icon: "🧾", title: "Meal-Prep-Meister", desc: "8 Wochen durchgeplant",        stat: "weeksPlanned", target: 8, xp: 250 },
  { id: "meals_100",  icon: "🍽️", title: "Sattmacher",       desc: "100 Mahlzeiten abgehakt",      stat: "mealsChecked", target: 100, xp: 200 },
  { id: "early_5",    icon: "🌅", title: "Frühaufsteher",     desc: "5 Trainings vor 9 Uhr morgens", stat: "earlyWorkouts", target: 5, xp: 120 }
];

window.LEVELS = [
  { level: 1,  xp: 0,     title: "Neuling" },
  { level: 2,  xp: 200,   title: "Anfänger" },
  { level: 3,  xp: 500,   title: "Aktiv" },
  { level: 4,  xp: 1000,  title: "Engagiert" },
  { level: 5,  xp: 1800,  title: "Fit" },
  { level: 6,  xp: 3000,  title: "Stark" },
  { level: 7,  xp: 4600,  title: "Athlet" },
  { level: 8,  xp: 6800,  title: "Beast" },
  { level: 9,  xp: 9600,  title: "Elite" },
  { level: 10, xp: 13000, title: "Titan" },
  { level: 11, xp: 17500, title: "Legende" },
  { level: 12, xp: 23000, title: "Unsterblich" }
];
