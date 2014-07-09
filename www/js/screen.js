var Canvas = Backbone.View.extend({
  render: function() {
    return this;
  },

  addChild: function(childView){
    this.$el.append(childView.render().el);
  }
});

var VideoView = Backbone.View.extend({
  className: 'video-view',

  initialize: function(options) {
    this.width  = options.width;
    this.height = options.height;
    this.src    = options.src;
  },


  play: function(){
    this.video.play();
  },

  pause: function(){
    this.video.pause();
  },

  render: function() {
    this.$el.css({
      width:  this.width,
      height: this.height
    }).draggable()
      .resizable();

    var self    = this;
    var videoEl = $('<video>').attr({
      width:  '100%',
      height: '100%'
    });

    videoEl.append($('<source>').attr({
      src:  this.src, 
      type: 'video/mp4'
    }));

    this.$el.append(videoEl);
    this.video = videoEl.get(0);

    this.video.addEventListener('ended', function(){
      self.trigger('ended');
    });

    this.video.addEventListener('timeupdate', function(){
      self.trigger('timeupdate', self.video.currentTime);
    });

    return this;
  }
});

var ImageView = Backbone.View.extend({
  className: 'image-view',

  initialize: function(options) {
    this.width  = options.width;
    this.height = options.height;
    this.src    = options.src;
  },

  render: function() {
    this.$el.css({
      width:  this.width,
      height: this.height
    });

    this.$el.html($('<img>').attr('src', this.src));

    this.$el.draggable()
            .resizable();

    return this;
  },

  setSrc: function(src) {
    this.src = src;
    this.$el.find('img').attr('src', this.src);
  } 
});


$(function(){
  console.log('Initializing...');

  var canvas = new Canvas({
    el: $('body')
  }).render();

  var images = [
    'images/image1.svg',
    'images/image2.svg'
  ];

  var currentImage = 0;

  var imageView = new ImageView({
    width:  200,
    height: 200,
    src:    images[0]
  });

  var videoView = new VideoView({
    width:  300,
    height: 300,
    src:    'videos/small.mp4'
  });

  canvas.addChild(imageView);
  canvas.addChild(videoView);

  var socket = io.connect('http://localhost:8080');

  socket.on('video:play', function (data) {
    videoView.play();
  });



  socket.on('image:switch', function (data) {
    currentImage = (currentImage + 1) % images.length;
    imageView.setSrc(images[currentImage]);
  });


});