let button = document.getElementById('button');
let tab_candidat = document.getElementById('tab_bureau');
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

    fetch(url + "/api/v1/bureau/delete/" + id, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(result)
            init()
        })
        .catch((error) => console.error(error));
}


let init = () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url + "/api/v1/bureau/all", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            let data = JSON.parse(result);
            let html = ``;
            let download = ""
            let link = ""
            for (let i = 0; i < data.length; i++) {
                if (data[i].pv.length>0){
                    link = url+"/api/v1/file/download/"+data[i].pv[0].realName+"/"+data[i].pv[0].name
                    download = `<a href="${link}" target="_blank" class="btn btn-primary download">Télécharger PV</a>`
                }else{
                    download = `<a href="#" target="_blank" class="btn btn-secondary disabled">Télécharger PV</a>`
                }
                html += `<tr>
                            <td>${i + 1}</td>
                            <td>${data[i].region}</td>
                            <td>${data[i].departement}</td>
                            <td>${data[i].arrondisssement}</td>
                            <td>${data[i].matricule}</td>
                            <td>${data[i].nbreElecteurs}</td>
                            <td>${data[i].scrutateur.login}</td>
                            <td>
                            <button type="button" data-id="${data[i].id}"  class="btn btn-danger sup" onclick="">Sup.</button>
                            ${download}
                            </td>
                        </tr>`;
            }

            tab_candidat.innerHTML = html;
            buttons = document.querySelectorAll(".sup");

            buttons.forEach(button => {
                button.addEventListener("click", function () {
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
    let region = document.getElementById('region').value;
    let departement = document.getElementById('departement').value;
    let arrondisssement = document.getElementById('arrondissement').value;
    let matricule = document.getElementById('matricule').value;
    let nbreElecteurs = document.getElementById('electeur').value;
    let phone = document.getElementById('phone').value;
    let login = document.getElementById('login').value;
    let password = document.getElementById('password').value;   
    if(region=="" || departement=="" || arrondisssement=="" || matricule=="" || nbreElecteurs=="" || phone=="" || login=="" || password==""){
        let alert = document.getElementById('alert');
        let html = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Erreur:</strong> Veuillez remplir tous les champs.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>
        `
        alert.innerHTML = html;
        return
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "matricule": matricule,
        "region":region,
        "departement": departement,
        "arrondisssement": arrondisssement,
        "nbreElecteurs": nbreElecteurs,
        "scrutateur": {
            "login": login,
            "phone": phone,
            "password": password
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(url+"/api/v1/bureau/create", requestOptions)
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
            }else{
                let alert = document.getElementById('alert');
                let html = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Alert:</strong> Scrutateur avec ce login existe déjà
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `
                alert.innerHTML = html;
            }
        })
        .catch((error) => console.error(error));
});
