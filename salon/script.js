/* =====================================================
   1. RÉGLAGES À MODIFIER POUR CHAQUE CLIENT
   ===================================================== */
// Numéro WhatsApp : indicatif (237) + numéro, sans espace ni "+"
var PHONE = "237652508451"; // à remplacer par le vrai numéro

// Prestations. n = nom, d = durée, p = prix de départ en FCFA
var services = [
  { n: "Tresses (box braids)", d: "5 à 7 heures", p: 15000 },
  { n: "Tissage et pose",      d: "2 à 3 heures", p: 10000 },
  { n: "Vanilles / twists",    d: "3 à 4 heures", p: 8000 },
  { n: "Soin et brushing",     d: "1 à 2 heures", p: 5000 },
  { n: "Coupe dame",           d: "1 heure",      p: 3000 },
  { n: "Coupe homme et barbe", d: "30 minutes",   p: 1500 }
];

// Heures de rendez-vous (le salon ouvre à 8h et ferme à 19h)
var heures = ["8h00", "9h00", "10h00", "11h00", "12h00", "13h00", "14h00", "15h00", "16h00", "17h00"];

/* =====================================================
   2. ÉLÉMENTS DE LA PAGE (stockés pour les réutiliser)
   ===================================================== */
var liste = document.getElementById("list");
var selService = document.getElementById("service");
var selDay = document.getElementById("day");
var selHour = document.getElementById("hour");
var champNom = document.getElementById("name");
var recap = document.getElementById("recap");
var envoyer = document.getElementById("send");

/* =====================================================
   3. FONCTIONS UTILES
   ===================================================== */
// 15000 devient "15 000 FCFA"
function fmt(n) {
  return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
}
// Une date écrite en français : "samedi 7 novembre"
function dateFr(d) {
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

/* =====================================================
   4. CARTES DE PRESTATIONS ET MENU DÉROULANT
   ===================================================== */
services.forEach(function (s, i) {
  // Une carte par prestation
  var carte = document.createElement("div");
  carte.className = "card";
  carte.innerHTML =
    "<h3>" + s.n + "</h3><small>" + s.d + "</small>" +
    '<div class="price">' + fmt(s.p) + "</div><button>Choisir</button>";

  // Clic sur "Choisir" : on sélectionne la prestation dans le formulaire
  // puis on fait défiler la page jusqu'à la réservation
  carte.querySelector("button").onclick = function () {
    selService.value = i;
    majRecap();
    document.getElementById("reservation").scrollIntoView({ behavior: "smooth" });
  };
  liste.appendChild(carte);

  // On ajoute aussi la prestation au menu déroulant du formulaire
  selService.add(new Option(s.n + " – " + fmt(s.p), i));
});

/* =====================================================
   5. JOURS ET HEURES PROPOSÉS
   On propose les 10 prochains jours ouverts (dimanche sauté : salon fermé).
   ===================================================== */
var jours = [];
for (var k = 0; jours.length < 10; k++) {
  var d = new Date();
  d.setDate(d.getDate() + k);       // aujourd'hui + k jours
  if (d.getDay() === 0) continue;   // getDay() vaut 0 le dimanche : on saute
  jours.push(dateFr(d));
}
jours.forEach(function (j) { selDay.add(new Option(j, j)); });
heures.forEach(function (h) { selHour.add(new Option(h, h)); });

/* =====================================================
   6. RÉSUMÉ ET LIEN WHATSAPP (mis à jour à chaque changement)
   ===================================================== */
function majRecap() {
  var s = services[selService.value];
  var nom = champNom.value.trim();

  // Résumé affiché à l'écran
  recap.textContent = s.n + " (" + fmt(s.p) + "), le " + selDay.value + " à " + selHour.value + ".";

  // Message préparé pour WhatsApp ("\n" = retour à la ligne)
  var message =
    "Bonjour, je voudrais réserver :\n" +
    s.n + " (à partir de " + fmt(s.p) + ")\n" +
    "Le " + selDay.value + " à " + selHour.value + "\n" +
    "Prénom : " + (nom || "…");

  // encodeURIComponent adapte le texte pour qu'il passe dans une adresse web
  envoyer.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(message);
}

// Mise à jour quand on change un menu ou qu'on tape le prénom
[selService, selDay, selHour].forEach(function (el) { el.onchange = majRecap; });
champNom.oninput = majRecap;
majRecap(); // premier affichage au chargement
