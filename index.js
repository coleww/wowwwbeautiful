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
var callNextTick = require('call-next-tick')

var name = 'wowwwbeautiful'

// quidprofollow makes our following list match our followers list. 
// that way anyone who follows the bot gets followed back, 
// and when we search for selfies we can basically just look at our timeline
// and also ppl can easily opt-out of the bot by unfollowing.
quidprofollow({twitterAPIKeys: config, retainFilter: function (ids, done) {
ids.push(1447613460) // never unfollow sui ever. 
    callNextTick(done, null, ids);
}}, function reportResults (err, followed, unfollowed) {
  console.log(err)
  if (err) throw err
  console.log('Followed:', followed)
  console.log('Unfollowed:', unfollowed)
  var last = fs.readFileSync('./lastId').toString()
 
      console.log('grabbing timeline since:', last)
    // grabbing tweets since the last time we tweeted. IIRC this maxes out at 200. 
    // if the bot gets super popular i guess we can page through it. cool
    T.get('statuses/home_timeline', {count: 200, since_id: last, exclude_replies: true}, function (err, data, response) {
      if (err) throw err
      console.log('got', data.length, 'tweets')


      
      var inty
      
      
      // filter the tweets! we can immediately ignore any tweets that:
      // don't have an image
      // contain problematic language
      // are a retweet (otherwise the bot might complement people who didn't opt in to it, which i have feels about)
      // are actually a tweet from this bot itself lol
      var tweets = data.filter(function(t){
        return hasImage(t) && tipots(t.text) && !t.retweeted_status && t.user.screen_name !== 'wowwwbeautiful' && !t.text.match(/sayhername|tw |cw |trigger|warning/i)
      })

      console.log(tweets.length, "with images")
      
      // if we have 30 or more image tweets, 
      // we won't be able to process them all before the bot runs again, 
      // so lets just pick 29 and call it alright
      // maybe later we can make a fancy redis queue, 
      // as realistically very few images are gonna be selfies
      // but i don't want to tempt the rate limit here
      if (tweets.length >= 15) {
          console.log("TRUNCATING", tweets.length)
          tweets = pick(tweets, {count: 14})
      }

    // on a 2 minute timer, pop off a tweet, check if it's a selfie, and reply if so.
    // if yr out of tweets to process, clear the timer.
      inty = setInterval(function () {

        var tweet = tweets.pop()
        if (tweet) {
            console.log('pop pop', tweet.text)

            // reject tweets that don't have 1 image, or contain awful language, or that are retweets
            replyIfTheTweetIsASelfie(tweet)
            if (!tweets.length) clearInterval(inty)
        }
      }, 120000) // dont get rate limited
    })
  })


function hasImage (tweet) {
  // console.log(tweet)
  
  return tweet.extended_entities && tweet.extended_entities.media //&& tweet.extended_entities.media.length == 1
 
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
    // TODO figure out what to do with multiple faces. ugh geometry :<
    if (result.length) {
      var imgdata = result.sort(function(a, b){
        return b.width - a.width
      })[0] // biggest first!
      console.log(imgdata)

      // OH HEY fav
      
      
      
      var probs = tweet.text.match(/selfie|selfiearmy|transisbeautiful|bodyposi|bodypositive|selfportrait/i) ? 0 : (width / 12) 

     
      // if the detected face is at least 1/12th the size of the image, call it a selfie
      console.log(imgdata.width, width)
      if (imgdata.width > probs){
      // imgdata contains:
      // x, y : the coordinates of the top-left corner of the face's bounding box
      // width, height : the pixel dimensions of the face's bounding box
      // neighbours, confidence : info from the detection algorithm
      
      
          // pick a random compliment and a random emohi and append them together to make the reply
      var toot = pick(fs.readFileSync('./compliments.txt').toString().split("\n").filter(function(x){ return x})     )[0] + ' ' + pick(fs.readFileSync('./emoji.txt').toString().split("\n").filter(function(x){ return x}))[0]
     
        console.log("I TWEETED ", toot, tweet.text, tweet.user.screen_name)
        T.post('favorites/create', {id: tweet.id_str}, function (e, d, r){
          if (e) console.log(e)
          T.post('statuses/update', {status: '@' + tweet.user.screen_name + ' ' + toot, in_reply_to_status_id: tweet.id_str}, function (err, data, response) {
           if (err) throw err
           console.log(data)
           fs.writeFileSync('./lastId', data.id_str)
            // delete the temp selfie file.
           fs.unlink('./temp/' + tweet.extended_entities.media[0].media_url.replace(/\/|\:/g, ''), function(){console.log('deleted something')}) // delete the temp selfie

          })
        })
      }
    }
  }

  console.log("WRITING")
    var ws = fs.createWriteStream('./temp/' + tweet.extended_entities.media[0].media_url.replace(/\/|\:/g, '')) // temporarily save the selfie cuz idk how to write directly to the canvas :<

  request(tweet.extended_entities.media[0].media_url).pipe(ws)

  ws.on("finish", function(){
    console.log("READING")

    fs.readFile('./temp/' + tweet.extended_entities.media[0].media_url.replace(/\/|\:/g, ''), function(err, data){
      if (err) throw err
      console.log("READ")
      img.src = data
    })
  })
}
