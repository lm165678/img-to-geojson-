#!/usr/bin/env node
const { exec, execSync } = require('child_process')

const delOpt = process.argv[2]
const shellScript = exec('. ./img-to-geojson.sh')

shellScript.stdout.on('data', data => {
	console.log(data)
})

shellScript.stderr.on('data', data => {
	console.error(data)
})

shellScript.on('exit', code => {
	if (delOpt === '--delete' || delOpt === '-D') {
		const delOriginals = exec(
			'for f in ./images/*.heic; do rm "${f}"; done && echo Successfully deleted original images... && cat ./json/geoJson.json'
		)
		delOriginals.stdout.on('data', data => {
			console.log(data)
		})
		delOriginals.stderr.on('data', data => {
			console.error(data)
		})
	}
})
