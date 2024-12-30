let button = document.getElementById('connexion');
let url = "http://localhost:3001"

let role = localStorage.getItem('role');
if (role === 'ADMIN') {
    window.location.href = "admin/bureaux-vote.html";
}else if (role === 'BUREAU') {
    window.location.href = "bureau/resultats-vote.html";
}

button.addEventListener('click', function () {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if (username === '' || password === '') {
        let alert = document.getElementById('alert');
        let html = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Erreur:</strong> Veuillez remplir tous les champs.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>
        `
        alert.innerHTML = html;
    } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "login": username,
            "password": password
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(url + "/api/v1/user/authenticate", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                let resultat = JSON.parse(result);
                if (resultat.id) {
                    let alert = document.getElementById('alert');
                    let html = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                                            <strong>Connexion:</strong> Connexion réussie.
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                          </div>
                    `
                    alert.innerHTML = html;
                    if (resultat.role === 'ADMIN') {
                        localStorage.setItem('id', resultat.id);
                        localStorage.setItem('role', resultat.role);
                        window.location.href = "admin/bureaux-vote.html";
                    } else {
                        localStorage.setItem('id', resultat.id);
                        localStorage.setItem('role', resultat.role);
                        window.location.href = "bureau/resultats-vote.html";
                    }
                } else {
                    let alert = document.getElementById('alert');
                    let html = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                            <strong>Erreur:</strong> Mot de passe ou login incorrect.
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                          </div>
                    `
                    alert.innerHTML = html;
                }
            })
            .catch((error) => console.error(error));
    }

});
