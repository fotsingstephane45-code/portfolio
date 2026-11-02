/* =====================================================
   1. RÉGLAGES À MODIFIER POUR CHAQUE CLIENT
   ===================================================== */

// Numéro WhatsApp du restaurant : indicatif du pays (237) + numéro, sans espace ni "+"
var PHONE = "237600000000"; // à remplacer par le vrai numéro du client

// Liste des plats. Pour ajouter un plat, copie une ligne et change les valeurs.
//   n = nom, d = description, p = prix en FCFA, c = catégorie,
//   i = chemin de la photo (facultatif), a = description de la photo
var items = [
  { n: "Poisson braisé (tilapia)", c: "Grillades",     d: "Mariné aux épices, avec plantain et sauce pimentée", p: 3500, i: "images/poisson-braise.jpg", a: "Poisson braisé avec plantain" },
  { n: "Poulet braisé (entier)",   c: "Grillades",     d: "Rôti doré, mariné pendant la nuit",                  p: 6000, i: "images/poulet-braise.jpg",  a: "Poulet braisé entier" },
  { n: "Dorade au four",           c: "Grillades",     d: "Pommes de terre et romarin",                         p: 5000, i: "images/dorade-four.jpg",    a: "Dorade au four avec pommes de terre" },
  { n: "Soya de bœuf",             c: "Grillades",     d: "Brochettes pimentées, portion de 5",                 p: 1500, i: "images/soya-boeuf.jpg",     a: "Brochettes de bœuf grillées aux poivrons" },
  { n: "Ndolé et plantain",        c: "Plats du pays", d: "Crevettes, miondo et plantain mûr",                  p: 3000, i: "images/ndole-plantain.jpg", a: "Ndolé aux crevettes avec plantain et miondo" },
  { n: "Eru",                      c: "Plats du pays", d: "Feuilles d’eru et waterleaf mijotées à l’huile de palme, avec fufu", p: 3000, i: "images/eru.jpg",  a: "Eru avec fufu" },
  { n: "Ekok",                     c: "Plats du pays", d: "Spécialité cuite à l’étouffée dans des feuilles de bananier",       p: 2500, i: "images/ekok.jpg", a: "Ekok en feuilles de bananier" },
  { n: "Koki",                     c: "Plats du pays", d: "Pâte de haricots à l’huile de palme, cuite en feuilles, avec plantain mûr", p: 2000, i: "images/koki.jpg", a: "Koki avec plantain mûr" },
  { n: "Taro sauce jaune",         c: "Plats du pays", d: "Taro pilé et sauce jaune à l’huile de palme",        p: 3500, i: "images/taro.jpg",           a: "Taro sauce jaune" },
  { n: "Jus d’orange frais",       c: "Boissons",      d: "Pressé à la commande, bouteille de 50 cl",           p: 500,  i: "images/jus-orange.jpg",     a: "Verre de jus d’orange avec glaçons" },
  { n: "Jus d’ananas frais",      c: "Boissons",      d: "Ananas pressé à la commande, bouteille de 50 cl",    p: 500,  i: "images/jus-ananas.jpg",     a: "Verre de jus d’ananas frais" },
  { n: "Jus de gingembre",         c: "Boissons",      d: "Gingembre frais, citron et un peu de sucre, 50 cl",  p: 500,  i: "images/jus-gingembre.jpg",  a: "Bouteille de jus de gingembre" }
];

// Catégories affichées en boutons au-dessus du menu
var categories = ["Tout", "Grillades", "Plats du pays", "Boissons"];

/* =====================================================
   2. VARIABLES DU PROGRAMME
   ===================================================== */

// q = quantités : un nombre par plat, tous à 0 au départ.
// Exemple : [0, 2, 0, 0, 1, 0…] = 2 poulets et 1 ndolé commandés.
var q = items.map(function () { return 0; });

// On récupère dans la page le bloc vide où afficher le menu
var board = document.getElementById("board");
var filtres = document.getElementById("filtres");

/* =====================================================
   3. FONCTIONS UTILES
   ===================================================== */

// Écrit un prix proprement : 3500 devient "3 500 FCFA"
function fmt(n) {
  return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
}

// Fabrique le lien WhatsApp avec le message déjà écrit.
// encodeURIComponent transforme le texte pour qu'il passe dans une adresse web.
function wa(texte) {
  return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(texte);
}

/* =====================================================
   4. AFFICHAGE DU MENU
   On parcourt la liste des plats et on crée une carte pour chacun.
   forEach = "pour chaque plat" ; it = le plat, i = sa position (0, 1, 2…)
   ===================================================== */
var cartes = []; // on garde les cartes pour pouvoir les cacher avec les filtres

items.forEach(function (it, i) {
  var carte = document.createElement("article");
  carte.className = "card";

  // On écrit le HTML de la carte. Si la photo n'existe pas, un motif s'affiche à la place.
  carte.innerHTML =
    '<div class="photo">' + (it.i ? '<img src="' + it.i + '" alt="' + it.a + '" loading="lazy">' : "") + "</div>" +
    '<div class="t"><h3>' + it.n + "</h3><small>" + it.d + "</small></div>" +
    '<div class="bas"><div class="price">' + fmt(it.p) + "</div>" +
    '<div class="qty"><button aria-label="Retirer">–</button><span>0</span><button aria-label="Ajouter">+</button></div></div>';

  // Photo introuvable : on affiche le motif "Photo à ajouter"
  var img = carte.querySelector("img");
  if (img) img.addEventListener("error", function () { img.parentNode.classList.add("vide"); });
  else carte.querySelector(".photo").classList.add("vide");

  var boutons = carte.querySelectorAll("button"); // [bouton –, bouton +]
  var affichage = carte.querySelector("span");    // le chiffre entre les deux boutons

  // Clic sur "–" : on retire 1, mais jamais en dessous de 0
  boutons[0].onclick = function () {
    if (q[i] > 0) {
      q[i]--;
      affichage.textContent = q[i];
      majPanier();
    }
  };

  // Clic sur "+" : on ajoute 1
  boutons[1].onclick = function () {
    q[i]++;
    affichage.textContent = q[i];
    majPanier();
  };

  cartes.push(carte);
  board.appendChild(carte); // on place la carte dans la grille du menu
});

// Boutons de catégories : un clic cache les plats des autres catégories.
// Les quantités déjà choisies sont conservées.
categories.forEach(function (cat) {
  var b = document.createElement("button");
  b.type = "button";
  b.textContent = cat;
  b.setAttribute("aria-pressed", cat === "Tout");
  b.onclick = function () {
    filtres.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
    cartes.forEach(function (carte, i) {
      carte.hidden = !(cat === "Tout" || items[i].c === cat);
    });
  };
  filtres.appendChild(b);
});

/* =====================================================
   5. MISE À JOUR DE LA BARRE DE COMMANDE
   Appelée à chaque clic sur + ou –.
   ===================================================== */
function majPanier() {
  var total = 0;     // montant total en FCFA
  var nb = 0;        // nombre d'articles
  var lignes = [];   // lignes du message WhatsApp

  // On parcourt les plats et on garde seulement ceux commandés (quantité > 0)
  items.forEach(function (it, i) {
    if (q[i]) {
      total += q[i] * it.p;
      nb += q[i];
      lignes.push(q[i] + " × " + it.n);
    }
  });

  // La barre rouge s'affiche s'il y a au moins 1 article (classe "on" = visible)
  document.getElementById("cart").classList.toggle("on", nb > 0);

  // Texte de la barre : "3 articles · 11 500 FCFA"
  document.getElementById("sum").textContent =
    nb + (nb > 1 ? " articles · " : " article · ") + fmt(total);

  // Message envoyé au restaurant. "\n" = retour à la ligne
  document.getElementById("send").href = wa(
    "Bonjour, je voudrais commander :\n" +
    lignes.join("\n") +
    "\nTotal : " + fmt(total) +
    "\nMon adresse de livraison : "
  );
}

/* =====================================================
   6. BOUTON WHATSAPP DE L'EN-TÊTE
   Pour une simple question, sans commande
   ===================================================== */
document.getElementById("wa-top").href = wa("Bonjour, j’ai une question.");
