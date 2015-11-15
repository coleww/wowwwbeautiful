var tap = require('tap')
var utils = require('./src/utils')
var config = require('./src/config')
var compliment = utils.compliment
var emojiRegex = require('emoji-regex')
var getImagePaths = utils.getImagePaths
var tweet = {
  text: 'wow, beautiful',
  user: {
    screen_name: 'bob'
  },
  // retweeted_status: false,
  entities: {
    user_mentions: []
  },
  extended_entities: {
    media: [
      {
        url: 'www.example.com'
      }
    ]
  }
}

tap.test('thisTweetIsPromising', function (t) {
  t.plan(1)
  t.ok(utils.thisTweetIsPromising(tweet))
})

tap.test('withinEachOther', function (t) {
  t.plan(3)
  t.ok(utils.withinEachOther(0, 0, 100, 25, 50, 10))
  t.ok(!utils.withinEachOther(75, 0, 100, 100, 50, 50))
  t.ok(!utils.withinEachOther(0, 75, 100, 100, 50, 50))
})

tap.test('hasImage', function (t) {
  t.plan(3)
  t.ok(utils.hasImage(tweet))

  var noImage = JSON.parse(JSON.stringify(tweet))
  noImage.extended_entities = {}
  t.ok(!utils.hasImage(noImage), 'only accepts tweets that actually have images')

  var manyImages = JSON.parse(JSON.stringify(tweet))
  manyImages.extended_entities.media.push({url: 'wowlol'})
  t.ok(!utils.hasImage(manyImages), 'only accepts single image tweets')
})

tap.test('willNotNotifyOtherUsers', function (t) {
  t.plan(4)
  t.ok(utils.willNotNotifyOtherUsers(tweet))

  var isWowB = JSON.parse(JSON.stringify(tweet))
  isWowB.user.screen_name = 'wowwwbeautiful'
  t.ok(!utils.willNotNotifyOtherUsers(isWowB), 'does not reply to itself')

  var isRT = JSON.parse(JSON.stringify(tweet))
  isRT.retweeted_status = {blah: 'whatever'}
  t.ok(!utils.willNotNotifyOtherUsers(isRT), 'no RTs')

  var isMention = JSON.parse(JSON.stringify(tweet))
  isMention.entities.user_mentions.push('blaaah')
  t.ok(!utils.willNotNotifyOtherUsers(isMention), 'no mentions')
})

tap.test('willHopefullyNotBeDisrespectful', function (t) {
  t.plan(3)
  t.ok(utils.willHopefullyNotBeDisrespectful(tweet))

  var isTW = JSON.parse(JSON.stringify(tweet))
  isTW.text = 'tw no'
  t.ok(!utils.willHopefullyNotBeDisrespectful(isTW), 'no TW labelled tweets')

  var isNotCool = JSON.parse(JSON.stringify(tweet))
  isNotCool.text = 'funeral'
  t.ok(!utils.willHopefullyNotBeDisrespectful(isNotCool), 'no uncool tweets')
})

tap.test('detects text', function (t) {
  var testImgs = getImagePaths('text')
  t.plan(testImgs.length)
  testImgs.forEach(function (img) {
    utils.detectText(img, function (text) {
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

tap.test('skips size/conf check if hashtag is present', function (t) {
  var testImgs = getImagePaths('yep')
  t.plan(testImgs.length)
  testImgs.forEach(function (img) {
    utils.detectSelfie(img, {id_str: '123'}, true, 1, function (toot) {
      t.ok(toot)
    })
  })
})

tap.test('does not detect not face things', function (t) {
  var testImgs = getImagePaths('nope')
  t.plan(0)
  testImgs.forEach(function (img) {
    utils.detectSelfie(img, {id_str: '123'}, false, config.minSize, function (toot) {
      t.ok(!toot)
    })
  })
})

tap.test('returns a compliment', function (t) {
  t.plan(2)
  t.ok(compliment().length, 'returns...something')
  t.ok(emojiRegex().test(compliment()), 'contains an emoji')
})
