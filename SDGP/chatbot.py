# Import necessary libraries
from flask import Flask, request, jsonify  # Flask for creating the web application
import random  # For generating random numbers
import json  # For working with JSON data
import pickle  # For serializing and deserializing Python objects
import numpy as np  # For numerical computations
import nltk  # Natural Language Toolkit for text processing
from nltk.stem import WordNetLemmatizer  # Lemmatization for text preprocessing
from tensorflow.keras.models import load_model  # For loading the trained chatbot model
import re  # Regular expressions for text pattern matching
import speech_recognition as sr  # For speech recognition
from word2number import w2n  # For converting words to numbers

# Initialize Flask application
app = Flask(__name__)

# Load necessary data and models
intents = json.loads(open('intents.json').read())  # Load intents from JSON file
words = pickle.load(open('words.pkl', 'rb'))  # Load preprocessed words
classes = pickle.load(open('classes.pkl', 'rb'))  # Load intent classes
model = load_model('chatbotmodel.h5')  # Load the trained chatbot model
lemmatizer = WordNetLemmatizer()  # Initialize WordNet lemmatizer
recognizer = sr.Recognizer()  # Initialize speech recognizer

# Functions for text processing and intent recognition
def clean_up_sentence(sentence):
    # Tokenize and lemmatize the sentence
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    # Convert the sentence into a bag of words representation
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word==w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    # Predict the intent class of the input sentence
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i,r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    return return_list

def get_response(intents_list, intents_json, response2="I'm sorry, I didn't understand that."):
    # Get a response based on the predicted intent
    if intents_list:
        tag = intents_list[0]['intent']
        for intent in intents_json['intents']:
            if intent['tag'] == tag:
                result = random.choice(intent['responses'])
                return result
    return response2

# Loan calculation functions
def extract_loan_details(text):
    # Extract loan details from text using regular expressions
    loan_amount_match = re.search(r'\b\d+\b', text)
    if loan_amount_match:
        loan_amount = int(loan_amount_match.group())
    else:
        loan_amount = None
    
    interest_rate_match = re.search(r'\b\d+(\.\d+)?%\b', text)
    if interest_rate_match:
        annual_interest_rate = float(interest_rate_match.group().rstrip('%'))
    else:
        annual_interest_rate = None
    
    loan_term_match = re.search(r'\b\d+\b years', text)
    if loan_term_match:
        loan_term_years = int(loan_term_match.group())
    else:
        loan_term_years = None
    
    return loan_amount, annual_interest_rate, loan_term_years

def calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years):
    # Calculate the monthly loan payment
    monthly_interest_rate = annual_interest_rate / 12 / 100
    total_months = loan_term_years * 12
    monthly_payment = (loan_amount * monthly_interest_rate * (1 + monthly_interest_rate) ** total_months) / \
                      (((1 + monthly_interest_rate) ** total_months) - 1)
    
    return monthly_payment


# Global variables for maintaining conversation state and loan details
state = None
loan_amount = None
annual_interest_rate = None
loan_term_years = None

# API endpoint to handle text input and return response
@app.route('/api/chat', methods=['POST'])
def chat():
    global state, loan_amount, annual_interest_rate, loan_term_years
    data = request.get_json()
    user_input = data['text']
    
    if state == "ask_loan_amount":
        # Extract loan amount from user input
        loan_amount = w2n.word_to_num(user_input)
        state = "ask_annual_interest_rate"
        response = "Got it. Now, please provide the annual interest rate."
    
    elif state == "ask_annual_interest_rate":
        # Extract annual interest rate from user input
        annual_interest_rate = w2n.word_to_num(user_input)
        state = "ask_loan_term_years"
        response = "Thanks. Finally, please provide the loan term in years."
    
    elif state == "ask_loan_term_years":
        # Extract loan term in years from user input and calculate loan payment
        loan_term_years = w2n.word_to_num(user_input)
        state = None
        monthly_payment = calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years)
        response = f"Your monthly loan payment is {monthly_payment} USD."
    
    else:
        # Predict intent and generate response based on user input
        intents_list = predict_class(user_input)
        response = get_response(intents_list, intents)
        
        # Reset conversation state if user input contains "goodbye"
        if "goodbye" in user_input.lower():
            state = None
        
        # Prompt user for loan details if "calculate loan" is mentioned in user input
        if "calculate loan" in user_input.lower():
            state = "ask_loan_amount"
            response = "Sure. What is the loan amount?"
    
    return jsonify({'response': response})

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
