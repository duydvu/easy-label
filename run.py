from api_server.app import create_app  # pylint: disable=relative-import,no-name-in-module

APP = create_app()
APP.run(host='0.0.0.0', port=3001, debug=True)
