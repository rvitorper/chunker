//This file justs manages personalized options that will be passed
//as a parameter on the function exported by index.js in this project
//The keys/values necessary in the options are not restricted in this file
//They are specified in the validator.js file

//The object that holds the options
var options = {}

//This function just sets the options
var setOptions = function(optionsJSON) {
	options = optionsJSON
}

//This function returns the options
var getOptions = function() {
	return options
}

//Exporting everything
module.exports = {
	get: getOptions,
	set: setOptions
}