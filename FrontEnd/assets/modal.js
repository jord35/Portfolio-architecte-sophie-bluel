import { getWorks, getCategories, deleteWork, addWork } from "./api.js";
import { afficherWorks } from "./script.js";

export async function adminMode() {
  const categories = await getCategories();

  const modalForAdmin = document.createElement("div");
  modalForAdmin.classList.add("modalForAdmin");

  modalForAdmin.innerHTML = `
    <a href="#modal" class="js-modal">Ouvrir la boîte modal</a>
    <aside id="modal" class="modal" aria-hidden="true" role="dialog" aria-labelledby="titlemodal" style="display:none;">
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

  const modal = document.getElementById("modal");
  const openModalBtn = modalForAdmin.querySelector(".js-modal");
  const closeModalBtn = modal.querySelector(".js-modal-close");
  const modalWorks = modal.querySelector(".js-modal-works");
  const slideContainer = modal.querySelector(".slide-container");

  const stopPropagation = function (e) {
    e.stopPropagation();
  };

  function openModal(e) {
    e.preventDefault();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

    // Charger les projets dans la modale
    getWorks().then(works => {
      afficherModalWorks(works);
    });
  }

  function closeModal(e) {
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    closeModalBtn.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

    // Recharger les projets dans la galerie principale
    getWorks().then(nouvellesWorks => {
      afficherWorks(nouvellesWorks);
    });
  }

  openModalBtn.addEventListener("click", openModal);

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
    }
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
      imageElement.classList.add("modal-img");
      workElement.classList.add("test");

      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash");
      trash.style.cursor = "pointer";

      trash.addEventListener("click", async () => {
        const token = window.sessionStorage.getItem("token");

        if (!token) {
          alert("Vous devez être connecté pour supprimer une image.");
          return;
        }
        const success = await deleteWork(work.id, token);

        if (success) {
          workElement.remove();
        } else {
          alert("Erreur lors de la suppression de l’image.");
        }

      });

      workElement.appendChild(imageElement);
      workElement.appendChild(trash);
      modalWorks.appendChild(workElement);
    }
  }

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

    const newWork = await addWork(formData, token);

    if (newWork) {
      const updatedWorks = await getWorks();
      afficherModalWorks(updatedWorks);
      afficherWorks(updatedWorks);
      form.reset();
      alert("Image ajoutée avec succès !");
    } else {
      alert("Erreur lors de l'ajout de l'image.");
    }
  })
}
