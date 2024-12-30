let button = document.getElementById('button');
let tab_candidat = document.getElementById('tab_candidat');
let url = 'http://localhost:3001';
let buttons = []


function logout() {
    localStorage.clear();
    window.location.href = "../login.html";
}
document.getElementById('logout').addEventListener('click', logout);

let sup = (id) => {
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    fetch(url + "/api/v1/candidat/delete/" + id, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(result)
            init()
        })
        .catch((error) => console.error(error));
}


const init = () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url + "/api/v1/candidat/all", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            let data = JSON.parse(result);
            let html = ``;
            for (let i = 0; i < data.length; i++) {
                html += `<tr>
                            <td>${i + 1}</td>
                            <td>${data[i].lastName}</td>
                            <td>${data[i].firstName}</td>
                            <td>${data[i].parti}</td>
                            <td>
                            <div class="" style="height: 30px; width:30px;background: ${data[i].couleur};margin-left:5px "></div>
                            </td>
                            <td><button type="button" data-id="${data[i].id}"  class="btn btn-danger sup" onclick="">Sup.</button>
                        </tr>`;
            }
            tab_candidat.innerHTML = html;
            buttons = document.querySelectorAll(".sup");
            

            buttons.forEach(button => {
                button.addEventListener("click", function() {
                    const id = this.getAttribute("data-id");
                    sup(id);
                });
            });
            
            
        })
        .catch((error) => console.error(error));
}

init()

button.addEventListener('click', (e) => {
    e.preventDefault();
    let lastName = document.getElementById('nom').value;
    let firstName = document.getElementById('prenom').value;
    let parti = document.getElementById('parti').value;
    let couleur = document.getElementById('couleur').value;

    if (lastName === "" || firstName === "" || parti === "" || couleur === "") {
        let alert = document.getElementById('alert');
        let html = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Erreur:</strong> Veuillez remplir tous les champs.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>
        `
        alert.innerHTML = html;
        return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "firstName": firstName,
        "lastName": lastName,
        "parti": parti,
        "couleur": couleur
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(url + "/api/v1/candidat/create", requestOptions)
        .then((response) => response.text())
        .then((result) => {

            data = JSON.parse(result);
            if (data.id) {
                let alert = document.getElementById('alert');
                let html = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                                        <strong>Succès:</strong> Candidat ajouté avec succès.
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                      </div>
                `
                alert.innerHTML = html;
                init()
            }
        })
        .catch((error) => console.error(error));
});