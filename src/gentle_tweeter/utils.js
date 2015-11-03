var compliments = fs.readFileSync('./compliments.txt').toString().split("\n").filter(function(x){ return x})
var emoji = fs.readFileSync('./emoji.txt').toString().split("\n").filter(function(x){ return x})

function compliment () {
  return pick(compliments)[0] + ' ' + pick(emoji)[0]
}

module.exports = {
  compliment: compliment
}
