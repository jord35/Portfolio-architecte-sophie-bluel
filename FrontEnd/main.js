// main.js
import { store } from "./scripts/store.js";
import { renderGallery } from "./scripts/gallery.js";

const sectionWorks = document.querySelector(".gallery");

// Affichage des projets dans la galerie principale
function renderGlobalGallery(works) {
    const container = document.querySelector(".gallery");
    renderGallery(works, container);

    // Ajoute les titres 
    const figures = container.querySelectorAll("figure");
    works.forEach((work, i) => {
        const title = document.createElement("figcaption");
        title.innerText = work.title;
        figures[i].appendChild(title);
    });
}

// Mise à jour automatique de la galerie quand les données changent dans le store
store.subscribe(() => {
    renderGlobalGallery(store.works);
});

let token = window.sessionStorage.getItem("token");
console.log("token", token);

// Si connecté, charge le mode admin
if (token !== null) {
    import("./scripts/modal.js").then(module => {
        const { adminMode } = module;
        adminMode();
    }).catch(error => {
        console.error("Erreur lors du chargement du module modal.js :", error);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await store.getWorks();
        await store.getCategories();

        const sectionPortfolio = document.getElementById("portfolio");

        // Structure de base via innerHTML
        sectionPortfolio.innerHTML += `
  <div class="portfolio_filter">
    <button class="btn-tous">Tous</button>
  </div>
`;

        const filter = sectionPortfolio.querySelector(".portfolio_filter");

        // Bouton "Tous"
        const btnTous = filter.querySelector(".btn-tous");
        btnTous.addEventListener("click", (event) => {
            event.preventDefault();
            renderGlobalGallery(store.works);
        });

        // Boutons dynamiques 
        for (let categorie of store.categories) {
            const btnFilter = document.createElement("button");
            btnFilter.textContent = categorie.name;

            btnFilter.addEventListener("click", (event) => {
                event.preventDefault();
                const worksByCategory = store.works.filter(work => work.categoryId === categorie.id);
                renderGlobalGallery(worksByCategory);
            });

            filter.appendChild(btnFilter);
        }

    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
});