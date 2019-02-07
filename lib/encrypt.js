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

// browser support
;
(function(module){
  module.exports = encrypt
})(typeof module === 'undefined'? this['encrypt']={}: module);
