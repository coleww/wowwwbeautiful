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
  return hasImage(t) && willNotNotifyOtherUsers(t) && willHopefullyNotBeDisrespectful(t) && probablyNotABot(t)
}

function probablyNotABot (t) {
  console.log('CRUCIALBOTDETECTIONDATA', t.user.screen_name.match(/\d+\w+\d+/i))
  return !t.user.screen_name.match(/\d+\w+\d+/i)
}

function hasImage (t) {
  // only look at tweets that have 1 image for now. better to focus than try to catch everything i think...
  return t.extended_entities && t.extended_entities.media && t.extended_entities.media.length === 1 && t.extended_entities.media[0].media_url.match(/png|jpg|jpeg/i) && t.extended_entities.media[0].type !== 'animated_gif'
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
    // try to detect any text in the image, removing the obvious noise
    var ocr = ocrad(canvas).replace(/\W|\_/g, '')
    cb(ocr)
  }
  fs.readFile(path, function (err, data) {
    if (err) console.log(err)
    img.src = data
  })
}

var generalFaceCascades = [
  __dirname + '/../node_modules/opencv/data/haarcascade_frontalface_alt_tree.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_frontalface_default.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_frontalface_alt.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_frontalface_alt2.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_profileface.xml',
  __dirname + '/../cascades/headshoulders.xml']

var captainFaceCascades = [
  __dirname + '/../cascades/lefteye.xml',
  __dirname + '/../cascades/righteye.xml',
  __dirname + '/../cascades/frontalEyes.xml',
  __dirname + '/../cascades/haarcascade_smile.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_eye_tree_eyeglasses.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_mcs_eyepair_big.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_mcs_eyepair_small.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_mcs_mouth.xml',
  __dirname + '/../node_modules/opencv/data/haarcascade_mcs_nose.xml']

// check if generalFaces match,
// then make sure there are captains behind those generals

function withinEachOther (x, y, w, h, x2, y2) {
  return x2 > x && (x2 < x + w) && y2 > y && (y2 < y + h)
}

function detectSelfie (path, t, ht, ms, cb) {
  cv.readImage(path, function (err, im) {
    if (err) {
      console.log(err)
    } else {
      var results = []
      var reallyCertains = []
      var init = after(generalFaceCascades.length, function () {
        if (results.length) {
          var allResults = results.reduce(function (a, b) {
            return a.concat(b)
          })
          var validResults = allResults.filter(function (img) {
            var probs = ht ? 0 : (im.width() / ms)
            return img.width > probs
          }).sort(function (a, b) {
            return b.width - a.width
          })
          console.log(t.id_str, 'DATA', validResults)
          if (validResults.length / generalFaceCascades.length > 0.3) {
            var theOne = validResults[0]
            console.log(t.id_str, 'the_one', theOne)
            var finallyInit = after(captainFaceCascades.length, function () {
              if (reallyCertains.length / captainFaceCascades.length > 0.3) cb(t)
            })
            captainFaceCascades.forEach(function (casc) {
              im.detectObject(casc, {}, function (err, restemp) {
                var res2 = restemp && restemp.sort(function (a, b) {
                  return b.width - a.width
                })[0]
                if (err) {
                  console.log(t.id_st, 'ocverr', err)
                } else if (res2 && withinEachOther(theOne.x, theOne.y, theOne.width, theOne.height, res2.x + (res2.width / 2), res2.y + (res2.height / 2))) {
                  reallyCertains.push(res2)
                }
                finallyInit()
              })
            })
          }
        }
      })
      generalFaceCascades.forEach(function (cascade) {
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

function getImagePaths (type) {
  return fs.readdirSync('./test_imgs').filter(function (f) {
    return f.match(type)
  }).map(function (f) {
    return './test_imgs/' + f
  })
}

module.exports = {
  hasImage: hasImage,
  getImagePaths: getImagePaths,
  willNotNotifyOtherUsers: willNotNotifyOtherUsers,
  willHopefullyNotBeDisrespectful: willHopefullyNotBeDisrespectful,
  thisTweetIsPromising: thisTweetIsPromising,
  detectSelfie: detectSelfie,
  detectText: detectText,
  compliment: compliment,
  withinEachOther: withinEachOther
}
