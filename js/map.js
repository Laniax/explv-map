'use strict';

import { Position } from './model/Position.js';
import { Region } from './model/Region.js';

$(document).ready(function () {

    const currentUrl = new URL(window.location.href);

    const urlCentreX = currentUrl.searchParams.get("centreX");
    const urlCentreY = currentUrl.searchParams.get("centreY");
    const urlCentreZ = currentUrl.searchParams.get("centreZ");
    const urlZoom = currentUrl.searchParams.get("zoom");

    const urlRegionID = currentUrl.searchParams.get("regionID");

    var map = L.map('map', {
        //maxBounds: L.latLngBounds(L.latLng(-40, -180), L.latLng(85, 153))
        zoomControl: false,
        attributionControl: false,
        renderer: L.canvas()
    });

    map.plane = 0;

    if (urlCentreZ) {
        map.plane = Number(urlCentreZ);
    }

    map.updateMapPath = function () {
        if (map.tile_layer !== undefined) {
            map.removeLayer(map.tile_layer);
        }
        map.tile_layer = L.tileLayer('https://raw.githubusercontent.com/Explv/osrs_map_tiles/master/' + map.plane + '/{z}/{x}/{y}.png', {
            minZoom: 4,
            maxZoom: 11,
			
            noWrap: true,
            tms: true
        });
        map.tile_layer.addTo(map);
        map.invalidateSize();
    }

    map.updateMapPath();
    map.getContainer().focus();

    let zoom = 7;
    let centreLatLng = [-79, -137]

    if (urlZoom) {
        zoom = urlZoom;
    }

    if (urlCentreX && urlCentreY && urlCentreZ) {
        const centrePos = new Position(Number(urlCentreX), Number(urlCentreY), Number(urlCentreZ));
        centreLatLng = centrePos.toLatLng(map);

		var rect = centrePos.toLeaflet(map);
		rect.addTo(map);
		
    } else if (urlRegionID) {
        const region = new Region(Number(urlRegionID));
        const centrePos = region.toCentrePosition()
        centreLatLng = centrePos.toLatLng(map);
        zoom = urlZoom || 9;
    }

    map.setView(centreLatLng, zoom);
});
