# strip
Snerx Strip Cipher (SSC)

## Command Line Interface

Make your key (range defaults to 394)
`# node makeKey.js [range] > key`

Use the key to encode your message
`# node encrypt.js key "this is my messsage" > msg`

Use the key to decode your message
`# node decrypt.js key < msg`

Use message and the plain text equivalent to try to reverse the key
`# node bruteKey.js inputKey "this is my message" < msg > outputKey`

## API

charset2homophones(frequnecy set, character set, range of result homophone symbols) returns a letter to homephone mapping

encrypt(message, letter to homophones map) returns an array of all homophones

decrypt(message, letter to homophones map) decodes homophones back into original message
