const charset2homophones = require('./lib/generator.js')
const adjustFrequency    = require('./lib/adjust.js')
const fs                 = require('fs')

var string        = process.argv[2]
var scale         = process.argv[3]
// is it a scaling factor or a max
// lower scale, increasing scale
if (scale       === undefined) scale = 12

// actual subset
var charsetFile   = process.argv[4]
if (charsetFile === undefined) charsetFile  = 'languages/charset_en.json'
const our_charset = JSON.parse(fs.readFileSync(charsetFile))

var content = '';
process.stdin.resume();
process.stdin.on('data', function(buf) { content += buf.toString() })
process.stdin.on('end', function() {
  if (!content) content = {}
  //console.log('content', content)
  const language_frequency = JSON.parse(content)

  var adjusted = adjustFrequency(language_frequency, string, scale)
  console.log(JSON.stringify(adjusted, null, 2))
})
