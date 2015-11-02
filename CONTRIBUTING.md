# WOWWWBEAUTIFUL COLLABORATION
---------------------------------------------------


# DEVELOPMENT
- [install node-canvas dependencies](https://github.com/Automattic/node-canvas/wiki)
- `npm install`
- [replace these tweety things with console.logs or something so u don't actually tweet while developing](https://github.com/coleww/wowwwbeautiful/blob/master/index.js#L90-L99)
- make a bot account, get some API keys for it, and `module.exports` them from a `config.js` in the [ttezel/twit format](https://github.com/ttezel/twit)
- the bot must have at least one tweet tweeted, and it will scan any images posted by users that follow it. 
- `node index.js` => the bot will look at what it's followers have tweeted since the last time the bot tweeted, and then reply to selfies that it detects.

