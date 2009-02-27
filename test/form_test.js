jQuery(document).ready(function() {
  var model = {};
  var form = new AjaxResource.Form('.form', {
    model : model
  });

  test("Truthitest", function() {
    ok(true);
  });

  module("Init", {
    setup : function() {
      form = new AjaxResource.Form('.form', {
	model : model
      });
    }
  });

  test("#form should return correct form", function() {
    matches_only(form.form(), '#form', "Should match correct form");
  });

  test("#submit_button should return correct button", function() {
    matches_only(form.submit_button(), '#submit-button', "Should match the correct button");
  });

  test("#fetch_model should return model object if 'model' option is not a function", function() {
    var model = {};
    equals((new AjaxResource.Form("foo", { model : model })).fetch_model(), model, "Should return the specified object itself");
  });

  test ("#fetch_model should invoke model function and return the returns if model options is a function", function() {
    var model_builder = function() { return "foo"; };
    equals((new AjaxResource.Form("foo", { model : model_builder })).fetch_model(), "foo", "Should return the builder's return");
  });

  test("#error_panel should return correctly specified error object", function() {
    matches_only(form.error_panel().error_div(), "#form-error", "Should only locate error div within the form");
  });

  test("Clicking submit button should attempt to submit the form", function() {
    var submitted = false;
    form.submit = function() { submitted = true; };

    form.submit_button().click();
    ok(submitted, "Should have attempted to submit the form"); submitted = false;

    // double-click prevention is responsibility of the submission process,
    // so #submit should be invoked on a second click as well.
    form.submit_button().click();
    ok(submitted, "Should have attemted to submit form on second click as well");
  });

  test("#parse_fields should return a json property set of values in the form", function() {
    jQuery(":input[name=foo[bar]]").attr("value", "foobar");
    jQuery(":input[name=bar[zeta]]").attr("value", "zetar");

    same(form.parse_fields(), { foo : { bar : "foobar" }, bar : { zeta : "zetar" } }, "Should parse the input fields correct");
  });

  module("#submit", {
    setup : function() {
      model = {
	parse_json: function(json) {
	  this.parsed_json = json;
	}
      };

      form = new AjaxResource.Form('div.form', {
	model : model
      });
    }
  });

  test("Should not submit twice", function() {
    var save_invoked = false; model.save = function(callback) { save_invoked = true; };
    var parse_invoked = false; form.parse_fields = function() { parse_invoked = true; };

    form.submit();
    ok(parse_invoked, "Should attempt to parse the fields within the form"); parse_invoked = false;
    ok(save_invoked, "Should attempt to save the model"); save_invoked = false;

    // since the dummy implementation of save does not invoke callback, semaphore should not be decremented state
    form.submit();
    ok(!parse_invoked, "Should not attempt to parse again");
    ok(!save_invoked, "Should not attempt to save again");
  });

  test("Should parse attributes from the form", function() {
    var field_values = { foo : { name : 'foo' }, bar : { zeta : 'foobar' } };

    form.parse_fields = function() {
      return field_values;
    };

    // stub out the actual saving
    model.save = function(saved_model) { };

    form.submit();
    same(model.parsed_json, field_values, "Should tell model to update itself with the json from the form");
  });

  test("Should specify a save callback that handles errors correctly", function() {
    var save_callback = null;
    model.save = function(callback) { save_callback = callback; };

    // pay attention to the semaphore decremention
    var semaphore_decremented = false;
    form.semaphore().dec = function() {
      semaphore_decremented = true;
    };

    // stub form.on_save
    on_save_model = null;
    form.on_save = function(saved_model) {
      on_save_model = saved_model;
    };

    // stub out the form.errors accessor
    var errors = {
      set: function(declared_errors) {
	errors.reported_errors = declared_errors;
      },
      clear: function() {
	errors.cleared = true;
      }
    };
    form.error_panel = function() { return errors; };

    // submit the form
    form.submit();
    ok(save_callback !== null, "Should have set save callback");

    // invoke callback with some errors
    var saved_model = { valid : function() { return true; } };
    save_callback(saved_model); 
    ok(semaphore_decremented, "Should have decremented semaphore since request was finished"); semaphore_decremented = false;

    equals(on_save_model, saved_model, "Should have invoked on_save callback with model specified"); on_save_model = null;
    ok(errors.cleared, "Should have cleared the errors in a successful save"); errors.cleared = false;

    saved_model = { valid: function() { return false; }, errors: function() { return [ [ "foo", "is not awesome enough" ]]; } };
    save_callback(saved_model);
    ok(semaphore_decremented, "Should decrement semaphore for error request as well"); semaphore_decremented = false;
    equals(on_save_model, null, "Should not invoke on_save callback, since the model contained errors");

    same(errors.reported_errors, [ [ "foo", "is not awesome enough" ] ], "Should set specified errors");
  });
});
