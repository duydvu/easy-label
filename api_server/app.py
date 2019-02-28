from flask import Flask, Blueprint, request, abort, Response
from flask_cors import CORS, cross_origin
from api_server.dataset_manager import DatasetManager
from api_server.config_parser import ConfigParser
from bson.json_util import dumps

BLUE_PRINT = Blueprint('easy-label', __name__)
CORS(BLUE_PRINT)
DATASET_MANAGER = DatasetManager()
CONFIG_PARSER = ConfigParser()

@BLUE_PRINT.route('/metadata', methods=['GET'])
def get_metadata():
    return dumps({
        'labels': CONFIG_PARSER.get_labels(),
        'database': DATASET_MANAGER.get_metadata(),
    })


@BLUE_PRINT.route('/data/<index>', methods=['GET'])
def get_data(index):
    return dumps(DATASET_MANAGER.find_by_index(int(index)))


@BLUE_PRINT.route('/data/<index>', methods=['PUT'])
def put_data(index):
    document = request.get_json()
    if len(document.keys()) is 0:
        return abort(400)
    if DATASET_MANAGER.update_by_index(int(index), document):
        return dumps({})
    else:
        abort(400)


@BLUE_PRINT.route('/download/labelled', methods=['GET'])
def get_labelled():
    labels = CONFIG_PARSER.get_labels()
    labelled_data = DATASET_MANAGER.get_labelled_data(labels).getvalue()
    return Response(labelled_data,
                    mimetype='application/json',
                    headers={"Content-Disposition":
                             "attachment;filename=data.json"})

def create_app():
    app = Flask(__name__)
    app.register_blueprint(BLUE_PRINT)

    return app
