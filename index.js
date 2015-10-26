var fs = require('fs')
var face_detect = require('face-detect')
var request = require('request')
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
      
      
      // maybe pop off tweets on a timer so as to avoid rate limits...
      data.forEach(function(tweet){          
        console.log(tweet.text)
        
        if (hasImage(tweet) && isSelfie(tweet) && tipots(tweet.text) && !tweet.retweeted_status) {
        
        // do stuff!!!!!!!!!!!!!!!!!!!!!        
        // if (res) {
        //   console.log('bingo', res)
        //   T.post('statuses/update', {status: res, in_reply_to_status_id: tweet.id_str}, function (err, data, response) {
        //     if (err) throw err
        //     console.log(data)
        //   })
        }
      
      })
      
      
    })
  })
})





function hasImage (tweet) {
  return !!tweet.extended_entities.media
}

function isSelfie (tweet) {
  tweet.extended_entities.media
}







/// face-detect boilerplate below:


// REQUEST an image and draw it to a canvas... hmmm.... howwwwww
var width = img.width
  var height = img.height
  var canvas = new Canvas(width, height)

  ctx = canvas.getContext('2d')
   ctx.drawImage(img, 0, 0, width, height)



// ... initialize a canvas object ...

var result = face_detect.detect_objects({ "canvas" : canvas,
  "interval" : 5,
  "min_neighbors" : 1 });

console.log('Found ' + result.length  + ' faces.');

for (var i = 0; i < result.length; i++){
  var face =  result[i];
  console.log(face);
}
