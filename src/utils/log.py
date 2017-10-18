import logging
from . import LOG_DIR
import inspect

def create_logger(name: str = 'default', file_level: int = logging.DEBUG, console_level: int = logging.ERROR) -> logging.Logger:
    # Get specific logger
    log = logging.getLogger(name)

    # Create output file for logger with desired level
    fh = logging.FileHandler('{0}/{1}.log'.format(LOG_DIR, name))
    fh.setLevel(file_level)

    # Write errors to console
    ch = logging.StreamHandler()
    ch.setLevel(console_level)

    # format log messages
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)

    log.addHandler(fh)
    log.addHandler(ch)

    return log