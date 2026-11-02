/* ===== Manga Deco – script =====
   À MODIFIER : les numéros et la liste des articles ci-dessous. */

const TELEPHONE = "237695515155";   // numéro WhatsApp (indicatif 237 + numéro)

// Chaque article : titre, catégorie, texte court, photo (mettre le fichier dans le dossier images/)
const ARTICLES = [
  { titre: "Rideaux de salon",       cat: "Rideaux",  texte: "Des rideaux épais pour habiller les grandes fenêtres du salon.", photo: "rideau-1.jpg" },
  { titre: "Rideaux de chambre",     cat: "Rideaux",  texte: "Pour garder la chambre calme, sombre et agréable.",              photo: "rideau-2.jpg" },
  { titre: "Rideaux pour fenêtres",  cat: "Rideaux",  texte: "Un large choix de tissus et de couleurs pour chaque pièce.",      photo: "rideau-3.jpg" },
  { titre: "Voilages légers",        cat: "Voilages", texte: "Ils laissent entrer la lumière du jour tout en gardant l'intimité.", photo: "voilage-1.jpg" },
  { titre: "Voilages de salon",      cat: "Voilages", texte: "Un rendu doux et lumineux pour les grandes pièces.",              photo: "voilage-2.jpg" },
  { titre: "Voilages de chambre",    cat: "Voilages", texte: "À associer avec vos rideaux pour une fenêtre bien habillée.",     photo: "voilage-3.jpg" },
  { titre: "Tringles",               cat: "Tringles", texte: "Des tringles solides pour bien suspendre vos rideaux.",           photo: "tringle-1.jpg" },
  { titre: "Tringles et anneaux",    cat: "Tringles", texte: "Anneaux et supports pour faire glisser les rideaux facilement.",  photo: "tringle-2.jpg" },
  { titre: "Embrasses et crochets",  cat: "Tringles", texte: "Les petits accessoires qui finissent un beau rideau.",            photo: "tringle-3.jpg" },
  { titre: "Plantes d'intérieur",    cat: "Plantes",  texte: "Des plantes pour donner de la vie à chaque pièce.",               photo: "plante-1.jpg" },
  { titre: "Pots en céramique",      cat: "Plantes",  texte: "Des pots de fleurs pour l'intérieur, la terrasse ou l'entrée.",   photo: "plante-2.jpg" },
  { titre: "Plantes et grands pots", cat: "Plantes",  texte: "Pour décorer le salon, la cour ou la terrasse.",                  photo: "plante-3.jpg" }
];
const CATEGORIES = ["Tout", "Rideaux", "Voilages", "Tringles", "Plantes"];

const grille = document.getElementById("grille");
const filtres = document.getElementById("filtres");

function wa(texte) {
  return "https://wa.me/" + TELEPHONE + "?text=" + encodeURIComponent(texte);
}

// Affiche les cartes de la catégorie choisie
function afficher(cat) {
  grille.innerHTML = "";
  ARTICLES.filter(a => cat === "Tout" || a.cat === cat).forEach(a => {
    const carte = document.createElement("article");
    carte.className = "carte";
    carte.innerHTML =
      '<div class="vignette"><img src="images/' + a.photo + '" alt="' + a.titre + '" loading="lazy"></div>' +
      '<div class="carte-corps"><h3>' + a.titre + '</h3><p>' + a.texte + '</p>' +
      '<a href="' + wa("Bonjour Manga Deco, je suis intéressé(e) par : " + a.titre + ". Pouvez-vous me donner le prix et la disponibilité ?") +
      '" target="_blank" rel="noopener">Demander sur WhatsApp</a></div>';
    // Si la photo n'existe pas encore, on garde un motif à la place
    carte.querySelector("img").addEventListener("error", e => e.target.parentNode.classList.add("vide"));
    grille.appendChild(carte);
  });
}

// Boutons de catégories
CATEGORIES.forEach(cat => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = cat;
  b.setAttribute("aria-pressed", cat === "Tout");
  b.addEventListener("click", () => {
    filtres.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    afficher(cat);
  });
  filtres.appendChild(b);
});
afficher("Tout");

// Photo de la boutique manquante : on garde le motif
const pb = document.querySelector("#photoBoutique img");
pb.addEventListener("error", () => pb.parentNode.classList.add("vide"));

// Formulaire -> message WhatsApp
document.getElementById("formulaire").addEventListener("submit", e => {
  e.preventDefault();
  const nom = document.getElementById("nom").value.trim();
  const sujet = document.getElementById("sujet").value;
  const msg = document.getElementById("msg").value.trim();
  let texte = "Bonjour Manga Deco, je m'appelle " + nom + ". Je suis intéressé(e) par : " + sujet + ".";
  if (msg) texte += " " + msg;
  window.open(wa(texte), "_blank");
});

document.getElementById("annee").textContent = new Date().getFullYear();
