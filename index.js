
// spawn processes, let them run for {TIME}, then take them down
// at which point a cron will step in and restart this script

// https://github.com/foreverjs/forever-monitor
var forever = require('forever-monitor')

var child = new (forever.Monitor)('your-filename.js', {
  max: 3,
  silent: true,
  args: []
})

child.on('exit', function () {
  console.log('your-filename.js has exited after 3 restarts')
})
child.start()
