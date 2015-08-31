var options = require('./options')
var crypto = require('crypto')

var files = {}

//This method watches a file through its id
var addFile = function(path, size, checksum) {
    var timeNow = (+new Date())
    var expirationDate = timeNow + options.expires
    var id = '' + timeNow + options.secret //this works because Node does not run the code in multiple threads
    var digester = crypto.createHash('sha1') //this will create the id hash
    digester.update(id)
    id = digester.digest('hex')
    var fileDigester = crypto.createHash('sha1') //this will be added to the file object so that everytime a chunk is added, it will be updated
    //adding the file
    files[id] = {
	id: id,
	digester: fileDigester,
	expires: expirationDate,
	path: path,
	size: size,
	checksum: checksum
    }
    return files[id]
}

//This method just returns the whole file object and checks if it hasn't expired
var getFile = function(id) {
    var call = files[id]
    if(call && (+new Date()) > call.expires) {
	delete files[id]
	return undefined
    }
    return call
}

var optimize = function() {
    var timeNow = (+new Date())
    var list = []
    for(key in files) {
	if(files[key].expires < timeNow) {
	    list.push(key)
	}
    }
    for(key in list) {
	delete files[key]
    }
}

module.exports = {
    addFile: addFile,
    getFile: getFile,
    optimize: optimize
}