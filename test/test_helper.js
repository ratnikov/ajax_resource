
function matches_only(actual, selectors, message) {
  if (typeof actual === "undefined") {
    ok(false, message + ": expected selector should be defined");
    return;
  }

  if (!jQuery.isArray(selectors)) {
    selectors = [ selectors ];
  }


  var unmatched = actual;
  jQuery.each(selectors, function() {
    var expected = this.toString();
    ok(actual.is(expected), message + ': '+expected+' should be matched');
    unmatched = unmatched.not(expected);
  });

  ok(unmatched.length == 0, message + ': should not match other elements');
}
