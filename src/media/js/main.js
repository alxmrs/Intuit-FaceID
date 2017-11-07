
var VideoStream = require('./VideoStream.js').VideoStream;

//// Setup Section
var output = document.getElementById('test'),
  imgOutput = document.getElementById('imgOutput'),
  cameraOutput = document.getElementById('camera');


var ws,
  vs = new VideoStream(),
  bbs = [];




//// Video Stream Rendering Section

cameraOutput.appendChild(vs.canvas);
// cameraOutput.appendChild(vs.video);

/**
 * Capture an image at a time from the VideoStream object, draw bounding box, send to server.
 */
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


/**
 * Draws bounding box onto a canvas, given a canvas context.
 * @param context Canvas context to draw bounding box on.
 */
function drawBoundingBox(context)
{
  var dims = bbs.pop();
  if(dims)
  {
    context.rect(dims.left, dims.top, dims.width, dims.height);
    context.stroke();
  }
}


function trainCustomer(cust_id){
  var payload = {
    'type': 'start_train',
    'customer_id': cust_id
  };

  ws.send(JSON.stringify(payload));

  setTimeout(function(){
    ws.send(JSON.stringify({'type': 'stop_train'}));
  }, 3000);
}


setInterval(sendPicture, 100);

//// WebSocket Handler Section

var host = window.location.host;
console.log(host);

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



