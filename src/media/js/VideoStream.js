
var isStreaming = false;
var ctx, width, height;
var video = document.createElement('video'),
  canvas = document.createElement('canvas');

function VideoStream(_width, _height){

  self = this;



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
    this.video.pause();
  }
};

VideoStream.prototype.startStreaming = function() {
  if(!isStreaming)
  {
    isStreaming = true;
    this.video.play();
  }
};

VideoStream.prototype.render = function() {
  if(width && height && isStreaming) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(video, 0, 0, width, height);

    return true;
  }

  return false;
};

exports.VideoStream = VideoStream;
