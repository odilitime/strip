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

// browser support
;
(function(module){
  module.exports = decrypt
})(typeof module === 'undefined'? this['decrypt']={}: module);
