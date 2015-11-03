var redis = require('redis')
var client = redis.createClient()
var thisTweetIsPromising = require('./utils').thisTweetIsPromising
var Twit = require('twit')
var config = require('../config')
var T = new Twit(config)

var stream = T.stream('user')

stream.on('tweet', function (t) {
  console.log('processing', t.user.screen_name, t.text)
  if (thisTweetIsPromising(t)) client.publish("OCVq", JSON.stringify(t))
})