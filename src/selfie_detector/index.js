var fs = require('fs')
var request = require('request')
var redis = require('redis')
var client = redis.createClient()
var utils = require('./utils')

client.on('message', function (channel, message) {
  var t = JSON.parse(message)
  var url = t.extended_entities.media[0].media_url
  var path = './temp/' + url.replace(/\/|\:/g, '')
  var ws = fs.createWriteStream(path)
  var hasHashtag = t.text.match(/selfie|selfiearmy|transisbeautiful|bodyposi|bodypositive|selfportrait/i)
  request(url).pipe(ws)
  ws.on('finish', function(){
    utils.detectText(path, function (ocr) {
      if (ocr.length > 12) {
        console.log(t.id_str, 'is a meme probably', ocr)
      } else {
        utils.detectSelfie(path, t, hasHashtag, function (its_a_selfie_probably_yay) {
          console.log(t.id_str, 'is a selfie probably!!!')
          client.rpush('selfies', JSON.stringify(its_a_selfie_probably_yay), redis.print);
        })
      }
    })
  })
})

client.subscribe('OCVq')
