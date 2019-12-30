const data = require('./../json/exif.json')

function getExifJson(data) {
	const imagesData = []
	for (const obj of data) {
		const image = obj.image,
			imgData = {
				name: image.baseName,
				GPSLatitude: image.properties['exif:GPSLatitude'],
				GPSLatitudeRef: image.properties['exif:GPSLatitudeRef'],
				GPSLongitude: image.properties['exif:GPSLongitude'],
				GPSLongitudeRef: image.properties['exif:GPSLongitudeRef']
			}
		imagesData.push(imgData)
	}
	return imagesData
}

function ParseDMS(coords) {
	const lat = [],
		long = []
	for (const item of coords.latitude) {
		const split = item.split('/')
		lat.push(split[0] / split[1])
	}
	for (const item of coords.longitude) {
		const split = item.split('/')
		long.push(split[0] / split[1])
	}

	const parsedLat = ConvertDMSToDD(lat[0], lat[1], lat[2], coords.latDirection),
		parsedLong = ConvertDMSToDD(long[0], long[1], long[2], coords.longDirection)
	return {
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [parsedLat, parsedLong]
		},
		properties: {
			name: coords.name.replace('heic', 'jpg')
		}
	}
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
	let dd = degrees + minutes / 60 + seconds / (60 * 60)
	if (direction == 'S' || direction == 'W') {
		dd = dd * -1
	}
	return dd
}

const geoJSON = []

for (const imgJson of getExifJson(data)) {
	const coords = {
		name: imgJson.name,
		latitude: imgJson.GPSLatitude.split(','),
		longitude: imgJson.GPSLongitude.split(','),
		latDirection: imgJson.GPSLatitudeRef,
		longDirection: imgJson.GPSLongitudeRef
	}

	geoJSON.push(ParseDMS(coords))
}

console.log(JSON.stringify(geoJSON))
