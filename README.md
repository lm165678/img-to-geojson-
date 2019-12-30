## IMG-TO-GEOJSON

---

A utility tool that

1. Converts apple `heic` images to `jpg`
2. Resizes the converted jpgs
3. Extracts exif data and parses the data to geoJson

Directory structure

```bash
img-to-geojson
├── images
│   ├── jpgs
│   *.heic
│   *.heic
├── json
│   ├── exif.json
│   ├── geoJson.json #This is where the geoJson data will be saved
├── .gitignore
├── img-to-geojson.sh
├── index.js
├── package.json
└── README.md
```

> Note: This module relies on [Node.js](https://nodejs.org/en/download/) and [Imagemagick](https://imagemagick.org/). Imagemagick can be installed with brew - `brew install imagemagick`. [More installation info](https://imagemagick.org/script/download.php).

> 1.  Make sure images are in the `./images` directory.
> 2.  `./json/geoJson.json` is where the geoJson data will be saved

### Usage

---

```bash
image-to-geojson:$ node index.js
```

Pass `--delete` or `-D` as an option to delete original `heic`. **_THIS IS IRREVERSIBLE!_**

```bash
image-to-geojson:$ node index.js --delete #DON'T DO THIS IF YOU NEED THE ORIGINALS.
```

### Reference: The expanded version of all the commands used:

---

1. Run this to rename all files to lowercase.

```bash
images:$ for f in *; do mv "$f" "$f.tmp"; mv "$f.tmp" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done
```

2. Convert heic images to jpgs using imagemagick and move to jpgs_100 folder. The resized jpgs will be saved in images/jpgs.

```bash
images:$ mogrify -format jpg *.heic
images:$ mkdir jpgs_100 jpgs
images:$ for f in *.jpg
        mv $f ../jpgs_100
```

3. [Using this resizing formula](https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/) resize images.

```bash
#This is the function
images:$ smartresize() {
  mogrify -path $3 -filter Triangle -define filter:support=2 -thumbnail $2 -unsharp 0.25x0.08+8.3+0.045 -dither None -posterize 136 -quality 85 -define heic:fancy-upsampling=off -define heic:compression-filter=5 -define heic:compression-level=9 -define heic:compression-strategy=1 -define heic:exclude-chunk=all -interlace none -colorspace sRGB $1
}
images:$ for f in jpgs_100/*.jpg
         smartresize $f 50% jpgs
images:$ rm -rf jpgs_100
```

4. Use imagemagick to get exif data of HEIC images and output it to `json/exif.json`.

```bash
img-to-geojson:$ convert ./images/*.heic json: > ./json/exif.json
```

5. Then redirect the output of calling parseCoords.js into `json/geoJson.json`

```bash
img-to-geojson:$ node ./js/parseCoords.js > ./json/geoJson.json
```
