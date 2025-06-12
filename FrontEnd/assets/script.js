// import {userListenerLogin} from "./login_script.js";

let token = window.sessionStorage.getItem("token");
console.log("token", token);


if (token !== null) {
    import("./modal.js").then(module => {
        const { createModal } = module;

        const blockLink = document.createElement("div");
        blockLink.classList.add("admin-block"); // Tu peux styliser ce bloc en CSS

        const adminLink = document.createElement("a");
        adminLink.innerText = "Modifier";
        adminLink.href = "#";
        adminLink.classList.add("admin-link");
        adminLink.addEventListener("click", (e) => {
            e.preventDefault();
            createModal();
        });

        const infoLink = document.createElement("i");
        infoLink.classList.add("fa-solid", "fa-pen-to-square");

        blockLink.appendChild(infoLink);
        blockLink.appendChild(adminLink);

        const sectionWorks = document.querySelector("#portfolio");
        if (sectionWorks) {
            sectionWorks.appendChild(blockLink);
        }
    });
}




document.addEventListener("DOMContentLoaded", async () => {
    try {

        const reponse = await fetch("http://localhost:5678/api/works");
        const works = await reponse.json();
        console.log("Réponse API (works) :", works);

        const sectionWorks = document.querySelector(".gallery");


        function afficherWorks(worksFiltrés) {
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

        // Affiche tous les projets au départ
        afficherWorks(works);

        // Récupération des catégories
        const reponsCategories = await fetch("http://localhost:5678/api/categories");
        const categories = await reponsCategories.json();
        console.log("Réponse API (categories) :", categories);

        const sectionPortfolio = document.getElementById("portfolio");

        // Bouton "Tous"
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


        // Boutons pour chaque catégorie
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

