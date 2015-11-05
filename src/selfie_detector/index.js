var fs = require('fs')
var request = require('request')
var redis = require('redis')
var client = redis.createClient()
var utils = require('./utils')
var config = require('../config')
var selfieRegex = config.selfieRegex
var ocrMax = config.ocrMax
var minSize = config.minSize

client.on('message', function (channel, message) {
  var t = JSON.parse(message)
  var url = t.extended_entities.media[0].media_url
  var path = './temp/' + url.replace(/\/|\:/g, '')
  var ws = fs.createWriteStream(path)
  var hasSelfieHashtag = t.text.match(selfieRegex)
  request(url).pipe(ws)
  ws.on('finish', function(){
    utils.detectText(path, function (ocr) {
      if (ocr.length > ocrMax) {
        console.log(t.id_str, 'is a meme probably', ocr)
        fs.unlink(path, function () {})
      } else {
        utils.detectSelfie(path, t, hasSelfieHashtag, minSize, function (itsProbablyASelfie) {
          console.log(t.id_str, 'is a selfie probably!!!')
          client.rpush('selfies', JSON.stringify(itsProbablyASelfie), redis.print)
          fs.unlink(path, function () {})
        })
      }
    })
  })
})

client.subscribe('OCVq')
