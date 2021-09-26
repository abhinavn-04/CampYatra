const coordinates = campground.geometry.coordinates;
const centerAt = (coordinates.length) ? coordinates : [-104.9903, 39.7392];
mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: centerAt, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl(),'bottom-left');

new mapboxgl.Marker()
    .setLngLat(centerAt)
    .addTo(map)