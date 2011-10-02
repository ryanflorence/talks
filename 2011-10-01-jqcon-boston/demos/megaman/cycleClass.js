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
