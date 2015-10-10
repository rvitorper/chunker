var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var options = require('./util/options')
var validator = require('./util/validator')
var upload = require('./util/upload')
var chunk = require('./util/chunk')
var manager = require('./util/manager')

//TODO: comment

router.use(
	function(req, res, next) {
		if(/^application\/json(;\s?charset=(utf-8))?$/.test(req.get('content-type'))) {
			next()
		}
		else {
			return res.status(400).send('Only JSON in utf-8 may be accepted')
		}
	},
	bodyParser.json({
		limit: options.get().maxChunkSize
	}),
	function(err, req, res, next) {
		if(err) {
			console.log('error:', err)
			return res.status(400).send('Bad JSON provided')
		}
		next()
	}
)

router.use('/upload', upload)
router.use('/chunk', chunk)

module.exports = function(optionsJSON, db) {
	var obj = validator.options(optionsJSON)
	var dbObj = undefined
	
	if(db !== undefined) {
		dbObj = validator.db(db)
		if(dbObj) {
			manager.changeDB(dbObj)
		}
		else {
			throw "Bad DB provided"
		}
	}
	else {
		manager.useDefault() 
	}
	
	if(obj) {
		options.set(obj)
		return router
	}
	else throw "Bad options provided"
}