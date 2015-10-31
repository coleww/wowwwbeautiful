var fs = require('fs')
var opt = require('./opt')

fs.unlinkSync('./out.txt')
var imgs = fs.readdirSync('./selfies')



setInterval(function(){
  var img = imgs.pop()

  if (!img) process.exit(0)
  opt('./selfies/' + img)

}, 1000)


