var redis = require('redis')
var client = redis.createClient()
var tipots = require('this-is-probably-ok-to-say')
var Twit = require('twit')
var config = require('./config')
var T = new Twit(config)

var stream = T.stream('user')

stream.on('tweet', function (t) {
  console.log('processing', t.user.screen_name, t.text)
  if (thisTweetIsPromising(t)) client.publish("OCVq", JSON.stringify(t))
})

function thisTweetIsPromising (t) {
  return hasImage(t) && willNotNotifyOtherUsers(t) && willHopefullyNotBeDisrespectful(t)
}

function hasImage (t) {
  // only look at tweets that have 1 image for now. better to focus than try to catch everything i think...
  return t.extended_entities && t.extended_entities.media && t.extended_entities.media.length == 1
}

function willNotNotifyOtherUsers (t) {
  // is not an RT or a reply/mention (otherwise we might reply to images posted by someone that has not opted-in)
  // also is not a tweet from this user itself, because for some reason it will double fave or w/e
  return t.user.screen_name !== 'wowwwbeautiful' && !t.retweeted_status && !t.entities.user_mentions.length
}

function willHopefullyNotBeDisrespectful (t) {
  // runs iscool on the text via tipots. other strings to avoid can be added to the regex.
  return tipots(t.text) && !t.text.match(/sayhername|tw |cw |trigger|warning/i))
}