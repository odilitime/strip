const decrypt = require('./lib/decrypt.js')
const fs      = require('fs')

var keyFile    = process.argv[2]
var key        = JSON.parse(fs.readFileSync(keyFile))
var homophones = key.h
//console.dir(homophones)

var content = ''
process.stdin.resume()
process.stdin.on('data', function(buf) { content += buf.toString() })
process.stdin.on('end', function() {
  //console.log('content', content)
  var message = JSON.parse(content)
  //console.log('message', message)
  var result = decrypt(message, homophones)
  console.log(result.join(""))
})

