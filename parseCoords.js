const data = require('./json/exif.json')

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
	const lat = coords.GPSLatitude.split(', '),
		long = coords.GPSLongitude.split(', '),
		parsedLat = ConvertDMSToDD(parseFloat(lat[0]), parseFloat(lat[1]), parseFloat(lat[2]), coords.GPSLatitudeRef),
		parsedLong = ConvertDMSToDD(parseFloat(long[0]), parseFloat(long[1]), parseFloat(long[2]), coords.GPSLongitudeRef)

	return {
		geometry: {
			type: 'point',
			coordinates: [parsedLat, parsedLong],
			properties: {
				name: coords.name.replace('heic', 'jpg')
			}
		}
	}
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
	let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60)
	if (direction == 'S' || direction == 'W') {
		dd = dd * -1
	}
	return dd
}

const geoJSON = []

for (const imgJson of getExifJson(data)) {
	geoJSON.push(ParseDMS(imgJson))
}

console.log(JSON.stringify(geoJSON))
