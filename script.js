let bureau_vote = [
    {
        id: 1,
        arrondissement: "abel",
        electeur: 500,
        resultats: [
            { id: 1, candidat: "Candidat 1", parti: "ACP", votes: 24, couleur: '#ff0000' },
            { id: 2, candidat: "Candidat 2", parti: "UDA", votes: 100, couleur: '#0000ff' },
            { id: 3, candidat: "Candidat 3", parti: "UDA", votes: 200, couleur: '#ff00ff'},
            { id: 4, candidat: "Candidat 4", parti: "RDR", votes: 50, couleur: '#00ffff'},
            { id: 5, candidat: "Candidat 5", parti: "UDM", votes: 74, couleur: '#ffff00'}
        ]
    }
]


function getColor(id) {
    switch (id) {
        case 1: return '#ff0000';
        case 2: return '#00ff00';
        case 3: return '#0000ff';
        case 4: return '#0fffff';
        case 5: return '#ff00ff';
        case 6: return '#f0f000';
        case 7: return '#ccff0f';
        case 8: return '#1f9000';
        case 9: return '#04836f';
        default: return '#cccccc';
    }
}

// Fonction de style pour chaque région
function style(feature) {
    return {
        fillColor: getColor(feature.id), // Utilise la couleur de la région
        weight: 2,
        opacity: 1,
        color: 'white',       // Couleur de la bordure
        dashArray: '3',
        fillOpacity: 0.7
    };
}

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

//osm.addTo(map);

//satelite.addTo(map);
carto.addTo(map);

const loadPays = (style) => {
    fetch('geojson/cameroun.geojson')
        .then(response => response.json())
        .then(data => {
            console.log(data.type);
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
            console.log(data.type);
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
            console.log(data.type);
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
            console.log(data.type);
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

loadDepartment(style);

map.on('zoomend', () => {
    const zoomLevel = map.getZoom();
    console.log("Niveau de zoom actuel :", zoomLevel);
    if (zoomLevel <= 5) {
        loadPays(style)
    } else if (zoomLevel <= 6) {
        loadRegion(style)
    } else if (zoomLevel <= 7) {
        loadDepartment(style)
    } else {
        loadArrondissement(style)
    }
});