var frequency = {
  'a': 8,
  'b': 2,
  'c': 3,
  'd': 4,
  'e': 12,
  'f': 2,
  'g': 2,
  'h': 6,
  'i': 7,
  'j': 0,
  'k': 1,
  'l': 4,
  'm': 3,
  'n': 7,
  'o': 8,
  'p': 2,
  'q': 0,
  'r': 6,
  's': 6,
  't': 9,
  'u': 3,
  'v': 1,
  'w': 2,
  'x': 0,
  'y': 2,
  'z': 0,
  '[': 0,
  ']': 0,
  '\\': 0,
  ';': 0,
  '\'': 0,
  ',': 4,
  '.': 4,
  '/': 1,
  '`': 0,
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  '6': 0,
  '7': 0,
  '8': 0,
  '9': 0,
  '0': 0,
  '-': 1,
  '=': 0,
  '§': 3,
  ' ': 12,
  'A': 3,
  'B': 1,
  'C': 1,
  'D': 0,
  'E': 0,
  'F': 1,
  'G': 0,
  'H': 2,
  'I': 0,
  'J': 0,
  'K': 0,
  'L': 1,
  'M': 0,
  'N': 2,
  'O': 1,
  'P': 0,
  'Q': 0,
  'R': 1,
  'S': 3,
  'T': 0,
  'U': 0,
  'V': 1,
  'W': 0,
  'X': 0,
  'Y': 0,
  'Z': 0,
  '{': 1,
  '}': 1,
  '|': 0,
  ':': 0,
  '"': 1,
  '<': 0,
  '>': 0,
  '?': 0,
  '~': 0,
  '!': 0,
  '@': 0,
  '#': 0,
  '$': 0,
  '%': 0,
  '^': 0,
  '&': 0,
  '*': 0,
  '(': 1,
  ')': 1,
  '_': 1,
  '+': 0,
  '\n': 3,
  '\t': 1,
}

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

function encrypt(message, letter2homophones_map) {
  var result = []
  // for each letter in message
  for(var i in message) {
    // find homophone for message letter in offseted random alphabet
    var options = letter2homophones_map[message[i]]
    // map all unmapped characters to '§'
    if (options === undefined) {
      options = letter2homophones_map['§']
    }
    var option = options[Math.floor(Math.random() * options.length)]
    // append a homephone to result
    result.push(option)
  }
  // return result
  return result
}

function decrypt(message, letter2homophones_map) {
  var result = []
  for(var i in message) {
    var h = message[i]
    for(var l in letter2homophones_map) {
      var idx = letter2homophones_map[l].indexOf(h)
      if (idx != -1) {
        result.push(l)
        break
      }
    }
  }
  return result
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
