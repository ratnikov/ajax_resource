
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
