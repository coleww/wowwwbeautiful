# WOWWWBEAUTIFUL COLLABORATION
---------------------------------------------------


# DEVELOPMENT
- [install node-canvas dependencies](https://github.com/Automattic/node-canvas/wiki)
- do the stuff in `.travis.yml`/`before_install` to install the correct opencv version
- `npm install`
- TODO: add dev mode where it won't tweet
- make a bot account, get some API keys for it, and 
- TODO: add a blank src/config file!
- TODO: explain microservices
- TODO: explain testing

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

