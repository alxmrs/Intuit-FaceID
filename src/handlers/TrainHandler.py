
import tornado.web

from src.utils.paths import STATIC_DIR

class TrainHandler(tornado.web.RequestHandler):
    def get(self, customer_id):
        self.render('{0}/train.html'.format(STATIC_DIR), customer_id=customer_id)