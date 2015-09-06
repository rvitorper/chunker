var express = require('express')
var router = express()

var options = require('./options')
var upload = require('./util/upload')
var chunk = require('./util/chunk')

router.use(
    bodyParser.json({
	limit: options.maxChunkSize
    }),
    function(err, req, res, next) {
	if(err) return res.status(500).send('Bad JSON provided')
	next()
    }
)

router.use('/upload', upload)
router.use('/chunk', chunk)

router.listen(8000, '0.0.0.0', function() {
    console.log('Working')
})