var fs = require('fs')
var face_detect = require('face-detect')
var Canvas = require('canvas')
















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






      // if the detected face is at least 1/12th the size of the image, call it a selfie
      console.log(imgdata.width, width)
      if (imgdata.width > (width / 12)){
      // imgdata contains:
      // x, y : the coordinates of the top-left corner of the face's bounding box
      // width, height : the pixel dimensions of the face's bounding box
      // neighbours, confidence : info from the detection algorithm


          // pick a random compliment and a random emohi and append them together to make the reply
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