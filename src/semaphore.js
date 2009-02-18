
AjaxResource.Semaphore = function() {
  return {
    init: function(options) {
      var private = {};

      private.on_restricted = options.on_restricted;
      private.on_available = options.on_available;

      private.value = 0;
      private.restricted = false;

      var self = {
	inc: function() {
	  if (self.available() && (typeof(private.on_restricted) !== "undefined")) {
	    private.on_restricted();
	  }

	  private.value++;
	},

	dec: function() {
	  private.value--;

	  if (self.available() && (typeof(private.on_available) !== "undefined")) {
	    private.on_available();
	  }
	},

	available: function() { 
	  if (!private.restricted) {
	    return private.value === 0;
	  } else {
	    return false;
	  }
	},

	/*
	 * Resets the semaphore to be available.
	 */
	reset: function() { private.value = 0; private.restricted = false; },

	/*
	 * Restricts semaphore to never be available unless reset.
	 * The semaphore is still capable of inc and decrementing.
	 */
	restrict: function() { private.restricted = true; },

	/*
	 * Unrestricts the semaphore.
	 */
	unrestrict: function() { private.restricted = false; }
      };

      return self;
    }
  };
}();

