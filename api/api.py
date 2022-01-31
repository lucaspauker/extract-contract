import time
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/dummy_predict", methods=["POST"])
def dummy_predict():
    if request.method == "POST":
        text = request.get_json()["input"]
        return jsonify({"message": "hi " + text})
