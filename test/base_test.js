
jQuery(document).ready(function() {
  var model = new AjaxResource.Base({ resource: 'funky_resource' });

  // stubbing out the ajax requests
  var ajax_options;

  jQuery.ajax = function(options) {
    ajax_options = options;
    return 'ajax_request';
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

  test("Should un-customize html if not specified", function() {
    model.set_custom("hello world");
    equals(model.html(), "hello world");

    ok(model.parse_json({ funky_resource : { } }), "Should parse the json");
    equals(model.html(), model.default_view(), "Should use the default view even though previously customized");
  });

  module("#create");

  test("Should make an ajax request and parse its returns", function() {
    model.attributes().foo = 'foo';
    model.attributes().bar = 'foobar';

    var callback_invoked = false;
    var callback = function(updated_model) {
      equals(updated_model, model, "Should reference the same model");
      callback_invoked = true;
    };

    equals(model.create(callback), 'ajax_request', "Should return the ajax request object");

    ok(typeof ajax_options !== "undefined", "Should have made an ajax request.");

    equals(ajax_options.type, 'POST', "Should make a post request");
    equals(ajax_options.url, model.collection_path(), "Should use the collection path for the url to post to");
    equals(ajax_options.dataType, "json", "Should set that a JSON response is expected");

    equals(ajax_options.data._method, 'post', "Should use the rails faking of post mechanism to specify it's a post request");
    delete ajax_options.data._method; // remove to get access to other data stuff
    same(ajax_options.data, model.serialized_attributes(), "The rest of the post data should be the serialized attributes of the model");

    var ajax_success = ajax_options.success;
    ok(typeof(ajax_success) !== "undefined", "Should specify a success ajax callback");

    ok(!callback_invoked, "Should not have invoked callback yet.");

    var response = {};
    response[model.resource_name()] = { id : 5, foo : 'fooism', errors : 'Bad bar' };
    ajax_success(response);

    ok(callback_invoked, "Should have invoked callback now.");

    callback_invoked = false;
    ajax_success({});
    ok(!callback_invoked, "Should not invoke callback if it's missing the resource name");
  });
});
