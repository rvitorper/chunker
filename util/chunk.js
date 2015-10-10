/**
 * The purpose of this chunk file is to create a route so that chunks of a file can be sent one by one. 
 * This defines the route /; a client has to post a chunk to it so that it is added to the file in the savePath path. 
 * This file also implements a route that signals the end of a transmission, the /done route.
 * 
 * Essentially, a client with a valid id just has to post a JSON in the following format:
 * 
 * {"id": <valid id here>, "chunk": <non empty chunk here>}
 * 
 * such as:
 * 
 * {"id": "22abf6e7040fbd8e972c6d760d23012d96c83485", "chunk": "abcdefghij"}
 * 
 * And the chunk content will be appended to its corresponding file.
 * If the id is invalid, nothing will be done.
 * If the chunk is empty, nothing will be done.
 * If the chunk length added to the content is larger than the contracted file, the content wont be added to the file and the file will be marked as invalid.
 * The /done route has the following format:
 * 
 * {"id": <valid id here>, "checksum": <a valid checksum here>}
 * 
 * And that's it. 
 * If the id is invalid, nothing will be done. 
 * If the size of the file does not match the contract size, the file will be deleted. 
 * If the checksum does not match the calculated checksum, the file will be deleted.
 */

//Required modules
var express = require('express')
var router = express.Router()

//Chunker modules
var manager = require('./manager')
var validator = require('./validator')

//This is the / route, which accepts the chunks
router.route('/')
.post(
    function(req, res) {
		
		//checks if the request is valid
		var obj = validator.chunk(req.body)
		
		//if valid
		if(obj) {
			//appends the file via the manager
			manager.db().appendToFile(obj.id, obj.chunk, function(err, status) {
				if(err) console.log(err) //in case some error occurs
				
				//returns a nice and smooth answer or an error
				if(status.json) return res.status(status.code).json(status.json)
				else return res.status(status.code).send(status.message)
			})
		}
		//if not, responds with an error
		else {
			res.status(400).send('Bad parametres')
		}
    }
)

//this is the /done route, which ends transmissions
router.route('/done')
.post(
    function(req, res) {
		
		//checks if the request is valid
		var obj = validator.end(req.body)
		
		//if the request is valid
		if(obj) {
			
			//closes the file in the db
			manager.db().endFile(obj.id, obj.checksum, function(err, status) {
				if(err) console.log(err) //in case some error occurs
				
				//returns a nice and smooth answer or an error
				if(status.json) return res.status(status.code).json(status.json)
				else return res.status(status.code).send(status.message)
			})
			
		}
		//if not, just answers with an error message
		else {
			res.status(400).send('Bad parametres')
		}
    }
)

module.exports = router
