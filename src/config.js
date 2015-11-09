module.exports = {
  twitter: {
    'consumer_key': 'SPIDERS!',
    'consumer_secret': 'spiders!!!',
    'access_token': 'SPIDERS!',
    'access_token_secret': 'moreSPIDERS!'
  },
  filterRegex: /sayhername|tw |cw |trigger|warning|tw\:|cw\:/i, // strings to not reply to
  selfieRegex: /selfie|selfiearmy|transisbeautiful|bodyposi|bodypositive|selfportrait/i, // strings to reply more often to
  ocrMax: 8, // max # of chars that can be detected in the image
  minSize: 10, // detected face should be greated than width / minSize
  replyInterval: 1000 * 60 * 60, // wait at least an hour before replying to someone again
  live: true
}
