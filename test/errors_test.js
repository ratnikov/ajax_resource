
jQuery(document).ready(function() {
  test("Truthitest", function() {
    ok(true);
  });

  module("Init");
  test("Should recognize error div correctly", function() {
    inner_errors = new AjaxResource.Errors('#inner-div');
    same(inner_errors.error_div().get(), jQuery("#inner-error-div").get(), "Should return only the inner div");

    main_errors = new AjaxResource.Errors('#main');
    same(main_errors.error_div().get(), jQuery("#main-error-div, #inner-error-div").get(), "Should return both error divs");

    all_errors = new AjaxResource.Errors(document);
    same(all_errors.error_div().get(), jQuery("div.error").get(), "Should match all error divs on the page.");
  });

  module("#ul");
  test("Should return ul within the error div", function() {
    var inner_ul = (new AjaxResource.Errors('#inner-div')).ul();
    matches_only(inner_ul, '#inner-ul', "Should include the inner ul");
    matches_only((new AjaxResource.Errors('#main')).ul(), [ '#inner-ul', '#main-ul', ], "Should include both inner and main uls");
  });

  module("UI effects", {
    setup : function() {
      inner_errors = new AjaxResource.Errors("#inner-div");
    }
  });

  var inner_errors = null;

  test("#hide and #show should hide and show the error div", function() {
    ok(inner_errors.error_div().is(":visible"), "Error div should be visible at beginning of test");
    inner_errors.hide();
    ok(inner_errors.error_div().is(":hidden"), "Error div should become hidden after #hide is invoked");

    inner_errors.show();
    ok(inner_errors.error_div().is(":visible"), "Error div should become visible after #show is invoked");
  });
});
