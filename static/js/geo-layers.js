let activeGeoLayer;

function getGeoJsonStyle() {
    return {
        fillOpacity: 0.2,
        color: '#00628e',
        weight: 2,
    };
}

function initFeature(feature, layer) {
    layer.bindTooltip(feature.properties.title, { sticky: true });
    return true;
}

function loadGeoLayer(geoLayerId) {
    if (!geoLayerId) {
        if (activeGeoLayer) {
            map.removeLayer(activeGeoLayer);
        }
        return;
    }

    $.getJSON('/fieldsight/geo-json/' + geoLayerId + '/', function(data) {
        // TODO fix multiple async calls happening simultaneously

        if (activeGeoLayer) {
            map.removeLayer(activeGeoLayer);
        }

        activeGeoLayer = L.geoJson(data, {
            style: getGeoJsonStyle,
            onEachFeature: initFeature,
        }).addTo(map);
        activeGeoLayer.bringToBack();

        map.flyToBounds(activeGeoLayer.getBounds(), { duration: 0.5 });
    });
}

function initGeoLayers() {
    $('input[name="geo-layer"]').change(function() {
        const geoLayerId = $(this).val();
        loadGeoLayer(geoLayerId);
    });
}
