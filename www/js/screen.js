//
// Helper functions
//
function logFrame(el){
  console.log('w:', el.css('width'), 'h:', el.css('height'), 't:', el.css('top'), 'l:', el.css('left'));
}

window.toggleEditMode = function (){
  $('body').toggleClass('edit-mode');
}

//
// Canvas is the main view container 
//
var Canvas = Backbone.View.extend({
  render: function() {
    return this;
  },

  addChild: function(childView){
    this.$el.append(childView.render().el);
  }
});

//
// VideoView plays a video
//
var VideoView = Backbone.View.extend({
  className: 'video-view',

  initialize: function(options) {
    this.width  = options.width;
    this.height = options.height;
    this.left   = options.left;
    this.top    = options.top;    
    this.src    = options.src;
  },

  hide: function(){
    this.$el.hide();
  },

  show: function(){
    this.$el.show();
  },

  play: function(){
    this.video.play();
  },

  pause: function(){
    this.video.pause();
  },

  setLoop: function(shouldLoop) {
    if (shouldLoop){
      this.videoEl.attr({loop: 'true'});  
    }
    else {
      this.videoEl.removeAttr('loop');
    }
  },

  render: function() {
    this.$el.css({
      width:  this.width,
      height: this.height,
      top:    this.top,
      left:   this.left
    });

    this.$el.draggable({
          stop: function() { logFrame($(this)); } 
        })
        .resizable({
          stop: function() { logFrame($(this)); } 
        });

    var self    = this;
    this.videoEl = $('<video>').attr({
      width:    '100%',
      height:   '100%'
    });

    this.videoEl.append($('<source>').attr({
      src:  this.src, 
      type: 'video/mp4'
    }));

    this.$el.append(this.videoEl);
    this.video = this.videoEl.get(0);

    this.video.addEventListener('ended', function(){
      self.trigger('ended');
    });

    this.video.addEventListener('timeupdate', function(){
      self.trigger('timeupdate', self.video.currentTime);
    });

    return this;
  }
});



//
// ImageView displays an image
//
var ImageView = Backbone.View.extend({
  className: 'image-view',

  initialize: function(options) {
    this.width  = options.width;
    this.height = options.height;
    this.left   = options.left;
    this.top    = options.top;     
    this.src    = options.src;
  },

  hide: function(){
    this.$el.hide();
  },

  show: function(){
    this.$el.show();
  },


  render: function() {
    this.$el.css({
      width:  this.width,
      height: this.height,
      top:    this.top,
      left:   this.left
    });

    this.$el.html($('<img>').attr('src', this.src));

    this.$el.draggable({
              stop: function() { logFrame($(this)); } 
            })
            .resizable({
              stop: function() { logFrame($(this)); } 
            });

    return this;
  },

  setSrc: function(src) {
    this.src = src;
    this.$el.find('img').attr('src', this.src);
  } 
});

//
// Bootstrap code
//
$(function(){
  console.log('Initializing...');

  var canvas = new Canvas({
    el: $('body')
  }).render();

  // ------------------------------------
  // Describe Behaviour here
  // ------------------------------------

  var mainBoardVideo = new VideoView({
    width:  200,
    height: 200,
    top:    300,
    left:   300,
    src:    'videos/artboard5.mp4'
  });

  var mainBoardImage = new ImageView({
    width:  200,
    height: 200,
    top:    600,
    left:   600,    
    src:    'images/intro.svg'
  });

  var gbIndicatorVideo = new VideoView({
    width:  300,
    height: 300,
    src:    'videos/rotcircle.mp4'
  });

  var gbIndicatorImage = new ImageView({
    width:  300,
    height: 300,
    src:    'images/gi-key.svg'
  });

  canvas.addChild(mainBoardImage);
  canvas.addChild(mainBoardVideo);
  canvas.addChild(gbIndicatorVideo);
  canvas.addChild(gbIndicatorImage);

  gbIndicatorVideo.setLoop(true);

  var socket = io.connect('http://localhost:8080');

  function setState(state){

    switch (state){
      case 1:
        gbIndicatorVideo.show();
        gbIndicatorVideo.play();
        gbIndicatorImage.show();
        mainBoardImage.show();
        mainBoardVideo.hide();
        mainBoardImage.setSrc('images/intro.svg');
        gbIndicatorImage.setSrc('images/gi-key.svg');      
        break;

      case 2:
        gbIndicatorVideo.hide();
        gbIndicatorImage.show();
        mainBoardImage.show();
        mainBoardImage.setSrc('images/intro.svg');
        gbIndicatorImage.setSrc('images/gi-damages.svg');      
        break;
      case 3:

        mainBoardImage.setSrc('images/drive-ready.svg');
        gbIndicatorImage.hide();      
        break;

      case 4:
        gbIndicatorVideo.hide();
        gbIndicatorImage.hide();
        mainBoardImage.hide();
        mainBoardVideo.show();
        mainBoardVideo.play();
        break;

      case 5:
        break;
      case 6:
        break;
    }

  }

  // setState(1);

  for (var i = 1; i <= 11; i++){
    (function (state) {
      socket.on('state:change:' + state, function (){ 
        console.log('Changing state to', state);
        setState(state); 
      });  
    })(i)
  }

  






});