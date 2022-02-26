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
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},

// 	//add business markers function, I want to customize markers
   // ADD A MARKER

   addMarkers() {
	for (var i = 0; i < this.businesses.length; i++) {
	this.markers = L.marker([
		this.businesses[i].lat,
		this.businesses[i].long,
	])
		.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
		.addTo(this.map)
	}
},
}

// get coordinates via geolocation api
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

// get foursquare businesses, async function, fetch request
async function getFoursquare(business) {
	const options = 
	{method: 'GET', 
	headers: {
	Accept: 'application/json',
	Authorization: `fsq3GfLjfu97/4L4PL/Xti/VY+a1tK1lhjz/6fvcdTcRk88=`
		}
	  }
	  let limit = 5
	  let lat = myMap.coordinates[0]
	  let lon = myMap.coordinates[1]
	  let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	// I think I see how this is supposed to work, I'm getting a 503 service unavailable error, seems like a common thing from reading cors-anywhere
	  let data = await response.text()  //set the data to varaiable and await the response as text
	let parsedData = JSON.parse(data) // parsed data returned as an object
	  let businesses = parsedData.results
	  return businesses
	}
// process foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}



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
