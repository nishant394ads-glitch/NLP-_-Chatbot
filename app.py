from flask import Flask, render_template, request, jsonify
import pickle
import json
import random

app = Flask(__name__)

# Load model and vectorizer from model folder
model = pickle.load(open('model/model.pkl', 'rb'))
vectorizer = pickle.load(open('model/vectorizer.pkl', 'rb'))

# Load intents
with open('data/intents.json') as file:
    intents = json.load(file)

def get_response(text):
    X = vectorizer.transform([text])
    tag = model.predict(X)[0]
    for intent in intents['intents']:
        if intent['tag'] == tag:
            return random.choice(intent['responses'])
    return "Sorry, I didn't understand that."

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get", methods=["POST"])
def chat():
    userText = request.form["msg"]
    return jsonify({"reply": get_response(userText)})

if __name__ == "__main__":
    app.run(debug=True)
