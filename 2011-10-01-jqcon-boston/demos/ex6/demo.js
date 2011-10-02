// ## Ex6 Options
//
// When you call the widget method with an object literal, the options are set
// for you behind the scenes.  Any subsequent calls will set the options again.

jQuery.widget('ns.opts', {

  options: {
    foo: 'bar'
  },

  _init: function(){
    this.element.html( 'foo is: ' + this.options.foo );
  }

});

var optsEl = $('#opts');
// logs 'bar' the default value
optsEl.opts();
// logs 'baz'
optsEl.opts({foo: 'baz'});
// or set one individually
optsEl.opts('option', 'foo', 'quux');
// call opts again to get _init to run
optsEl.opts();


// You can use the options in any of your widget prototype methods.
jQuery.widget('ns.math', {

  options: { x: 0, y: 0 },

  sum: function(){
    var sum = this.options.x + this.options.y;
    this.element.html(sum);
    return sum;
  }

});

var mathEl = $('#math');
// create it
mathEl.math({ x: 1, y: 2 });
// the method 'sum' is run, returns 3, and element html is updated
mathEl.math( 'sum' );

// You can also set the options inside of one of your methods (not usually
// necessary, but I've had to do this on occasion):

jQuery.widget( 'ns.setOptionsDemo', {

  someMethodThatSetsOptions: function(foo) {
    this._setOptions({
      foo: 'foo'
    });
  }

});

