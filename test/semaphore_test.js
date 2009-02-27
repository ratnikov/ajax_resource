
jQuery(document).ready(function() {
  test("Truthitest", function() {
    ok(true);
  });

  test("General usage", function() {
    var on_available_invoked = false;
    var on_unavailable_invoked = false;

    var on_available = function() { on_available_invoked = true; };
    var on_unavailable = function() { on_unavailable_invoked = true ; };

    var semaphore = new AjaxResource.Semaphore({
      on_available : on_available,
      on_unavailable : on_unavailable
    });

    ok(semaphore.available(), "Should be available after initialization");

    ok(!on_unavailable_invoked, "Should not have invoked unavailable yet");
    semaphore.inc();
    ok(!semaphore.available(), "Should not be available anymore");
    ok(on_unavailable_invoked); on_unavailable_invoked = false;

    semaphore.inc();
    ok(!semaphore.available(), "Should still be unavailable");
    ok(!on_unavailable_invoked, "Should not invoke on_unavailable hook, since did not change availibility state");

    semaphore.dec();
    ok(!semaphore.available(), "Just decreased once, so should be still unavailable");
    ok(!on_available_invoked, "Should not invoke available hook since didn't change state");

    semaphore.dec();
    ok(semaphore.available(), "Should go back to being available");
    ok(on_available_invoked, "Should execute the availibility hook since just becamse available"); on_available_invoked = false;

    semaphore.dec();
    ok(semaphore.available(), "Should be still available");
    ok(!on_available_invoked, "Should not invoke the hook since didn't change states");

    semaphore.inc();
    ok(!semaphore.available(), "Should ignore that we decremented during being available");
  });
  
  test("#on_unavailable", function() {
    var unavailable_invoked = false;
    var semaphore = new AjaxResource.Semaphore({
      on_unavailable: function() { unavailable_invoked = true; }
    });

    semaphore.on_unavailable();
    ok(unavailable_invoked, "Should have been invoked");
  });
});
