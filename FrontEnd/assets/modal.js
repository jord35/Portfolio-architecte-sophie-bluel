

import { getWorks, getCategories } from "./api.js";

const works = await getWorks();
const categories = await getCategories();



export function adminMode() {
  const modalForAdmin = document.createElement("div");
  modalForAdmin.classList.add("modalForAdmin");

  modalForAdmin.innerHTML = `
    <a href="#modal1" class="js-modal">Ouvrir la boîte modal</a>
    <aside id="modal1" class="modal" aria-hidden="true" role="dialog" aria-labelledby="titlemodal" style="display:none;">
      <div class="modal-wrapper js-modal-stop">
        <button class="js-modal-close">Fermer la boîte modal</button>
        <h2 id="titlemodal">Galerie photo</h2>

        <div class="slide-container show-gallery">
          <div class="slide">
            <div class="js-modal-works modal-works"></div>
            <button class="js-switch-to-form">Ajouter une photo</button>
          </div>
          <div class="slide">
            <div class="js-add-picture"></div>
            <button class="js-switch-to-gallery">← Retour à la galerie</button>
          </div>
        </div>
      </div>
    </aside>
  `;

  document.getElementById("portfolio").appendChild(modalForAdmin);

  const modal = document.getElementById("modal1");
  const closeButton = modal.querySelector(".js-modal-close");
  const openLink = modalForAdmin.querySelector(".js-modal");
  const modalWorks = modal.querySelector(".js-modal-works");
  const slideContainer = modal.querySelector(".slide-container");

  openLink.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = null
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true")
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  });

  const switchToFormBtn = modal.querySelector(".js-switch-to-form");
  const switchToGalleryBtn = modal.querySelector(".js-switch-to-gallery");

  switchToFormBtn.addEventListener("click", () => {
    slideContainer.classList.remove("show-gallery");
    slideContainer.classList.add("show-form");
  });

  switchToGalleryBtn.addEventListener("click", () => {
    slideContainer.classList.remove("show-form");
    slideContainer.classList.add("show-gallery");
  });

  function afficherModalWorks(worksFiltrés) {
    modalWorks.innerHTML = "";

    for (let work of worksFiltrés) {
      const workElement = document.createElement("figure");
      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;
      imageElement.alt = work.title;
      workElement.classList.add("test")
      imageElement.classList.add("modal-img")

      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash");
      trash.style.cursor = "pointer";

      trash.addEventListener("click", async () => {
        const token = window.sessionStorage.getItem("token");

        if (!token) {
          alert("Vous devez être connecté pour supprimer une image.");
          return;
        }

        try {
          const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            workElement.remove();
          } else {
            alert("Erreur lors de la suppression de l’image.");
          }
        } catch (error) {
          console.error("Erreur réseau :", error);
        }
      });

      workElement.appendChild(imageElement);
      workElement.appendChild(trash);
      modalWorks.appendChild(workElement);
    }
  }

  afficherModalWorks(works);

  const addPicture = modal.querySelector(".js-add-picture");
  addPicture.innerHTML = `
    <h2>Ajout d'une photo</h2>
    <form class="js-add-form" enctype="multipart/form-data">
      <div>
        <label for="image">Image :</label>
        <input type="file" id="image" name="image" accept="image/*" required>
      </div>
      <div>
        <label for="title">Titre :</label>
        <input type="text" id="title" name="title" required>
      </div>
      <div>
        <label for="category">Catégorie :</label>
       <select id="category" name="category" required>
        ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join("")}
      </select>
      </div>
      <button type="submit">Valider</button>
    </form>
  `;

  const form = modal.querySelector(".js-add-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = window.sessionStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté.");
      return;
    }

    const formData = new FormData();
    const imageInput = form.querySelector("#image");
    const titleInput = form.querySelector("#title");
    const categorySelect = form.querySelector("#category");

    formData.append("image", imageInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newWork = await response.json();
        works.push(newWork);
        afficherModalWorks(works);
        form.reset();
        alert("Image ajoutée avec succès !");
      } else {
        alert("Erreur lors de l'ajout de l'image.");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Échec de l'envoi. Vérifiez votre connexion.");
    }
  });
}
