var fs = require('fs')
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

module.exports = {
  compliment: compliment
}
