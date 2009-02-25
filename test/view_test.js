
jQuery(document).ready(function() {
  test("Truthitest", function() {
    ok(true);
  });

  module("#default_view", {
    setup : function() {
      model = new AjaxResource.View();
      model.resource_name = function() {
	return 'funky_foo';
      };

      model.id = function() {
	return this._id;
      };
    }
  });

  test("Should return in format: '{resource_name} (id: {id})'", function() {
    model._id = '5';
    equals(model.default_view(), 'funky_foo (id: 5)');

    model._id = null;
    equals(model.default_view(), 'funky_foo (id: null)');
  });


  module("#html");
  test("Should return default view by default", function() {
    var view = new AjaxResource.View();
    view.default_view = function() { return 'default'; }
    equals(view.html(), 'default', "Should use the default.");

    view._html = 'hello';
    equals(view.html(), 'hello', "should use the specified html if there exists.");
  });

  module("#set_custom");
  test("Should update what #html returns", function() {
    view = new AjaxResource.View();
    view.default_view = function() { return 'default'; }
    equals(view.html(), 'default', "should use the default html until customized");

    view.set_custom("<p>foo</p>");
    equals(view.html(), "<p>foo</p>", "Should return customized version after customization");

    view.set_custom(null);
    equals(view.html(), 'default', "Should fallback to default view if customized to be null");
  });

});
