var fs = require('fs') 

var options = JSON.parse(fs.readFileSync(__dirname + '/../options.json').toString())

module.exports = options