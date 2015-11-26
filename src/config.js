module.exports = {
  twitter: {
    'consumer_key': process.env.CONSUMER_KEY,
    'consumer_secret': process.env.CONSUMER_SECRET,
    'access_token': process.env.ACCESS_TOKEN,
    'access_token_secret': process.env.ACCESS_TOKEN_SECRET
  },
  filterRegex: /sayhername|paris|porteouverte|france|pray|tw |cw |trigger|warning|tw\:|cw\:/i, // strings to not reply to
  selfieRegex: /selfie|selfiearmy|transisbeautiful|bodyposi|bodypositive|selfportrait/i, // strings to reply more often to
  ocrMax: 8, // max # of chars that can be detected in the image
  minSize: 10, // detected face should be greated than width / minSize
  replyInterval: 1000 * 60 * 60 * 6, // wait time before replying to someone again
  live: true
}
