var express = require('express')
var app = express()
var expect = require('chai').expect

var opt = {
    "secret": "teste",
    "savePath": "/home/ramon/uploads/",
    "maxChunkSize": 102400,
    "expires": 86400000
}


app.use(require('../index')(opt))



