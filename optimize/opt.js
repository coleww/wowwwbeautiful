// interval data science test thing
// var fs = require('fs')

// module.exports = function (fn) {

// var face_detect = require('face-detect')
// var Canvas = require('canvas')
//   var Image = Canvas.Image
//   img = new Image
//   img.onload = function() {
//     var scaly = 500.0 / img.width
//     var width = scaly * img.width
//     var height = scaly * img.height

//     var canvas = new Canvas(width, height)
//     var ctx = canvas.getContext('2d')
//     console.log("DRAWING", fn, width, height)
//     ctx.drawImage(img, 0, 0, width, height)


//     var opts = { "canvas" : canvas,
//       "interval" : 5,
//       "min_neighbors" : 1 }
//     var result = face_detect.detect_objects(opts)
//     var data = {}
//     data.five = result.length + '|'

//     opts.interval = 15
//     result = face_detect.detect_objects(opts)
//     data.fift = result.length + '|'


//     opts.interval = 7
//     result = face_detect.detect_objects(opts)
//     data.seven = result.length + '|'

//     opts.interval = 11
//     result = face_detect.detect_objects(opts)
//     data.eleven = result.length + '|'

//       opts.interval = 9
//     result = face_detect.detect_objects(opts)
//     data.nine = result.length + '|'








//     fs.appendFileSync('./out.txt', fn + ':' + JSON.stringify(data) + '\n')
//   }


//   fs.readFile(fn, function(err, data){
//     if (err) throw err
//     console.log("READ")
//     img.src = data
//   })
// }
























// OCR test


// var fs = require('fs')
// var check = require('../')
// module.exports = function (fn) {

// var face_detect = require('face-detect')
// var Canvas = require('canvas')
//   var Image = Canvas.Image
//   img = new Image
//   img.onload = function() {
//     var scaly = 500.0 / img.width
//     var width = scaly * img.width
//     var height = (scaly * img.height)
//     console.log(scaly, width, height)
//     var canvas = new Canvas(width, height)
//     var ctx = canvas.getContext('2d')
//     console.log("DRAWING", fn, width, height)
//     ctx.drawImage(img, 0, 0, width, height)
//     console.log("DRAWN")




//     var pixels = ctx.getImageData(0, 0, width, height)



//     fs.appendFileSync('./out.txt', fn + ':' + check(pixels, width, height) + '\n')
//   }


//   fs.readFile(fn, function(err, data){
//     if (err) throw err
//     console.log("READ")
//     img.src = data
//   })
// }


