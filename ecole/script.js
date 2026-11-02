/* =====================================================
   1. RÉGLAGES À MODIFIER POUR CHAQUE CLIENT
   ===================================================== */
// Numéro WhatsApp du secrétariat : indicatif (237) + numéro, sans espace ni "+"
var PHONE = "237652508451"; // à remplacer par le vrai numéro

// Formations. n = nom, d = durée, p = prix par mois (FCFA), c = couleur du trait de la carte
var formations = [
  { n: "Développement web",      d: "4 mois · HTML, CSS, JavaScript",  p: 25000, c: "#2346d6" },
  { n: "Bureautique et secrétariat", d: "3 mois · Word, Excel, courrier", p: 15000, c: "#ff8a1f" },
  { n: "Anglais professionnel",  d: "3 mois · du débutant à l’avancé", p: 12000, c: "#14a37f" },
  { n: "Comptabilité",           d: "5 mois · bases et logiciel",      p: 20000, c: "#8a4fff" },
  { n: "Marketing digital",      d: "3 mois · réseaux sociaux, pub",   p: 20000, c: "#e0348a" },
  { n: "Soutien scolaire",       d: "Au mois · collège et lycée",      p: 10000, c: "#0f1f5c" }
];

/* =====================================================
   2. ÉLÉMENTS DE LA PAGE
   ===================================================== */
var liste = document.getElementById("list");
var selService = document.getElementById("service");
var selDay = document.getElementById("day");
var selLevel = document.getElementById("level");
var champNom = document.getElementById("name");
var recap = document.getElementById("recap");
var envoyer = document.getElementById("send");

/* =====================================================
   3. FONCTIONS UTILES
   ===================================================== */
// 25000 devient "25 000 FCFA"
function fmt(n) {
  return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
}
// Date en français : "lundi 2 novembre"
function dateFr(d) {
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

/* =====================================================
   4. DATES DE RENTRÉE
   La rentrée a lieu le premier lundi de chaque mois.
   Cette fonction renvoie les 4 prochaines.
   ===================================================== */
function prochainesRentrees(nb) {
  var res = [];
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  while (res.length < nb) {
    d.setDate(d.getDate() + 1);                         // on avance jour après jour
    if (d.getDay() === 1 && d.getDate() <= 7) {         // lundi ET dans les 7 premiers jours du mois
      res.push(new Date(d));                            // on garde une copie de la date
    }
  }
  return res;
}
var rentrees = prochainesRentrees(4);

// Autocollant de l'en-tête : première rentrée + nombre de jours restants
var jours = Math.ceil((rentrees[0] - new Date()) / 86400000); // 86 400 000 ms = 1 jour
document.getElementById("rentree").textContent = dateFr(rentrees[0]);
document.getElementById("countdown").textContent = "dans " + jours + (jours > 1 ? " jours" : " jour");

/* =====================================================
   5. CARTES DES FORMATIONS ET MENUS DÉROULANTS
   ===================================================== */
formations.forEach(function (f, i) {
  var carte = document.createElement("div");
  carte.className = "card";
  carte.style.setProperty("--c", f.c);                  // couleur du trait en haut de la carte
  carte.innerHTML =
    "<h3>" + f.n + "</h3><small>" + f.d + "</small>" +
    '<div class="price">' + fmt(f.p) + " <span>/ mois</span></div><button>Je m’inscris</button>";

  // Clic : on choisit la formation dans le formulaire et on descend jusqu'à lui
  carte.querySelector("button").onclick = function () {
    selService.value = i;
    majRecap();
    document.getElementById("inscription").scrollIntoView({ behavior: "smooth" });
  };
  liste.appendChild(carte);
  selService.add(new Option(f.n + " – " + fmt(f.p) + "/mois", i));
});

rentrees.forEach(function (r) { selDay.add(new Option(dateFr(r), dateFr(r))); });

/* =====================================================
   6. RÉSUMÉ ET LIEN WHATSAPP
   ===================================================== */
function majRecap() {
  var f = formations[selService.value];
  var nom = champNom.value.trim();

  recap.textContent = f.n + ", rentrée du " + selDay.value + " (niveau " + selLevel.value.toLowerCase() + ").";

  var message =
    "Bonjour, je souhaite m’inscrire :\n" +
    "Formation : " + f.n + "\n" +
    "Rentrée : " + selDay.value + "\n" +
    "Niveau : " + selLevel.value + "\n" +
    "Nom : " + (nom || "…");

  envoyer.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(message);
}

[selService, selDay, selLevel].forEach(function (el) { el.onchange = majRecap; });
champNom.oninput = majRecap;
majRecap();
