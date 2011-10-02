// ## Ex2 - Creating your own widgets
//
// Creating your own widgets is easy.  Using the jQuery.widget method, you
// simply give your widget a name and a definition, and the widget factory does
// a bunch of work behind the scenes, like adding your widget to the jQuery
// prototype and caching your element at `this.element`.

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
