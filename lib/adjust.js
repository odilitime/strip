function adjustFrequency(language_frequency, string, scale) {
  // get frequencies of string
  var counts = {}
  //var maxVector = 0
  for(var i in string) {
    var l = string[i]
    if (counts[l] === undefined) counts[l]=0
    counts[l]++
    //maxVector = Math.max(maxVector, counts[l])
  }
  //console.log('max dupe', maxVector)

  var rScale = 0
  if (scale >= 12) {
    // 48 = 0.125
    // 24 = 0.25
    // 12 = 0.5
    rScale = 6 / scale
  } else {
    // 0 - 12
    // 11 = 0.5ish 0
    // 6  = 0.75
    // 1  = 1ish 11
    rScale = 0.5 + 0.5 * ((12 - scale) / 12)
  }
  console.error('unused reduction scale', rScale)

  // adjust language_frequency
  var newFreqSet = JSON.parse(JSON.stringify(language_frequency))

  // scale down unused
  for(var l in newFreqSet) {
    if (!counts[l]) {
      newFreqSet[l] *= rScale
      //newFreqSet[l] = Math.round(newFreqSet[l])
      if (language_frequency[l] != newFreqSet[l]) {
        console.error('lowering', l, 'from', language_frequency[l], 'to', newFreqSet[l])
      }
    }
  }
  // scale up used
  for(var l in counts) {
    var cnt = counts[l]
    var freq = language_frequency[l]
    //var relPer = cnt / maxVector
    var absPer = cnt / string.length
    //console.log(l, cnt, absPer, freq, absPer * scale)
    // 0> means increase
    // 1 means double
    // 0> = 1
    // 1 = 2
    var scaled = absPer * (scale / 12)
    if (freq) {
      newFreq = freq * (1 + scaled)
    } else {
      newFreq = scaled
    }
    newFreqSet[l] = newFreq
    console.error('increasing', l, 'from', freq, 'to', newFreq)
  }
  return newFreqSet
}
// browser support
;
(function(ref){
  if (ref === undefined) {
    ref = adjustFrequency
  } else {
    ref.exports = adjustFrequency
  }
})(typeof module === 'undefined'? this['adjustFrequency']: module);
