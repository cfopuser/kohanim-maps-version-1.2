// client/app.js
const map = L.map('map').setView([31.0461, 34.8516], 8); // Centered on Israel

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OSM contributors'
}).addTo(map);

let startMarker, endMarker, routeLayer;

const exclusionLayer = new L.FeatureGroup().addTo(map);

// Render forbidden polygons from server
fetch('/api/forbidden-zones')
  .then(res => res.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      style: { color: 'red', fillColor: 'red', fillOpacity: 0.3 },
      onEachFeature: (feature, layer) => {
        exclusionLayer.addLayer(layer);
      }
    });
  });

// initialize the draw control
const drawControl = new L.Control.Draw({
  draw: {
    polyline: false,
    marker: false,
    circle: false,
    polygon: true,
    circlemarker: false,
    rectangle: false
  },
  edit: {
    featureGroup: exclusionLayer,
    remove: true
  }
});
map.addControl(drawControl);

// when user finishes drawing a polygon, add to exclusionLayer
map.on(L.Draw.Event.CREATED, e => {
  exclusionLayer.addLayer(e.layer);
});

map.on('click', e => {
  if (!startMarker) {
    startMarker = L.marker(e.latlng, { draggable: true }).addTo(map);
    return;
  }
  if (!endMarker) {
    endMarker = L.marker(e.latlng, { draggable: true }).addTo(map);
    return;
  }
  // If both exist, replace them in order
  startMarker.setLatLng(endMarker.getLatLng());
  endMarker.setLatLng(e.latlng);
});

// wire up buttons
document.getElementById('drawBtn').onclick = () => {
  // activate draw toolbar’s polygon button
  document.querySelector('.leaflet-draw-draw-polygon').click();
};

document.getElementById('routeBtn').onclick = async () => {
  if (!startMarker || !endMarker) {
    return alert('Please set both start and end markers by clicking on the map.');
  }

  // collect points [lon,lat] as required by GraphHopper
  const points = [
    [ startMarker.getLatLng().lng, startMarker.getLatLng().lat ],
    [ endMarker.getLatLng().lng,   endMarker.getLatLng().lat   ]
  ];

  const resp = await fetch('http://localhost:4000/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points })
  });
  const data = await resp.json();
  if (data.message) {
    // GraphHopper error
    return alert('GH error: ' + JSON.stringify(data));
  }

  // draw the returned route
  const coords = data.paths[0].points.coordinates.map(c => [c[1], c[0]]); // GH uses [lon,lat]
  if (routeLayer) map.removeLayer(routeLayer);
  routeLayer = L.polyline(coords, { color: 'blue', weight: 5 }).addTo(map);
  map.fitBounds(routeLayer.getBounds(), { padding: [20,20] });
};
