jQuery's Secret Weapon: .widget.
================================

A talk given by Ryan Florence at the 2011 jQuery Boston Conference.

The jQuery.widget factory is a great way to compartmentalize, reuse, extend
and test your DOM-centric code.

## Licence

This repository is released under the [Creative Commons - Attribution-NonCommercial-ShareAlike license](http://creativecommons.org/licenses/by-nc-sa/3.0/).

## Ex1 - Using existing widgets from http://jqueryui.com/

```javascript
$('#dialog').dialog({
  width: 300
});
```

## Ex2 - Creating your own widgets

Creating your own widgets is easy.  Using the jQuery.widget method, you
simply give your widget a name and a definition, and the widget factory does
a bunch of work behind the scenes, like adding your widget to the jQuery
prototype and caching your element at `this.element`.

```javascript
jQuery.widget('ns.hello', {

  echo: function (words){
    var text = 'You said: ' + words;
    this.element.html(text);
    return text;
  }

});

var $hello = $('#hello');

// create an instance of "hello"
$hello.hello();

// call the echo method
$hello.hello('echo', 'Hello world!');
```

## Ex3 - Namespaces

Every widget has to belong to a namespace--I use `rf`.  You'll get an error
if you don't provide one:

```javascript
// BAD CODE!
jQuery.widget('borked', {
  _create: function () {
    this.element.html('it worked!');
  }
});

// doesn't complain until you try to use it:
$('#borked').borked(); // ERROR!

// Good Code
jQuery.widget('rf.notBorked', {
  _create: function () {
    this.element.html('it worked!');
  }
});

$('#notBorked').notBorked();
```

## Ex4 - Extending existing widgets

If you find yourself passing the same options to a jQuery UI widget every
time you use it, or find yourself hacking the source, or otherwise doing
weird things to get a UI widget to do what you want, you should extend the
widget instead.

Here we override the default options on all dialogs, and ensure that only
one dialog is open at a time by overriding the `open` method.

The first argument is our widget name, second is the widget to inherit from,
and third the widget's prototype definition.

```javascript
jQuery.widget('rf.dialog', jQuery.ui.dialog, {

  options: {
    width: 600
  },

  open: (function () {
    var lastDialog;

    return function () {
      if (lastDialog && lastDialog !== this) lastDialog.close();
      lastDialog = this;
      // Call super by accessing the widget prototype.
      return jQuery.ui.dialog.prototype.open.apply(this, arguments);
    };

  }())

});
```

jQuery.fn.dialog gets overridden by the last defined widget, so you can do
this without worrying about updating the rest of your app to use your new
"subclass" of dialog.

```javascript
// Open up d1
var d1 = $('#dialog1').dialog();

// When d2 is opened, d1 is closed automatically
var d2 = $('#dialog2').dialog({ position: {my: 'top', at: 'top'}});

// And when d1 is opened again, d1 is closed
d1.dialog('open');
```

## Ex5 - Initialization methods

When you create a new instance of a widget, it'll automatically call a couple
initialization methods: `_create` and `_init`.

`_create` gets called the very first time, while `_init` will be called the
first time and every time you initialize it (call the widget method without a 
string as the first argument, because that calls a method.)

```javascript
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
```

## Ex6 Options

When you call the widget method with an object literal, the options are set
for you behind the scenes.  Any subsequent calls will set the options again.

```javascript
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
```

You can use the options in any of your widget prototype methods.

```javascript
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
```

You can also set the options inside of one of your methods (not usually
necessary, but I've had to do this on occasion):

```javascript
jQuery.widget( 'ns.setOptionsDemo', {

  someMethodThatSetsOptions: function(foo) {
    this._setOptions({
      foo: 'foo'
    });
  }

});
```

## Ex7 - Events

Your widget can fire custom element events, you should do it whenever
interesting things happen.

```javascript
jQuery.widget( 'np.☃', {

  _create: function () {
    this.element.html('<div class=frosty>☃</div>');
    this.melted = false;
    // Note that `this.widgetName` should be used when adding events to the
    // element, they'll automatically be removed when `destroy` is called
    // on a widget, or when `remove` is called on the element.
    this.element.bind('click.' + this.widgetName, jQuery.proxy(this, 'toggle'));
  },

  melt: function (event) {
    this.element.addClass('melt');
    this.melted = true;
    this._trigger('melt', event, {more: 'data'});
  },

  build: function (event) {
    this.element.removeClass('melt');
    this.melted = false;
    this._trigger('build', event);
  },

  toggle: function(event){
    this[this.melted ? 'build' : 'melt'](event);
  }

});

var body = $('body');
```

You can plug into them like any other element event.

```javascript
$('#snowman')['☃']().bind({
  '☃melt': function (event) {
    body.addClass('melt');
  },
  '☃build': function (event) {
    body.removeClass('melt');
  }  
});
```

## Megaman cycleClass example

```javascript
jQuery.widget( 'rf.cycleClass' , {

  options: {
    className: 'frame',
    frames: 10,
    duration: 1000,
    now: true
  },

  _init: function(){
    if (!this._timer) this._lastClass = '';
    this._speed = this.options.duration / this.options.frames;
    if (this.options.now) this.start();
  },

  start: function(){
    this.reset().resume();
    return this;
  },

  reset: function(){
    this.pause();
    this.currentFrame = 0;
    this.element.removeClass( this._lastClass );
    return this;
  },

  resume: function(){
    this._step();
    return this;
  },

  pause: function(){
    clearTimeout(this._timer);
    return this;
  },

  _step: function(){
    this.currentFrame = (this.currentFrame === this.options.frames) ? 1 : this.currentFrame + 1;
    this.element.removeClass( this._lastClass );
    this._lastClass = this.options.className + this.currentFrame;
    this.element.addClass( this._lastClass );
    this._timer = setTimeout( jQuery.proxy( this, '_step' ), this._speed );
  }

});
```

## jQuery Slideshow

* [Github](https://rpflorence/jquery-rf-slideshow)
* [Website](http://ryanflorence.com/jquery-slideshow)

