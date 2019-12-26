1. Run this to rename all files to use lowercase from the directory where all the images are.

```console
heics_originals:$ for f in *; do mv "$f" "$f.tmp"; mv "$f.tmp" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done
```

2. Use [imagemagick](https://imagemagick.org/script/download.php) to get exif data of HEIC images and output it to `json/exif.json`.

```console
img-to-geojson:$ convert ./images/heics_originals/*.heic json: > ./json/exif.json
```

3. Then redirect the output of calling parseCoords.js into `json/geoJson.json`

```console
img-to-geojson:$ code parseCoords.js > ./json/geoJson.json
```

4. Convert heic images to jpegs and resize using imagemagick and [using this resizing formula](https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/). Just add the function to `~/.aliases`. Then `source ~/.aliases` from command line.

```bash
#This is the function
smartresize() {
  mogrify -path $3 -filter Triangle -define filter:support=2 -thumbnail $2 -unsharp 0.25x0.08+8.3+0.045 -dither None -posterize 136 -quality 85 -define heic:fancy-upsampling=off -define heic:compression-filter=5 -define heic:compression-level=9 -define heic:compression-strategy=1 -define heic:exclude-chunk=all -interlace none -colorspace sRGB $1
}
```

Then run it like this:

```console
images:$ for f in jpegs_100/*.jpg
         smartresize $f 50% jpegs_resized
```
