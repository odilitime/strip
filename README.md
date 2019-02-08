# strip
Snerx Strip Cipher (SSC)

## Play with it
This makes a key, encrypts a string into a message, and decrypts that message back into a string
`# node strip.js ` (strip takes same params as makeKey)

## Command Line Interface

Make your key (range defaults to 394)
`# node makeKey.js [range] [languages/frequency_en.json] [languages/charset_en.json] > key`

Use the key to encode your message
`# node encrypt.js key "this is my message" > msg`

Use the key to decode your message
`# node decrypt.js key < msg`

Use message and the plain text equivalent to try to reverse the key
`# node bruteKey.js inputKey "this is my message" < msg > outputKey`

Tailor frequencies for specific plain text
`# node adjustFrequnecy.js "Adjust the frequencies" < languages/frequency_en.json > frequency_custom.json`

## API

charset2homophones(frequency set, character set, range of result homophone symbols) returns a letter to homephone mapping

encrypt(plaintext, letter to homophones map) returns an array of all homophones

decrypt(cipher, letter to homophones map) decodes homophones back into original message

extractHomophones(plaintext, cipher, frequency set) return updated frequency set

adjustFrequency(frequency set, plaintext, scale) return updated frequency set
