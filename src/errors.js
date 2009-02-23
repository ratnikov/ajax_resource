
AjaxResource.Errors = function(selector) {
  var private = { };
  jQuery(document).ready(function() {
    private.div = jQuery(jQuery.unique(jQuery(selector).find('div.error')));
    private.ul = private.div.find("ul");
  });

  this.clear = function() {
    private.ul.html("");
    this.hide();
  };

  this.append = function(errors) {
    jQuery.each(errors, function() {
      // assuming the errors are in the [ desc, message ] format
      if (this.length == 2) {
	var desc = this[0];
	var msg = this[1];
      } else {
	throw "Util.Errors: Unsupported error format";
      }

      var full_message;
      if (desc !== 'base') {
	full_message = desc+" "+msg;
      } else {
	// if it's a base error, add just the error message
	full_message = msg;
      }

      private.ul.append("<li>"+full_message+"</li>");
    });
  };

  this.set = function(errors) {
    this.clear();
    this.append(errors);
    this.show();
  };

  this.hide = function() { private.div.hide(); };
  this.show = function() { private.div.show(); };
};
