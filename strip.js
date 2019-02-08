const charset2homophones = require('./lib/generator.js')
const encrypt            = require('./lib/encrypt.js')
const decrypt            = require('./lib/decrypt.js')
const fs                 = require('fs')

// string
var string         = process.argv[2]
if (string       === undefined) string = 'The job requires extra pluck and zeal from every young wage earner. '

// strength
var max            = process.argv[3]
if (max          === undefined) max = 394

// frequency
var languageFile   = process.argv[4]
if (languageFile === undefined) languageFile = 'languages/frequency_en.json'
const language_frequency = JSON.parse(fs.readFileSync(languageFile))

// actual subset
var charsetFile    = process.argv[5]
if (charsetFile  === undefined) charsetFile  = 'languages/charset_en.json'
const our_charset        = JSON.parse(fs.readFileSync(charsetFile))

var homophones = charset2homophones(language_frequency, our_charset, max)
console.dir(homophones)
var test       = encrypt(string, homophones)
console.log(test)
var result     = decrypt(test, homophones)
console.log(result.join(""))
