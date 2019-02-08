function extractHomophones(plaintext, cipher, letter2homophones_map) {
  var new_l2h_map = JSON.parse(JSON.stringify(letter2homophones_map))
  for(var i in plaintext) {
    var l = plaintext[i]
    var h = cipher[i]
    if (h === undefined || h === null) {
      continue
    }
    if (new_l2h_map[l] === undefined) {
      console.error('NEW Letter!', h, '=', l)
      new_l2h_map[l] = [h]
    } else {
      var idx = new_l2h_map[l].indexOf(h)
      if (idx == -1) {
        console.error('NEW HomoPhone!', h, '=', l)
        new_l2h_map[l].push(h)
      }
    }
  }
  // check for dupes
  return new_l2h_map
}

// browser support
;
(function(ref){
  if (ref === undefined) {
    ref = extractHomophones
  } else {
    ref.exports = extractHomophones
  }
})(typeof module === 'undefined'? this['extractHomophones']: module);
