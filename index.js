var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
//TODO: change options to embed json
var options = require('./options')
var upload = require('./util/upload')
var chunk = require('./util/chunk')
//TODO: comment
router.use(
    function(req, res, next) {
		console.log('content-type:', req.get('content-type'))
		if(/^application\/json(;\s?charset=(utf-8))?$/.test(req.get('content-type'))) {
			next()
		}
		else {
			return res.status(400).send('Only JSON in utf-8 may be accepted')
		}
    },
    bodyParser.json({
		limit: options.maxChunkSize
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

module.exports = router