var quidprofollow = require('quidprofollow')
var callNextTick = require('call-next-tick')
var config = require('./config')
quidprofollow({twitterAPIKeys: config.twitter, retainFilter: function (ids, done) {
  ids.push(1447613460) // never unfollow sui ever.
  callNextTick(done, null, ids)
}}, function reportResults (err, followed, unfollowed) {
  console.log('qpf-err:', err)
  if (err) throw err
  console.log('Followed:', followed)
  console.log('Unfollowed:', unfollowed)
})
