module.exports = function (str) {
  return 'hello ' + str
}



var face_detect = require('face-detect'),
    Canvas = require('canvas');

// ... initialize a canvas object ...

var result = face_detect.detect_objects({ "canvas" : myCanvas,
  "interval" : 5,
  "min_neighbors" : 1 });

console.log('Found ' + result.length  + ' faces.');

for (var i = 0; i < result.length; i++){
  var face =  result[i];
  console.log(face);
}