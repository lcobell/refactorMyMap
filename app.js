// Location tracking alert
alert('This app would like to use your location, please wait.')
//map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	//  function render leaflet map
	renderMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 8,
		});

		// add openstreetmap tiles

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)


		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)  //append to map
		.bindPopup('<p1><b>This is you!</b><br></p1>')
		.openPopup()
	},

// 	//add business markers function, I want to customize markers
   // ADD A MARKER


}
// get coordinates via geolocation api
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

// get foursquare businesses, async function, fetch request


// process foursquare array




window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.renderMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})
