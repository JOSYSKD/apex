/* APEX – Abendgerichte (leichter/proteinreicher als mittags, viel Gemüse, ~380–580 kcal)
   Format: { n:Name, i:[[zutatId, gramm], ...], t:[tags] }  – kcal berechnet die App.
   Reis/Nudeln/Couscous/Bulgur/Quinoa = Rohgewicht. ml-Zutaten (Öl, Sojasauce, Brühe, Kokosmilch) in ml. */

window.MEALS_DINNER = [
  /* ---------- Fisch ---------- */
  { n: "Ofenlachs mit Brokkoli & Süßkartoffel", i: [["salmon", 150], ["broccoli", 200], ["sweetpotato", 150], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm"] },
  { n: "Zitronen-Lachs auf Spinat", i: [["salmon", 160], ["spinach", 200], ["lemon", 30], ["garlic", 5], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Ofenkabeljau mit Kräuterkruste & Kartoffeln", i: [["cod", 200], ["potato", 180], ["tomatocherry", 120], ["herbs", 8], ["oliveoil", 10]], t: ["herzhaft", "protein", "warm"] },
  { n: "Seelachs mit Ofenkartoffeln & Spargel", i: [["cod", 180], ["potato", 200], ["asparagus", 150], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm"] },
  { n: "Gebratene Forelle mit grünen Bohnen", i: [["trout", 180], ["greenbeans", 200], ["potato", 150], ["oliveoil", 8], ["lemon", 20]], t: ["herzhaft", "protein", "warm"] },
  { n: "Garnelenpfanne mit Zucchini & Knoblauch", i: [["shrimp", 200], ["zucchini", 200], ["garlic", 8], ["tomatocherry", 120], ["oliveoil", 15]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Garnelen-Curry mit Blumenkohlreis", i: [["shrimp", 180], ["cauliflower", 200], ["coconutmilk", 80], ["currypaste", 20], ["pepper", 80]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Thunfisch-Bohnen-Salat", i: [["tuna", 120], ["whitebeans", 120], ["onionred", 40], ["tomato", 100], ["rocket", 40], ["oliveoil", 8]], t: ["herzhaft", "protein", "kalt"] },
  { n: "Lachs-Teriyaki mit Pak-Gemüse", i: [["salmon", 150], ["broccoli", 150], ["carrot", 80], ["soysauce", 15], ["ginger", 8], ["sesame", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Kabeljau in Tomatensugo mit Oliven", i: [["cod", 220], ["passata", 150], ["olives", 40], ["onion", 60], ["garlic", 6], ["oliveoil", 12]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Ofenlachs mit Quinoa & Rucola", i: [["salmon", 130], ["quinoa", 50], ["rocket", 40], ["tomatocherry", 100], ["oliveoil", 5]], t: ["herzhaft", "protein", "warm"] },
  { n: "Forelle aus dem Ofen mit Fenchelgemüse", i: [["trout", 180], ["leek", 120], ["carrot", 100], ["lemon", 30], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Kabeljau mit Ofengemüse & Feta", i: [["cod", 180], ["zucchini", 120], ["pepper", 100], ["eggplant", 100], ["feta", 40], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },

  /* ---------- Hähnchen / Pute ---------- */
  { n: "Hähnchenbrust mit Ofengemüse", i: [["chicken", 180], ["zucchini", 120], ["pepper", 120], ["onionred", 60], ["oliveoil", 8], ["herbs", 5]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Hähnchen-Gemüse-Pfanne asiatisch", i: [["chicken", 170], ["broccoli", 150], ["carrot", 80], ["pepper", 80], ["soysauce", 15], ["ginger", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Hähnchen-Curry mit Blumenkohlreis", i: [["chicken", 170], ["cauliflower", 200], ["coconutmilk", 60], ["curry", 6], ["pepper", 80], ["onion", 50]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Putenbrust mit Ratatouille", i: [["turkey", 180], ["zucchini", 120], ["eggplant", 120], ["pepper", 100], ["passata", 100], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Hähnchen-Bowl mit Quinoa & Avocado", i: [["chicken", 150], ["quinoa", 45], ["avocado", 40], ["tomatocherry", 100], ["rocket", 40]], t: ["herzhaft", "protein"] },
  { n: "Putengeschnetzeltes mit Champignons", i: [["turkey", 200], ["mushroom", 150], ["creamsour", 60], ["onion", 60], ["oliveoil", 6], ["herbs", 5]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Hähnchenspieße mit griechischem Salat", i: [["chicken", 170], ["cucumber", 120], ["tomato", 120], ["feta", 40], ["olives", 20], ["oliveoil", 8]], t: ["herzhaft", "protein", "lowcarb"] },
  { n: "Hähnchenschenkel mit Ofengemüse", i: [["chickenthigh", 160], ["carrot", 120], ["broccoli", 120], ["onion", 60], ["oliveoil", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Puten-Zucchini-Pfanne mit Feta", i: [["turkey", 170], ["zucchini", 200], ["tomatocherry", 100], ["feta", 40], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Hähnchen mit Süßkartoffel & Rosenkohl", i: [["chicken", 160], ["sweetpotato", 150], ["broccoli", 150], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm"] },
  { n: "Hähnchen-Fajita-Pfanne", i: [["chicken", 170], ["pepper", 150], ["onion", 80], ["chili", 5], ["curry", 4], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Putenbrust mit Blumenkohlpüree & Spinat", i: [["turkey", 200], ["cauliflower", 200], ["spinach", 100], ["cheesecreamlt", 50], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Hähnchen-Kokos-Curry mit Spinat", i: [["chicken", 160], ["spinach", 150], ["coconutmilk", 60], ["currypaste", 20], ["onion", 60]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Gegrillte Hähnchenbrust mit großem Salat", i: [["chicken", 170], ["lettuce", 80], ["tomato", 100], ["cucumber", 100], ["pepper", 80], ["oliveoil", 8]], t: ["herzhaft", "protein", "kalt", "lowcarb"] },
  { n: "Puten-Paprika-Gulasch", i: [["turkey", 200], ["pepper", 150], ["passata", 120], ["onion", 70], ["oliveoil", 8], ["curry", 4]], t: ["herzhaft", "protein", "warm", "lowcarb"] },

  /* ---------- Rind / Schwein ---------- */
  { n: "Rindersteak mit Ofengemüse", i: [["beefsteak", 160], ["zucchini", 120], ["pepper", 120], ["mushroom", 100], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Steak mit grünem Spargel", i: [["beefsteak", 160], ["asparagus", 200], ["tomatocherry", 100], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Rinderhack-Gemüsepfanne", i: [["beefmince", 150], ["zucchini", 150], ["pepper", 120], ["onion", 60], ["passata", 100]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Low-Carb-Chili con Carne", i: [["beefmince", 150], ["beans", 120], ["passata", 120], ["pepper", 80], ["onion", 60], ["chili", 5]], t: ["herzhaft", "protein", "warm"] },
  { n: "Schweinefilet mit Rahmchampignons", i: [["porkfillet", 190], ["mushroom", 150], ["creamsour", 60], ["onion", 50], ["oliveoil", 6], ["herbs", 5]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Schweinefilet mit Ofenkartoffeln & Brokkoli", i: [["porkfillet", 160], ["potato", 180], ["broccoli", 150], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm"] },
  { n: "Rindersteak mit Kräuterbutter-Bohnen", i: [["beefsteak", 160], ["greenbeans", 200], ["garlic", 6], ["herbs", 5], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Hackfleisch-Zucchini-Auflauf", i: [["beefmince", 150], ["zucchini", 200], ["passata", 100], ["cheese", 40], ["onion", 50]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Rinderhack-Kohl-Pfanne", i: [["beefmince", 150], ["cabbage", 200], ["carrot", 80], ["onion", 60], ["soysauce", 12]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Schweinefilet-Medaillons mit Rotkohl", i: [["porkfillet", 170], ["redcabbage", 200], ["apple", 60], ["oliveoil", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] },

  /* ---------- Gefüllte Gemüse ---------- */
  { n: "Gefüllte Paprika mit Rinderhack", i: [["pepper", 200], ["beefmince", 130], ["rice", 40], ["passata", 80], ["onion", 50]], t: ["herzhaft", "protein", "warm"] },
  { n: "Gefüllte Paprika mit Hähnchen & Feta", i: [["pepper", 200], ["chicken", 130], ["feta", 40], ["tomatocherry", 80], ["herbs", 5]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Gefüllte Zucchini mit Putenhack & Käse", i: [["zucchini", 250], ["turkey", 130], ["cheese", 40], ["passata", 80], ["onion", 40]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Vegetarisch gefüllte Paprika mit Quinoa", i: [["pepper", 200], ["quinoa", 55], ["feta", 40], ["tomatocherry", 80], ["onion", 40]], t: ["vegetarisch", "protein", "warm"] },
  { n: "Gefüllte Aubergine mit Hackfleisch", i: [["eggplant", 250], ["beefmince", 130], ["passata", 100], ["cheese", 30], ["garlic", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] },

  /* ---------- Suppen / Eintöpfe ---------- */
  { n: "Rote-Linsen-Suppe mit Kokos", i: [["lentilsred", 70], ["carrot", 100], ["coconutmilk", 50], ["onion", 60], ["curry", 5], ["broth", 300]], t: ["herzhaft", "vegan", "warm"] },
  { n: "Gemüse-Minestrone mit Bohnen", i: [["whitebeans", 130], ["zucchini", 100], ["carrot", 80], ["passata", 120], ["pasta", 50], ["onion", 50], ["oliveoil", 6]], t: ["herzhaft", "vegetarisch", "warm"] },
  { n: "Hühnersuppe mit Nudeln & Gemüse", i: [["chicken", 160], ["pasta", 40], ["carrot", 100], ["leek", 80], ["celery", 60], ["broth", 300], ["herbs", 5]], t: ["herzhaft", "protein", "warm"] },
  { n: "Kürbissuppe mit Kürbiskernen & Tofu", i: [["pumpkin", 300], ["tofusmoked", 100], ["coconutmilk", 60], ["onion", 60], ["ginger", 8], ["pumpkinseed", 20]], t: ["herzhaft", "vegan", "warm"] },
  { n: "Linseneintopf mit Gemüse", i: [["lentils", 200], ["carrot", 100], ["potato", 100], ["leek", 60], ["broth", 250]], t: ["herzhaft", "vegan", "warm"] },
  { n: "Blumenkohl-Cremesuppe mit Hähnchen", i: [["cauliflower", 250], ["chicken", 150], ["cheesecreamlt", 50], ["oliveoil", 8], ["broth", 200], ["herbs", 5]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Kichererbsen-Spinat-Eintopf", i: [["chickpeas", 180], ["spinach", 150], ["passata", 100], ["onion", 60], ["garlic", 6], ["oliveoil", 8]], t: ["herzhaft", "vegan", "warm"] },
  { n: "Erbseneintopf mit Räuchertofu", i: [["peas", 180], ["tofusmoked", 130], ["carrot", 80], ["potato", 120], ["broth", 250]], t: ["herzhaft", "vegan", "warm"] },
  { n: "Scharfe Kokos-Gemüse-Suppe", i: [["coconutmilk", 80], ["broccoli", 120], ["pepper", 80], ["tofu", 100], ["currypaste", 15], ["broth", 250]], t: ["herzhaft", "vegan", "warm", "lowcarb"] },

  /* ---------- Omelett / Frittata / Shakshuka ---------- */
  { n: "Gemüse-Omelett mit Käse", i: [["egg", 150], ["pepper", 80], ["spinach", 60], ["cheese", 30], ["oliveoil", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Shakshuka mit Feta", i: [["egg", 120], ["passata", 150], ["pepper", 100], ["onion", 60], ["feta", 40], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Champignon-Frittata", i: [["egg", 180], ["mushroom", 150], ["onion", 50], ["parmesan", 20], ["herbs", 5]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Spinat-Feta-Omelett", i: [["egg", 150], ["spinach", 100], ["feta", 40], ["oliveoil", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Zucchini-Frittata mit Tomaten", i: [["egg", 150], ["zucchini", 120], ["tomatocherry", 100], ["parmesan", 20], ["oliveoil", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Rührei mit Räucherlachs & Spinat", i: [["egg", 180], ["salmonsmoked", 60], ["spinach", 80], ["oliveoil", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Bauernomelett mit Kartoffeln", i: [["egg", 150], ["potato", 120], ["onion", 50], ["pepper", 70], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm"] },
  { n: "Shakshuka verde mit Spinat & Erbsen", i: [["egg", 150], ["spinach", 120], ["peas", 100], ["onion", 50], ["feta", 30], ["oliveoil", 8]], t: ["herzhaft", "protein", "warm", "lowcarb"] },

  /* ---------- Tofu / Tofu / vegan ---------- */
  { n: "Tofu-Gemüse-Pfanne mit Sesam", i: [["tofusmoked", 150], ["broccoli", 150], ["pepper", 100], ["soysauce", 15], ["sesame", 8], ["ginger", 8]], t: ["herzhaft", "vegan", "protein", "warm", "lowcarb"] },
  { n: "Tofu-Curry mit Blumenkohlreis", i: [["tofu", 150], ["cauliflower", 200], ["coconutmilk", 60], ["currypaste", 20], ["pepper", 80]], t: ["herzhaft", "vegan", "warm", "lowcarb"] },
  { n: "Tofu mit Ofengemüse", i: [["tofu", 130], ["zucchini", 120], ["pepper", 120], ["onionred", 60], ["oliveoil", 8]], t: ["herzhaft", "vegan", "protein", "warm", "lowcarb"] },
  { n: "Knuspertofu mit Erdnusssauce & Brokkoli", i: [["tofusmoked", 150], ["broccoli", 180], ["peanut", 20], ["soysauce", 15], ["ginger", 6]], t: ["herzhaft", "vegan", "protein", "warm", "lowcarb"] },
  { n: "Linsen-Bolognese mit Vollkornnudeln", i: [["lentilsred", 40], ["pasta", 60], ["passata", 120], ["onion", 60], ["garlic", 6], ["oliveoil", 8]], t: ["herzhaft", "vegan", "protein", "warm"] },
  { n: "Räuchertofu-Bowl mit Quinoa & Edamame", i: [["tofusmoked", 120], ["quinoa", 55], ["edamame", 80], ["carrot", 60], ["soysauce", 12]], t: ["herzhaft", "vegan", "protein"] },
  { n: "Tofu-Teriyaki mit Pak Choi", i: [["tofu", 150], ["cabbage", 150], ["carrot", 70], ["soysauce", 15], ["sesame", 10], ["oliveoil", 6]], t: ["herzhaft", "vegan", "protein", "warm", "lowcarb"] },
  { n: "Gebackener Tofu mit Rosenkohl", i: [["tofu", 160], ["broccoli", 200], ["soysauce", 12], ["oliveoil", 6], ["sesame", 6]], t: ["herzhaft", "vegan", "protein", "warm", "lowcarb"] },

  /* ---------- Hülsenfrüchte / vegetarisch ---------- */
  { n: "Kichererbsen-Curry mit Spinat", i: [["chickpeas", 180], ["spinach", 120], ["coconutmilk", 80], ["currypaste", 18], ["onion", 60], ["tomato", 80]], t: ["herzhaft", "vegan", "warm"] },
  { n: "Linsen-Dal mit Blumenkohl", i: [["lentilsred", 70], ["cauliflower", 150], ["coconutmilk", 50], ["curry", 6], ["onion", 60], ["broth", 200]], t: ["herzhaft", "vegan", "warm"] },
  { n: "Bohnen-Gemüse-Pfanne mit Ei", i: [["beans", 150], ["pepper", 100], ["zucchini", 100], ["egg", 120], ["passata", 80], ["oliveoil", 8]], t: ["herzhaft", "vegetarisch", "protein", "warm"] },
  { n: "Griechischer Bauernsalat mit Kichererbsen", i: [["chickpeas", 150], ["cucumber", 120], ["tomato", 120], ["feta", 50], ["olives", 25], ["oliveoil", 10]], t: ["herzhaft", "vegetarisch", "kalt"] },
  { n: "Ofen-Kichererbsen mit Süßkartoffel & Feta", i: [["chickpeas", 150], ["sweetpotato", 180], ["feta", 40], ["spinach", 60], ["oliveoil", 8]], t: ["herzhaft", "vegetarisch", "warm"] },
  { n: "Linsensalat mit Feta & Rucola", i: [["lentils", 200], ["feta", 40], ["rocket", 40], ["tomatocherry", 100], ["oliveoil", 8]], t: ["herzhaft", "vegetarisch", "kalt"] },
  { n: "Edamame-Quinoa-Bowl", i: [["edamame", 120], ["quinoa", 55], ["carrot", 60], ["cucumber", 80], ["soysauce", 12], ["sesame", 6]], t: ["herzhaft", "vegan", "protein"] },

  /* ---------- Halloumi / Käse-vegetarisch ---------- */
  { n: "Gebratener Halloumi mit Ofengemüse", i: [["halloumi", 120], ["zucchini", 120], ["pepper", 100], ["eggplant", 80], ["oliveoil", 8]], t: ["herzhaft", "vegetarisch", "warm", "lowcarb"] },
  { n: "Halloumi-Salat mit Trauben", i: [["halloumi", 100], ["rocket", 50], ["cucumber", 100], ["grape", 40], ["oliveoil", 8]], t: ["herzhaft", "vegetarisch", "kalt", "lowcarb"] },
  { n: "Caprese-Salat mit Avocado", i: [["cheesemozz", 100], ["tomato", 150], ["avocado", 60], ["rocket", 30], ["oliveoil", 8]], t: ["vegetarisch", "kalt", "lowcarb"] },
  { n: "Blumenkohl-Käse-Auflauf", i: [["cauliflower", 250], ["cheese", 50], ["cheesecreamlt", 40], ["egg", 60], ["herbs", 5]], t: ["vegetarisch", "protein", "warm", "lowcarb"] },

  /* ---------- Bowls / Salate / kalt ---------- */
  { n: "Poke-Bowl mit Lachs & Edamame", i: [["salmon", 120], ["rice", 45], ["edamame", 60], ["cucumber", 80], ["avocado", 30], ["soysauce", 12]], t: ["herzhaft", "protein", "kalt"] },
  { n: "Hähnchen-Cäsar-Salat", i: [["chicken", 160], ["lettuce", 100], ["parmesan", 20], ["yogurtgreek", 40], ["tomatocherry", 80], ["oliveoil", 8]], t: ["herzhaft", "protein", "kalt", "lowcarb"] },
  { n: "Thunfisch-Ei-Salat", i: [["tuna", 120], ["egg", 120], ["lettuce", 80], ["tomato", 100], ["cucumber", 80], ["oliveoil", 8]], t: ["herzhaft", "protein", "kalt", "lowcarb"] },
  { n: "Quinoa-Salat mit Gemüse & Feta", i: [["quinoa", 55], ["tomatocherry", 100], ["cucumber", 100], ["pepper", 80], ["feta", 40], ["oliveoil", 8]], t: ["vegetarisch", "kalt"] },
  { n: "Rindersteak-Salat mit Rucola", i: [["beefsteak", 140], ["rocket", 50], ["tomatocherry", 100], ["parmesan", 20], ["oliveoil", 8], ["vinegar", 8]], t: ["herzhaft", "protein", "kalt", "lowcarb"] },
  { n: "Bulgur-Salat mit Kichererbsen & Minze", i: [["bulgur", 55], ["chickpeas", 100], ["cucumber", 100], ["tomato", 100], ["herbs", 8], ["oliveoil", 8]], t: ["vegan", "kalt"] },
  { n: "Couscous-Salat mit Ofengemüse", i: [["couscous", 55], ["zucchini", 100], ["pepper", 100], ["onionred", 50], ["feta", 40], ["oliveoil", 8]], t: ["vegetarisch"] },

  /* ---------- Ofengerichte / Aufläufe ---------- */
  { n: "Zucchini-Lasagne mit Hackfleisch", i: [["zucchini", 250], ["beefmince", 130], ["passata", 100], ["cheese", 40], ["onion", 50]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Ofengemüse mit Kichererbsen & Tahin-Alternative", i: [["chickpeas", 120], ["carrot", 100], ["pumpkin", 150], ["onionred", 60], ["hummus", 30], ["oliveoil", 8]], t: ["herzhaft", "vegan", "warm"] },
  { n: "Überbackener Blumenkohl mit Hähnchen", i: [["chicken", 150], ["cauliflower", 200], ["cheese", 40], ["cheesecreamlt", 30], ["broccoli", 80]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Süßkartoffel-Ofen mit Hähnchen & Brokkoli", i: [["chicken", 150], ["sweetpotato", 150], ["broccoli", 120], ["oliveoil", 8], ["herbs", 5]], t: ["herzhaft", "protein", "warm", "mealprep"] },
  { n: "Gnocchi-Gemüse-Pfanne mit Mozzarella", i: [["gnocchi", 180], ["tomatocherry", 120], ["spinach", 80], ["cheesemozz", 60], ["garlic", 6]], t: ["vegetarisch", "warm"] },
  { n: "Polenta mit Pilzragout", i: [["polenta", 60], ["mushroom", 180], ["onion", 60], ["parmesan", 20], ["herbs", 5], ["oliveoil", 8]], t: ["vegetarisch", "warm"] },

  /* ---------- Wraps / Mediterran / Sonstiges ---------- */
  { n: "Hähnchen-Wrap mit Gemüse", i: [["wrap", 64], ["chicken", 120], ["lettuce", 40], ["tomato", 60], ["cheesecreamlt", 20], ["pepper", 50]], t: ["herzhaft", "protein", "schnell"] },
  { n: "Falafel-Wrap mit Hummus", i: [["wrap", 64], ["chickpeas", 100], ["hummus", 30], ["cucumber", 60], ["tomato", 60], ["lettuce", 30]], t: ["herzhaft", "vegan", "schnell"] },
  { n: "Puten-Gyros mit Zaziki", i: [["turkey", 170], ["yogurtgreek", 80], ["cucumber", 60], ["onionred", 40], ["pita", 50], ["garlic", 5]], t: ["herzhaft", "protein", "warm"] },
  { n: "Antipasti-Teller mit Halloumi", i: [["halloumi", 100], ["eggplant", 100], ["zucchini", 100], ["pepper", 100], ["olives", 25], ["oliveoil", 8]], t: ["vegetarisch", "warm", "lowcarb"] },
  { n: "Deutscher Wurstsalat-Ersatz mit Ei & Käse", i: [["egg", 120], ["cheese", 40], ["gherkin", 40], ["onion", 40], ["mustard", 8], ["oliveoil", 6]], t: ["herzhaft", "protein", "kalt", "lowcarb"] },
  { n: "Sauerkraut-Pfanne mit Räuchertofu", i: [["sauerkraut", 200], ["tofusmoked", 130], ["onion", 50], ["potato", 100], ["oliveoil", 6]], t: ["herzhaft", "vegan", "protein", "warm"] },
  { n: "Kohlrabi-Möhren-Curry mit Hähnchen", i: [["chicken", 150], ["carrot", 120], ["broccoli", 120], ["coconutmilk", 50], ["currypaste", 15], ["ginger", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] },
  { n: "Spargel-Frittata mit Schinken", i: [["egg", 150], ["asparagus", 150], ["ham", 40], ["parmesan", 20], ["oliveoil", 6]], t: ["herzhaft", "protein", "warm", "lowcarb"] }
];
