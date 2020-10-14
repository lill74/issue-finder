from flask import Flask, request, jsonify
from db import alux_collection
from flask_cors import CORS


app = Flask(__name__, static_folder='build', static_url_path='/')

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/search_query/<skips>', methods=['POST'])
def search_query(skips):
    content = request.json
    try:
        request_query = alux_collection.find(content).limit(8).skip(int(skips))
    except:
        return "Item not found", 404

    if request_query is not None:
        response_data = []
        for response in request_query:
            del (response['_id'])
            response_data.append(response)

        return jsonify(response_data)
    else:
        return "Item not found", 404


