
// borrowed from https://stackoverflow.com/a/6940176
function ArrNoDupe(a) {
  var temp = {}
  for (var i = 0; i < a.length; i++)
    temp[a[i]] = true
  var r = []
  for (var k in temp)
    r.push(k)
  return r
}

// borrowed from https://stackoverflow.com/a/6274381
function shuffle(a) {
  var j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

// create a probability map
function getSlotMap(noDupeCharset, frequency) {
  // total slots
  var totalFreqSlots = 0
  var slotMap = {}
  // console.log('charSet', noDupeCharset)
  for(var i in noDupeCharset) {
    var l = noDupeCharset[i]
    var freq = frequency[l] + 1
    for(var j = parseInt(totalFreqSlots); j < parseInt(totalFreqSlots) + Math.round(freq); j++) {
      slotMap[j] = l
    }
    totalFreqSlots += Math.round(freq)
  }
  console.log('totalFreqSlots', totalFreqSlots)
  return {
    slotMap: slotMap,
    totalFreqSlots: totalFreqSlots
  }
}

// fills any gaps
function checkMap(last, noDupeCharset, l2h_map) {
  // make sure all letters get at least one assignment
  var shuffledLetters = shuffle(noDupeCharset)
  for(var i in shuffledLetters) {
    var l = shuffledLetters[i]
    if (l2h_map[l] === undefined) {
      l2h_map[l] = [last] // enumerate value
      last++
    }
  }
  return last
}

// generate a set of homephones based on a range and charset
function charset2homophonesEngine(frequency, charset, max, chooser) {
  if (max === undefined) {
    console.error('max is required')
    return {}
  }
  var noDupeCharset = ArrNoDupe(charset)
  var rows = noDupeCharset.length
  if (max < rows) {
    console.error('max(', max, ') needs to exceed unique characters (', rows, ')')
    return {}
  }
  var obj = getSlotMap(noDupeCharset, frequency)
  var totalFreqSlots = obj.totalFreqSlots
  var slotMap = obj.slotMap

  var l2h_map = {}
  var last = 0

  var allButOne = max - noDupeCharset.length

  // distribution
  for(var i=0; i < allButOne; i++) {
    var letter = chooser(slotMap, totalFreqSlots)
    if (letter === undefined) letter = '§'
    //if (randLetter === undefined) console.error('no slot at', randSlot, '/', totalFreqSlots)
    if (l2h_map[letter] === undefined) l2h_map[letter] = []
    l2h_map[letter].push(last) // enumerate value
    last++
  }
  last = checkMap(last, noDupeCharset, l2h_map)

  // final round: sprinkle until full
  while(last < max) {
    var letter = chooser(slotMap, totalFreqSlots)
    if (letter === undefined) letter = '§'
    if (l2h_map[letter] === undefined) l2h_map[letter] = []
    l2h_map[letter].push(last) // enumerate value
    last++
  }
  return l2h_map
}

// https://stackoverflow.com/a/55926440
function sha512(str) {
  return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('')
  })
}

// generate a deterministic set of homephones based on a range and charset
async function charset2homophonesSecretHash(frequency, charset, max, secret, cb) {
  // make this 64 characters long
  var hash = await sha512(secret)
  console.log('hash', hash)
  // convert 64 characters into 64 Uint8s (0-255)
  var typedArray = new Uint8Array(hash.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  }))
  // 64 entries from 0 to 255
  var charArr = typedArray // hash.split('')
  console.log('charArr', charArr)
  var values = {}
  // find min/max and count unique values
  var initialVector = charArr.reduce(function(accum, curVal, idx) {
    if (values[curVal] === undefined) values[curVal] = 0
    values[curVal] ++
    accum.min = Math.min(curVal, accum.min)
    accum.max = Math.max(curVal, accum.max)
    return accum
  }, { min: 65535, max: 0 })
  var range = initialVector.max - initialVector.min
  console.log('initialVector', initialVector, 'range', range, 'entropy', Object.keys(values).length)
  var idx = 0
  var homophones = charset2homophonesEngine(frequency, charset, max, function(slotMap, totalFreqSlots) {
    var curVal = parseInt(hash[idx], 16) * 16 + parseInt(hash[idx + 1], 16)
    var secCharAdj = curVal - initialVector.min
    // console.log('secChar', secChar, 'for', secretPos, 'secCharAdj', secCharAdj)
    var percent = (curVal - initialVector.min) / range
    //console.log('randPer', randPer)
    randSlot = parseInt(percent * totalFreqSlots)
    //console.log('randSlot', randSlot, '/', totalFreqSlots, 'slot', slotMap[randSlot])
    idx += 2
    if (idx >= charArr.length) {
      idx = 0
    }
    return slotMap[randSlot]
  })
  if (cb) cb(homophones)
  return homophones
}

const enc = new TextEncoder()

async function charset2homophonesSecretOneToOne(frequency, charset, max, secret, cb) {
  if (max === undefined) {
    console.error('max is required')
    return {}
  }
  var noDupeCharset = ArrNoDupe(charset)
  var rows = noDupeCharset.length

  var obj = getSlotMap(noDupeCharset, frequency)
  var totalFreqSlots = obj.totalFreqSlots // like 250
  var homophonesPerSymbol = max / totalFreqSlots
  // console.log('max', max)
  // console.log('homophonesPerSymbol', homophonesPerSymbol)
  // console.log('totalFreqSlots', totalFreqSlots)

  // generate a range of homephones
  const RANGE = (a,b) => Array.from((function*(x,y){
    while (x <= y) yield x++;
  })(a,b));
  const homophones = RANGE(0, max)
  // console.log('homophone range', homophones)

  // console.log('frequency', frequency)

  // shuffle it by secret
  var pos = 0
  homophones.sort(function(a, b) {
    var data = secret.charCodeAt(pos)
    // console.log(pos, data)
    pos++
    if (pos == secret.length) pos = 0
    return (data % 2 == 0) ? -1 : 1
  })

  // console.log('sorted homophones', homophones)

  // distribute it
  var acc = homophonesPerSymbol
  var ttl = 0
  var lowscore = 99
  var countPerSymbol = {}
  for(i in charset) {
    var chr = charset[i]
    var freq = frequency[chr] + 1
    var homophonesForThisSymbol = freq * parseInt(acc)
    var accInt = parseInt(acc)
    acc -= accInt
    // lower means
    var score = homophonesForThisSymbol / freq
    lowscore = Math.min(score, lowscore)
    // console.log('chr', chr, 'freq', freq, 'needs', homophonesForThisSymbol, 'score', score)
    countPerSymbol[chr] = homophonesForThisSymbol

    // homophonesForThisSymbol = freq

    ttl += homophonesForThisSymbol
    acc += homophonesPerSymbol
  }
  // console.log('max', max, 'ttl', ttl)
  var remaining = max - ttl
  // console.log('remaining', remaining, 'lowscore', lowscore)
  var lowest = []
  // reset acc
  acc = homophonesPerSymbol
  for(i in charset) {
    var chr = charset[i]
    var freq = frequency[chr] + 1
    var homophonesForThisSymbol = freq * parseInt(acc)
    var accInt = parseInt(acc)
    acc -= accInt
    // lower means
    var score = homophonesForThisSymbol / freq
    //console.log('chr', chr, 'freq', freq, 'needs', homophonesForThisSymbol, 'acc', acc, 'score', score, 'lowscore', lowscore)
    if (score === lowscore) {
      // console.log('hit', chr, score, freq)
      lowest.push([score, freq, chr])
    }
    acc += homophonesPerSymbol
  }
  // sort lowest by arr[2]
  // console.log('lowest', lowest)
  lowest.sort(function(a, b) {
    // 0 is equal
    // -1 is a goes before b
    var s1 = a[0]
    var s2 = b[0]
    if (s1 == s2) {
      var f1 = a[1]
      var f2 = b[1]
      if (f1 == f2) return 0
      return (f1 < f2) ? -1 : 1
    }
    return (s1 < s2) ? -1 : 1
  })
  var round = [...lowest] // copy
  // sprinkle the remaining
  for(var i = 0; i < remaining; i++) {
    var next = round.pop()
    if (!round.length) round = [...lowest]
    countPerSymbol[next[2]] ++
  }
  // console.log('Symbol', Object.keys(countPerSymbol).length, 'vs', rows)
  // console.log('countPerSymbol', countPerSymbol)
  if (Object.keys(countPerSymbol).length != rows) {
    alert("Failure")
    return {}
  }

  var l2h_map = {}
  round = [...noDupeCharset] // copy
  // ok now do the distribution
  for(var i = 0; i < max; i++) {
    var nextChr = round.pop()
    if (!round.length) round = [...noDupeCharset]
    while(!countPerSymbol[nextChr]) {
      nextChr = round.pop()
      if (!round.length) round = [...noDupeCharset]
    }
    countPerSymbol[nextChr] --
    if (l2h_map[nextChr] === undefined) l2h_map[nextChr] = []
    l2h_map[nextChr].push(homophones.pop())
  }
  // console.log('l2h_map', l2h_map)
  if (cb) cb(l2h_map)
  return l2h_map
}

// generate a deterministic set of homephones based on a range and charset
async function charset2homophonesSecretHand(frequency, charset, max, secret, cb) {
  var charArr = enc.encode(secret)
  console.log('charArr', charArr)
  var values = {}
  // find min/max and count unique values
  var initialVector = charArr.reduce(function(accum, curVal, idx) {
    if (values[curVal] === undefined) values[curVal] = 0
    values[curVal] ++
    accum.min = Math.min(curVal, accum.min)
    accum.max = Math.max(curVal, accum.max)
    return accum
  }, { min: 65535, max: 0 })
  var range = initialVector.max - initialVector.min
  console.log('initialVector', initialVector, 'range', range, 'entropy', Object.keys(values).length)
  var idx = 0
  let ttlFreq = 0
  var homophones = charset2homophonesEngine(frequency, charset, max, function(slotMap, totalFreqSlots) {
    var curVal = charArr[idx]
    ttlFreq = totalFreqSlots
    var secCharAdj = curVal - initialVector.min
    // console.log('secChar', secChar, 'for', secretPos, 'secCharAdj', secCharAdj)
    var percent = (curVal - initialVector.min) / range
    //console.log('randPer', randPer)
    randSlot = parseInt(percent * totalFreqSlots)
    //console.log('randSlot', randSlot, '/', totalFreqSlots, 'slot', slotMap[randSlot])
    idx ++
    if (idx == charArr.length) {
      idx = 0
    }
    return slotMap[randSlot]
  })
  if (Object.keys(values).length / ttlFreq < 0.5) {
    console.log('secret has low entrophy for Key Symbol Frequency Set of', ttlFreq)
  }
  if (range < 128) {
    console.log('secret range is low, there will be uneven distribution of the homephobes to symbols')
  }
  if (cb) cb(homophones)
  return homophones
}

// from https://stackoverflow.com/a/424445
function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000 // 2**31
  this.a = 1103515245
  this.c = 12345

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1))
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m
  return this.state
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start
  var randomUnder1 = this.nextInt() / this.m
  return start + Math.floor(randomUnder1 * rangeSize)
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)]
}

var utf8encoder = new TextEncoder()

// from https://stackoverflow.com/a/60505243
function utf8ToHex(s) {
  const rb = utf8encoder.encode(s)
  let r = ''
  for (const b of rb) {
    r += ('0' + b.toString(16)).slice(-2)
  }
  return r
}

// generate a deterministic set of homephones based on a range and charset
async function charset2homophonesSecretSeed(frequency, charset, max, secret, cb) {
  // convert secret into big number
  var hex = utf8ToHex(secret)
  var bn = BigInt('0x' + hex).toString(10)
  var myNumber = Number(bn)
  console.log('stringNumber', myNumber)
  var rng = new RNG(myNumber)
  var homophones = charset2homophonesEngine(frequency, charset, max, function(slotMap, totalFreqSlots) {
    var randSlot = rng.nextRange(0, totalFreqSlots)
    // console.log('randSlot', randSlot, 'slot', slotMap[randSlot])
    return slotMap[randSlot]
  })
  if (cb) cb(homophones)
  return homophones
}

// generate a random set of homephones based on a range and charset
function charset2homophones(frequency, charset, max, cb) {
  var homophones = charset2homophonesEngine(frequency, charset, max, function(slotMap, totalFreqSlots) {
    var randSlot = Math.floor(Math.random() * totalFreqSlots)
    return slotMap[randSlot]
  })
  if (cb) cb(homophones)
  return homophones
}

// browser support
;
(function(ref){
  if (ref === undefined) {
    ref = charset2homophones
  } else {
    ref.exports = charset2homophones
  }
})(typeof module === 'undefined'? this['charset2homophones']: module);
