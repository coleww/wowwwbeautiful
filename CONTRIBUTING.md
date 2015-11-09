# WOWWWBEAUTIFUL COLLABORATION
---------------------------------------------------

# DEVELOPMENT
- [install node-canvas dependencies](https://github.com/Automattic/node-canvas/wiki)
- do the stuff in `.travis.yml`/`before_install` to install the correct opencv version
- install redis and run `redis server`
- `npm install`
- set `live` to false in `src/config.js`
- make a bot account, get some API keys for it, and add it to `src/config.js` (be sure to not committ that stuff tho!)
- `npm test`
- `forever src/selfie_detective.js` runs the tweet processor/selfie detector
- follow yr test bot and tweet some images to see what the bot sees
- run `node src/selfie_complimenter.js` to see what it does with detected selfies

SELFIE_DETECTIVE
---------------------

The Selfie Detector streams the bot's timeline 
and runs potential selfies through OCR (to try to eliminate memes, screenshots, etc.),
as well as multiple OpenCV cascades,
and pushes tweets that contain images that match certain criteria onto a redis queue.

SELFIE_COMPLIMENTER
-----------------------

The Selfie Complimenter pulls tweets off a redis queue and replies to them with a compliment,
while also checking to make sure that it does not reply to the same user too often.

-------------------------------

