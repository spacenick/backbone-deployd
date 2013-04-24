'use strict';
(function(root){
	
	// Keep track of Backbone.sync
	root.Backbone.originalSync = root.Backbone.sync;

	// Map Backbone method name to deployd SDK functions name
	var methodToFunction = {
		"read":"get",
		"create":"post",
		"update":"put",
		"delete":"del"
	};
	// Deployd support a single function with result,error as parameters
	var defaultCallback = function(result,error){
		if (error) options.error(error);
		else options.success(result);
	}

	root.Backbone.sync = function(method,model,options) {

		// Default base args.
		var args = [defaultCallback];
		var functionName = methodToFunction[method];

		// Set dpd call parameters depending on the method indeed.
		if (functionName == "get") {
			if (options.query) args = [options.query].concat(args); 
			if (model.id) args = [model.id].concat(args);
		}
		else if (functionName == "post") {
			args = [model.toJSON()].concat(args);
		}
		else if (functionName == "put") {
			args = [model.id,model.toJSON()].concat(args);
		}
		else if (functionName == "del") {
			args = [model.id].concat(args);
		}


		// Get good function name from the map, and call with good parameters
		dpd[model.resourceName][functionName].apply(dpd,args);
	};


})(window);