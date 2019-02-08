function encrypt(message, letter2homophones_map) {
  var result = []
  // for each letter in message
  for(var i in message) {
    // find homophone for message letter in offseted random alphabet
    var options = letter2homophones_map[message[i]]
    // map all unmapped characters to '§'
    if (options === undefined) {
      if (letter2homophones_map['§'] === undefined) letter2homophones_map['§'] = [null]
      options = letter2homophones_map['§']
    }
    var option = options[Math.floor(Math.random() * options.length)]
    // append a homephone to result
    result.push(option)
  }
  // return result
  return result
}

// browser support
;
(function(module){
  if (ref === undefined) {
    ref = encrypt
  } else {
    ref.exports = encrypt
  }
})(typeof module === 'undefined'? this['encrypt']: module);
