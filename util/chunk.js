var bodyParser = require('body-parser')
var express = require('express')
var router = express.Router()
var fs = require('fs')
//TODO: comment
var options = require('./../options')
var manager = require('./manager')
var validator = require('./validator')

router.route('/')
.post(
    function(req, res) {
		var obj = validator.chunk({id: req.body.id})
		if(obj) {
			var file = manager.getFile(obj.id)
			if(!file) return res.status(404).send('File not found')
			if(file.offset + req.body.chunk.length > file.size) {
				file.expires = -1
				return res.status(400).send('Data sent larger than contract')
			}
			fs.appendFile(file.path, req.body.chunk, function(err) {
				if(err) console.log(err)
				file.digester.update(req.body.chunk)
				file.offset += req.body.chunk.length
				res.status(200).json({id: obj.id, offset: file.offset, expires: obj.expires})
			})
		}
		else {
			res.status(400).send('Bad parametres')
		}
    }
)

router.route('/done')
.post(
    function(req, res) {
		var obj = validator.end(req.body)
		var timeNow = +(new Date())
		if(obj) {
			var file = manager.getFile(obj.id)
			if(!file) return res.status(404).send('File not found')
			var check = file.digester.digest('hex')
			if(!(timeNow <= file.expires && file.size === file.offset && file.checksum === check)) {
				console.log('file.size === file.offset', file.size === file.offset)
				console.log('file.checksum === check', file.checksum === check)
				console.log('timeNow <= file.expires', timeNow <= file.expires)
				console.log('check', check)
				console.log('checksum', file.checksum)
				fs.unlink(file.path, function() {})
				file.expires = -1
				return res.status(400).send('Bad request')
			}
			res.status(200).json({id: obj.id, done: true})
		}
		else {
			res.status(400).send('Bad parametres')
		}
    }
)

module.exports = router
