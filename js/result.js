const candidats = document.getElementById("candidat")
const url = "http://localhost:3001"
const id_scrutatreur = localStorage.getItem("id")
const tab_result = document.getElementById("tab_result")
const candidat = document.getElementById("candidat")
const enregistrer = document.getElementById("enregistrer")
const enre_pv = document.getElementById("enre_pv")
let bureau = {}
const max = document.getElementById("maxi")
const pv = document.getElementById("pv")

let resultats = {}

function logout() {
    localStorage.clear();
    window.location.href = "../login.html";
}

document.getElementById('logout').addEventListener('click', logout);

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function sortResults(data) {
    return data.sort((a, b) => b.nombreVoie - a.nombreVoie);
}

//function to fill tab_result
function fillTable(res) {
    tab_result.innerHTML = ""
    let html = ""

    res.resultCandidat.forEach((candidat, index) => {
        html += `
                <tr>
                    <td>${candidat.nomCandidat}</td>
                    <td>${candidat.parti}</td>
                    <td>
                        <div class="" style="height: 30px; width:30px;background: ${candidat.couleur};margin-left:5px "></div>
                    </td>
                    <td>${candidat.nombreVoie}</td>
                    <td>${roundToTwo(candidat.nombreVoie * 100 / res.totalElecteur)}%</td>
                </tr>
            `
    })
    tab_result.innerHTML = html
}

const upload_pv = () => {
    if (!bureau.id) {
        let alert = document.getElementById('alert2');
        let html = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Erreur:</strong> Identifiant du bureau non trouvé.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>
        `
        alert.innerHTML = html;
        return
    }
    let pv_file = document.getElementById('preuve').files;
    if (pv_file.length == 0) {
        let alert = document.getElementById('alert2');
        let html = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Erreur:</strong> Veullez sélectionner un fichier
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>
        `
        alert.innerHTML = html;
        return;
    }

    const formdata = new FormData();
    formdata.append("file", pv_file[0], pv_file[0].name);

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    fetch(url + "/api/v1/file/bureau/" + bureau.id, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            let data = JSON.parse(result)
            if (data.id) {
                let alert = document.getElementById('alert2');
                let html = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>Success:</strong> PV chargé avec success.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>
        `
                alert.innerHTML = html;
                init()
            }
        })
        .catch((error) => console.error(error));
}

const init = () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url + "/api/v1/bureau/scrutatreur/" + id_scrutatreur, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            bureau = JSON.parse(result)
            if (bureau.id) {
                if (bureau.pv.length > 0) {
                    let link = ""
                    const element = bureau.pv[0];
                    link = url + "/api/v1/file/download/" + element.realName + "/" + element.name

                    pv.innerHTML = `<a href="${link}" target="_blank">Télécharger PV : ${element.realName}</a>`
                } else {
                    pv.innerHTML = `<span>Aucun PV disponible pour le moment.</span>`
                }
                fetch(url + "/api/v1/result/bureau/" + bureau.id, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        resultats = JSON.parse(result)
                        resultats.resultCandidat = sortResults(resultats.resultCandidat)
                        fillTable(resultats)

                        let html = `<option value="">Sélectionnez un candidat</option>`
                        for (let i = 0; i < resultats.resultCandidat.length; i++) {
                            const element = resultats.resultCandidat[i];
                            html += `<option value="${element.idCandidat}">${element.nomCandidat} / ${element.parti}</option>`
                        }
                        candidats.innerHTML = html
                        let somme_voie = 0
                        for (let i = 0; i < resultats.resultCandidat.length; i++) {
                            somme_voie += resultats.resultCandidat[i].nombreVoie
                        }
                        max.innerHTML = `/ ${resultats.totalElecteur - somme_voie}`

                    })
                    .catch((error) => console.error(error));

            }
        })
        .catch((error) => console.error(error));
}

init()
enregistrer.addEventListener('click', () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let vote = document.getElementById("votes").value
    if (vote === "" || candidat.value == "") {
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
    let somme_voie = 0
    for (let i = 0; i < resultats.resultCandidat.length; i++) {
        somme_voie += resultats.resultCandidat[i].nombreVoie
    }

    if (vote > resultats.totalElecteur - somme_voie) {
        let alert = document.getElementById('alert');
        let html = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Erreur:</strong> Votre choix dépasse le nombre de voies possible.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>
        `
        alert.innerHTML = html;
        return;
    }

    const raw = JSON.stringify({
        "nombreVoie": vote
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(url + "/api/v1/result/add/bureau/" + bureau.id + "/candidat/" + candidat.value, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            init()
            let alert = document.getElementById('alert');
            let html = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>Success:</strong> Vote Enregistré
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>
        `
            alert.innerHTML = html;
        })
        .catch((error) => console.error(error));
});

enre_pv.addEventListener('click', upload_pv)