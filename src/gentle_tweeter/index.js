var redis = require('redis')
var client = redis.createClient()
var compliment = require('./utils').compliment

var config = require('../config')
var T = require('twit')


  // console.log("I TWEETED ", toot, tweet.text, tweet.user.screen_name)




  // T.post('favorites/create', {id: tweet.id_str}, function (e, d, r){
  //   if (e) console.log(e)
  //   T.post('statuses/update', {status: '@' + tweet.user.screen_name + ' ' + toot, in_reply_to_status_id: tweet.id_str}, function (err, data, response) {
  //    if (err) throw err
  //    console.log(data)
  //    fs.writeFileSync('./lastId', data.id_str)
  //     // delete the temp selfie file.
  //    fs.unlink('./temp/' + cleanUrl(tweet.extended_entities.media[0].media_url), function(){console.log('deleted something')}) // delete the temp selfie
  //   })
  // })















// // INSTEAD OF NEVER-AGAIN: save a timestamp, check that it has been at least a lil bit

// // popQueue modified from sorting-bot by Darius Kazemi
// // https://github.com/dariusk/sorting-bot/blob/master/index.js
// //
// function popQueue() {
//   // pop the queue
//   client.lpop('queue', function(err, reply) {
//     console.log('next is', reply)
//     // if null, ignore
//     if (reply !== null) {
//       // if not null, check if we've already tweeted
//       client.exists('&'+reply, function(err, doesExist) {
//         console.log('exists:', doesExist)
//         // if we haven't already tweeted, tweet and add to never-tweet hash
//         if (!doesExist) {
//           // TWEET
//           var myTweet = generate()
//           var person = reply
//           if (person[0] === '@') {
//             person = person.substr(1,1000)
//           }
//           myTweet = '@' + person + ' ' + myTweet
//           console.log('THE TWEET:', myTweet)
//           T.post('statuses/update', { status: myTweet }, function(err, reply) {
//             if (err) {
//               console.log('error:', err)
//               // close connection and program
//               client.end()
//             }
//             else {
//               console.log('reply:', reply)
//               // add follower to a never-tweet-again key (add & to protect against users with names like @queue)
//               client.set('&'+person, '1', redis.print)
//               client.end()
//             }
//           })
//         }
//         else {
//           popQueue()
//         }
//       })
//     }
//   })
// }

// popQueue()