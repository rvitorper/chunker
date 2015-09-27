var options = require('./../options')
//TODO: comment
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
//TODO: validate chunk
var chunkValidator = function(requestJSON) {
    return requestJSON
}
//TODO: validate end
var endValidator = function(requestJSON) {
    return requestJSON
}

module.exports = {
    file: fileValidator,
    chunk: chunkValidator,
    end: endValidator
}