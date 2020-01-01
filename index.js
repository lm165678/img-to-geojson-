#!/usr/bin/env node
const { exec } = require('child_process')

const format = process.argv[2]

if (format === '--format-name') {
  const formatName = exec(
    'for f in ./images/*; do mv "$f" "$f.tmp"; mv "$f.tmp" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done'
  )

  formatName.stdout.on('data', data => {
    console.log(data)
  })
  formatName.stderr.on('data', data => {
    console.error(data)
  })
  formatName.on('exit', () => {
    const shellScript = exec('. ./img-to-geojson.sh')

    shellScript.stdout.on('data', data => {
      console.log(data)
    })

    shellScript.stderr.on('data', data => {
      console.error(data)
    })
  })
}
