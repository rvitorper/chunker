/*
 * The purpose of this file is to implement a route that registers a new upload to be done returning a message handled by the manager.js to the client.
 * The route used is the / route, with its absolute path to be controlled by the index.js file.
 * 
 * The functionality of this route is obtained by posting a JSON to this route with the following format:
 * 
 * {"file": <the file name here>, "size": <a valid size here>}
 * 
 * such as:
 * 
 * {"file":"matrix.txt", "size": "10"}
 * 
 * And the file will be added to the manager DB.
 * If file is invalid, no file will be created.
 * If the size is invalid, no file will be created.
 * The restrictions of what is valid or not are specified by the validator.js file.
 */

//Required modules
var express = require('express')
var router = express.Router()

//Chunker modules
var manager = require('./manager')
var validator = require('./validator')

//This is the route that accepts the JSON and asks the DB to create the file
router.route('/')
.post(
	function(req, res) {
		//Validates the req.body
		var obj = validator.file(req.body)
		
		//if valid
		if(obj) {
			//requests the manager db to create the file
			manager.db().addFile(obj.path, obj.size, function(err, status) {
				if(err) console.log(err) //in case some error occurs
				
				//returns a nice and smooth answer or an error
				if(status.json) return res.status(status.code).json(status.json)
				else return res.status(status.code).send(status.message)
			})
		}
		//otherwise, just returns an error message
		else {
			res.status(400).send('Bad parametres')
		}
    }
)

module.exports = router