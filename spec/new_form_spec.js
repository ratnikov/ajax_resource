var Util = function() {
  return {
    Errors: {
      select: function() { 
      }
    }
  };
}();

var Foo = function(spec) {
  var private = {};
  this.attributes = {};

  if (typeof(spec.bar_id) !== "undefined") {
    this.attributes.bar_id = spec.bar_id;
  } else {
    throw("Must specify bar id");
  }

  this.bar_id = function() {
    return this.attributes.bar_id;
  };

  AjaxResource.Base.extend(this, {
    resource_name: 'foo',
    singular_path: '/foo',
    prefix: '/bars/'+this.bar_id()
  });

  var old_create = this.create;

  // override create to read from success or error, depending on the flag
  this.create = function(callback) {
    var request = old_create(callback);
    request.json_success();
  };
};

AjaxTools.read_json = function() {
  if (jQuery(".foo-success-radio").attr("checked")) {
    return jQuery.evalJSON(jQuery(".foo-success").attr("value"));
  } else {
    return jQuery.evalJSON(jQuery(".foo-error").attr("value"));
  }
};

jQuery(document).ready(function() {

  var form = jQuery("#parse-form");

  var model_builder = function() { 
    return new Foo({
      bar_id: form.metadata().bar_id
    });
  };

  // using a global to be able to access from firebug
  new_form = new AjaxResource.NewForm(form, {
    on_create: function(model) {
      alert("Create new model.");
      console.log(model);
    },
    model_builder: model_builder 
  });

  jQuery(":button.parse-attributes").click(function() {
    var foo = model_builder();
    new_form.parse(foo);

    jQuery(".foo-success").attr("value", jQuery.toJSON({ 'foo' : foo.attributes }));
    jQuery(".foo-error").attr("value", jQuery.toJSON({ 'foo' : jQuery.extend({ errors: [ [ "Foo", "is not awesome enough" ] ] }, foo.attributes) }));
  });
});

