from flask import Flask, request, jsonify
from db import alux_collection
from flask_cors import CORS



app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

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


if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)



