const charset2homophones = require('./lib/generator.js')
const fs                 = require('fs')

// strength
var max            = process.argv[2]
if (max          === undefined) max = 394

// frequency
var languageFile   = process.argv[3]
if (languageFile === undefined) languageFile = 'languages/frequency_en.json'
const language_frequency = JSON.parse(fs.readFileSync(languageFile))

// actual subset
var charsetFile    = process.argv[4]
if (charsetFile  === undefined) charsetFile  = 'languages/charset_en.json'
const our_charset        = JSON.parse(fs.readFileSync(charsetFile))

var homophones = charset2homophones(language_frequency, our_charset, max)
var keyFormat = {
  v: 1, // version number
  h: homophones, // charset to homophones map (includes charset, max (count of homophones) and all homophones)
  c: 'strip',
}
console.log(JSON.stringify(keyFormat, null, 2))
