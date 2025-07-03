// main.js
import { store } from "./scripts/store.js";
import { renderGallery } from "./scripts/gallery.js";

// __________________________________________________________
//  zone contenant le code dedié aux differente logique metier 

let link = document.getElementById('login');
link.innerHTML = `login`;
link.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "login_page.html";
});

// Fonction d'affichage des projets
function renderGlobalGallery(works) {
    const container = document.querySelector(".gallery");
    renderGallery(works, container);

    const figures = container.querySelectorAll("figure");
    works.forEach((work, i) => {
        const title = document.createElement("figcaption");
        title.innerText = work.title;
        figures[i].appendChild(title);
    });
}

// Mise à jour automatique via store
store.subscribe(() => {
    renderGlobalGallery(store.works);
});

// __________________________________________________________
// zone contenant le code dedié aux differents boutons permettant le filtrage des travaux

document.addEventListener("DOMContentLoaded", async () => {
    const sectionPortfolio = document.getElementById("portfolio");
    let filter;

    try {
        await store.getWorks();
        await store.getCategories();

        // Ajoute la structure HTML du filtre
        sectionPortfolio.innerHTML += `
            <div class="portfolio_filter">
                <button class="btn-all">Tous</button>
            </div>
        `;

        filter = sectionPortfolio.querySelector(".portfolio_filter");

        function resetClikedButtons() {
            const allButtons = filter.querySelectorAll("button");
            allButtons.forEach(btn => btn.classList.remove("button_clicked"));
        }

        // Bouton "Tous"
        const btnAll = filter.querySelector(".btn-all");
        btnAll.id = "tous";
        btnAll.addEventListener("click", (event) => {
            event.preventDefault();
            resetClikedButtons();
            btnAll.classList.add("button_clicked");
            renderGlobalGallery(store.works);
        });

        // Boutons dynamiques selon les catégories
        for (let categorie of store.categories) {
            const btnFilter = document.createElement("button");
            btnFilter.textContent = categorie.name;
            btnFilter.id = categorie.name;

            btnFilter.addEventListener("click", (event) => {
                event.preventDefault();
                resetClikedButtons();
                btnFilter.classList.add("button_clicked");
                const worksByCategory = store.works.filter(work => work.categoryId === categorie.id);
                renderGlobalGallery(worksByCategory);
            });

            filter.appendChild(btnFilter);
        }

        // __________________________________________________________
        // zone contenant le code dédié au mode admin

        const token = window.sessionStorage.getItem("token");
        console.log("token", token);
        const body = document.querySelector("body");
        const conteneurInHeader = document.getElementById('conteneur_in_header')
        const main = document.querySelector("main");


        if (token !== null) {
            body.classList.add("body-admin");
            conteneurInHeader.classList.add("padding-admin");
            main.classList.add("padding-admin");
            link.innerHTML = `logout`;
            // Supprimer les filtres 
            filter.remove();


            // Ajout de la barre d'édition
            const adminNav = document.createElement("div");
            adminNav.classList.add("admin_nav");
            adminNav.innerHTML += `
                <i class="fa-solid fa-pen-to-square"></i>
                <p>Mode édition</p>
            `;
            const header = document.querySelector("header");
            header.classList.add("header_admin");
            header.appendChild(adminNav);

            // Chargement du module modal.js
            import("./scripts/modal.js").then(module => {
                const { adminMode } = module;
                adminMode();
            }).catch(error => {
                console.error("Erreur lors du chargement du module modal.js :", error);
            });
        }

    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
});
