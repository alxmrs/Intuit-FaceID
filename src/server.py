import tornado.ioloop
import tornado.template
import tornado.web
import tornado.websocket

from src.Utils import STATIC_DIR
from src.handlers.EchoApi import ApiHandler
from src.handlers.FaceIDServer import FaceIDServer
from src.settings import settings


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('{0}/index.html'.format(STATIC_DIR))

def make_app():
    return tornado.web.Application([
        (r'/', MainHandler),
        (r'/ws', FaceIDServer),
        (r'/api', ApiHandler),
    ], **settings)

if __name__ == '__main__':
    app = make_app()
    app.listen(8887)
    tornado.ioloop.IOLoop.current().start()