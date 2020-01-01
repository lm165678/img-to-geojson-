## IMG-TO-GEOJSON

---

A utility tool that extracts image exif data and parses the data to geoJson.

Directory structure

```bash
img-to-geojson
├── images #Put images to extract geoJson from here
│   ├── *.HEIC
│   ├── *.JPEG
│   ├── *.heic
├── json
│   ├── exif.json
│   ├── geoJson.json #This is where the geoJson data will be saved
├── img-to-geojson.sh
├── index.js
├── package.json
├── README.md
└── ...
```

> Note: This module relies on [Node.js](https://nodejs.org/en/download/) and [Imagemagick](https://imagemagick.org/). Imagemagick can be installed with brew - `brew install imagemagick`. [More installation info](https://imagemagick.org/script/download.php).

> 1.  Make sure images are in the `./images` directory.
> 2.  `./json/geoJson.json` is where the geoJson data will be saved

### Usage

---

```bash
image-to-geojson:$ node index.js
```
