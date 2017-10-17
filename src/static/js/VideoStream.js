(function(){

  var self;
  var isStreaming = false;
  var video, canvas, ctx, width, height;


  function VideoStream(_width, _height){

    self = this;

    video = document.createElement('video');
    canvas = document.createElement('canvas');

    width = _width || 320;
    height = _height || 0;

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.error('An error occurred: ' + err);
    });

    video.addEventListener('canplay', function(ev){
      if(!isStreaming) {
        height = video.videoHeight / (video.videoWidth/width);

        video.setAttribute('width', width);
        video.setAttribute('height', height);

        canvas.setAttribute('width', width);z =
        canvas.setAttribute('height', height);

        isStreaming = true;
      }
    }, false);
  }

  VideoStream.prototype.video = video;

  VideoStream.prototype.canvas = canvas;

  VideoStream.prototype.ctx = ctx || (ctx = canvas.getContext('2d'));

  VideoStream.prototype.isStreaming = function()
  {
    return isStreaming;
  };

  VideoStream.prototype.stopStreaming = function () {
    if(isStreaming)
    {
      isStreaming = false;
      video.pause();
    }
  };

  VideoStream.prototype.startStreaming = function() {
    if(!isStreaming)
    {
      isStreaming = true;
      video.play();
    }
  };


}());