/* =====================================================
   1. RÉGLAGES À MODIFIER POUR CHAQUE CLIENT
   ===================================================== */
// Numéro WhatsApp de l'accueil : indicatif (237) + numéro, sans espace ni "+"
var PHONE = "237652508451"; // à remplacer par le vrai numéro

// Spécialités. n = nom, d = détail, p = prix de consultation (FCFA), e = emoji
var services = [
  { n: "Médecine générale", d: "Consultation adulte",         p: 5000,  e: "🩺" },
  { n: "Pédiatrie",         d: "Enfants de 0 à 15 ans",       p: 6000,  e: "🧒" },
  { n: "Gynécologie",       d: "Suivi et maternité",          p: 10000, e: "🤰" },
  { n: "Dentaire",          d: "Soins et détartrage",         p: 8000,  e: "🦷" },
  { n: "Laboratoire",       d: "Analyses sur place",          p: 3000,  e: "🧪" },
  { n: "Échographie",       d: "Sur rendez-vous",             p: 15000, e: "📋" }
];

// Heures de rendez-vous proposées
var heures = ["7h30", "8h30", "9h30", "10h30", "11h30", "14h00", "15h00", "16h00", "17h00", "18h00"];

// Horaires d'ouverture : [heure d'ouverture, heure de fermeture] pour chaque jour
// L'ordre suit getDay() : 0 = dimanche, 1 = lundi … 6 = samedi
var horaires = [[9, 13], [7, 20], [7, 20], [7, 20], [7, 20], [7, 20], [7, 20]];

/* =====================================================
   2. ÉLÉMENTS DE LA PAGE
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
// 5000 devient "5 000 FCFA"
function fmt(n) {
  return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
}
// Date en français : "lundi 2 novembre"
function dateFr(d) {
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

/* =====================================================
   4. BADGE "OUVERT / FERMÉ"
   On compare l'heure actuelle aux horaires du jour.
   ===================================================== */
function majStatut() {
  var now = new Date();
  var h = now.getHours() + now.getMinutes() / 60;  // ex. 14h30 devient 14.5
  var plage = horaires[now.getDay()];
  var badge = document.getElementById("status");
  var ouvert = h >= plage[0] && h < plage[1];

  badge.className = "badge " + (ouvert ? "open" : "closed");
  badge.textContent = ouvert
    ? "Ouvert maintenant · jusqu’à " + plage[1] + "h"
    : "Consultations fermées · urgences 24h/24";
}
majStatut();

/* =====================================================
   5. CARTES DES SPÉCIALITÉS ET MENU DÉROULANT
   ===================================================== */
services.forEach(function (s, i) {
  var carte = document.createElement("div");
  carte.className = "card";
  carte.innerHTML =
    '<div class="ico">' + s.e + "</div>" +
    "<h3>" + s.n + "</h3><small>" + s.d + "</small>" +
    '<div class="price">' + fmt(s.p) + "</div><button>Prendre rendez-vous</button>";

  // Clic : on choisit la spécialité dans le formulaire et on descend jusqu'à lui
  carte.querySelector("button").onclick = function () {
    selService.value = i;
    majRecap();
    document.getElementById("rdv").scrollIntoView({ behavior: "smooth" });
  };
  liste.appendChild(carte);
  selService.add(new Option(s.n + " – " + fmt(s.p), i));
});

/* =====================================================
   6. JOURS ET HEURES PROPOSÉS
   10 prochains jours, sans les dimanches (rendez-vous du lundi au samedi).
   ===================================================== */
var jours = [];
for (var k = 0; jours.length < 10; k++) {
  var d = new Date();
  d.setDate(d.getDate() + k);
  if (d.getDay() === 0) continue;   // on saute le dimanche
  jours.push(dateFr(d));
}
jours.forEach(function (j) { selDay.add(new Option(j, j)); });
heures.forEach(function (h) { selHour.add(new Option(h, h)); });

/* =====================================================
   7. RÉSUMÉ ET LIEN WHATSAPP
   ===================================================== */
function majRecap() {
  var s = services[selService.value];
  var nom = champNom.value.trim();

  recap.textContent = s.n + ", le " + selDay.value + " à " + selHour.value + ".";

  var message =
    "Bonjour, je souhaite un rendez-vous :\n" +
    "Spécialité : " + s.n + "\n" +
    "Le " + selDay.value + " à " + selHour.value + "\n" +
    "Nom du patient : " + (nom || "…");

  envoyer.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(message);
}

[selService, selDay, selHour].forEach(function (el) { el.onchange = majRecap; });
champNom.oninput = majRecap;
majRecap();
