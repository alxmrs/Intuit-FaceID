
var VideoStream = require('./VideoStream.js').VideoStream;

var output = document.getElementById('test'),
  imgOutput = document.getElementById('imgOutput'),
  cameraOutput = document.getElementById('camera');

var bbs = [];

var ws;

var vs = new VideoStream();

cameraOutput.appendChild(vs.canvas);
cameraOutput.appendChild(vs.video);


function sendPicture() {

  if(vs.render()){
     var data = vs.canvas.toDataURL('image/png', 0.6);

     drawBoundingBox(vs.ctx);

      var payload = {
      'type': 'image',
      'content': data
    };

    console.log('sending data');
    ws.send(JSON.stringify(payload));
  }
}


function drawBoundingBox(context)
{
  var dims = bbs.pop();
  if(dims)
  {
    context.rect(dims.left, dims.top, dims.width, dims.height);
    context.stroke();
  }
}

var host = window.location.host;
console.log(host);
//createSocket("ws://" + host +  "/ws", "Local");

ws = new WebSocket('ws://' + host + '/ws');

ws.onopen = function() {
  output.innerHTML = 'Connection open';
};

ws.onmessage = function(ev) {
  var data = JSON.parse(ev.data);
  output.innerHTML = 'received message';
  console.log(data);

  var type = data.type;

  switch(type)
  {
    case 'bounding_box':
      bbs.push(data.dims);
      break;

    default:
      break;
  }

};

ws.onclose = function(ev) {
  output.innerHTML = 'connection closed';
};

ws.onerror = function(ev) {
  output.innerHTML = 'error occurred';
  console.error(ev);
};


setInterval(sendPicture, 100);
