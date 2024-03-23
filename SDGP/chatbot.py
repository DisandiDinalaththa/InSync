import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
import speech_recognition as sr
import pyttsx3
import re
from word2number import w2n

engine = pyttsx3.init()
recognizer = sr.Recognizer()
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
    if intents_list:
        tag = intents_list[0]['intent']
        list_of_intents = intents_json['intents']
        for i in list_of_intents:
            if i['tag'] == tag:
                result = random.choice(i['responses'])
                break
        return result
    else:
        return "I'm sorry, I didn't understand that."

def speak(text):
    engine.say(text)
    engine.runAndWait()

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

def get_yes_no_response(recognizer, audio):
    try:
        response = recognizer.recognize_google(audio)
        print("Recognized response:", response)
        response = response.lower()
        if "yes" in response:
            return "yes"
        elif "no" in response:
            return "no"
        else:
            return None
    except sr.UnknownValueError:
        return None
    except sr.RequestError:
        return None

def extract_loan_details(text):
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

def listen_and_respond():
    try:
        print("Hello! I'm Cloudy. How can I assist you today?")
        speak("Hello! I'm Cloudy. How can I assist you today?")
        
        state = None
        loan_amount = None
        annual_interest_rate = None
        loan_term_years = None
        
        while True:
            with sr.Microphone() as source:
                print("Listening...")
                recognizer.adjust_for_ambient_noise(source)
                try:
                    audio = recognizer.listen(source, timeout=5)
                except sr.WaitTimeoutError:
                    print("Timeout occurred while waiting for audio.")
                    speak("Can you please repeat that?")
                    continue
                try:
                    print("Recognizing...")
                    converted_text = recognizer.recognize_google(audio)
                    print("You said:", converted_text)
                    print("Lowercased text:", converted_text.lower())
                    
                    if state == "ask_loan_amount":
                        loan_amount = w2n.word_to_num(converted_text)
                        print("Recognized loan amount:", loan_amount)
                        state = "ask_annual_interest_rate"
                        speak("Got it. Now, please provide the annual interest rate.")
                    
                    elif state == "ask_annual_interest_rate":
                        annual_interest_rate = w2n.word_to_num(converted_text)
                        print("Recognized annual interest rate:", annual_interest_rate)
                        state = "ask_loan_term_years"
                        speak("Thanks. Finally, please provide the loan term in years.")
                    
                    elif state == "ask_loan_term_years":
                        loan_term_years = w2n.word_to_num(converted_text)
                        print("Recognized loan term (years):", loan_term_years)
                        state = None
                        monthly_payment = calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years)
                        print("Your monthly loan payment is:", monthly_payment)
                        speak(f"Your monthly loan payment is {monthly_payment} USD.")
                    
                    else:
                        ints = predict_class(converted_text)
                        res = get_response(ints, intents)
                        print(res)
                        speak(res)
                        
                        if any(pattern in converted_text.lower() for pattern in goodbye_patterns):
                            print("Goodbye!")
                            speak("Goodbye!")
                            break
                            
                        if any(pattern in converted_text.lower() for pattern in loan_patterns):
                            state = "ask_loan_amount"
                            speak("Sure. What is the loan amount?")
                            
                except sr.UnknownValueError:
                    print("I'm sorry I could not understand you. Can you please repeat what you said.")
                    speak("I'm sorry I could not understand you. Can you please repeat what you said.")
                    continue
                except sr.RequestError as e:
                    print("Sorry, an error occurred. {0}".format(e))
                    continue
    except Exception as e:
        print("An exception occurred:", e)

print("Chatbot is running!")

goodbye_patterns = [pattern.lower() for intent in intents["intents"] if intent["tag"] == "goodbye" for pattern in intent["patterns"]]
loan_patterns = [pattern.lower() for intent in intents["intents"] if intent["tag"] == "calculate_loan" for pattern in intent["patterns"]]

listen_and_respond()