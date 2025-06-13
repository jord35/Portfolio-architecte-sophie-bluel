export async function getWorks() {
    const res = await fetch("http://localhost:5678/api/works");
    return res.json();
}

export async function getCategories() {
    const res = await fetch("http://localhost:5678/api/categories");
    return res.json();
}