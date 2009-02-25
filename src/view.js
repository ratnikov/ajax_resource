
AjaxResource.View = function() { };

AjaxResource.View.prototype.default_view = function() {
  return this.resource_name() + ' (id: '+this.id()+')';
};
