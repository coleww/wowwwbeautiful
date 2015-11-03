// run this to delete tempfiles that for some reason go undeleted sometimes
var rmrf = require('rimraf')
var fs = require('fs')
rmrf('../temp', function (e) {
  console.log(e)
  fs.mkdir('../temp', function (e) {
    console.log(e)
  })
})
