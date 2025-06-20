// login
import { loginUser } from "./api.js";

function userListenerLogin() {
    const formulairLogin = document.querySelector(".formulaire-login");

    formulairLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = event.target.querySelector("[name=email]").value;
        const password = event.target.querySelector("[name=password]").value;

        try {
            const data = await loginUser(password, email);

            if (!data) {
                throw new Error("Connexion échouée. Vérifiez vos identifiants.");
            }

            sessionStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } catch (error) {
            alert(error.message);
            console.error("Erreur de login :", error);
        }
    });
}

userListenerLogin();

