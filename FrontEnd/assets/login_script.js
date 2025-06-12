// if AuthToken  === null
//     redirect login_pagte



//     response = await fetch( url , {
// method : "DELETE",
// headers : {
// "Accept" : "*/*",
// "Authorization": `Bearer ${token}`
// }
// });




function userListenerLogin() {
    const formulairLogin = document.querySelector(".formulaire-login");

    formulairLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        const login = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(login)
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Mot de passe incorrect.");
                    } else if (response.status === 404) {
                        throw new Error("Utilisateur non trouvé.");
                    } else {
                        throw new Error("Erreur lors de la connexion.");
                    }
                }
                // test
                console.log("test", response);
                return response.json();

            })
            .then(data => {
                sessionStorage.setItem("token", data.token);
                window.location.href = "index.html";
            })
            .catch(error => {
                alert(error.message);
                console.error("Erreur de login :", error);
            });
    });
}


userListenerLogin(); 
