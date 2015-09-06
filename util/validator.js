var options = require('./../options')

var fileValidator = function(requestJSON) {
    var fileRegex = /^\w{2,15}\.\w{1,15}$/
    var sizeRegex = /^[1-9]([0-9]+)?$/
    var checksumRegex = /^[a-z0-9]+$/
    if(requestJSON.file && requestJSON.size && requestJSON.checksum &&
	fileRegex.test(requestJSON.file) &&
	sizeRegex.test(requestJSON.size) &&
	checksumRegex.test(requestJSON.checksum)) {
	return {path: requestJSON.file, size: requestJSON.size, checksum: requestJSON.checksum}
    }
    return undefined
}

var chunkValidator = function(requestJSON) {
    
}

var endValidator = function(requestJSON) {
    
}

module.exports = {
    file: fileValidator,
    chunk: chunkValidator,
    end: endValidator
}