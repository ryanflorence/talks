// ## Ex4 - Extending existing widgets
//
// If you find yourself passing the same options to a jQuery UI widget every
// time you use it, or find yourself hacking the source, or otherwise doing
// weird things to get a UI widget to do what you want, you should extend the
// widget instead.

// Here we override the default options on all dialogs, and ensure that only
// one dialog is open at a time by overriding the `open` method.
//
// The first argument is our widget name, second is the widget to inherit from,
// and third the widget's prototype definition.

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

// jQuery.fn.dialog gets overridden by the last defined widget, so you can do
// this without worrying about updating the rest of your app to use your new
// "subclass" of dialog.

// Open up d1
var d1 = $('#dialog1').dialog();

// When d2 is opened, d1 is closed automatically
var d2 = $('#dialog2').dialog({ position: {my: 'top', at: 'top'}});

// And when d1 is opened again, d1 is closed
d1.dialog('open');
