
/*
 * Creates a new routing object. 
 *
 * Following options are required:
 *
 *  - controller: the name of the controller to use for routing.
 *
 * Following options are available:
 *
 *  - prefix: prefix to use by the route. By default is ''
 */
AjaxResource.Routing = function(spec) {
  if (typeof spec.controller !== "undefined") {
    this._controller_name = spec.controller;
  } else {
    throw "Must specify controller to use";
  }

  if (typeof spec.prefix !== "undefined") {
    this._prefix = spec.prefix;
  } else {
    this._prefix = '';
  }
};

AjaxResource.Routing.prototype.controller_name = function() {
  return this._controller_name;
};

AjaxResource.Routing.prototype.prefix = function() {
  return this._prefix;
};

AjaxResource.Routing.prototype.collection_path = function() {
  return this.prefix() + '/' + this.controller_name();
};

AjaxResource.Routing.prototype.member_path = function(identifier) {
  return this.prefix() + '/' + this.controller_name() + '/' + identifier;
};
