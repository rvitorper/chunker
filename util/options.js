

var options = {}

var setOptions = function(optionsJSON) {
	options = optionsJSON
}

var getOptions = function() {
	return options
}

module.exports = {
	get: getOptions,
	set: setOptions
}