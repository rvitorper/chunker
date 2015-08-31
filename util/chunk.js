var bodyParser = require('body-parser')
var express = require('express')
var router = express.Router()

var options = require('./options')
var manager = require('./manager')

router.route('/')
.post(bodyParser.json(),
    function(err, req, res, next) {
	if(err) return res.status(500).send('Bad JSON provided')
	next()
    },
    function(req, res) {
	var obj = manager.getFile(req.body.id)
	if(obj) {
	    
	    res.status(200).json({id: obj.id, offset: 0, expires: obj.expires})
	}
	else {
	    res.status(401).send('Bad parametres')
	}
    }
)

module.exports = router 
