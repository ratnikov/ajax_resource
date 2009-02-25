
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
});
