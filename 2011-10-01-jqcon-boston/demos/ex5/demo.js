// ## Ex5 - Initialization methods

// When you create a new instance of a widget, it'll automatically call a couple
// initialization methods: `_create` and `_init`.
//
// `_create` gets called the very first time, while `_init` will be called the
// first time and every time you initialize it (call the widget method without a 
// string as the first argument, because that calls a method.)

jQuery.widget('ns.foo', {

  _create: function () {
    this.element.append( '_create\n' );
  },

  _init: function () {
    this.element.append( '_init\n' );
  },

  noop: function () {
    this.element.append( 'noop\n' );
  }

});

var el = $('#foo');

// _create and _init
el.foo();

// only _init 
el.foo();

// neither
el.foo( 'noop' );
