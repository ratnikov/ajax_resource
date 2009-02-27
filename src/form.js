
AjaxResource.Form = function(form, options) {
  var self = this;

  this._form = jQuery(form);

  if (typeof options === "undefined") {
    options = {};
  }

  if (typeof options.model !== "undefined") {
    this._model = options.model;
  } else {
    throw("Must specify model");
  }

  this._on_save = options.on_save;

  this._semaphore = new AjaxResource.Semaphore();

  this.submit_button().bind("click", function(event) {
    event.preventDefault();
    self.submit();
  });
};

AjaxResource.Form.prototype.form = function() {
  return this._form;
};

AjaxResource.Form.prototype.submit_button = function() {
  return this.form().find(":submit");
};

AjaxResource.Form.prototype.model = function() {
  return this._model;
};

AjaxResource.Form.prototype.semaphore = function() {
  return this._semaphore;
};

AjaxResource.Form.prototype.on_save = function(model) {
  if (typeof this._on_save !== "undefined") {
    this._on_save(model);
  } else {
    // do nothing since no on_save callback was specified
  }
};

AjaxResource.Form.prototype.parse_fields = function() {
  var parsed_attributes = {};
  jQuery(this.form()).find(":input").each(function() {
    var regex = '(.*)\\[(.*)\\]';
    var match = new RegExp(regex).exec(jQuery(this).attr("name"));
    if (match !== null) {
      var resource_name = match[1];
      var attr_name = match[2];

      // initialize the hash for the resource if not present yet
      if (typeof parsed_attributes[resource_name] === "undefined") {
	parsed_attributes[resource_name] = {};
      }

      parsed_attributes[resource_name][attr_name] = jQuery(this).attr("value");
    } else {
      // input field name does not match the foo[bar] format so ignoring
    }
  });

  return parsed_attributes;
};

AjaxResource.Form.prototype.submit = function() {
  var self = this;
  if (this.semaphore().available()) {
    // update the model from the attributes within the form
    this.model().parse_json(form.parse_fields());

    this.model().save(function(saved_model) {
      if (saved_model.valid()) {
	// if the model is valid, clear errors and execute the on_saved callback

	self.errors().clear();
	self.on_save(saved_model);
      } else {
	// if returned model contained errors, report them
	self.errors().set(saved_model.errors());
      }

      // the request was handled, decrease the semaphore
      self.semaphore().dec();
    });

    // just initiated request, increment semaphore to prevent further submissions
    this.semaphore().inc();
  } else {
    // do nothing if semaphore is not available
  }
};
