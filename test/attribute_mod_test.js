
jQuery(document).ready(function() {
  mod = new AjaxResource.AttributeMod();

  test("Should have blank errors by default", function() {
    equals(0, mod.errors().length);
  });

  module("#update_attributes");
  test("Should parse attributes correctly", function() {
    var json = { "id" : 5, "bar" : "woohoo" };
    mod.update_attributes(json);
    same(json, mod.attributes(), "Should have parsed attributes correctly.");
    equals(false, mod.has_errors(), "Should not have any errors");
  });

  test("Should parse errors", function() {
    var errors = [ [ "Foo", "is not awesome enough" ] ];
    var json = { "id" : 5, "errors" : errors };
    mod.update_attributes(json);
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

  module("#id");
  test("Should return the id attribute", function() {
    mod._attributes.id = 5;
    equals(mod.id(), 5, "Should match the specified attribute id");

    mod._attributes.id = "asdf";
    equals(mod.id(), "asdf");
  });

  test("Should return null if the id attribute is not set", function() {
    delete mod._attributes.id;
    equals(null, mod.id(), "Should be null if not set.");
  });

  module("#new_record");

  test("Should return false if there is an id attribute", function() {
    mod._attributes.id = '5';
    equals(false, mod.is_new());
  });

  test("Should return true if there is no id attribute or it is null", function() {
    delete mod._attributes.id;
    equals(true, mod.is_new(), "Should be true if there is no id");

    mod._attributes.id = null;
    equals(true, mod.is_new(), "Should be true if the id is null");
  });
});
