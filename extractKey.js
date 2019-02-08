const fs      = require('fs')
const extract = require('./lib/extract.js')

// given partial or empty key, plain text and encrypted message
// fill out more of the key

// not safe to run more than one copy of the program

var keyFile    = process.argv[2]
var string     = process.argv[3]

// load keyfile
var key        = JSON.parse(fs.readFileSync(keyFile))
var homophones = key.h

var content = '';
process.stdin.resume();
process.stdin.on('data', function(buf) { content += buf.toString() })
process.stdin.on('end', function() {
  //console.log('content', content)
  var message = JSON.parse(content)
  //console.log('message', message)

  key.h = extract(string, message, homophones)

  // save updated keyfile
  var keyFormat = {
    v: 1, // version number
    h: key.h, // charset to homophones map (includes charset, max (count of homophones) and all homophones)
    c: 'strip',
  }
  console.log(JSON.stringify(keyFormat, null, 2))
});

