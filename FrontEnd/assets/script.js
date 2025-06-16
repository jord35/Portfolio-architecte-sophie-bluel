import { getWorks, getCategories } from "./api.js";

const sectionWorks = document.querySelector(".gallery");

export function afficherWorks(worksFiltrés) {
    sectionWorks.innerHTML = ""; // Vide la galerie
    for (let work of worksFiltrés) {
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;

        const nomElement = document.createElement("figcaption");
        nomElement.innerText = work.title;

        workElement.appendChild(imageElement);
        workElement.appendChild(nomElement);
        sectionWorks.appendChild(workElement);
    }
}

let token = window.sessionStorage.getItem("token");
console.log("token", token);

if (token !== null) {
    import("./modal.js").then(module => {
        const { adminMode } = module;
        adminMode();
    }).catch(error => {
        console.error("Erreur lors du chargement du module modal.js :", error);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const works = await getWorks();
        const categories = await getCategories();

        // Affiche tous les projets au départ
        afficherWorks(works);

        const sectionPortfolio = document.getElementById("portfolio");

        // Filtres
        const filter = document.createElement("div");
        filter.className = "portfolio_filter";
        sectionPortfolio.appendChild(filter);

        const btnTous = document.createElement("button");
        btnTous.textContent = "Tous";
        btnTous.addEventListener("click", (event) => {
            event.preventDefault();
            afficherWorks(works);
        });
        filter.appendChild(btnTous);

        for (let categorie of categories) {
            const btnFilter = document.createElement("button");
            btnFilter.textContent = categorie.name;

            btnFilter.addEventListener("click", (event) => {
                event.preventDefault();
                const worksFiltres = works.filter(work => work.categoryId === categorie.id);
                afficherWorks(worksFiltres);
                console.log("Catégorie sélectionnée :", categorie.name);
            });

            filter.appendChild(btnFilter);
        }

    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
});
