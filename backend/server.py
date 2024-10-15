from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/data', methods=['GET'])
def get_data():
    df = pd.read_csv('assets/Fußballer.csv')

    data = df.to_dict(orient='list')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
