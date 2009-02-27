
AjaxResource.Base = function(spec) {
  AjaxResource.AttributeMod.apply(this);

  if (typeof spec.resource !== "undefined") {
    this._resource_name = spec.resource;
  } else {
    throw("Must specify resource");
  }

  // include the routes
  this._assign_routes(spec);
};

AjaxResource.Base.prototype._assign_routes = function(spec) {
  var route_spec = {};

  if (typeof spec.controller !== "undefined") {
    route_spec.controller = spec.controller;
  } else {
    route_spec.controller = this.resource_name() + 's';
  }

  AjaxResource.Routing.apply(this, [ route_spec ]);
};

jQuery.extend(AjaxResource.Base.prototype, AjaxResource.AttributeMod.prototype);
jQuery.extend(AjaxResource.Base.prototype, AjaxResource.Routing.prototype);
jQuery.extend(AjaxResource.Base.prototype, AjaxResource.View.prototype);

AjaxResource.Base.prototype.resource_name = function() {
  return this._resource_name;
};

AjaxResource.Base.prototype.serialized_attributes = function() {
  var base = this;
  var serialized = {};
  jQuery.each(this.attributes(), function(key, value) {
    serialized[base.resource_name() + '[' + key + ']'] = value;
  });
  return serialized;
};

AjaxResource.Base.prototype.parse_json = function(json) {
  var resource_json = json[this.resource_name()];

  if (typeof resource_json !== "undefined") {

    if (typeof resource_json.html !== "undefined") {
      // set to use custom html if specified
      this.set_custom(resource_json.html);
      delete resource_json.html;
    } else {
      // otherwise set to use default html
      this.set_custom(null);
    }

    // update the attributes with the resource_json
    this.update_attributes(resource_json);

    return true;
  } else {
    // if no resource json was parsed, return false
    return false;
  }
};

AjaxResource.Base.prototype.create = function(success_callback) {

  // sanity check
  if (!this.is_new()) {
    throw("Cannot create an existing record");
  }

  var post_data = jQuery.extend({ _method : 'post' }, this.serialized_attributes());
  var resource = this;

  return jQuery.ajax({
    type: 'POST',
    url: this.collection_path(),
    data: post_data,
    success: function(json) {
      if (resource.parse_json(json)) {
	success_callback(resource);
      } else {
	// do nothing on error
      }
    },
    dataType: 'json'
  });
};

AjaxResource.Base.prototype.update = function(success_callback) {

  // sanity check
  if (this.is_new()) {
    throw("Cannot update a new record");
  }

  var post_data = jQuery.extend({ _method : 'put' }, this.serialized_attributes());
  var resource = this;

  return jQuery.ajax({
    type: 'POST',
    url : this.member_path(this.id()),
    data: post_data,
    success: function(json) {
      if (resource.parse_json(json)) {
	success_callback(resource);
      } else {
	// do nothing on error
      }
    },
    dataType: 'json'
  });
};

AjaxResource.Base.prototype.save = function(callback) {
  if (this.is_new()) {
    return this.create(callback);
  } else {
    return this.update(callback);
  }
};

AjaxResource.Base.prototype.destroy = function(success_callback) {

  // sanity check
  if (this.is_new()) {
    throw("Cannot destroy a new record");
  }

  var post_data = { _method : 'delete' };
  var resource = this;

  return jQuery.ajax({
    type : 'POST',
    url : this.member_path(this.id()),
    data : post_data,
    success: function(json) {
      if (resource.parse_json(json)) {
	success_callback(resource);
      } else {
	// do nothing on error
      }
    },
    dataType: 'json'
  });
};
