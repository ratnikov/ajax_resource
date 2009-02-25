
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

  module("#parse_json", { 
    setup : function() {
      model = new AjaxResource.Base({resource : 'funky_resource' });
    }
  });

  test("Should successfully parse a json with the resource name specified", function() {
    ok(model.parse_json({ funky_resource : { foo : 'foo', id : 5, '12345' : 12345 } }), "Should manage to parse the json");
    same(model.attributes(), { foo: 'foo', id: 5, '12345' : 12345 }, "Should have updated attributes");

    ok(model.parse_json({ funky_resource : { foo : 'bar', errors : "bad foo" } }), "Should manage to parse with errors");
    equals(model.attributes().foo, 'bar', "should have updated the specified attribute");
    equals(model.attributes()['12345'], '12345', "Should have not changed former attributes that were not specified in json");
    equals(model.errors(), "bad foo", "Should have set the errors");

    equals(model.html(), model.default_view(), "Should use the default view to generate html");
  });

  test("Should parse html if specified", function() {
    ok(model.parse_json({funky_resource : { foo : 'foo', html : '<p>foo</p>' } }), "Should parse json");
    equals(model.html(), "<p>foo</p>", "Should use specified html as model's html");
  });
});
