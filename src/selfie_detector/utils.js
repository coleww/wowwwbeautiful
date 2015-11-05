var fs = require('fs')
var cv = require('opencv')
var ocrad = require('ocrad.js')
var Canvas = require('canvas')

function detectText (path, cb) {
  var Image = Canvas.Image
  var img = new Image
  img.onload = function() {
    var width = img.width
    var height = img.height
    var canvas = new Canvas(width, height)
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)
    var pixels = ctx.getImageData(0, 0, width, height)

    // check for text in the plain image
    var ocrPlain = ocrad(canvas).replace(/\W|\_/g, '')

    // try to detect the white impact meme font by threshholding on white-ish pixels
    ctx.putImageData(threshhold(JSON.parse(JSON.stringify(pixels)), 230), 0, 0, width, height)
    var ocrLight = ocrad(canvas).replace(/\W|\_/g, '')

    // threshhold on dark pixels to try to accentuate text
    ctx.putImageData(threshhold(JSON.parse(JSON.stringify(pixels)), 30), 0, 0, width, height)
    var ocrDark = ocrad(canvas).replace(/\W|\_/g, '')

    // take the longest string detected by the OCR runs.
    var detected = [ocrPlain, ocrLight, ocrDark].sort(function (a, b) {
      return b.length - a.length
    })[0]

    cb(detected)
  }
  fs.readFile(path, function(err, data){
    if (err) console.log(err)
    img.src = data
  })
}

function detectSelfie (path, t, ht, ms, cb) {
  cv.readImage(path, function(err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function(err, result){
      console.log(t.id_str, 'Found faces', result.length)
      if (result.length) {
        var imgdata = result.sort(function(a, b){
          return b.width - a.width
        })[0]
        var probs = ht ? 0 : (im.width / ms)
        console.log(t.id_str, 'DATA', imgdata, imgdata.width, probs)
        if (imgdata.width > probs) cb(t)
      }
    })
  })
}

function threshhold (pixels, thresh) {
  for (var i = 0; i < pixels.data.length; i += 4) {
    var avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3
    var ne = avg > thresh ? 0 : 255
    pixels.data[i] = ne
    pixels.data[i + 1] = ne
    pixels.data[i + 2] = ne
  }
  return pixels
}

module.exports = {
  detectSelfie: detectSelfie,
  detectText: detectText
}
