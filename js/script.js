let url = "http://localhost:3001";
let resultRegion = [];
let resultDepartement = [];
let resultArrondissement = [];
let results = [];

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

const init = () => {
    let html = ``;
    let html2 = ``;
    let winner = document.getElementById('winner');
    let candidat = document.getElementById('candidat');
    let tab_resultats = document.getElementById('resultats');
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url + "/api/v1/result/final", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            let globe = JSON.parse(result)
            let data = sortResults(globe.resultCandidat);
            results = data
            let winnerData = getMax(data);
            if (winnerData != null) {
                winner.innerHTML = `
                    <h3 class="text-center d-flex justify-content-center align-items-center">
                             ${winnerData.nomCandidat} / ${winnerData.parti} / ${roundToTwo(winnerData.nombreVoie * 100 / globe.totalElecteur)} % /
                            <span class="" style="height: 30px; width:30px;background: ${winnerData.couleur};margin-left:5px "></span>
                        </h3>
                `;
            } else {
                winner.innerHTML = `
                    <h3 class="text-center d-flex justify-content-center align-items-center">
                             Aucun gagnant
                        </h3>
                `;
            }


            for (let i = 0; i < data.length; i++) {
                html += `
                    <div class="col-md-3 p-1">
                            <div class="card">
                                <div class="card-body">
                                    <div class="text-center d-flex justify-content-center align-items-center">
                                        ${data[i].nomCandidat} / ${data[i].parti}
                                        <span class="" style="height: 30px; width:30px;background: ${data[i].couleur};margin-left:5px "></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                `;
                html2 += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${data[i].nomCandidat}</td>
                        <td>${data[i].parti}</td>
                        <td>${data[i].nombreVoie}</td>
                        <td>${roundToTwo(data[i].nombreVoie * 100 / globe.totalElecteur)
                    } %</td>
                        <td>
                        <div class="" style="height: 30px; width:30px;background: ${data[i].couleur};margin-left:5px "></div>
                        </td>

                    </tr>
                `;
            }
            tab_resultats.innerHTML = html2;
            candidat.innerHTML = html;
        })
        .catch((error) => console.error(error));




    fetch(url + "/api/v1/result/region", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            resultRegion = JSON.parse(result);
        })
        .catch((error) => console.error(error));

    fetch(url + "/api/v1/result/departement", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            resultDepartement = JSON.parse(result);
        })
        .catch((error) => console.error(error));

    fetch(url + "/api/v1/result/arrondissement", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            resultArrondissement = JSON.parse(result);
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

// Fonction de style pour chaque région
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
            L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.COUNTRY) {
                        layer.bindTooltip(feature.properties.COUNTRY, {
                            // permanent: true,
                            direction: 'center',
                            className: 'custom-tooltip'
                        });
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));
}

const loadRegion = (style) => {

    fetch('geojson/region.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.NAME_1) {
                        layer.bindTooltip(feature.properties.NAME_1, {
                            // permanent: true,
                            direction: 'center',
                            className: 'custom-tooltip'
                        });
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));
}

const loadDepartment = (style) => {
    fetch('geojson/departement.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.NAME_2) {
                        layer.bindTooltip(feature.properties.NAME_2, {
                            // permanent: true,
                            direction: 'center',
                            className: 'custom-tooltip'
                        });
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));
}

const loadArrondissement = (style) => {
    fetch('geojson/arrondissement.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
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

init()

var map = L.map('map').setView([7.3696495, 12.3445856], 8);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satelite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'jpg'
})
var carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

// osm.addTo(map);

//satelite.addTo(map);
carto.addTo(map);


loadDepartment(departementStyle);

map.on('zoomend', () => {
    const zoomLevel = map.getZoom();
    // console.log("Niveau de zoom actuel :", zoomLevel);
    if (zoomLevel <= 5) {
        emtyMap()
        loadPays(style)
    } else if (zoomLevel <= 6) {
        emtyMap()
        loadRegion(regionStyle)
    } else if (zoomLevel <= 8) {
        emtyMap()
        loadDepartment(departementStyle)
    } else {
        emtyMap()
        loadArrondissement(arrondissementStyle)
    }
});

