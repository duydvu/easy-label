from flask import Flask, Blueprint, request, abort, Response, make_response, jsonify
from flask_cors import CORS, cross_origin
from api.dataset_manager import DatasetManager
from api.config_parser import ConfigParser
from bson.json_util import dumps

BLUE_PRINT = Blueprint('easy-label', __name__)
CORS(BLUE_PRINT)
DATASET_MANAGER = DatasetManager()
CONFIG_PARSER = ConfigParser()

def error(message, status_code):
    return abort(make_response(jsonify(message=message), status_code))

@BLUE_PRINT.route('/metadata', methods=['GET'])
def get_metadata():
    return dumps({
        'labels': CONFIG_PARSER.get_labels(),
        'database': DATASET_MANAGER.get_metadata(),
    })


@BLUE_PRINT.route('/data/<index>', methods=['GET'])
def get_data(index):
    document = DATASET_MANAGER.find_by_index(int(index))
    if document:
        return dumps(document)
    else:
        return error("Not found", 404)


@BLUE_PRINT.route('/data/<index>', methods=['PUT'])
def put_data(index):
    document = request.get_json()
    label_list = CONFIG_PARSER.get_labels(onlyName=True)
    if sorted(label_list) != sorted(list(document.keys())):
        return error("Bad request", 400)
    log = DATASET_MANAGER.update_by_index(int(index), document)
    if log:
        return dumps(log)
    error("Not found", 404)


@BLUE_PRINT.route('/download/labelled', methods=['GET'])
def download_labelled():
    labels = CONFIG_PARSER.get_labels()
    labelled_data = DATASET_MANAGER.get_labelled_data(labels)
    return Response(labelled_data,
                    mimetype='application/json',
                    headers={
                        'Content-Disposition':
                        'attachment;filename=data.json'
                    })


@BLUE_PRINT.route('/upload', methods=['POST'])
def upload_file():
    # check if the post request has the file part
    if 'file' not in request.files:
        return error("Bad request1", 400)
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    filename = file.filename
    if filename == '':
        return error("Bad request", 400)
    if file and '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ['json']:
        file_content = file.read().decode("utf-8")
        result = DATASET_MANAGER.insert_from_data(file_content)
        if result:
            return dumps(result.inserted_ids)
    return error("Bad request", 400)

        

def create_app():
    app = Flask(__name__)
    app.register_blueprint(BLUE_PRINT)

    return app
