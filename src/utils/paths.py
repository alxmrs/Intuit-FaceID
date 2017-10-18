import os
from pathlib import Path

_file_dir = os.path.dirname(os.path.realpath(__file__))

SRC_DIR = Path(_file_dir).parent
ROOT_DIR = SRC_DIR.parent
LOG_DIR = SRC_DIR / 'Log'
UTILS_DIR = SRC_DIR / 'utils'
STATIC_DIR = SRC_DIR / 'static'
OF_DIR = ROOT_DIR / 'openface'
MODELS_DIR = ROOT_DIR / 'models'
DLIB_MODELS_DIR = MODELS_DIR / 'dlib'




if __name__ == '__main__':
    print(_file_dir)
    print(SRC_DIR, SRC_DIR.is_dir())
    print(LOG_DIR, LOG_DIR.is_dir())
    print(STATIC_DIR, STATIC_DIR.is_dir())
    print(OF_DIR, OF_DIR.is_dir())