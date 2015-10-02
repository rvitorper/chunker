var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var options = require('./util/options')
var validator = require('./util/validator')
var upload = require('./util/upload')
var chunk = require('./util/chunk')

//TODO: comment

router.use(
	function(req, res, next) {
		console.log(options.get())
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

module.exports = function(optionsJSON) {
	var obj = validator.options(optionsJSON)
	if(obj) {
		options.set(obj)
		return router
	}
	throw "Bad provided options JSON"
}