var bodyParser = require('body-parser')
var express = require('express')
var router = express.Router()

var options = require('./../options')
var manager = require('./manager')
var validator = require('./validator')

router.route('/')
.post(bodyParser.json(),
    function(err, req, res, next) {
	if(err) return res.status(500).send('Bad JSON provided')
	next()
    },
    function(req, res) {
	var obj = validator({file: req.body.file, checksum: req.body.checksum, size: req.body.size})
	if(obj) {
	    obj = manager.addFile(obj.path, obj.size, obj.checksum)
	    res.status(200).json({id: obj.id, offset: 0, expires: obj.expires})
	}
	else {
	    res.status(401).send('Bad parametres')
	}
    }
)

module.exports = router