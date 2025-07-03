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
    // Permet à main.js d’être notifié des changements d’état déclenchés dans modal.js, via les appels API gérés par la classe Store.
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    // Permet à toutes les méthodes de la classe Store de notifier les abonnés (subscribe), et donc main.js, lors d’un changement d’état.
    notify() {
        this.subscribers.forEach((fn) => fn(this));
    }

    // Ces méthodes intègrent toutes un appel à l’API, suivant la même logique :
    // 1. Appeler l’API correspondante et attendre sa réponse.
    // 2. Vérifier si l’appel a réussi. En cas d’échec, afficher un avertissement et interrompre le processus pour éviter une erreur plus grave.
    // 3. En cas de succès, mettre à jour la variable concernée avec la réponse de l’API,
    //    soit directement, soit en rappelant getWorks() pour actualiser la liste.
    // 4. Enfin, notifier les abonnés via notify(), notamment main.js.

    // ______________________________________________
    async getWorks() {
        const success = await Api.getWorks()
        if (!success) {
            console.warn("impossible de charger la liste.");
            return;
        }
        this.works = success;
        this.notify();
    }
    // ______________________________________________
    async getCategories() {
        const success = await Api.getCategories()
        if (!success) {
            console.warn("impossible de charger les categories.");
            return;
        }
        this.categories = success;
        this.notify();

    }
    // ______________________________________________
    async removeWork(id) {
        const success = await Api.deleteWork(id, token);
        if (!success) {
            console.warn("Suppression échouée, pas de mise à jour de la liste.");
            return;
        }
        this.works = await Api.getWorks();
        this.notify();
    }
    // ______________________________________________
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