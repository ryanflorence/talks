// ## Ex7 - Events
//
// Your widget can fire custom element events, you should do it whenever
// interesting things happen.

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

// You can plug into them like any other element event.
$('#snowman')['☃']().bind({
  '☃melt': function (event) {
    body.addClass('melt');
  },
  '☃build': function (event) {
    body.removeClass('melt');
  }  
});


// I'm not in love with the name of the event, there's a good chance in a future
// version it'll be 'myWidget:event' with a colon between.
