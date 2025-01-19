let url = "http://localhost:3001";
let resultRegion = [];
let resultDepartement = [];
let resultArrondissement = [];
let results = [];
let back_button = document.getElementById("back")
let back_button2 = document.getElementById("back2")
let titre_tab = document.getElementById("titre_tab")
let current_region = '';
let current_departement = '';
let globe = []
var map = L.map('map')
let level = 'region'

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function sortResults(data) {
    return data.sort((a, b) => b.nombreVoie - a.nombreVoie);
}

function getMax(data) {
    let numMax = 0;
    let idx = 0;
    let max = 0;
    for (let j = 0; j < data.length; j++) {
        if (data[j].nombreVoie >= max) {
            if (data[j].nombreVoie == max) {
                numMax++
            } else {
                numMax = 1;
            }
            max = data[j].nombreVoie;
            idx = j;
        }
    }
    if (numMax == 1) {
        return data[idx];
    } else {
        return null;
    }
}
let back = () => {
    back_button.style.display = 'none'
    back_button2.style.display = 'none'
    emtyMap()
    loadRegion(regionStyle)
}
let back2 = () => {
    back_button.style.display = 'block'
    back_button2.style.display = 'none'
    emtyMap()
    loadDepartment(departementStyle, current_region)
}

const fill_table = (resultats) => {
    let data = sortResults(resultats.resultCandidat);
    let tab_resultats = document.getElementById('resultats');
    titre_tab.innerHTML = `Résultats Globaux`
    let html2 = ``;
    results = data
    for (let i = 0; i < data.length; i++) {
        html2 += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${data[i].nomCandidat}</td>
                        <td>${data[i].parti}</td>
                        <td>${data[i].nombreVoie}</td>
                        <td>${roundToTwo(data[i].nombreVoie * 100 / resultats.totalElecteur)} %</td>
                        <td>
                            <div class="" style="height: 30px; width:30px;background: ${data[i].couleur};margin-left:5px "></div>
                        </td>
                    </tr>
                `;
    }
    tab_resultats.innerHTML = html2;
}
const fill_table2 = (resultats) => {
    let data = sortResults(resultats.resultCandidat);
    let tab_resultats = document.getElementById('resultats');
    let html2 = ``;
    results = data
    for (let i = 0; i < data.length; i++) {
        html2 += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${data[i].nomCandidat}</td>
                        <td>${data[i].parti}</td>
                        <td>${data[i].nombreVoie}</td>
                        <td>${roundToTwo(data[i].nombreVoie * 100 / resultats.totalElecteur)} %</td>
                        <td>
                            <div class="" style="height: 30px; width:30px;background: ${data[i].couleur};margin-left:5px "></div>
                        </td>
                    </tr>
                `;
    }
    tab_resultats.innerHTML = html2;
}


const init = () => {
    back_button.style.display = 'none'
    back_button2.style.display = 'none'
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url + "/api/v1/result/final", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            globe = JSON.parse(result)
        })
        .catch((error) => console.error(error));

    fetch(url + "/api/v1/result/region", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            resultRegion = JSON.parse(result);
            if (level =='region') {
                emtyMap()
                loadRegion(regionStyle)
            }
        })
        .catch((error) => console.error(error));

    fetch(url + "/api/v1/result/departement", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            resultDepartement = JSON.parse(result);
            if (level =='departement') {
                emtyMap()
                loadDepartment(departementStyle, current_region)
            }
        })
        .catch((error) => console.error(error));

    fetch(url + "/api/v1/result/arrondissement", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            resultArrondissement = JSON.parse(result);
            if (level =='arrondissement') {
                emtyMap()
                loadArrondissement(arrondissementStyle, current_departement)
            }

        })
        .catch((error) => console.error(error));
}


function getColor() {
    let numMax = 0;
    let idx = 0;
    let max = 0;
    for (let j = 0; j < results.length; j++) {
        if (results[j].nombreVoie >= max) {
            if (results[j].nombreVoie == max) {
                numMax++
            } else {
                numMax = 1;
            }
            max = results[j].nombreVoie;
            idx = j;
        }
    }
    if (numMax == 1) {
        return results[idx].couleur;
    } else if (numMax == 0) {
        return '#252525'
    } else {
        return '#cccccc'
    }
}

function getColorRegion(regionName, resultRegion) {
    for (let i = 0; i < resultRegion.length; i++) {
        if (resultRegion[i].name == regionName) {
            let numMax = 0;
            let idx = 0;
            let max = 0;
            for (let j = 0; j < resultRegion[i].resultCandidat.length; j++) {
                if (resultRegion[i].resultCandidat[j].nombreVoie >= max) {
                    if (resultRegion[i].resultCandidat[j].nombreVoie == max) {
                        numMax++
                    } else {
                        numMax = 1;
                    }
                    max = resultRegion[i].resultCandidat[j].nombreVoie;
                    idx = j;
                }
            }
            if (numMax == 1) {
                return resultRegion[i].resultCandidat[idx].couleur;
            } else if (numMax == 0) {
                return '#252525'
            } else {
                return '#cccccc'
            }
        }
    }
    return '#fff';
}

function getColorDepartement(departementName, resultDepartement) {
    for (let i = 0; i < resultDepartement.length; i++) {
        if (resultDepartement[i].name == departementName) {
            let numMax = 0;
            let idx = 0;
            let max = 0;
            for (let j = 0; j < resultDepartement[i].resultCandidat.length; j++) {
                if (resultDepartement[i].resultCandidat[j].nombreVoie >= max) {
                    if (resultDepartement[i].resultCandidat[j].nombreVoie == max) {
                        numMax++
                    } else {
                        numMax = 1;
                    }
                    max = resultDepartement[i].resultCandidat[j].nombreVoie
                    idx = j;
                }
            }
            if (numMax == 1) {
                return resultDepartement[i].resultCandidat[idx].couleur;
            } else if (numMax == 0) {
                return '#252525'
            } else {
                return '#cccccc'
            }
        }
    }
    return '#fff';
}

function getColorArrondissement(arrondissementName, resultArrondissement) {
    for (let i = 0; i < resultArrondissement.length; i++) {
        if (resultArrondissement[i].name == arrondissementName) {
            let numMax = 0;
            let idx = 0;
            let max = 0;
            for (let j = 0; j < resultArrondissement[i].resultCandidat.length; j++) {

                if (resultArrondissement[i].resultCandidat[j].nombreVoie >= max) {
                    if (resultArrondissement[i].resultCandidat[j].nombreVoie == max) {
                        numMax++
                    } else {
                        numMax = 1;
                    }
                    max = resultArrondissement[i].resultCandidat[j].nombreVoie;
                    idx = j;
                }
            }
            if (numMax == 1) {
                return resultArrondissement[i].resultCandidat[idx].couleur;
            } else if (numMax == 0) {
                return '#252525'
            } else {
                return '#cccccc'
            }
        }
    }
    return '#fff';
}

function style(feature) {
    return {
        fillColor: getColor(),
        weight: 2,
        opacity: 1,
        color: '#bebebe',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function regionStyle(feature) {
    return {
        fillColor: getColorRegion(feature.properties.NAME_1, resultRegion),
        weight: 2,
        opacity: 1,
        color: '#bebebe',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function departementStyle(feature) {
    return {
        fillColor: getColorDepartement(feature.properties.NAME_2, resultDepartement),
        weight: 2,
        opacity: 1,
        color: '#bebebe',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function arrondissementStyle(feature) {
    return {
        fillColor: getColorArrondissement(feature.properties.NAME_3, resultArrondissement),
        weight: 2,
        opacity: 1,
        color: '#bebebe',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

const loadPays = (style) => {
    fetch('geojson/cameroun.geojson')
        .then(response => response.json())
        .then(data => {
            let layer = L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.COUNTRY) {
                        layer.bindTooltip(feature.properties.COUNTRY, {
                            direction: 'center',
                            className: 'custom-tooltip'
                        });
                    }
                }
            }).addTo(map);
            map.fitBounds(layer.getBounds())

        })
        .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));
}

const onEachRegion = (feature, layer) => {
    if (feature.properties && feature.properties.NAME_1) {
        layer.bindTooltip(feature.properties.NAME_1, {
            // permanent: true,
            direction: 'center',
            className: 'custom-tooltip'
        });
    }
    layer.on('click', () => {
        emtyMap()
        loadDepartment(departementStyle, feature.properties.NAME_1)
    });
}

const loadRegion = (style) => {
    level = "region"
    fetch('geojson/region.geojson')
        .then(response => response.json())
        .then(data => {
            fill_table(globe)
            let layer = L.geoJSON(data, {
                style: style,
                onEachFeature: onEachRegion
            }).addTo(map);
            map.fitBounds(layer.getBounds())
        })
        .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));
}

const onEachDepartement = (feature, layer) => {
    if (feature.properties && feature.properties.NAME_2) {
        layer.bindTooltip(feature.properties.NAME_2, {
            // permanent: true,
            direction: 'center',
            className: 'custom-tooltip'
        });
    }
    layer.on('click', () => {
        emtyMap()
        loadArrondissement(arrondissementStyle, feature.properties.NAME_2)
    });
}
const loadDepartment = (style, name) => {
    current_region = name
    back_button.style.display = 'block'
    back_button2.style.display = 'none'
    level = "departement"
    fetch('geojson/departement.geojson')
        .then(response => response.json())
        .then(data => {
            let filter = data.features.filter(obj => obj.properties.NAME_1 === name);
            let aux = resultRegion.filter(obj => obj.name === name)
            if (aux.length > 0) {
                fill_table2(aux[0])
                titre_tab.innerHTML = `Résultat de la région : ${aux[0].name}`
            }
            data.features = filter
            let layer = L.geoJSON(data, {
                style: style,
                onEachFeature: onEachDepartement
            }).addTo(map);
            map.fitBounds(layer.getBounds())
        })
        .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));
}

const loadArrondissement = (style, name) => {
    back_button.style.display = 'block'
    back_button2.style.display = 'block'
    level = "arrondissement"
    fetch('geojson/arrondissement.geojson')
        .then(response => response.json())
        .then(data => {
            let filter = data.features.filter(obj => obj.properties.NAME_2 === name);
            data.features = filter
            current_region = data.features[0].properties.NAME_1
            current_departement = data.features[0].properties.NAME_2

            let aux = resultDepartement.filter(obj => obj.name === name)
            if (aux.length > 0) {
                fill_table2(aux[0])
                titre_tab.innerHTML = `Résultat dans le département:  ${aux[0].name}`
            }

            let layer = L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.NAME_3) {
                        layer.bindTooltip(feature.properties.NAME_3, {
                            // permanent: true,
                            direction: 'center',
                            className: 'custom-tooltip'
                        });
                    }
                }
            }).addTo(map);
            map.fitBounds(layer.getBounds())
        })
        .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));
}

const emtyMap = () => {
    map.eachLayer(layer => {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });
}
back_button.addEventListener("click", back)
back_button2.addEventListener("click", back2)

init()
emtyMap()
loadRegion(regionStyle)

// Establish WebSocket connection
const connect = () => {
    let Sock = new SockJS(url + '/ws'); // Replace `end` with your base URL
    stompClient = Stomp.over(Sock)
    stompClient.connect({}, onConnected, onError);
};

// On successful connection, subscribe to the public channel
const onConnected = () => {
    stompClient.subscribe('/chatroom/public', onPublicMessage); // Subscribe to public channel
};

// Handle incoming public messages
const onPublicMessage = (payload) => {
    const message = JSON.parse(payload.body);
    init()
};

// Send public messages
const sendPublicMessage = () => {
    if (stompClient) {
        const chatMessage = {
            sender: "send_number", // Sender's identifier
            message: "met toi à jour",       // The actual message
            status: "MESSAGE"    // Optional metadata
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage)); // Send to public endpoint
    }
};

// Handle connection errors
const onError = (err) => {
    console.error("Error:", err);
};
connect()