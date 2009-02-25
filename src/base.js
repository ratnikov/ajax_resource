
AjaxResource.Base = function(spec) {
  jQuery.extend(this, new AjaxResource.AttributeMod());

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

  jQuery.extend(this, new AjaxResource.Routing(route_spec));
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
