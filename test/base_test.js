
jQuery(document).ready(function() {
  var model = new AjaxResource.Base({ resource: 'funky_resource' });

  // stubbing out the ajax requests
  var ajax_options;

  jQuery.ajax = function(options) {
    ajax_options = options;
  };

  test("Truthitest", function() {
    ok(true);
  });

  module("Initialization");
  test("Should use pluralized version of resource name for controller if none is specifed", function() {
    var story = new AjaxResource.Base({ resource : 'story' });
    equals(story.controller_name(), 'storys', "Should use the pluralized name, by appending an 's' to the resource name");
  });

  test("Should use custom controller name if specified", function() {
    var foobar = new AjaxResource.Base({ resource : 'foobar', controller : 'bar' });
    equals(foobar.controller_name(), 'bar', "Should use the explicitely specified controller name");
  });

  module("#resource_name");
  test("Should return the resource specified during initialization", function() {
    equals(model.resource_name(), 'funky_resource');
  });

  module("#searialized_attribute", {
    setup: function() {
      model.attributes().foo = "foo";
      model.attributes().bar = "bar\nzen";
    }
  });

  test("Should return an property set of attributes serialized in 'resource[field] : value' format", function() {
    same(model.serialized_attributes(), { 'funky_resource[foo]' : "foo", 'funky_resource[bar]' : "bar\nzen" });
  });
});
