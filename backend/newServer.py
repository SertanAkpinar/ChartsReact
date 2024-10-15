from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/data', methods=['GET'])
def get_data():
    df = pd.read_csv('assets/neue.csv')
    
    postal_codes = df['Postleitzahl'].astype(str).tolist()
    total = df['Gesamt'].tolist()

    categories = df.columns[2:]
    details = {category: df[category].tolist() for category in categories}

    data = {
        'postalCodes': postal_codes,
        'total': total,
        'categories': details
    }

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
