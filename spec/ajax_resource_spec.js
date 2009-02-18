
var FooResource = function() {
  return {
    build: function(spec) {

      var self = {
	attributes: { },
	view: function() {
	  return "<div class='foo-resource'>"+self.attributes.name+"</div>";
	}
      };

      AjaxResource.Base.extend(self, {
	resource_name: 'foo_resource',
	singular_path: '/foo_resource',
	plural_path: '/foo_resources',
	prefix: '/foo/bar'
      });

      return self;
    }
  };
}();

jQuery(document).ready(function() {
  foo = FooResource.build();
  jQuery("a.foo-create").click(function() {
    foo.parse_fields("#parse-form");
    foo.create(function() {
      console.log("New foo created:");
      console.log(foo);
    });
  });

  jQuery("a.foo-destroy").click(function() {
    foo.destroy(function() {
      console.log("Foo derstroyed:");
      console.log(foo);
    });
  });
});
