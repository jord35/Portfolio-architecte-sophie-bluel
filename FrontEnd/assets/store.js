// store.js
import * as Api from './api.js';

let token = window.sessionStorage.getItem("token");
console.log("token", token);

class Store {
    constructor() {
        this.works = [];
        this.categories = [];
        this.subscribers = []; // observers (DOM updates, etc.)
    }
    // Pour écouter les changements
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify() {
        this.subscribers.forEach((fn) => fn(this));
    }
    async getWorks() {
        const success = await Api.getWorks()
        if (!success) {
            console.warn("impossible de charger la liste.");
            return;
        }
        this.works = success;
        this.notify();
    }
    async getCategories() {
        const success = await Api.getCategories()
        if (!success) {
            console.warn("impossible de charger les categories.");
            return;
        }
        this.categories = success;
        this.notify();

    }
    async removeWork(id) {
        const success = await Api.deleteWork(id, token);
        if (!success) {
            console.warn("Suppression échouée, pas de mise à jour de la liste.");
            return;
        }
        this.works = await Api.getWorks();
        this.notify();
    }
    async addWork(formData) {
        const success = await Api.addWork(formData, token);
        if (!success) {
            console.warn("échec de l'ajout, pas de mise à jour de la liste");
            return;
        }
        this.works = await Api.getWorks();
        this.notify();
    }
}
export const store = new Store();