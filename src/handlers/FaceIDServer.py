import base64
import io
import json
from typing import Optional

import dlib
import numpy as np
import tornado.websocket
from PIL import Image

import openface
from src.Utils import create_logger, DLIB_MODELS_DIR
from src.handlers.EchoApi import cl

align = openface.AlignDlib(str(DLIB_MODELS_DIR / 'shape_predictor_68_face_landmarks.dat'))

class FaceIDServer(tornado.websocket.WebSocketHandler):

    def __init__(self, *args, **kwargs) -> None:

        super().__init__(*args, **kwargs)

        self.detector = dlib.get_frontal_face_detector()

        self.logger = create_logger('face_server')
        self.logger.info('Face ID Server created')

    def check_origin(self, origin):
        return True

    def open(self):
        self.logger.info('WebSocket opened')
        if self not in cl:
            cl.append(self)

    def on_message(self, message):
        self.logger.debug('received message {0}', message)


        msg = json.loads(message)
        type = msg.get('type', 'Unknown')

        output = {
            'type': 'NULL',
            'content': 'Received message of type {0}'.format(type)
        }

        if type == 'image':
            bb = self.bound_face(msg['content'])

            if bb is not None:
                self.logger.info('Bounding box found: {0}', bb)

                payload = {
                    'type': 'bounding_box',
                    'dims': {
                        'left': bb.left(),
                        'top': bb.top(),
                        'width': bb.width(),
                        'height': bb.height()
                    }
                }

                self.write_message(json.dumps(payload))
        else:
            self.write_message(json.dumps(output))


    def on_close(self):
        self.logger.info('WebSocket closed')

        if self in cl:
            cl.remove(self)

    def load_state(self):
        pass

    def bound_face(self, str64: str) -> Optional[dlib.rectangle]:
        mx = base64_to_mx(str64)
        faces = self.detector(mx, 1)

        if len(faces) > 0:
            return max(faces, key=lambda rect: rect.width() * rect.height())
        else:
            return None

    def get_data(self):
        pass

    def train_svm(self):
        pass

    def process_frame(self):
        pass

def base64_to_mx(str64: str) -> np.ndarray:
    head, *img_str =  str64.split(',')
    bytes_img = base64.b64decode(img_str[0])

    buf = io.BytesIO()
    buf.write(bytes_img)
    buf.seek(0)

    img = np.asarray(Image.open(buf))

    w, h, *_ = img.shape

    rgb_frame = np.zeros((w, h, 3), dtype=np.uint8)
    rgb_frame[:, :, :] = img[:, :, :-1]

    return rgb_frame


def train_identity():
    pass


def process_frame():
    pass


def test_identity():
    pass