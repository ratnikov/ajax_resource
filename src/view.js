
AjaxResource.View = function() { };

AjaxResource.View.prototype.default_view = function() {
  return this.resource_name() + ' (id: '+this.id()+')';
};

AjaxResource.View.prototype.set_custom = function(html) {
  if (html !== null) {
    this._html = html;
  } else {
    // if null, delete the entry, dropping back to default view
    delete this._html;
  }
};

AjaxResource.View.prototype.html = function() {
  if (typeof this._html !== "undefined") {
    return this._html;
  } else {
    // fall back to default view
    return this.default_view();
  }
};
