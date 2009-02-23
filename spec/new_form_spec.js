var Util = function() {
  return {
    Errors: {
      select: function() { 
      }
    }
  };
}();

var Foo = function() {
  this.attributes = {};
  AjaxResource.Base.extend(this, {
    resource_name: 'foo',
    singular_path: '/foo'
  });

  var old_create = this.create;

  // override create to read from success or error, depending on the flag
  this.create = function(callback) {
    var request = old_create(callback);
    request.json_success();
  }
};

AjaxTools.read_json = function() {
  if (jQuery(".foo-success-radio").attr("checked")) {
    return jQuery.evalJSON(jQuery(".foo-success").attr("value"));
  } else {
    console.log("errorz!!!!");
    return jQuery.evalJSON(jQuery(".foo-error").attr("value"));
  }
}

jQuery(document).ready(function() {
  new_form = new AjaxResource.NewForm("#parse-form", {
    on_create: function(model) {
      console.log("Created new model:");
      console.log(model);
    },
    model: Foo
  });

  jQuery(":button.parse-attributes").click(function() {
    var foo = new Foo();
    new_form.parse(foo);

    jQuery(".foo-success").attr("value", jQuery.toJSON({ 'foo' : foo.attributes }));
    jQuery(".foo-error").attr("value", jQuery.toJSON({ 'foo' : jQuery.extend({ errors: [ [ "Foo", "is not awesome enough" ] ] }, foo.attributes) }));
  });
});

