/*
 * This file creates a router for the chunker package by creating two routes, /upload and /chunk.
 * Every route has its own middleware that deals with each function.
 * /upload is used solely to create new file uploads.
 * /chunk receives every chunk and deals with the end of the transmission.
 * Check upload.js and chunk.js for more details.
 *
 * The role of this file is to accept only JSON requests, limit the JSON string size and set the DB to be used
 */

//Required modules
var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

//Chunker modules
var options = require('./util/options')
var validator = require('./util/validator')
var upload = require('./util/upload')
var chunk = require('./util/chunk')
var manager = require('./util/manager')

//This part filters the requests so that it only accepts JSON
router.use(
	function(req, res, next) {
		//checks if the content-type is application/json
		if(/^application\/json(;\s?charset=(utf-8))?$/.test(req.get('content-type'))) {
			//if so, just continues
			next()
		}
		else {
			//if not, returns an error message
			return res.status(400).send('Only JSON in utf-8 may be accepted')
		}
	},
	//calls the bodyParser module to parse the JSON and limits the size of the acceptable requests
	bodyParser.json({
		limit: '' + options.get().maxChunkSize
	}),
	//in case it is invalid JSON, this is a fallback that responds with an error message
	function(err, req, res, next) {
		if(err) {
			console.log('error:', err)
			return res.status(400).send('Bad JSON provided')
		}
		next()
	}
)

//Sets the routes
router.use('/upload', upload)
router.use('/chunk', chunk)

//export a function that receives the options and the db
//if no db is specified, uses the default
module.exports = function(optionsJSON, db) {

	//validates the optionsJSON
	var obj = validator.options(optionsJSON)
	//used to validate the db
	var dbObj = undefined

	//if db is specified
	if(db !== undefined) {
		//validates the db
		dbObj = validator.db(db)

		//if valid
		if(dbObj) {
			//changes it to the to-be-used db
			manager.changeDB(dbObj)
		}
		else {
			//otherwise it is impossible to continue
			throw "Bad DB provided"
		}
	}
	//if not, uses default
	else {
		manager.useDefault()
	}

	//if the options are valid
	if(obj) {
		//set them and returns the router
		options.set(obj)
		return router
	}
	//otherwise it is impossible to continue
	else throw "Bad options provided"
}
