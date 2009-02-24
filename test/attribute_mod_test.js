
jQuery(document).ready(function() {
  mod = new AjaxResource.AttributeMod();

  test("Should have blank errors by default", function() {
    equals(0, mod.errors().length);
  });

  module("#parse_json");
  test("Should parse attributes correctly", function() {
    var json = { "id" : 5, "bar" : "woohoo" };
    mod.parse_json(json);
    same(json, mod.attributes(), "Should have parsed attributes correctly.");
    equals(false, mod.has_errors(), "Should not have any errors");
  });

  test("Should parse errors", function() {
    var errors = [ [ "Foo", "is not awesome enough" ] ];
    var json = { "id" : 5, "errors" : errors };
    mod.parse_json(json);
    same({ "id" : 5 }, mod.attributes(), "Should have passed the attributes.");
    same(errors, mod.errors(), "Parsed errors should match.");
  });

  module("#has_errors");
  test("Should return false if errors().length is 0", function() {
    mod.errors = function() { 
      return { length : 0 };
    };

    equals(false, mod.has_errors());
  });

  test("Should be true if errors() length is not 0", function() {
    mod.errors = function() { return { length : 5 }; };

    equals(true, mod.has_errors());
  });
});
