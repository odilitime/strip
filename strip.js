const frequency = require('./lib/frequency_en.js')
const encrypt = require('./lib/encrypt.js')
const decrypt = require('./lib/decrypt.js')

// borrowed from https://stackoverflow.com/a/6940176
function ArrNoDupe(a) {
  var temp = {};
  for (var i = 0; i < a.length; i++)
    temp[a[i]] = true;
  var r = [];
  for (var k in temp)
    r.push(k);
  return r;
}

// generate a set of homephones based on a range and charset
function charset2homophones(charset, max) {
  if (max === undefined) {
    console.error('max is required')
    return {}
  }
  if (max < rows) {
    console.error('max(', max, ') needs to exceed unique characters (', charset.length, ')')
    return {}
  }
  noDupeCharset = ArrNoDupe(charset)
  var rows = noDupeCharset.length
  var stdSlots = Math.floor(max / rows)
  console.log('stdSlots', stdSlots, 'rows', rows, 'test', rows * stdSlots , '<', max)
  if (max < rows * stdSlots) {
    console.error('max(', max, ') needs to exceed unique characters (', charset.length, ')')
    return {}
  }
  var used = 0
  var reduce_me = []
  // assign a number of slots for each character in set
  for(var i in noDupeCharset) {
    var l = noDupeCharset[i]
    var freq = frequency[l]
    // 1-13 => percentage
    // 0/12 => percentage of average slot size
    // lets say it's ass is 6, 3, 12
    // 0 = 1,    0 = .5
    // 6 = 7,    6 = 3.5
    // 12 = 13, 12 = 7.5
    // (freq + 1), (freq + 1) * (stdSlots / 6)
    //var slots = Math.ceil(1 + ((freq / 12) * stdSlots))
    var slots = Math.ceil((freq + 1) * (stdSlots / 3))
    reduce_me.push([l, slots])
    used += slots
    console.log(l, 'should get', slots, 'freq', freq)
  }
  var i = 0
  var last = 0
  var l2h_map = {}
  // enumerate each slot until all slots asked for are consumed
  while(reduce_me.length) {
    var l = reduce_me[i][0] // get character
    if (l2h_map[l] === undefined) l2h_map[l] = []
    l2h_map[l].push(last) // enumerate value
    last++ // increase value
    reduce_me[i][1]-- // mark slot as used
    if (!reduce_me[i][1]) {
      reduce_me.splice(i, 1) // mark character as all slots are consumed
    }
    i++ // go to next character
    if (i >= reduce_me.length) i = 0 // if at end then start over at beginning
  }
  console.log('used', last, '/', used, '/', max)
  return l2h_map
}

var our_charset = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '[',
  ']',
  '\\',
  ';',
  '\'',
  ',',
  '.',
  '/',
  '`',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  '-',
  '=',
  '§',
  ' ',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '{',
  '}',
  '|',
  ':',
  '"',
  '<',
  '>',
  '?',
  '~',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '_',
  '+',
  '\n',
  '\t',
]

var homophones = charset2homophones(our_charset, 394)
var test = encrypt('The job requires extra pluck and zeal from every young wage earner. ', homophones)
console.log(test)
var result = decrypt(test, homophones)
console.log(result.join(""))
