
jQuery(document).ready(function() {
  test("Truthitest", function() {
    ok(true);
  });

  var foo_route = new AjaxResource.Routing({ controller : 'foos' });

  test("#collection_path", function() {
    equals(foo_route.collection_path(), '/foos');
  });

  test("#member_path", function() {
    equals(foo_route.member_path('1'), '/foos/1');
  });

  test("Should use prefix if specified", function() {
    var with_prefix = new AjaxResource.Routing({ controller : 'foos', prefix : '/bars/5' });

    equals(with_prefix.collection_path(), '/bars/5/foos', "Collection path is wrong");
    equals(with_prefix.member_path(3), '/bars/5/foos/3', "Member path is wrong");
  });
});
