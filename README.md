1. Use [imagemagick](https://imagemagick.org/script/download.php) to get exif data of HEIC images and output it to `json/exif.json`.

```console
convert ./images/*.heic json: > ./json/exif.json
```

2. Then redirect the output of calling parseCoords.js into `json/geoJson.json`

```console
code parseCoords.js > ./json/geoJson.json
```
