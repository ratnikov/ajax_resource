AjaxResource.AttributeMod = function() {
  var _attributes = {};
  var _errors = [];

  this.attributes = function() {
    return _attributes;
  };

  this.errors = function() {
    return _errors;
  };

  this.has_errors = function() {
    return this.errors().length !== 0;
  };

  this.valid = function() {
    return !this.has_errors();
  };

  this.parse_json = function(json) {
    if (typeof(json.errors) !== "undefined") {
      _errors = json.errors;
      delete json.errors;
    } else {
      // if there're no errors, emptying out errors
      _errors = [];
    }

    // use all other properties as attributes
    _attributes = json;
  };
};
