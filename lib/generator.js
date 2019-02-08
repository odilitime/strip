
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

// generate a set of homephones based on a range and charset
function charset2homophones(frequency, charset, max) {
  if (max === undefined) {
    console.error('max is required')
    return {}
  }
  noDupeCharset = ArrNoDupe(charset)
  var rows = noDupeCharset.length
  if (max < rows) {
    console.error('max(', max, ') needs to exceed unique characters (', rows, ')')
    return {}
  }

  // total slots
  var totalFreqSlots = 0
  var slotMap = {}
  for(var i in noDupeCharset) {
    var l = noDupeCharset[i]
    var freq = frequency[l] + 1
    for(var j = totalFreqSlots; j < totalFreqSlots + freq; j++) {
      slotMap[j] = l
    }
    totalFreqSlots += freq
  }

  var l2h_map = {}
  var last = 0

  var allButOne = max - noDupeCharset.length
  // random distribution
  for(var i=0; i < allButOne; i++) {
    var randSlot = Math.floor(Math.random() * totalFreqSlots)
    var randLetter = slotMap[randSlot]
    //if (randLetter === undefined) console.error('no slot at', randSlot, '/', totalFreqSlots)
    if (l2h_map[randLetter] === undefined) l2h_map[randLetter] = []
    l2h_map[randLetter].push(last) // enumerate value
    last++
  }

  // make sure all letters get at least one assignment
  var shuffledLetters = shuffle(noDupeCharset)
  for(var i in shuffledLetters) {
    var l = shuffledLetters[i]
    if (l2h_map[l] === undefined) {
      l2h_map[l] = [last] // enumerate value
      last++
    }
  }

  // final round: random sprinkle until full
  while(last < max) {
    var randSlot = Math.floor(Math.random() * totalFreqSlots)
    var randLetter = slotMap[randSlot]
    l2h_map[randLetter].push(last) // enumerate value
    last++
  }
  return l2h_map
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
