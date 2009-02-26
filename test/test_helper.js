
function matches_only(actual, selectors, message) {
  if (!jQuery.isArray(selectors)) {
    selectors = [ selectors ];
  }

  var unmatched = actual;
  jQuery.each(selectors, function() {
    var expected = this.toString();
    ok(actual.is(expected), message + ': '+expected+' is not matched');
    unmatched = unmatched.not(expected);
  });

  ok(unmatched.length == 0, message + ': matches other elements');
}
