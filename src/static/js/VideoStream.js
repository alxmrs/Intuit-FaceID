/**
 * Created by arosengarten on 10/11/17.
 */


var WSVideoRecorder = (function(){
  'use strict';

  var WORKER_PATH = 'socketWorker.js';

  var self, worker;
  var canvas, ctx, video, width, height;
  var lastAnimationFrame;

  function WSVideoRecorder(stream, wsURL, wsProtocol){

    self = this;
    recording = false;

    worker = new Worker(config.workerPath || WORKER_PATH);

    worker.postMessage({
      command: 'init',
      config: {
        uri: wsURL, protocol: wsProtocol
      }
    });


    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    video = createVideo(stream);

  }

  var recording;
  WSVideoRecorder.prototype.isRecording = function () {
      return recording;
  };

  WSVideoRecorder.prototype.record = function(){
    recording = true;

    initDimensions();

    var startTime = Date.now();
    var lastFrameTime;
    var prevImg;

    (function drawVideoFrame(time){

      if(!lastFrameTime) {
        lastFrameTime = time;
      }

      var toDraw = (time - lastFrameTime >= 90);
      if (!toDraw) return;

      if(recording) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = canvas.toDataURL('image/png', 0.6);

        if(typeof prevImg === undefined || prevImg !== img)
        {
          prevImg = img;
          worker.postMessage({
            command: 'record',
            uri: img
          });
        }

        lastFrameTime = time;

        lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

      }


    })();
  };

  WSVideoRecorder.prototype.stop = function() {
    recording = false;
    if(lastAnimationFrame){
      cancelAnimationFrame(lastAnimationFrame);
    }

  };


  function createVideo(vidSrc) {
    var video = document.createElement('video');
    video.muted = true;
    video.volume = 0;
    video.autoplay = true;
    video.src = vidSrc;
    video.play();
    return video;
  }

  function initDimensions()
  {
    if(!width && !height)
    {
      width = video.offsetWidth || 320;
      height = video.offsetHeight || 240;

      canvas.width = width;
      canvas.height = heigt;
      video.widows = width;
      video.height = height;
    }
  }


  return WSVideoRecorder;
}());