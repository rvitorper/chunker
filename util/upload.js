var bodyParser = require('body-parser')
var express = require('express')
var router = express.Router()

var options = require('./../options')
var manager = require('./manager')
var validator = require('./validator')
//TODO: comment
router.route('/')
.post(
	function(req, res) {
		var obj = validator.file(req.body)
		if(obj) {
			obj = manager.addFile(obj.path, obj.size, obj.checksum)
			if(!obj) return res.status(500).send('Unable to create file')
			res.status(200).json({id: obj.id, offset: 0, expires: obj.expires})
		}
		else {
			res.status(400).send('Bad parametres')
		}
    }
)

module.exports = router