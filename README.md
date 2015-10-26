wowwwbeautiful
----------------


a #wowwwnetwork bot that detects and compliments selfies.


every 5 minutes or whatever:

0. quidprofollow!
1. save "lastTweetId" to a file somewhere
2. every time it runs: grab last 200 of home_timeline, filter out self
3. download media entitites? (request? just use the URL from the API response?)
4. run it through the detector. if confidence > % then => tweet!
5. avoid rate limiting somehow, maybe store a queue?



=> if people post a ton of selfies, this bot could get rate limited...should it try to fave all of it's followers selfies? or just a random sampling?
=> should it look at the text of the tweet to help decide if it's a selfie or not? like somehow filter out rando pictures of ppls faces.


