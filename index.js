var express = require('express')
var router = express()

var options = require('./util/options')
var upload = require('./util/upload')

router.use(function(req, res) {
    
})

router.use('/upload', upload)

router.listen(8000, '0.0.0.0', function() {
    console.log('Working')
})