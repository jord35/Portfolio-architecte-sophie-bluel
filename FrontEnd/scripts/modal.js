// modal
import { store } from "./store.js";
import { renderGallery } from "./gallery.js";

export async function adminMode() {
  await store.getCategories();
  await store.getWorks();

  // function______________________________
  function openModal(e) {
    e.preventDefault();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

    renderModalGallery(store.works);
  }
  // ___________________
  function closeModal(e) {
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    closeModalBtn.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

    store.getWorks();
  }
  // ___________________
  function renderModalGallery(works) {
    const container = document.querySelector(".modal-works");
    renderGallery(works, container);

    const figures = container.querySelectorAll("figure");
    works.forEach((work, i) => {
      const figure = figures[i];
      figure.classList.add("modal-item");

      const img = figure.querySelector("img");
      img.classList.add("modal-img");

      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash");
      trash.style.cursor = "pointer";

      trash.addEventListener("click", async () => {
        await store.removeWork(work.id);
      });

      figure.appendChild(trash);
    });
  }
  // _______________________________________________
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
          ${store.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join("")}
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

    await store.addWork(formData);
    renderModalGallery(store.works);
    form.reset();
    alert("Image ajoutée avec succès !");
  });

  store.subscribe((state) => {
    renderModalGallery(state.works);
  });
}
