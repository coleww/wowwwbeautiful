var tap = require('tap')
var utils = require('./utils')
var fs = require('fs')

tap.test('detects text', function (t) {
  var testImgs = getImagePaths('text')
  t.plan(testImgs.length)
  testImgs.forEach(function (img) {
    utils.detectText(img, function (text) {
      t.ok(text.length > 8)
    })
  })
})

tap.test('detects faces', function (t) {
  var testImgs = getImagePaths('text')
  t.plan(testImgs.length)
  testImgs.forEach(function (img) {
    utils.detectText(img, function (text) {
      t.ok(text.length > 8)
    })
  })
})

tap.test('does not detect not face things', function (t) {
  var testImgs = getImagePaths('text')
  t.plan(testImgs.length)
  testImgs.forEach(function (img) {
    utils.detectText(img, function (text) {
      t.ok(text.length > 8)
    })
  })
})

function getImagePaths (type) {
  fs.readdirSync(__dirname + '/test_imgs').filter(function (f) {
    return f.match(type)
  }).map(function (f) {
    return __dirname + '/test_imgs/' + f
  })
}
