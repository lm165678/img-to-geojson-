#!/usr/bin/env node
const { exec } = require('child_process')

const shellScript = exec('. ./img-to-geojson.sh')

shellScript.stdout.on('data', data => {
  console.log(data)
})

shellScript.stderr.on('data', data => {
  console.error(data)
})
