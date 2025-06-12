export function createModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Éditer les œuvres</h2>
      <!-- Ton formulaire ici -->
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".close").addEventListener("click", () => {
    modal.remove();
  });
}