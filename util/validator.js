/*
 * This files massages the data provided by the user.
 * It may be replaced by another validator, however 
 * the code is not yet flexible to allow this. So:
 * 
 * TODO: enable flexibility to change the validator
 * 
 * Each validator checks a few conditions and returns 
 * the same or nearly the same requestJSON. Every validator
 * has its conditions above it.
 */


//Conditions:
//requestJSON has to have 'file' and 'size'
//'file' has to be in a format such as 'X.Y' where X has between 1 and 90 chars; Y has between 1 and 15 chars. Char in a sense that is in [a-zA-Z0-9\.]
//'size' has to be a number between 1 and 199999999999999, representing the amount of bytes in a file
var fileValidator = function(requestJSON) {
    var fileRegex = /^[\w\.]{1,90}\.\w{1,15}$/
    var sizeRegex = /^[1-9]([0-9]{1,14})?$/
    if(requestJSON.file && requestJSON.size &&
		fileRegex.test(requestJSON.file) &&
		sizeRegex.test(requestJSON.size)) {
		return {path: requestJSON.file, size: requestJSON.size}
    }
    return undefined
}

//Conditions:
//requestJSON has to have 'id' and 'chunk'
//'id' has to be a valid SHA1 hash, although this only tests for containing only letters and numbers
//'chunk' has to be non-empty and pretty much anything
var chunkValidator = function(requestJSON) {
	var idRegex = /^[a-z0-9]{40}$/
	if(requestJSON.chunk && requestJSON.id &&
		requestJSON.chunk.length > 0 &&
		idRegex.test(requestJSON.id)) {
		return {id: requestJSON.id, chunk: requestJSON.chunk}
	}
    return undefined
}

//Conditions:
//requestJSON has to have 'id' and 'checksum'
//'id' has to be a valid SHA1 hash, although this only tests for containing only letters and numbers
//'checksum' has to be a valid SHA1 hash, although this only tests for containing only letters and numbers
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

//Conditions:
//requestJSON has to have 'secret', 'savePath', 'maxChunkSize' and 'expires'
//'secret' has to be any word with length between 5 and 15 characters
//'savePath' has to be a string in the format '/a/valid/path/'
//'maxChunkSize' has to be a number between 1 and 199999999999999
//'expires' has to be a number between 1 and 199999999999999
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

//Conditions:
//requestJSON has to have 'addFile', 'appendToFile' and 'endFile'
var dbValidator = function(requestJSON) {
	if(requestJSON.addFile && requestJSON.appendToFile && requestJSON.endFile) return requestJSON
	else return undefined
}

module.exports = {
    file: fileValidator,
    chunk: chunkValidator,
    end: endValidator,
	options: optionsValidator,
	db: dbValidator
}