
AjaxResource.Base = function() {
  return {
    extend: function(self, spec) {
      var private = {
      };

      if (typeof(spec.resource_name) !== "undefined") {
	private.resource_name = spec.resource_name;
      } else {
	throw "must specify resource name";
      }

      private.singular_path = spec.singular_path;
      if (typeof(spec.plural_path) !== "undefined") {
	private.plural_path = spec.plural_path;
      } else {
	// if no plural path is specified, using singular + 's', e.g. member -> members
	private.plural_path = private.singular_path + 's';
      }

      if (typeof(spec.prefix) !== "undefined") {
	private.prefix = spec.prefix;
      } else {
	private.prefix = '';
      }

      var protected = {
	index_path: function() { return private.prefix+private.plural_path; },
	new_path:  function() { return protected.index_path() + '/new'; },
	create_path: function() { return protected.index_path(); },
	show_path: function() { 
	  if (self.id() !== null) {
	    return private.prefix + private.plural_path + '/' + self.id(); 
	  } else {
	    throw("Cannot generate a show path for an id-less object.");
	  }
	},
	edit_path: function() { return protected.show_path() + '/edit'; },
	update_path: function() { return protected.show_path(); },
	destroy_path: function() { return protected.show_path(); },

	update_attributes: function(json_response) {
	  var updated_attributes = json_response[private.resource_name];
	  if (typeof(updated_attributes) !== "undefined") {

	    // if there are any errors, remove them from update attributes and append as 'errors' property directly
	    if (typeof(updated_attributes.errors) !== "undefined") {
	      self.errors = updated_attributes.errors;
	      delete updated_attributes.errors;
	    } else {
	      // if there are no errors present, no special treatment is necessary
	    }

	    // if there was an html representation, add it to be returned as view
	    if (typeof(updated_attributes.html) !== "undefined") {
	      var html = updated_attributes.html;
	      self.view = function() { return html; };
	    } else {
	      // if there is no html representation present, allow to use the default renderer
	    }

	    // use all other properties as attributes
	    jQuery.extend(self.attributes, updated_attributes);

	    // Successfully updated attributes, returning true
	    return true;
	  } else {
	    // nothing has been updated, returning false
	    return false;
	  }
	}
      };

      jQuery.extend(self, {
	id: function() {
	  if (typeof(self.attributes.id) !== "undefined") {
	    return self.attributes.id;
	  } else {
	    return null;
	  }
	},
 
	has_errors: function() {
	  return ((typeof(self.errors) !== "undefined") && (self.errors.length !== 0));
	},

	valid: function() {
	  return !self.has_errors();
	},

	create: function(callback) {
	  var post_data = jQuery.extend({ _method: 'post' }, self.serialize_attributes());

	  return jQuery.ajax({
	    type: 'POST',
	    url: protected.create_path(),
	    data: post_data, 
	    success: function(json_response) {
	      console.log("response:");
	      console.log(json_response);
	      if (protected.update_attributes(json_response)) {

		// managed to update the attributes from json
		callback(self);
	      } else {

		// no updates received, calling the callback with null
		callback(null);
	      }
	    },
	    dataType: "json"
	  });
	},

	destroy: function(callback) {
	  var post_data = { _method: 'delete', id: self.attributes.id };

	  return jQuery.ajax({
	    type: 'POST',
	    url: protected.destroy_path(),
	    data: post_data,
	    success: function(json_response) {
	      if (protected.update_attributes(json_response)) {
		callback(self);
	      } else {
		callback(null);
	      }
	    },
	    dataType: "json"
	  });
	},

	parse_fields: function(div) {
	  var parsed_attributes = {};
	  jQuery(div).find(":input").each(function() {
	    var regex = private.resource_name + '\\[(.*)\\]';
	    var match = new RegExp(regex).exec(jQuery(this).attr("name"));
	    if (match !== null) {
	      var attr_name = match[1];
	      self.attributes[attr_name] = jQuery(this).attr("value");
	    } else {
	      // input field must be not for a group story, omitting...
	    }
	  });
	},

	serialize_attributes: function() {
	  var serialized_attributes = {};
	  jQuery.each(self.attributes, function(key, value) {
	    serialized_attributes[private.resource_name+"["+key+"]"] = value;
	  });
	  return serialized_attributes;
	},

	resource_name: function() { return private.resource_name; }
      });

      return self;
    }
  };
}();

