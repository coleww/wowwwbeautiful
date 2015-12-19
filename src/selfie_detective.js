var redis = require('redis')
var client = redis.createClient()
var fs = require('fs')
var request = require('request')
var utils = require('./utils')
var thisTweetIsPromising = utils.thisTweetIsPromising
var Twit = require('twit')
var config = require('./config')
var T = new Twit(config.twitter)
var selfieRegex = config.selfieRegex
var ocrMax = config.ocrMax
var minSize = config.minSize
var stream = T.stream('user')

stream.on('tweet', function (t) {
  console.log('processing', t.user.screen_name, t.text)
  if (thisTweetIsPromising(t)) {
    var url = t.extended_entities.media[0].media_url
    var path = './temp/' + url.replace(/\/|\:/g, '')
    var ws = fs.createWriteStream(path)
    var hasSelfieHashtag = t.text.match(selfieRegex)
    request(url).pipe(ws)
    ws.on('finish', function () {
      utils.detectText(path, function (ocr) {
        if (ocr.length > ocrMax) {
          console.log(t.id_str, 'is a meme probably', ocr)
          fs.unlink(path, function () {})
        } else {
          utils.detectSelfie(path, t, hasSelfieHashtag, minSize, function (itsProbablyASelfie) {
            console.log(t.id_str, 'is a selfie probably!!!')
            var isSuiOrCole = !!t.user.screen_name.match(/^(swayandsea|colewillsea)$/)
            if (isSuiOrCole || Math.random() > 0.3) {
              console.log(t.id_str, 'pushing')
              client.rpush('selfies', JSON.stringify(itsProbablyASelfie), redis.print)
            } else {
              console.log(t.id_str, 'no dice')
            }
            fs.unlink(path, function () {})
          })
        }
      })
    })
  }
})
