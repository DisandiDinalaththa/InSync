from flask import Flask, request, jsonify
import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
from word2number import w2n
import re

app = Flask(__name__)

lemmatizer = WordNetLemmatizer()
intents = json.loads(open('intents.json').read())
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('chatbotmodel.h5')

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word==w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i,r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    return return_list

def get_response(intents_list, intents_json):
    confidence_threshold = 0.5
    if intents_list:
        max_confidence_intent = max(intents_list, key=lambda x: float(x['probability']))
        if float(max_confidence_intent['probability']) > confidence_threshold:
            tag = max_confidence_intent['intent']
            list_of_intents = intents_json['intents']
            for intent in list_of_intents:
                if intent['tag'] == tag:
                    result = random.choice(intent['responses'])
                    return result
    return get_fallback_response()

def calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years):
    monthly_interest_rate = annual_interest_rate / 12 / 100
    total_months = loan_term_years * 12
    monthly_payment = (loan_amount * monthly_interest_rate * (1 + monthly_interest_rate) ** total_months) / \
                      (((1 + monthly_interest_rate) ** total_months) - 1)
    
    return monthly_payment

def preprocess_text(text):
    processed_text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return processed_text.lower()

def convert_word_to_number(word):
    words_dict = {
        "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
        "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
        "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15,
        "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19,
        "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50,
        "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90,
        "hundred": 100, "thousand": 1000, "million": 1000000, "billion": 1000000000
    }
    
    if "years" in word:
        num_words = word.split(" ")
        num = 0
        for w in num_words:
            if w.isdigit():
                num += int(w)
            elif w.lower() in words_dict:
                num += words_dict[w.lower()]
        return num
    
    if word.isdigit():
        return int(word)
    elif word.isalpha():
        return words_dict.get(word.lower(), None)
    else:
        return None

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_message = data["message"]
    response = process_message(user_message)
    print(response)
    return jsonify({"response": response})

def get_fallback_response():
    fallback_responses = [
        "I'm sorry, I didn't understand that.",
        "I'm not sure how to respond to that.",
        "Could you please rephrase that?",
        "I'm still learning! Can you ask me something else?",
        "I didn't catch that. Can you try again?"
    ]
    return random.choice(fallback_responses)

def process_message(message):
    arrayList = []
    cleaned_message = preprocess_text(message)
    ints = predict_class(cleaned_message)
    print("Recognized intents:", ints)
    response = get_response(ints, intents)
    arrayList.append(response) 
    if response.startswith("I'm sorry") or response.startswith("I'm not sure"):
        response = get_fallback_response()
        arrayList.append(response) 
    if any(intent['intent'] == 'calculate_loan' for intent in ints):
        loan_amount = None
        annual_interest_rate = None
        loan_term_years = None
        tokens = cleaned_message.split()
        for i in range(len(tokens)):
            if tokens[i].isdigit():
                loan_amount = int(tokens[i])
            elif tokens[i].lower() in ['interest', 'rate']:
                annual_interest_rate = convert_word_to_number(tokens[i-1])
            elif tokens[i].lower() == 'years':
                loan_term_years = convert_word_to_number(tokens[i-1])
        if all([loan_amount, annual_interest_rate, loan_term_years]):
            monthly_payment = calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years)
            response = f"Your estimated monthly payment for a loan of ${loan_amount} at an interest rate of {annual_interest_rate}% over {loan_term_years} years is ${monthly_payment:.2f}."
            arrayList.append(response)        
    return arrayList

if __name__ == '__main__':
    app.run(debug=True)
