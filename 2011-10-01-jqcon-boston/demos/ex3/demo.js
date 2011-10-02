// ## Ex3 - Namespaces
//
// Every widget has to belong to a namespace--I use `rf`.  You'll get an error
// if you don't provide one:

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
