
AjaxResource.Semaphore = function(options) {
  if (typeof options === "undefined") {
    options = {};
  }

  this._value = 0;

  this._on_available = options.on_available;
  this._on_unavailable = options.on_unavailable;
};

AjaxResource.Semaphore.prototype.dec = function() {
  if (this._value > 0) {
    this._value -= 1;

    if (this.available()) {
      this.on_available();
    } 

  } else {
    // do nothing since value should not go below zero
  }
};

AjaxResource.Semaphore.prototype.inc = function() {
  var was_available = this.available();
  this._value += 1;

  if (was_available && !this.available()) {
    this.on_unavailable();
  }
};

AjaxResource.Semaphore.prototype.on_available = function() {
  if (typeof this._on_available !== "undefined") {
    this._on_available();
  }
};

AjaxResource.Semaphore.prototype.on_unavailable = function() {
  if (typeof this._on_unavailable !== "undefined") {
    this._on_unavailable();
  }
};

AjaxResource.Semaphore.prototype.available = function() {
  return this._value === 0;
};
