// modal
import { store } from "./store.js";
import { renderGallery } from "./gallery.js";

// Fonction principale qui initialise et gère le mode admin (modale)
export async function adminMode() {
  // Chargement initial des catégories et œuvres depuis le store
  await store.getCategories();
  await store.getWorks();

  // === GESTION OUVERTURE DE MODALE ===
  function openModal(e) {
    e.preventDefault();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");

    modal.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

    renderModalGallery(store.works); // Affichage de la galerie dans la modale
  }

  // === GESTION FERMETURE DE MODALE ===
  function closeModal(e) {
    e.preventDefault();
    document.activeElement.blur();

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");

    modal.removeEventListener("click", closeModal);
    closeModalBtn.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

    store.getWorks(); // Mise à jour des œuvres après fermeture
  }

  // === RENDU DES ŒUVRES DANS LA MODALE ===
  function renderModalGallery(works) {
    const container = document.querySelector(".modal-works");
    renderGallery(works, container);

    const figures = container.querySelectorAll("figure");

    works.forEach((work, i) => {
      const figure = figures[i];
      figure.classList.add("modal-item");

      const img = figure.querySelector("img");
      img.classList.add("modal-img");

      // Création de l'icône poubelle pour suppression
      const trashConteneur = document.createElement("div");
      trashConteneur.classList.add("trash_conteneur");

      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash", "fa-style");

      // Suppression d'une œuvre
      trash.addEventListener("click", async () => {
        await store.removeWork(work.id);
      });

      trashConteneur.appendChild(trash);
      figure.appendChild(trashConteneur);
    });
  }

  // === GÉNÉRATION DE LA STRUCTURE HTML DE LA MODALE ===
  const modalForAdmin = document.createElement("div");
  modalForAdmin.classList.add("modalForAdmin");

  modalForAdmin.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <a href="#modal" class="js-modal">modifier</a>
    <aside id="modal" class="modal" aria-hidden="true" role="dialog" aria-labelledby="titlemodal" style="display:none;">
      <div class="modal-wrapper js-modal-stop">
        <div class="modal-button_conteneur">
          <button class="js-switch-to-gallery"><i class="fa-solid fa-arrow-left"></i></button>
          <button class="js-modal-close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Conteneur des deux vues (galerie + formulaire) -->
        <div class="slide-container show-gallery">
          <!-- Vue Galerie -->
          <div class="slide">
            <h2 id="titlemodal">Galerie photo</h2>
            <div class="js-modal-works modal-works"></div>
            <div class="modal-down-page">
              <button class="js-switch-to-form , modal_down_btn , modal_down_btn--add">Ajouter une photo</button>
            </div>
          </div>

          <!-- Vue Formulaire d'ajout -->
          <div class="slide">
            <div class="js-add-picture"></div>
          </div>
        </div>
      </div>
    </aside>
  `;

  // Insertion de la modale dans la zone prévue
  const injectZone = document.getElementById("js-injectZone");
  injectZone.classList.add("admin_margin");
  injectZone.appendChild(modalForAdmin);
  // === SÉLECTEURS ===
  const modal = document.getElementById("modal");
  const openModalBtn = modalForAdmin.querySelector(".js-modal");
  const closeModalBtn = modal.querySelector(".js-modal-close");
  const slideContainer = modal.querySelector(".slide-container");

  // Empêche la fermeture si on clique à l'intérieur de la modale
  const stopPropagation = function (e) {
    e.stopPropagation();
  };

  // Gestion de l'ouverture
  openModalBtn.addEventListener("click", openModal);

  // Fermeture via touche "Escape"
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
    }
  });

  // === GESTION DE LA NAVIGATION ENTRE LES VUES (galerie <-> formulaire) ===
  const switchToFormBtn = modal.querySelector(".js-switch-to-form");
  const switchToGalleryBtn = modal.querySelector(".js-switch-to-gallery");
  switchToGalleryBtn.classList.add("btn-hidd"); // Cache le bouton retour au début

  // Passage à la vue formulaire
  switchToFormBtn.addEventListener("click", () => {
    slideContainer.classList.remove("show-gallery");
    slideContainer.classList.add("show-form");
    switchToGalleryBtn.classList.remove("btn-hidd");
  });

  // Retour à la vue galerie
  switchToGalleryBtn.addEventListener("click", () => {
    slideContainer.classList.remove("show-form");
    slideContainer.classList.add("show-gallery");
    switchToGalleryBtn.classList.add("btn-hidd");
  });

  // === FORMULAIRE D’AJOUT D’IMAGE ===
  const addPicture = modal.querySelector(".js-add-picture");
  addPicture.innerHTML = `
  <h2>Ajout photo</h2>
  <form class="js-add-form" enctype="multipart/form-data" id="upload-form">
    <div id="drop-area">
      <i class="fa-regular fa-image"></i>
      <button class="add-button" type="button">+ Ajouter photo</button>
      <p>jpg, png : 4mo max</p>
      <input type="file" id="file-input" accept="image/*" hidden />
      <img id="preview" alt="Aperçu" />
    </div>
    <div class="input-conteneur">
      <label for="title">Titre</label>
      <input type="text" id="title" name="title" class="input-box" required>
    </div>
    <div class="select-wrapper">
      <label for="category">Catégorie</label>
      <select id="category" name="category" class="input-box" required>
        ${store.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join("")}
      </select>
    </div>
    <div class="modal-down-page">
      <button type="submit" class="modal_down_btn modal_down_btn--validate">Valider</button>
    </div>
  </form>
`;
  // === SÉLECTEURS ===
  const form = modal.querySelector(".js-add-form");
  const dropArea = form.querySelector("#drop-area");
  const fileInput = form.querySelector("#file-input");
  const preview = form.querySelector("#preview");
  const bttSubmit = form.querySelector(".modal_down_btn");

  // Empêche le comportement par défaut
  ["dragover", "drop"].forEach(evt =>
    window.addEventListener(evt, e => e.preventDefault())
  );

  // Clique pour ouvrir le file picker
  dropArea.addEventListener("click", () => fileInput.click());

  // Gestion du drag & drop
  ["dragenter", "dragover"].forEach(event => {
    dropArea.addEventListener(event, e => {
      e.preventDefault();
      dropArea.classList.add("hover");
    });
  });
  ["dragleave", "drop"].forEach(event => {
    dropArea.addEventListener(event, e => {
      e.preventDefault();
      dropArea.classList.remove("hover");
    });
  });

  // Récupère le fichier déposé ou sélectionné
  dropArea.addEventListener("drop", e => {
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    handleFile(file);
  });

  // Aperçu image + stockage dans input
  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
      dropArea.querySelector("i").style.display = "none";
      dropArea.querySelector("button").style.display = "none";
      dropArea.querySelector("p").style.display = "none";
      bttSubmit.classList.add("modal_down_btn--validate-true");
    };
    reader.readAsDataURL(file);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = window.sessionStorage.getItem("token");
    if (!token) return alert("Vous devez être connecté.");

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", form.querySelector("#title").value);
    formData.append("category", form.querySelector("#category").value);

    await store.addWork(formData);
    renderModalGallery(store.works);
    form.reset();
    preview.style.display = "none";
    bttSubmit.classList.remove("modal_down_btn--validate-true");
    alert("Image ajoutée avec succès !");
  })
}