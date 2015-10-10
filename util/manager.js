var options = require('./options')
var crypto = require('crypto')
var fs = require('fs')

//TODO: comment

var files = {}

var db = {
	addFile: addFile,
	appendToFile: appendToFile,
	endFile: endFile
}

var HASH = 'sha1'

//TODO: create a real db with every file and make this module access that db
//This method watches a file through its id
var addFile = function(path, size) {
    var timeNow = (+new Date())
    var expirationDate = timeNow + Number(options.get().expires)
    var id = '' + timeNow + options.get().secret //this works because Node does not run the code in multiple threads
    var digester = crypto.createHash(HASH) //this will create the id hash
    digester.update(id)
    id = digester.digest('hex')
    var fileDigester = crypto.createHash(HASH) //this will be added to the file object so that everytime a chunk is added, it will be updated
    //adding the file
    files[id] = {
		id: id,
		digester: fileDigester,
		expires: expirationDate,
		path: options.get().savePath + path,
		size: Number(size),
		offset: 0
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

var deleteFile = function(id) {
	var call = files[id]
	if(call) {
		delete files[id]
	}
}

var appendToFile = function(id, chunk, cb) {
	
	//the variable that represents the file
	var file = getFile(id)
	
	//if no file is found, returns an error
	if(!file) return cb(null, {
		code: 404,
		json: false,
		message: 'No File was found on the DB'
	})
	
	//the file has been found
	//checking if the addition of the chunk wont be larger than the contract
	if(file.offset + chunk.length > file.size) {
		
		//if it is larger, invalidates the file
		deleteFile(id)
		
		//and returns an error
		return cb(null, {
			code: 400,
			json: false,
			message: 'Data sent larger than contract'
		})
	}
	//if not, just append the content to the file
	fs.appendFile(file.path, chunk, function(err) {
		if(err) cb(err, null) //in case some error occurs
		
		//updates the checksum
		file.digester.update(chunk)
		
		//updates the offset of the file
		file.offset += chunk.length
		
		//returns a nice response
		return cb(null, {
			code: 200,
			json: {id: file.id, offset: file.offset, expires: file.expires},
			message: undefined
		})
	})
	
}

var endFile = function(id, checksum, cb) {
	
	//gets the time now
	var timeNow = +(new Date())
	
	//looks for the file in the db
	var file = getFile(id)
	
	//if no file was found, returns an error
	if(!file) return cb(null, {
		code: 404,
		json: false,
		message: 'No File was found on the DB'
	})
	
	//a file was found! Now calculates the checksum
	var check = file.digester.digest('hex')
	
	//checks if the offset matches the size, the file hasnt expired and if the checksum matches
	if(!(timeNow <= file.expires && file.size === file.offset && checksum === check)) {
		//if so, removes the file
		fs.unlink(file.path, function() {})
		
		//invalidates it in the db
		deleteFile(id)
		
		//and returns an error
		return cb(null, {
			code: 400,
			json: false,
			message: 'File didnt match the checking process'
		})
	}
	
	//in case everything went fine, just responds smoothly
	return cb(null, {
		code: 200,
		json: {id: id, done: true},
		message: undefined
	})
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

var dbChange = function(dbObject) {
	db = dbObject
}

var defaultDB = function() {
	db = {
		addFile: addFile,
		appendToFile: appendToFile,
		endFile: endFile
	}
}

var useDB = function() {
	return db;
}

module.exports = {
	db: useDB,
    useDefault: defaultDB,
	changeDB: dbChange
}