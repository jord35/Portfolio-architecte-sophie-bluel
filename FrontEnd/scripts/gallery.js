// gallery.js
export function renderGallery(works, container) {
    container.innerHTML = "";
    for (let work of works) {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        figure.appendChild(img);
        container.appendChild(figure);
    }
}