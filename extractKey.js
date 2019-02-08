const fs      = require('fs')
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
  // loop for message, set homophones that aren't set
  for(var i in string) {
    var l = string[i]
    var h = message[i]
    if (homophones[l] === undefined) {
      console.error('NEW Letter!', h, '=', l)
      key.h[l] = [h]
    } else {
      var idx = homophones[l].indexOf(h)
      if (idx == -1) {
        console.error('NEW HomoPhone!', h, '=', l)
        key.h[l].push(h)
      }
    }
  }
  // check for dupes
  // save updated keyfile
  var keyFormat = {
    v: 1, // version number
    h: key.h, // charset to homophones map (includes charset, max (count of homophones) and all homophones)
    c: 'strip',
  }
  console.log(JSON.stringify(keyFormat, null, 2))
});

