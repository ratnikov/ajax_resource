AjaxResource.AttributeMod = function() {
  this._attributes = {};
  this._errors = [];
};

AjaxResource.AttributeMod.prototype.attributes = function() {
  return this._attributes;
};

AjaxResource.AttributeMod.prototype.errors = function() {
  return this._errors;
};

AjaxResource.AttributeMod.prototype.has_errors = function() {
  return this.errors().length !== 0;
};

AjaxResource.AttributeMod.prototype.valid = function() {
  return !this.has_errors();
};

AjaxResource.AttributeMod.prototype.id = function() {
  if (typeof this.attributes().id !== "undefined") {
    return this.attributes().id;
  } else {

    // if there is no id attribute, return null as id
    return null;
  }
};

AjaxResource.AttributeMod.prototype.is_new = function() {
  return this.id() === null;
};

AjaxResource.AttributeMod.prototype.update_attributes = function(json) {
  if (typeof(json.errors) !== "undefined") {
    this._errors = json.errors;
    delete json.errors;
  } else {

    // if there are no errors reported by json, emptying out errors
    this._errors = [];
  }

  // use all other properties as attributes
  this._attributes = json;
};
