
AjaxResource.NewForm = function(form, options) {
  var private = {};
  var self = this;

  // INIT

  // initialize options to {} if not specified
  if (typeof(options) === "undefined") {
    options = {};
  }

  private.form = jQuery(form);
  private.submit_button = private.form.find(":submit");

  private.errors = new AjaxResource.Errors(form);

  private.submission_semaphore = AjaxResource.Semaphore.init({
    on_available: function() {
      private.submit_button.attr("disabled", false);
      private.submit_button.attr("value", private.old_submit_value);
    },
    on_restricted: function() {
      private.old_submit_value = private.submit_button.attr("value");
      private.submit_button.attr("disabled", true);
      private.submit_button.attr("value", "Processing...");
    }
  });

  if (typeof(options.model) !== "undefined") {
    private.new_model = function() {
      return new options.model();
    };
  } else {
    throw("Need to specify model for the form");
  }

  if (typeof(options.on_create) !== "undefined") {
    private.on_create = options.on_create;
  } else {
    // if no create callback is specified, specifying it as empty function call
    private.on_create = function() { };
  }

  private.submit_button.click(function(event) {
    event.preventDefault();
    self.submit();
  });

  // PUBLIC

  jQuery.extend(this, { 
    parse: function(model) {
      var parsed_attributes = {};
      console.log(model);
      jQuery(private.form).find(":input").each(function() {
	var regex = model.resource_name() + '\\[(.*)\\]';
	var match = new RegExp(regex).exec(jQuery(this).attr("name"));
	if (match !== null) {
	  var attr_name = match[1];
	  parsed_attributes[attr_name] = jQuery(this).attr("value");
	} else {
	  // input field must be not for a group story, omitting...
	}
      });

      jQuery.extend(model.attributes, parsed_attributes);
    },

    submit: function() {
      if (private.submission_semaphore.available()) {
	var model = private.new_model();
	this.parse(model);

	model.create(function(created_model) {
	  if (created_model.valid()) {
	    // if created model is valid, clear the errors and append the model
	    // to model list

	    private.errors.clear();
	    private.on_create(created_model);
	  } else {
	    // if the returned model has errrs, report them via error div
	    private.errors.set(created_model.errors);
	  }

	  private.submission_semaphore.dec();
	});

	private.submission_semaphore.inc();
      } else {
	// if not allowed to make a submission request, ignoring it.
      }
    }
  });
};
