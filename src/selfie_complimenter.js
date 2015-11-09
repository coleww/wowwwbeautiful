// uncomment this next line to crash everything
// throw 'a big fit'


var redis = require('redis')
var client = redis.createClient()
var compliment = require('./utils').compliment
var config = require('./config')
var twitConfig = config.twitter
var replyInterval = config.replyInterval
var Twit = require('twit')
var T = new Twit(twitConfig)

function popQueue () {
  client.lpop('selfies', function (err, tweetString) {
    console.log('popping', tweetString)
    if (err) {
      console.log(err)
    } else if (tweetString !== null) {
      var t = JSON.parse(tweetString)
      var user = t.user.screen_name
      // if not null, check if we've already tweeted at this user recently
      client.exists('&' + user, function (err, lastTweeted) {
        console.log(t.id_str, 'last replied to this user', lastTweeted)
        var timestamp = new Date().getTime()
        // if we haven't already tweeted, tweet and save a timestamp
        if (err) {
          console.log(err)
        } else if (!lastTweeted || (timestamp - lastTweeted > replyInterval)) {
          var myTweet = '@' + user + ' ' + compliment()
          console.log(t.id_str, 'THE REPLY:', myTweet)
          if (config.live) {
            T.post('favorites/create', {id: t.id_str}, function (e, d, r) {
              if (e) console.log(t.id_str, 'faverr', e)
              T.post('statuses/update', {status: myTweet, in_reply_to_status_id: t.id_str}, function (err, data, response) {
                if (err) {
                  console.log(t.id_str, 'replyerr:', err)
                  // close connection and program
                  client.end()
                } else {
                  console.log(t.id_str, 'reply:', data)
                  // record current timestamp for this user
                  client.set('&' + user, timestamp + '', redis.print)
                  client.end()
                }
              })
            })
          }
        } else {
          console.log('popping again')
          popQueue()
        }
      })
    }
  })
}

popQueue()

// // popQueue modified from sorting-bot by Darius Kazemi
// // https://github.com/dariusk/sorting-bot/blob/master/index.js
//
// Copyright (c) 2015 Kazemi, Darius

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
