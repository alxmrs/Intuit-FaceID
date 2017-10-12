(function(){
  var ws;

  function init(config) {
    ws = new WebSocket(config.uri, config.protocol);
  }

  this.onmessage = function(ev) {
    switch(ev.data.command)
    {
      case 'init':
        init(ev.data.config);
        break;
      case 'record':
        ws.send(ev.data.uri);
        break;
    }
  };
}());