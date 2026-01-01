import json
import pickle
import random

# Load trained model and vectorizer
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

print("Chatbot is running! (type 'quit' to stop)")

while True:
    user_input = input("You: ")
    if user_input.lower() == "quit":
        break
    print("Bot:", get_response(user_input))
