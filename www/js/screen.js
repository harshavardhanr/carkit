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
   width:  443,
    height: 230,
    top:    -24,
    left:   580,
    src:    'videos/1Scene.mp4'
  });

    var mainBoardsecondVideo = new VideoView({
    width:  443,
    height: 230,
    top:    -24,
    left:   580,
    src:    'videos/2aScene.mp4'
  });


  var mainBoardImage = new ImageView({
    width:  430,
    height: 200,
    top:    22,
    left:   635,        
    src:    'images/intro.svg'
  });

  var gbIndicatorVideo = new VideoView({
    width:  428,
    height: 300,
    top: 280,
    left: -42,
    src:    'videos/rotcircle.mp4'
  });

  var gbTextVideo = new VideoView({
    width:  508,
    height: 300,
    top: 25,
    left: -106,
    src:    'videos/2bScene.mp4'
  });

  var gbTextsecondVideo = new VideoView({
    width:  508,
    height: 300,
    top: 25,
    left: -106,
    src:    'videos/2cScene.mp4'
  });

  var gbDamagesVideo = new VideoView({
    width:  508,
    height: 300,
    top: 25,
    left: -106,
    src:    'videos/3aScene.mp4'
  });

  var gbDamagessecondVideo = new VideoView({
    width:  508,
    height: 300,
    top: 25,
    left: -106,
    src:    'videos/3bScene.mp4'
  });

  var gbDamagesthirdVideo = new VideoView({
    width:  508,
    height: 300,
    top: 25,
    left: -106,
    src:    'videos/3cScene.mp4'
  });

   var mainBoardPDVideo = new VideoView({
    width:  443,
    height: 230,
    top:    -24,
    left:   580,
    src:    'videos/6Scene.mp4'
  });


  var gbIndicatorImage = new ImageView({
    width:  300,
    height: 300,
    top: 337,
    left: 35,
    src:    'images/gi-key.svg'
  });

  canvas.addChild(mainBoardImage);
  canvas.addChild(mainBoardVideo);
  canvas.addChild(mainBoardsecondVideo);
  canvas.addChild(gbIndicatorVideo);
  canvas.addChild(gbIndicatorImage);
  canvas.addChild(gbTextVideo);
  canvas.addChild(gbTextsecondVideo);
  canvas.addChild(gbDamagesVideo);
  canvas.addChild(gbDamagessecondVideo);
  canvas.addChild(gbDamagesthirdVideo);
  canvas.addChild(mainBoardPDVideo);

  gbIndicatorVideo.setLoop(true);
  mainBoardVideo.setLoop(true);
  gbTextsecondVideo.setLoop(true);
  gbDamagessecondVideo.setLoop(true);

   

  var socket = io.connect('http://localhost:8080');

  function setState(state){

    switch (state){
      case 1:
        console.log('case 1');
        mainBoardVideo.show();
        mainBoardVideo.play(); 
        //Hide everything else
        gbTextVideo.hide();
        gbTextsecondVideo.hide();
        mainBoardsecondVideo.hide(); 
        gbIndicatorImage.hide();
        gbIndicatorVideo.hide();
        mainBoardImage.hide(); 
        mainBoardsecondVideo.hide();
        gbDamagesVideo.hide();
        gbDamagessecondVideo.hide();
        gbDamagesthirdVideo.hide();
        mainBoardPDVideo.hide();

        break;

      case 2:

        //Pause this video
        mainBoardVideo.pause(); 
        mainBoardVideo.hide();

        //Play this guy
        mainBoardsecondVideo.show();
        mainBoardsecondVideo.play();

        //Hide everything else
        gbIndicatorVideo.hide();
        gbIndicatorImage.hide();
        mainBoardImage.hide();
        gbTextsecondVideo.hide();
        gbTextVideo.hide();
        gbDamagesVideo.hide();
        gbDamagessecondVideo.hide();
        gbDamagesthirdVideo.hide();
        mainBoardPDVideo.hide();

        //Delays for the GB video1
        var delay=2000; //2 seconds
        setTimeout(function(){
          gbTextVideo.show();
          gbTextVideo.play();

        //Indented Delays for the GB video2
        var delay=2400; //2.4 seconds
        setTimeout(function(){
            gbTextsecondVideo.show();
            gbTextsecondVideo.play();
          },delay); 
        },delay); 

        //Delay for the GB Indicator video
        var delay=4000; //4 seconds
        setTimeout(function(){
          gbIndicatorVideo.show();
          gbIndicatorVideo.play();
        },delay); 

        break;

      case 3: 
        //purely for damages
        

        //Hide shit
        gbIndicatorVideo.hide();
        gbIndicatorImage.hide();
        //mainBoardVideo.hide(); 
        gbTextsecondVideo.hide();
        gbTextVideo.hide();
        gbDamagesthirdVideo.hide();
        mainBoardPDVideo.hide();

        //play shit 
        gbDamagesVideo.show();
        gbDamagesVideo.play();

//Delay for the GB Damages video
        var delay=1000; //4 seconds
        setTimeout(function(){
          gbDamagessecondVideo.show();
        gbDamagessecondVideo.play();
        },delay); 
      
        break;

      case 4:
     
       //purely for damages - getting out into the world of you
        
        //hideshit
        gbIndicatorVideo.hide();
        gbIndicatorImage.hide();
        //mainBoardVideo.hide(); 
        gbTextsecondVideo.hide();
        gbTextVideo.hide();
        mainBoardPDVideo.hide();
        gbDamagessecondVideo.hide();
        gbDamagesVideo.hide();

        //playshit
        gbDamagesthirdVideo.show();
        gbDamagesthirdVideo.play();

        break;

      case 5:
       //post app procedure
        //hideshit
        gbIndicatorVideo.hide();
        gbIndicatorImage.hide();
        mainBoardVideo.hide(); 
        gbTextsecondVideo.hide();
        gbTextVideo.hide();
        gbDamagesthirdVideo.hide();
        gbDamagessecondVideo.hide();
        gbDamagesVideo.hide();

        //playshit
        mainBoardPDVideo.show();
        mainBoardPDVideo.play();

        break;



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