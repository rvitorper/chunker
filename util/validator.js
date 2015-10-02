//TODO: comment

var fileValidator = function(requestJSON) {
    var fileRegex = /^[\w\.]{1,90}\.\w{1,15}$/
    var sizeRegex = /^[1-9]([0-9]+)?$/
    if(requestJSON.file && requestJSON.size &&
		fileRegex.test(requestJSON.file) &&
		sizeRegex.test(requestJSON.size)) {
		return {path: requestJSON.file, size: requestJSON.size}
    }
    return undefined
}

var chunkValidator = function(requestJSON) {
	var idRegex = /^[a-z0-9]{40}$/
	if(requestJSON.chunk && requestJSON.id &&
		requestJSON.chunk.length > 0 &&
		idRegex.test(requestJSON.id)) {
		return {id: requestJSON.id}//, chunk: requestJSON.chunk}
	}
    return undefined
}

var endValidator = function(requestJSON) {
	var checksumRegex = /^[a-z0-9]{40}$/
	var idRegex = /^[a-z0-9]{40}$/
	if(requestJSON.id && requestJSON.checksum &&
		idRegex.test(requestJSON.id) &&
		checksumRegex.test(requestJSON.checksum)) {
		return {id: requestJSON.id, checksum: requestJSON.checksum}
	}
    return undefined
}

//TODO: test this validator
var optionsValidator = function(requestJSON) {
	var numberRegex = /^[1-9]([0-9]{1,14})?$/
	var secretRegex = /^.{5,15}$/
	var pathRegex = /^\/(\w+\/)+$/
	if(requestJSON.secret && requestJSON.savePath && requestJSON.maxChunkSize && requestJSON.expires &&
		numberRegex.test(requestJSON.maxChunkSize) &&
		numberRegex.test(requestJSON.expires) &&
		secretRegex.test(requestJSON.secret) &&
		pathRegex.test(requestJSON.savePath)) {
		return {secret: requestJSON.secret, savePath: requestJSON.savePath, maxChunkSize: Number(requestJSON.maxChunkSize), expires: Number(requestJSON.expires)}
	}
	return undefined
}

module.exports = {
    file: fileValidator,
    chunk: chunkValidator,
    end: endValidator,
	options: optionsValidator
}