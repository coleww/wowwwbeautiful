var fs = require('fs')
var face_detect = require('face-detect')
var Canvas = require('canvas')
var Image = Canvas.Image
var quidprofollow = require('quidprofollow')
var tipots = require('this-is-probably-ok-to-say')
var Twit = require('twit')
var config = require('./config')
var T = new Twit(config)

var name = 'wowwwbeautiful'

quidprofollow({twitterAPIKeys: config}, function reportResults(err, followed, unfollowed) {
  if (err) throw err
  console.log('Followed:', followed)
  console.log('Unfollowed:', unfollowed)
  T.get('statuses/user_timeline', {count: 1, screen_name: name, exclude_replies: false}, function (err, data, response) {
    if (err) throw err
    console.log('grabbing timeline since:', data[0].id_str)
    T.get('statuses/home_timeline', {count: 200, since_id: data[0].id_str, exclude_replies: true}, function (err, data, response) {
      if (err) throw err
      console.log('got', data.length, 'tweets')


      // TODO maybe pop off tweets on a timer so as to avoid rate limits...
      data.forEach(function(tweet){
        console.log(tweet.text)

        // reject tweets that don't have 1 image, or contain awful language, or that are retweets
        if (hasImage(tweet) && tipots(tweet.text) && !tweet.retweeted_status) {
          replyIfTheTweetIsASelfie(tweet)
        }
      })
    })
  })
})

function hasImage (tweet) {
  // for now, only accepting tweets that have exactly 1 image
  return tweet.extended_entities.media && tweet.extended_entities.media.length == 1
  // TODO figure out how to handle multi-image tweets (accept them if they are all selfies?)
}

function replyIfTheTweetIsASelfie (tweet) {
  img = new Image

  img.onload = function() {
    var width = img.width
    var height = img.height
    var canvas = new Canvas(width, height)
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)
    var result = face_detect.detect_objects({ "canvas" : canvas,
      "interval" : 5,
      "min_neighbors" : 1 })

    console.log('Found ' + result.length  + ' faces.')

    // TODO figure out what to do with multiple faces. ugh geometry :<
    if (result.length == 1) {
      console.log(result[0])
      // result[0] contains:
      // x, y : the coordinates of the top-left corner of the face's bounding box
      // width, height : the pixel dimensions of the face's bounding box
      // neighbours, confidence : info from the detection algorithm

      // T.post('statuses/update', {status: res, in_reply_to_status_id: tweet.id_str}, function (err, data, response) {
      //   if (err) throw err
      //   console.log(data)
      // })
    }
  }

  img.src = tweet.extended_entities.media[0].media_url
}
