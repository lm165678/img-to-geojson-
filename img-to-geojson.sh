
cd ./images/ && for f in *; do mv "$f" "$f.tmp"; mv "$f.tmp" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done
echo Successfully formated heic image names...
mogrify -format jpg *.heic
mkdir jpgs_100 jpgs 
for f in ./*.jpg; do mv "${f}" ./jpgs_100; done
echo Successfully converted heics to jpgs...
for f in ./jpgs_100/*.jpg;
  do echo Resizing $(basename "${f}") && mogrify -path "./jpgs" -filter Triangle -define filter:support=2 -thumbnail "50%" -unsharp 0.25x0.08+8.3+0.045 -dither None -posterize 136 -quality 85 -define heic:fancy-upsampling=off -define heic:compression-filter=5 -define heic:compression-level=9 -define heic:compression-strategy=1 -define heic:exclude-chunk=all -interlace none -colorspace sRGB "${f}";
done
echo Successfully resized jpgs... 
rm -rf jpgs_100
cd .. 
convert ./images/*.heic json: > ./json/exif.json 
echo Successfully extracted exif data from images... 
node ./js/parseCoords.js > ./json/geoJson.json 
echo Successfully parsed exif data to geoJson...
