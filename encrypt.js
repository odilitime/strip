const encrypt = require('./lib/encrypt.js')
const fs      = require('fs')

var keyFile    = process.argv[2]
var string     = process.argv[3]
var key        = JSON.parse(fs.readFileSync(keyFile))
var homophones = key.h
//console.dir(homophones)

var test = encrypt(string, homophones)
console.log(test)
