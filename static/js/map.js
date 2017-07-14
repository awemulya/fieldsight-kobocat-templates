

var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var baseLayers = {
    "OpenStreetMap": osm,
    "Google Streets": googleStreets,
    "Google Hybrid": googleHybrid,
    "Google Satellite": googleSat,
    "Google Terrain": googleTerrain
};

markers = new L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
        if(feature.status == 0){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/red-small.png'
                    });
                }
                else if(feature.status == 1){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/blue-small.png'
                    });
                }
                else if(feature.status == 2){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/green-small.png'
                    });
                }
                else if(feature.status == 3){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/orange-small.png'
                    });
                }
        //console.log(icon.options);
        var marker = L.marker(latlng, {icon: icon});
        return marker;
        
    }, 
    onEachFeature: function(feature, layer) {
        var address = feature.properties.address || "";
        var url = "<a href=/fieldsight/site-dashboard/"+feature.id+">"+feature.properties.name+"</a>";
        layer.bindPopup(url+'<br/>'+address);
        
    }
});

        //console.log(data.features.length);
        if(data.features.length!=0){
           map = L.map("map",{layers:osm}).fitBounds(markers); 
        }
        else{
            map = L.map("map",{layers:osm}).setView([27, 85], 6);;
        }
        
        //map.addLayer(osm);
        layerswitcher = L.control.layers(baseLayers, {}, {collapsed: true, position: "topleft"}).addTo(map);

        map.addLayer(markers);




// map.fitBounds(markers.getBounds());

        // layerswitcher.addOverlay(markers, "Schools");

        progressLayer = new L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                // console.log(feature);
                if(feature.progress <= 20){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/green-small.png'
                    });
                }
                else if(feature.progress >= 20 && feature.progress <= 40){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/gray-small.png'
                    });
                }
                else if(feature.progress >= 40 && feature.progress <= 60){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/yellow-small.png'
                    });
                }
                else if(feature.progress >= 60 && feature.progress <= 80){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/black-small.png'
                    });
                }
                else if(feature.progress >= 80 && feature.progress <= 100){
                    icon = L.icon({
                                //iconSize: [27, 27],
                                iconAnchor: [13, 27],
                                popupAnchor:  [1, -24],
                                iconUrl: static_url+'images/violet-small.png'
                    });
                }
                //console.log(icon.options);
                var marker = L.marker(latlng, {icon: icon});
                return marker;
                
            }, 
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.public_desc+'<br/>'+feature.properties.name+'<br/>'+feature.properties.address);
                
            }
        });
        
        
        //layerswitcher.addOverlay(progressLayer, "Progress");
        
        $(".switch").on('change',function(){
            /* if($(this).is(':checked') == false){
                $(this).is(':checked') = true;
            }
            else{
                $(this).is(':checked') = false;
            } */
            $('.switch').not(this).prop('checked', false);
            if($(this)[0].id == "form_status"){
                if(map.hasLayer(progressLayer)){
                    console.log('here');
                    map.removeLayer(progressLayer);
                }
                
                if(!map.hasLayer(markers)){
                    console.log('not geojson layer');
                    map.addLayer(markers);
                }
            }
            else if($(this)[0].id == "project_progress"){
                if(map.hasLayer(markers)){
                    
                    map.removeLayer(markers);
                }
                if(!map.hasLayer(progressLayer)){
                    map.addLayer(progressLayer);
            }
            }
        });

markers.on('click',function(e){
    var site_id = e.layer.feature.id;
    // console.log(server_url+'/fieldsight/api/site-schedules/'+site_id);
    $.ajax({
url: '/fieldsight/api/site-images/'+site_id,
type: 'get', // This is the default though, you don't actually need to always mention it
dataType: "json",
success: function(data) {
img = '';
console.log(data.images);
for(i=0;i<data.images.length;i++){console.log(data.images[i]);
    img += '<img src = '+data.images[i]+'/>';
}

 $('.popop-container').show();
 $('.popop-gallery').html(img);
//$('.popop-gallery').html(data.images);
},
failure: function(data) { 
}
}); 
    $('.popop-head').addClass('changed');
    $('.popop-head').html(e.layer.feature.properties.name);
    $('.address-popop').html(e.layer.feature.properties.address);
    //$('.contact-popup').html(e.layer.feature.properties.contact);


});

progressLayer.on('click',function(e){
    var site_id = e.layer.feature.id;
    // console.log(server_url+'/fieldsight/api/site-schedules/'+site_id);
    $.ajax({
url: '/fieldsight/api/site-images/'+site_id,
type: 'get', // This is the default though, you don't actually need to always mention it
dataType: "json",
success: function(data) {
img = '';
console.log(data.images);
for(i=0;i<data.images.length;i++){console.log(data.images[i]);
    img += '<img src = '+data.images[i]+'/>';
}

 $('.popop-container').show();
 $('.popop-gallery').html(img);
//$('.popop-gallery').html(data.images);
},
failure: function(data) { 
}
}); 
    $('.popop-head').addClass('changed');
    $('.popop-head').html(e.layer.feature.properties.name);
    $('.address-popop').html(e.layer.feature.properties.address);
    //$('.contact-popup').html(e.layer.feature.properties.contact);


});

map.on('click',function(){
    $('.popop-head').removeClass('changed');
    $('.popop-head').html('');
    $('.address-popop').html('');
    //$('.contact-popup').html('');
});


