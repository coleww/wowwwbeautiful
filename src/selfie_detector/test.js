var tap = require('tap')
var utils = require('./utils')
var fs = require('fs')
var config = require('../config')

tap.test('detects text', function (t) {
  var testImgs = getImagePaths('text')
  t.plan(testImgs.length)
  console.log(testImgs)
  testImgs.forEach(function (img) {
    utils.detectText(img, function (text) {
      console.log(img, text)
      t.ok(text.length > config.ocrMax)
    })
  })
})

tap.test('detects faces', function (t) {
  var testImgs = getImagePaths('yep')
  t.plan(testImgs.length)
  testImgs.forEach(function (img) {
    utils.detectSelfie(img, {id_str: '123'}, false, config.minSize, function (toot) {
      t.ok(toot)
    })
  })
})

// tap.test('skips size/conf check if hashtag is present', function (t) {
//   var testImgs = getImagePaths('yep')
//   t.plan(testImgs.length)
//   testImgs.forEach(function (img) {
//     utils.detectSelfie(img, {id_str: '123'}, true, 1, function (toot) {
//       t.ok(toot)
//     })
//   })
// })

tap.test('does not detect not face things', function (t) {
  var testImgs = getImagePaths('nope')
  t.plan(0)
  testImgs.forEach(function (img) {
    utils.detectSelfie(img, {id_str: '123'}, false, config.minSize, function (toot) {
      t.ok(!toot)
    })
  })
})

function getImagePaths (type) {
  return fs.readdirSync(__dirname + '/test_imgs').filter(function (f) {
    return f.match(type)
  }).map(function (f) {
    return __dirname + '/test_imgs/' + f
  })
}
