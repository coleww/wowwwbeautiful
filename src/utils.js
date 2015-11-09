var tipots = require('this-is-probably-ok-to-say')
var config = require('./config')
var filterRegex = config.filterRegex
var fs = require('fs')
var cv = require('opencv')
var ocrad = require('ocrad.js')
var Canvas = require('canvas')
var after = require('after')
var pick = require('pick-random')
var compliments = loadList('compliments.txt')
var emoji = loadList('emoji.txt')

function loadList (path) {
  return fs.readFileSync(__dirname + '/' + path).toString().split('\n').filter(function (x) {
    return x
  })
}

function compliment () {
  return pick(compliments)[0] + ' ' + pick(emoji)[0]
}

function thisTweetIsPromising (t) {
  return hasImage(t) && willNotNotifyOtherUsers(t) && willHopefullyNotBeDisrespectful(t)
}

function hasImage (t) {
  // only look at tweets that have 1 image for now. better to focus than try to catch everything i think...
  return t.extended_entities && t.extended_entities.media && t.extended_entities.media.length === 1
}

function willNotNotifyOtherUsers (t) {
  // is not an RT or a reply/mention (otherwise we might reply to images posted by someone that has not opted-in)
  // also is not a tweet from this user itself, because for some reason it will double fave or w/e
  return t.user.screen_name !== 'wowwwbeautiful' && !t.retweeted_status && !t.entities.user_mentions.length
}

function willHopefullyNotBeDisrespectful (t) {
  // runs iscool on the text via tipots. other strings to avoid can be added to the regex.
  return tipots(t.text) && !t.text.match(filterRegex)
}

function detectText (path, cb) {
  var Image = Canvas.Image
  var img = new Image()
  img.onload = function () {
    var width = img.width
    var height = img.height
    var canvas = new Canvas(width, height)
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)
    var ocr = ocrad(canvas).replace(/\W|\_/g, '')
    cb(ocr)
  }
  fs.readFile(path, function (err, data) {
    if (err) console.log(err)
    img.src = data
  })
}

var cascades = [__dirname + '/../node_modules/opencv/data/haarcascade_frontalface_alt_tree.xml',
                __dirname + '/../node_modules/opencv/data/haarcascade_frontalface_default.xml',
                __dirname + '/../node_modules/opencv/data/haarcascade_frontalface_alt.xml',
                __dirname + '/../node_modules/opencv/data/haarcascade_frontalface_alt2.xml',
                __dirname + '/../node_modules/opencv/data/haarcascade_eye_tree_eyeglasses.xml']

function detectSelfie (path, t, ht, ms, cb) {
  console.log('DETECTING', path, t, ht, ms)
  cv.readImage(path, function (err, im) {
    if (err) {
      console.log(err)
    } else {
      var results = []
      var init = after(cascades.length, function () {
        console.log(results)
        if (results.length) {
          var allResults = results.reduce(function (a, b) {
            return a.concat(b)
          })
          var validResults = allResults.filter(function (img) {
            var probs = ht ? 0 : (im.width() / ms)
            return img.width > probs
          })
          console.log(t.id_str, 'DATA', validResults)
          if (validResults.length / allResults.length > 0.5) cb(t)
        }
      })
      cascades.forEach(function (cascade) {
        console.log(cascade)
        im.detectObject(cascade, {}, function (err, result) {
          if (err) {
            console.log(t.id_st, 'ocverr', err)
          } else {
            console.log(t.id_str, 'Found faces', result.length)
            results.push(result)
          }
          init()
        })
      })
    }
  })
}

module.exports = {
  hasImage: hasImage,
  willNotNotifyOtherUsers: willNotNotifyOtherUsers,
  willHopefullyNotBeDisrespectful: willHopefullyNotBeDisrespectful,
  thisTweetIsPromising: thisTweetIsPromising,
  detectSelfie: detectSelfie,
  detectText: detectText,
  compliment: compliment
}
