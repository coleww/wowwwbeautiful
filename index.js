var fs = require('fs')
var face_detect = require('face-detect')
var cv = require('opencv')
var Canvas = require('canvas')
var quidprofollow = require('quidprofollow')
var tipots = require('this-is-probably-ok-to-say')
var request = require('request')
var Twit = require('twit')
var config = require('./config')
var T = new Twit(config)
var pick = require('pick-random')
var callNextTick = require('call-next-tick')
var Ocrad = require('ocrad.js')
var compliments = fs.readFileSync('./compliments.txt').toString().split("\n").filter(function(x){ return x})
var emoji = fs.readFileSync('./emoji.txt').toString().split("\n").filter(function(x){ return x})

var name = 'wowwwbeautiful'

// quidprofollow makes our following list match our followers list.
// that way anyone who follows the bot gets followed back,
// and when we search for selfies we can basically just look at our timeline
// and also ppl can easily opt-out of the bot by unfollowing.
quidprofollow({twitterAPIKeys: config, retainFilter: function (ids, done) {
  ids.push(1447613460) // never unfollow sui ever.
  callNextTick(done, null, ids);
}}, function reportResults (err, followed, unfollowed) {
  console.log('qpferr', err)
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
      return hasImage(t) && tipots(t.text) && !t.retweeted_status && t.user.screen_name !== 'wowwwbeautiful' && !t.text.match(/\@\w+|sayhername|tw |cw |trigger|warning/i)
    })

    console.log(tweets.length, "with images")

    // if we have 30 or more image tweets,
    // we won't be able to process them all before the bot runs again,
    // so lets just pick 29 and call it alright
    // maybe later we can make a fancy redis queue,
    // as realistically very few images are gonna be selfies
    // but i don't want to tempt the rate limit here
    if (tweets.length >= 11) {
        console.log("TRUNCATING", tweets.length)
        tweets = pick(tweets, {count: 10})
    }

  // on a 2 minute timer, pop off a tweet, check if it's a selfie, and reply if so.
  // if yr out of tweets to process, clear the timer.
    inty = setInterval(function () {
      var tweet = tweets.pop()
      if (tweet) {
          console.log('PROCESSING:', tweet.text)
          replyIfTheTweetIsASelfie(tweet)
          if (!tweets.length) {
            clearInterval(inty)
            process.exit(0)
          }
      } else {
        clearInterval(inty)
        process.exit(0)
      }
    }, 120000) // dont get rate limited
  })
})


function hasImage (tweet) {
  // console.log(tweet)
  return tweet.extended_entities && tweet.extended_entities.media //&& tweet.extended_entities.media.length == 1
}

function replyToTweet (tweet) {
  // pick a random compliment and a random emoji and append them together to make the reply
  var toot = pick(compliments)[0] + ' ' + pick(emoji)[0]

  console.log("I TWEETED ", toot, tweet.text, tweet.user.screen_name)
  T.post('favorites/create', {id: tweet.id_str}, function (e, d, r){
    if (e) console.log(e)
    T.post('statuses/update', {status: '@' + tweet.user.screen_name + ' ' + toot, in_reply_to_status_id: tweet.id_str}, function (err, data, response) {
     if (err) throw err
     console.log(data)
     fs.writeFileSync('./lastId', data.id_str)
      // delete the temp selfie file.
     fs.unlink('./temp/' + cleanUrl(tweet.extended_entities.media[0].media_url), function(){console.log('deleted something')}) // delete the temp selfie
    })
  })
}

function replyIfTheTweetIsASelfie (tweet) {
  var Image = Canvas.Image
  img = new Image
  console.log("LOADING", tweet.extended_entities.media[0].media_url)
  img.onload = function() {
    // resize all images to some standard width,
    // as the image size seems to affect the face detect somehow?
    var scaly = 500.0 / img.width
    var width = scaly * img.width
    var height = scaly * img.height
    var canvas = new Canvas(width, height)
    var ctx = canvas.getContext('2d')
    console.log("DRAWING", width, height)
    ctx.drawImage(img, 0, 0, width, height)
    var probs = tweet.text.match(/selfie|selfiearmy|transisbeautiful|bodyposi|bodypositive|selfportrait/i) ? 0 : (width / 15.0)
    if (isProbablyAMeme(ctx, width, height) && probs){
      console.log("pretty sure this is a meme or something", tweet.extended_entities.media[0].media_url)
    } else {

      // umm, we already loaded the image, but thats ok. thats fine. whatever for now. hope this works!
      cv.readImage('./temp/' + cleanUrl(tweet.extended_entities.media[0].media_url), function(err, im){

        // TRY SEVERAL CASCADES! (how long does it take to process? gonna have to make it WAYYYY more async/streaming)
        // haarcascade_profileface.xml
        // haarcascade_eye_tree_eyeglasses.xml
        // haarcascade_fullbody.xml


        im.detectObject(cv.FACE_CASCADE, {}, function(err, result){ // REPLACE THIS WITH PATH TO VARIOUS CASCADES?
          console.log('Found ', result.length, ' faces in ', tweet.text, 'DATA', result)
          if (result.length) {
            var confs = result.filter(function(x){
              // idk what it returns... i guess we'll see once it logs something!
              return x.confidence ? (x.confidence > 0) : true
            })
            console.log("feeling very confident about", confs.length)
            if (!confs.length && probs){
              console.log('not feeling confident enough to respond to', tweet.text)
            } else {
              var imgdata = result.sort(function(a, b){
                return b.width - a.width
              })[0] // biggest result first! be hopeful!
              // if the detected face is at least 1/12th the size of the image or if the tweet contains certain hashtags, call it a selfie
              console.log('DATAS', imgdata, imgdata.width, width / 12.0)
              if (imgdata.width > probs){
                replyToTweet(tweet)
              }
            }
          }
        });
      })
    }
  }


  var ws = fs.createWriteStream('./temp/' + cleanUrl(tweet.extended_entities.media[0].media_url)) // temporarily save the selfie cuz idk how to write directly to the canvas :<

  request(tweet.extended_entities.media[0].media_url).pipe(ws)

  ws.on("finish", function(){

    fs.readFile('./temp/' + cleanUrl(tweet.extended_entities.media[0].media_url), function(err, data){
      if (err) throw err

      img.src = data
    })
  })
}

function cleanUrl (url) {
  return url.replace(/\/|\:/g, '')
}

function isProbablyAMeme(ctx2, w, h) {
  var pixels = ctx2.getImageData(0, 0, w, h)
  for (var i = 0; i < pixels.data.length; i += 4) {
    var avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3
    var ne = avg > 240 ? 0 : 255
    pixels.data[i] = ne
    pixels.data[i + 1] = ne
    pixels.data[i + 2] = ne
  }

  var canvas = new Canvas(w, h)
  var ctx = canvas.getContext('2d')
  ctx.putImageData(pixels, 0, 0)
  var ocr = Ocrad(canvas).replace(/\W|\_/g, '')
  console.log("DETECTED TEXT:", ocr)
  return ocr.length > 12
}
