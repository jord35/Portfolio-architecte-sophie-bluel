import { store } from "./store.js";

const sectionWorks = document.querySelector(".gallery");

// Affichage des projets dans la galerie principale
export function afficherWorks(worksFiltrés) { // _________________________________________________________________________________ as modifier 
    sectionWorks.innerHTML = "";
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

// Mise à jour automatique de la galerie quand les données changent dans le store
store.subscribe(() => {
    afficherWorks(store.works);// _________________________________________________________________________________ as modifier 
});

let token = window.sessionStorage.getItem("token");
console.log("token", token);

// Si connecté, charge le mode admin
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
        await store.getWorks();
        await store.getCategories();

        const sectionPortfolio = document.getElementById("portfolio");

        // Création des boutons de filtre
        const filter = document.createElement("div");
        filter.className = "portfolio_filter";
        sectionPortfolio.appendChild(filter);

        // Bouton "Tous"
        const btnTous = document.createElement("button");
        btnTous.textContent = "Tous";
        btnTous.addEventListener("click", (event) => {
            event.preventDefault();
            afficherWorks(store.works);// _________________________________________________________________________________ as modifier 
        });
        filter.appendChild(btnTous);

        // Boutons par catégorie
        for (let categorie of store.categories) {
            const btnFilter = document.createElement("button");
            btnFilter.textContent = categorie.name;

            btnFilter.addEventListener("click", (event) => {
                event.preventDefault();
                const worksFiltres = store.works.filter(work => work.categoryId === categorie.id);
                afficherWorks(worksFiltres);// _________________________________________________________________________________ as modifier 
                console.log("Catégorie sélectionnée :", categorie.name);
            });

            filter.appendChild(btnFilter);
        }

    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
});
