Ajax = {
  Request: function(url, parameters) {
    var fake_response = "Fake response from "+url;
    jQuery("#test_log").html(fake_response);

    Ajax.last_response = fake_response;

    return { url: url, parameters: parameters, method: "Request", response: fake_response };
  }
};

var AjaxTools = function() {
  var request_count = 0;
  var requests = {};

  // attach a click listener to all json success links
  jQuery("a.json-success").live("click", function() {
    request_id = jQuery(this).attr("request_id");
    AjaxTools.requests()[request_id].json_success();
  });

  jQuery("a.json-error").live("click", function() {
    AjaxTools.requests()[jQuery(this).attr('request_id')].json_error();
  });

  return {
    make_id: function() { 
      request_count++; 
      return request_count; 
    },
    requests: function() { 
      return requests; 
    },
    log: function(msg) {
      console.log(msg);
      jQuery("div.ajax ul").filter("#log").append("<li>"+msg+"</li>");
    },
    read_json: function() {
      json_contents = jQuery("div.ajax input#json").attr("value");
      eval("json = "+json_contents+";");
      return json;
    },
    AjaxRequest: function(options) {
      console.log(options);
      var id = AjaxTools.make_id();
      var url = options.url;
      var json_success = jQuery("<a href='#'>json success</a>");
      var success = options.success;
      var error = options.error;
      console.log(success);

      if (typeof(success) === "undefined") {
	success = function() { };
      }

      var complete = options.complete;

      var self = {
	json_success_link: "<a href='#' class='json-success' request_id='"+id+"'>json success</a>",
	json_error_link: "<a href='#' class='json-error' request_id='"+id+"'>json error</a>",
	perform: function() {
	  // log the link
	  AjaxTools.log("Ajax request #"+id+": "+jQuery.pp(options)+" ("+self.json_success_link+", "+self.json_error_link+")");
	},
	json_success: function() {
	  if (typeof(success) !== "undefined") {
	    json_response = AjaxTools.read_json();
	    AjaxTools.log("Feeding "+jQuery.pp(json_response)+" to as success for request #"+id+".");
	    success(json_response);
	  } else {
	    AjaxTools.log("No success callback specified for request. Ignoring...");
	  }

	  self.exec_complete();
	},
	json_error: function() {
	  if (typeof(error) !== "undefined") {
	    json_response = AjaxTools.read_json();
	    AjaxTools.log("Feeding "+jQuery.pp(json_response)+" as error for request #"+id+".");
	    error(json_response);
	  } else {
	    AjaxTools.log("No error callback specified for request. Ignoring...");
	  }

	  self.exec_complete();
	},
	exec_complete: function() {
	  if (typeof(complete) !== "undefined") {
	    AjaxTools.log("Evaluating complete callback...");
	    complete();
	  } else {
	    // skipping the complete callback
	  }
	}
      };
      requests[id] = self;
      return self;
    }
  };
}();




jQuery.extend(function() {
  return {
    ajax: function(options) {
      if (typeof(options.data) !== "undefined") {
	options.data = jQuery.pp(options.data);
      }

      AjaxTools.AjaxRequest(options).perform();
      return "Fake contents";
    },
    pp: function(obj) {
      if (typeof(obj) !== "undefined") {
	var contents = '{';
	jQuery.each(obj, function(key, val) {
	  contents += ' '+key+': '+val+',';
	});
	contents += '}';
	return contents;
      } else {
	return obj;
      }
    }
  };
}());

Form = {
  serialize: function(first) {
    return {
      name: "serialize",
      first: first
    };
  }
};
