var fs = require('fs')
var face_detect = require('face-detect')
var Canvas = require('canvas')
var quidprofollow = require('quidprofollow')
var tipots = require('this-is-probably-ok-to-say')
var request = require('request')
var Twit = require('twit')
var config = require('./config')
var T = new Twit(config)
var pick = require('pick-random')

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
      var inty

      setInterval(function () {

        var tweet = data.pop()
        if (!tweet) process.exit(0)
        console.log('pop pop', tweet.text)

        // reject tweets that don't have 1 image, or contain awful language, or that are retweets
        if (hasImage(tweet) && tipots(tweet.text) && !tweet.retweeted_status) {
          replyIfTheTweetIsASelfie(tweet)
        } else {
          console.log("BORK")
        }
        if (!data.length) clearInterval(inty)
      }, 15000)
    })
  })
})

function hasImage (tweet) {
  // console.log(tweet)
  // for now, only accepting tweets that have exactly 1 image
  return tweet.extended_entities && tweet.extended_entities.media && tweet.extended_entities.media.length == 1
  // TODO figure out how to handle multi-image tweets (accept them if they are all selfies?)
}

function replyIfTheTweetIsASelfie (tweet) {

  var Image = Canvas.Image
  img = new Image
  console.log("LOADING", tweet.extended_entities.media[0].media_url)
  img.onload = function() {
    var width = img.width
    var height = img.height
    var canvas = new Canvas(width, height)
    var ctx = canvas.getContext('2d')
    console.log("DRAWING", width, height)
    ctx.drawImage(img, 0, 0, width, height)
    var result = face_detect.detect_objects({ "canvas" : canvas,
      "interval" : 5,
      "min_neighbors" : 1 })

    console.log('Found ' + result.length  + ' faces in' + tweet.text)
    console.log(result)
    // TODO figure out what to do with multiple faces. ugh geometry :<
    if (result.length == 1) {
      console.log(result[0])
      
      // OH HEY fave it too?!?!?!?!?
      
      var toot = pick(fs.readFileSync('./compliments.txt').toString().split("\n"))[0] + pick(fs.readFileSync('./emoji.txt').toString().split("\n"))[0]
      
      // result[0] contains:
      // x, y : the coordinates of the top-left corner of the face's bounding box
      // width, height : the pixel dimensions of the face's bounding box
      // neighbours, confidence : info from the detection algorithm

      // T.post('statuses/update', {status: toot, in_reply_to_status_id: tweet.id_str}, function (err, data, response) {
      //   if (err) throw err
      //   console.log(data)
      //   fs.unlink('./temp/' +tweet.extended_entities.media[0].media_url + '.png', function(){console.log('deleted something')}) // delete the temp selfie
      // })
    }
  }

  console.log("WRITING")
  var ws = fs.createWriteStream('./temp/' + tweet.extended_entities.media[0].media_url.replace(/\/|\:/g, '')) // temporarily save the selfie cuz idk how to write directly to the canvas :<

  request(tweet.extended_entities.media[0].media_url).pipe(ws)

  ws.on("finish", function(){
    console.log("READING")
    fs.readFile('./temp/' +tweet.extended_entities.media[0].media_url.replace(/\/|\:/g, ''), function(err, data){
      if (err) throw err
      console.log("READ")
      img.src = data
    })
  })
}


setTimeout(function () {

}, 100000000)
