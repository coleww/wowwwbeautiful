var tap = require('tap')
var compliment = require('./utils').compliment
var emojiRegex = require('emoji-regex')

tap.test('returns a compliment', function (t) {
  t.plan(2)
  t.ok(compliment().length, 'returns...something')
  t.ok(emojiRegex().test(compliment()), 'contains an emoji')
})
