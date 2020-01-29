const data = require('./../json/exif.json')
const noLocation = [],
  geoJSON = []

function getExifJson(data) {
  const imagesData = []
  for (const obj of data) {
    const image = obj.image,
      width = image.geometry.width,
      height = image.geometry.height,
      orientation = width / height > 1 ? 'potrait' : 'landscape'
    if (!image.properties['exif:GPSLatitude']) {
      noLocation.push({
        name: image.baseName,
        geometry: image.geometry,
        orientation
      })
      continue
    }

    imgData = {
      name: image.baseName,
      GPSLatitude: image.properties['exif:GPSLatitude'],
      GPSLatitudeRef: image.properties['exif:GPSLatitudeRef'],
      GPSLongitude: image.properties['exif:GPSLongitude'],
      GPSLongitudeRef: image.properties['exif:GPSLongitudeRef'],
      geometry: image.geometry,
      orientation
    }
    imagesData.push(imgData)
  }
  return imagesData
}

function createGeoJson(name, parsedLat, parsedLong, geometry, orientation) {
  const coordinates = parsedLat && parsedLong ? [parsedLong, parsedLat] : []
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates
    },
    properties: {
      name,
      dimensions: geometry,
      orientation
    }
  }
}

function ParseDMS(imageData) {
  const lat = [],
    long = []
  for (const item of imageData.latitude) {
    const split = item.split('/')
    lat.push(split[0] / split[1])
  }
  for (const item of imageData.longitude) {
    const split = item.split('/')
    long.push(split[0] / split[1])
  }

  const parsedLat = ConvertDMSToDD(
      lat[0],
      lat[1],
      lat[2],
      imageData.latDirection
    ),
    parsedLong = ConvertDMSToDD(
      long[0],
      long[1],
      long[2],
      imageData.longDirection
    )
  return createGeoJson(
    imageData.name,
    parsedLat,
    parsedLong,
    imageData.geometry,
    imageData.orientation
  )
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / (60 * 60)
  if (direction == 'S' || direction == 'W') {
    dd = dd * -1
  }
  return dd
}

for (const imgJson of getExifJson(data)) {
  const imageData = {
    name: imgJson.name,
    latitude: imgJson.GPSLatitude.split(','),
    longitude: imgJson.GPSLongitude.split(','),
    latDirection: imgJson.GPSLatitudeRef,
    longDirection: imgJson.GPSLongitudeRef,
    geometry: imgJson.geometry,
    orientation: imgJson.orientation
  }

  geoJSON.push(ParseDMS(imageData))
}

for (const imgJson of noLocation) {
  geoJSON.push(
    createGeoJson(
      imgJson.name,
      null,
      null,
      imgJson.geometry,
      imgJson.orientation
    )
  )
}

console.log(JSON.stringify(geoJSON))
