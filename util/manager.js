var options = require('./options')
var crypto = require('crypto')
var fs = require('fs')

/**
 * This file implements a simple manager for the chunker.
 * The purpose of the manager is to manage the database that contains the files and the disk operations.
 * Also, it may contain functions that logs the activity and signals for spam and DoS/DDoS attacks, allowing the system to react.
 * This interface contains a simple database, that actually is a JS Object, where the key of the dictionary is an SHA1 hash string
 * that is called 'id', and the value is an object that contais a few properties which are:
 * 
 * id: same as the key - an string that is a SHA1 hash
 * digester: an crypto createHash object that creates the checksum at the end of the upload
 * expires: a number that signals the validity of the upload
 * path: a string that shows the physical path of the file
 * size: a number; when starting a upload, the size of the file is specified for safety reasons and it will be used at the end of the upload),
 * offset: a number that represents the point at which the upload is now
 * 
 * This is the modus operandi of this simple interface. Nothing impedes the change of this mode, as this file encapsulates the operations.
 * If one wants to override the default DB that is offered here, it is sufficient to create a module that has the three following functions:
 * 
 * addFile(path, size, cb) - where 'path' is the name of the file
 * 								   'size' is the size of the file
 * 								   'cb' is a callback function that has (err, status) parameters and 'status' is a json in the form
 *																		{code: <number>, json: <true/false>, message <string>}
 * 
 * appendToFile(id, chunk, cb) - where 'id' is a valid id for the file
 * 									   'chunk' is the string that will be appended to the path of the file with 'id' id
 * 									   'cb' is a callback function that has (err, status) parameters and 'status' is a json in the form:
 * 																		{code: <number>, json: <true/false>, message <string>}
 * 
 * endFile(id, checksum, cb) - where 'id' is a valid id for the file
 * 									 'checksum' is a valid SHA1 checksum that will be used for integrity checking the file
 * 									 'cb' is a callback function that has (err, status) parameters and 'status' is a json in the form:
 * 																		{code: <number>, json: <true/false>, message <string>}
 * 
 * Then it is sufficient to pass the object {addFile: <Your addFile>, appendToFile: <Your appendToFile>, endFile: <Your endFile>} as a parameter to
 * the index.js module.exports function of this project. Nice and easy.
 */

//will hold every upload available
var files = {}

//the db object that offers the minimal functionality
var db = {}

//the hash type for checksum and id generation; can be changed
//but might conflict with the validator.js string length
var HASH = 'sha1'

//This method watches a file through its id
var addFile = function(path, size, cb) {
	//gets the time now to add it to the file object; will be used below in the expirationDate
    var timeNow = (+new Date())
	//this is the limit date of the upload, so that it can be released if the upload isn't completed until this date
    var expirationDate = timeNow + Number(options.get().expires)
	//will create the id of the file
    var id = '' + timeNow + options.get().secret //this works because Node does not run the code in multiple threads
    //this is necessary for creating the SHA1 hash
    var digester = crypto.createHash(HASH) //this will create the id hash
	//digesting the id
    digester.update(id)
	//transforming the plain string into a SHA1 hex string
    id = digester.digest('hex')
	//this is used in the checksum
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
    
    //everythin went fine; calls the callback to signal an ok operation
    //this code still has to implement disk checking, permission checking, logging, and so on
    //that's why it is only a small, simple, functional example and shouldn't be used as a production
    //middleware. Please override this simple manager
    cb(null, {
		code: 200,
		json: {id: id, expires: expirationDate, offset: 0},
		message: undefined
	})
}

//This method just returns the whole file object and checks if it hasn't expired
var getFile = function(id) {
	//gets the file in the object
    var call = files[id]
    
    //checks expirationDate
    if(call && (+new Date()) > call.expires) {
		//if expired, deletes the file from db and returns undefined
		delete files[id]
		return undefined
    }
    //if everything went fine, just returns the file
    return call
}

//This method removes the file from the db
var deleteFile = function(id) {
	//gets the object from the db
	var call = files[id]
	
	//checks existence
	if(call) {
		//if exists, deletes
		delete files[id]
	}
}

//This method appends the chunk to the end of the file with id 'id'
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

//This method ends the upload of the file with id 'id'
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
		//if not, removes the file
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

//DEPRECATED
//just dont use this function
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

//this function changes the default DB to a personalized DB
var dbChange = function(dbObject) {
	db = dbObject
}

//this function assigns the default DB to the db object
var defaultDB = function() {
	db = {
		addFile: addFile,
		appendToFile: appendToFile,
		endFile: endFile
	}
}

//returns the db object
var useDB = function() {
	return db;
}

//exporting everything
module.exports = {
	db: useDB,
    useDefault: defaultDB,
	changeDB: dbChange
}