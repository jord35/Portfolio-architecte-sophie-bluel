export async function getWorks() {
    const res = await fetch("http://localhost:5678/api/works");
    return res.json();
}

export async function getCategories() {
    const res = await fetch("http://localhost:5678/api/categories");
    return res.json();
}

export async function deleteWork(id, token) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Échec de la suppression");
        }

        return true;
    } catch (error) {
        console.error("Erreur API lors de la suppression :", error);
        return false;
    }
}

export async function addWork(formData, token) {
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de l'image");
        }

        const newWork = await response.json();
        return newWork;
    } catch (error) {
        console.error("Erreur API lors de l'ajout :", error);
        return null;
    }
}