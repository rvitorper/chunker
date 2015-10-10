var express = require('express')
var router = express.Router()

var manager = require('./manager')
var validator = require('./validator')

router.route('/')
.post(
	function(req, res) {
		var obj = validator.file(req.body)
		if(obj) {
			var file = manager.db().addFile(obj.path, obj.size)
			if(!file) return res.status(500).send('Unable to create file')
			res.status(200).json({id: file.id, offset: 0, expires: file.expires})
		}
		else {
			res.status(400).send('Bad parametres')
		}
    }
)

module.exports = router