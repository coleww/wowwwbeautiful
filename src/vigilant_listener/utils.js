var tipots = require('this-is-probably-ok-to-say')
var filterRegex = require('../config').filterRegex

function thisTweetIsPromising (t) {
  return hasImage(t) && willNotNotifyOtherUsers(t) && willHopefullyNotBeDisrespectful(t)
}

function hasImage (t) {
  // only look at tweets that have 1 image for now. better to focus than try to catch everything i think...
  return t.extended_entities && t.extended_entities.media && t.extended_entities.media.length == 1
}

function willNotNotifyOtherUsers (t) {
  // is not an RT or a reply/mention (otherwise we might reply to images posted by someone that has not opted-in)
  // also is not a tweet from this user itself, because for some reason it will double fave or w/e
  return t.user.screen_name !== 'wowwwbeautiful' && !t.retweeted_status && !t.entities.user_mentions.length
}

function willHopefullyNotBeDisrespectful (t) {
  // runs iscool on the text via tipots. other strings to avoid can be added to the regex.
  return tipots(t.text) && !t.text.match(filterRegex)
}

module.exports = {
  hasImage: hasImage,
  willNotNotifyOtherUsers: willNotNotifyOtherUsers,
  willHopefullyNotBeDisrespectful: willHopefullyNotBeDisrespectful,
  thisTweetIsPromising: thisTweetIsPromising
}
