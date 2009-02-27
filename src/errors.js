
AjaxResource.Errors = function(selector) {
  this._error_div = jQuery(selector).find('div.error');
};

AjaxResource.Errors.prototype.error_div = function() {
  return this._error_div;
};

AjaxResource.Errors.prototype.ul = function() {
  return this.error_div().find("ul");
};

AjaxResource.Errors.prototype.append = function(error) {
  var self = this;
  jQuery.each(errors, function() {
    if (this.length == 2) {
      var desc = this[0];
      var msg = this[1];
    } else {
      throw "Unsupported error format for: "+this;
    }

    var full_message;
    if (desc !== 'base') {
      full_message = desc + ' ' + msg;
    } else {
      // Use only the error message for base errors
      full_message = msg;
    }

    self.ul().append("<li>" + full_message + "</li>");
  });
};

AjaxResource.Errors.prototype.clear = function() {
  this.ul().html("");
  this.hide();
};

AjaxResource.Errors.prototype.set = function(errors) {
  this.clear();
  this.append(errors);
  this.show();
};

AjaxResource.Errors.prototype.hide = function() {
  this.error_div().hide();
};

AjaxResource.Errors.prototype.show = function() {
  this.error_div().show();
};
