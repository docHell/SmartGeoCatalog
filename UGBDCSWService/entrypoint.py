#!/usr/bin/env python3
# =================================================================
#
# Authors: Ricardo Garcia Silva <ricardo.garcia.silva@gmail.com>
#
# Copyright (c) 2017 Ricardo Garcia Silva
#
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation
# files (the "Software"), to deal in the Software without
# restriction, including without limitation the rights to use,
# copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following
# conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
# OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
# OTHER DEALINGS IN THE SOFTWARE.
#
# =================================================================

"""Entrypoint script for docker containers.

This module serves as the entrypoint for docker containers. Its main
purpose is to set up the pycsw database so that newly generated
containers may be useful soon after being launched, without requiring
additional input.

"""


import argparse
import logging
import os
from six.moves.configparser import SafeConfigParser
from six.moves.configparser import NoOptionError
import sys
from time import sleep

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.exc import ProgrammingError

from pycsw.core import admin

from paho.mqtt.client import Client
from executor import execute
from multiprocessing import Process

import os
import random
import json

logger = logging.getLogger(__name__)


def launch_pycsw(pycsw_config, workers=2, reload=False):
    """Launch pycsw.

    Main function of this entrypoint script. It will read pycsw's config file
    and handle the specified repository backend, after which it will yield
    control to the gunicorn wsgi server.

    The ``os.execlp`` function is used to launch gunicorn. This causes it to
    replace the current process - something analogous to bash's `exec`
    command, which seems to be a common techinque when writing docker
    entrypoint scripts. This means gunicorn will become PID 1 inside the
    container and it somehow simplifies the process of interacting with it
    (e.g. if the need arises to restart the worker processes). It also allows
    for a clean exit. See

    http://docs.gunicorn.org/en/latest/signals.html

    for more information on how to control gunicorn by sending UNIX signals.
    """

    db_url = pycsw_config.get("repository", "database")
    db = db_url.partition(":")[0].partition("+")[0]
    db_handler = {
        "sqlite": handle_sqlite_db,
        "postgresql": handle_postgresql_db,
    }.get(db)
    logger.debug("Setting up pycsw's data repository...")
    logger.debug("Repository URL: {}".format(db_url))
    db_handler(
        db_url,
        pycsw_config.get("repository", "table"),
        pycsw_config.get("server", "home")
    )
    sys.stdout.flush()
    # we're using --reload-engine=poll because there is a bug with gunicorn
    # that prevents using inotify together with python3. For more info:
    #
    # https://github.com/benoitc/gunicorn/issues/1477
    #

    args = ["--reload", "--reload-engine=poll"] if reload else []
    execution_args = ["gunicorn"] + args + [
        "--bind=0.0.0.0:8000",
        "--access-logfile=-",
        "--error-logfile=-",
        "--workers={}".format(workers),
        "pycsw.wsgi",

    ]
    logger.debug("Launching pycsw with {} ...".format(" ".join(execution_args)))
    os.execlp(
        "gunicorn",
        *execution_args
    )

def run_mqtt_listener():
    mqtt_broker_url = '167.86.108.163'
    MQTT_HOST = os.getenv('MQTT_HOST', mqtt_broker_url)
    client_name = 'mqtt-csw-importer'
    topic = 'update_csw'

    
    print("Sono partito")
    print("->167.86.108.163")
    print("->mqtt-csw-importer")

    def _on_connect(client, userdata, flags, rc):
        print("Connesso con successo al topic", topic)

    def _on_log(client, userdata, level, buf):
        # print("log", level, buf)
        pass

    def _on_message(client, userdata, message):
        message = str(message.payload.decode("utf-8"))
        payload = json.loads(message)['rndt_xml']
        print('received event', payload)
        print('----ENDED------------------------------------------------------')
        cmd = 'pycsw-admin.py -c load_records -f /etc/pycsw/pycsw.cfg  -p /home/pycsw/datatemp'
        filename = "/home/pycsw/datatemp/temp1.xml"
        try:
            with open(filename, 'w') as file:
                file.write(payload)
            execute(cmd)
            # execute('rm -f ' + filename)
        except Exception as e:
            print('Exception', e)
    try:
        client = Client(client_id='{}_{}'.format(client_name, random.randint(1, 10000)), clean_session=True)
    
        print('Connecting to MQTT broker at ')
        client.connect(MQTT_HOST)
    except ConnectionRefusedError as e:
        print('Connection refused by MQTT broker at ')
        raise ConnectionRefusedError
    client.on_connect = _on_connect
    client.on_message = _on_message
    client.on_log = _on_log

    client.subscribe(topic)

    client.loop_forever()
    # client.loop_start()
    print('loop started')

def handle_sqlite_db(database_url, table_name, pycsw_home):
    db_path = database_url.rpartition(":///")[-1]
    if not os.path.isfile(db_path):
        try:
            os.makedirs(os.path.dirname(db_path))
        except OSError as exc:
            if exc.args[0] == 17:  # directory already exists
                pass
        admin.setup_db(database=database_url, table=table_name,
                       home=pycsw_home)


def handle_postgresql_db(database_url, table_name, pycsw_home):
    _wait_for_postgresql_db(database_url)
    try:
        admin.setup_db(database=database_url, table=table_name,
                       home=pycsw_home)
    except ProgrammingError:
        pass  # database tables are already created


def _wait_for_postgresql_db(database_url, max_tries=10, wait_seconds=3):
    logger.debug("Waiting for {!r}...".format(database_url))
    engine = create_engine(database_url)
    current_try = 0
    while current_try < max_tries:
        try:
            engine.execute("SELECT version();")
            logger.debug("Database is already up!")
            break
        except OperationalError:
            logger.debug("Database not responding yet ...")
            current_try += 1
            sleep(wait_seconds)
    else:
        raise RuntimeError(
            "Database not responding at {} after {} tries. "
            "Giving up".format(database_url, max_tries)
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--workers",
        default=2,
        help="Number of workers to use by the gunicorn server. Defaults to 2."
    )
    parser.add_argument(
        "-r",
        "--reload",
        action="store_true",
        help="Should the gunicorn server automatically restart workers when "
             "code changes? This option is only useful for development. "
             "Defaults to False."
    )
    args = parser.parse_args()
    config = SafeConfigParser()
    config.read(os.getenv("PYCSW_CONFIG"))
    try:
        level = config.get("server", "loglevel").upper()
    except NoOptionError:
        level = "WARNING"
    logging.basicConfig(level=getattr(logging, level))

    p = Process(target=run_mqtt_listener)
    p.start()

    launch_pycsw(config, workers=args.workers, reload=args.reload)
    p.join()

