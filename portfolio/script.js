/* =====================================================
   1. RÉGLAGES À MODIFIER
   ===================================================== */
// TON numéro WhatsApp : indicatif (237) + numéro, sans espace ni "+"
var PHONE = "237652508451"; // à remplacer par ton vrai numéro

// Technologies affichées en pastilles
var technos = ["HTML", "CSS", "JavaScript", "React", "Next.js", "NestJS", "Tailwind CSS"];

// Tes projets.
//   t = titre, k = type ("client" ou "demo"), d = description,
//   s = technologies, i = capture d'écran (dossier images/, facultative),
//   u = adresse du site en ligne (à remplir quand tu l'auras mis sur Netlify ou Vercel)
var projets = [
  { t: "Manga Deco", k: "client",
    d: "Site d'une boutique de décoration (carrefour Mec) : rideaux, voilages, tringles et pots de fleurs, avec catalogue filtrable et demande de prix sur WhatsApp.",
    s: "HTML · CSS · JavaScript", i: "manga-deco.jpg", u: "" },
  { t: "Le Braisé du Mfoundi", k: "demo",
    d: "Site de restaurant avec menu en FCFA, choix des plats et commande envoyée sur WhatsApp.",
    s: "HTML · CSS · JavaScript", i: "restaurant.jpg", u: "" },
  { t: "Salon Reine Ngono", k: "demo",
    d: "Site de salon de coiffure avec tarifs, galerie et réservation de créneau par WhatsApp.",
    s: "HTML · CSS · JavaScript", i: "salon.jpg", u: "" },
  { t: "Clinique Sainte-Lumière", k: "demo",
    d: "Site de clinique avec badge ouvert/fermé automatique et prise de rendez-vous.",
    s: "HTML · CSS · JavaScript", i: "clinique.jpg", u: "" },
  { t: "Académie Horizon", k: "demo",
    d: "Site de centre de formation avec prochaine rentrée calculée automatiquement et inscription.",
    s: "HTML · CSS · JavaScript", i: "ecole.jpg", u: "" },
  { t: "Stéphane IA", k: "demo",
    d: "Application web complète : inscription, connexion, puis questions posées à une IA qui répond.",
    s: "React · NestJS · Tailwind CSS", i: "application-ia.jpg", u: "" },
  { t: "Boutique de vêtements", k: "demo",
    d: "Site e-commerce vitrine pour une boutique de vêtements.",
    s: "React · Tailwind CSS", i: "boutique-vetements.jpg", u: "" }
];

/* =====================================================
   2. FONCTION : lien WhatsApp avec un message déjà écrit
   encodeURIComponent adapte le texte pour qu'il passe dans une adresse web.
   ===================================================== */
function wa(texte) {
  return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(texte);
}

/* =====================================================
   3. AFFICHAGE DES TECHNOLOGIES
   ===================================================== */
var zoneSkills = document.getElementById("skills");
technos.forEach(function (t) {
  var pastille = document.createElement("span");
  pastille.textContent = t;
  zoneSkills.appendChild(pastille);
});

/* =====================================================
   3 bis. AGRANDISSEMENT DES PHOTOS
   Un clic sur une capture l'ouvre en grand sur fond sombre.
   Un clic n'importe où (ou la touche Échap) la referme.
   ===================================================== */
var boite = document.createElement("div");
boite.className = "lightbox";
boite.innerHTML = '<img alt="">';
document.body.appendChild(boite);

function ouvrir(src, alt) {
  var grande = boite.querySelector("img");
  grande.src = src;
  grande.alt = alt;
  boite.classList.add("on");   // la classe "on" rend la fenêtre visible
}
boite.onclick = function () { boite.classList.remove("on"); };
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") boite.classList.remove("on");
});

/* =====================================================
   4. AFFICHAGE DES PROJETS
   Une carte par projet : image (ou dégradé), étiquette, texte, lien.
   ===================================================== */
var grille = document.getElementById("grid");
projets.forEach(function (p) {
  var carte = document.createElement("article");
  carte.className = "card";

  // Dégradé avec le titre : sert quand il n'y a pas de capture d'écran
  var secours = '<div class="noimg">' + p.t + "</div>";

  // Capture d'écran du dossier images/ si le projet en a une, sinon le dégradé
  var visuel = p.i
    ? '<img src="images/' + p.i + '" alt="Aperçu du site ' + p.t + '" loading="lazy">'
    : secours;

  // Étiquette verte "Client réel" ou grise "Démonstration"
  var etiquette = p.k === "client"
    ? '<span class="tag">Client réel</span>'
    : '<span class="tag demo">Démonstration</span>';

  // Si l'adresse du site est remplie : lien actif. Sinon : texte grisé
  var lien = p.u
    ? '<a class="go" href="' + p.u + '" target="_blank" rel="noopener">Voir le site ›</a>'
    : '<span class="go off">Démo bientôt en ligne</span>';

  carte.innerHTML = visuel +
    '<div class="body">' + etiquette + "<h3>" + p.t + "</h3><p>" + p.d + '</p><div class="tech">' + p.s + "</div>" + lien + "</div>";

  // Si le fichier image est introuvable (pas encore ajouté), on remet le dégradé
  var image = carte.querySelector("img");
  if (image) image.onerror = function () { image.outerHTML = secours; };
  // Clic sur la capture : on l'affiche en grand
  if (image) {
    image.title = "Cliquer pour agrandir";
    image.onclick = function () { ouvrir(image.src, image.alt); };
  }

  grille.appendChild(carte);
});

/* =====================================================
   5. BOUTONS WHATSAPP
   Tous les boutons marqués data-wa ouvrent WhatsApp avec un message prêt.
   ===================================================== */
document.querySelectorAll("[data-wa]").forEach(function (a) {
  a.href = wa("Bonjour, j’ai vu votre portfolio et j’aimerais un site web pour mon activité.");
  a.target = "_blank";
  a.rel = "noopener";
});
