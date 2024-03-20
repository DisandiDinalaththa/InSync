import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
import speech_recognition as sr
import pyttsx3

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

def speak_response(text):
    engine.say(text)
    engine.runAndWait()

def listen_and_respond():
    try:
        print("Hello! I'm Cloudy. How can I assist you today?")
        speak_response("Hello! I'm Cloudy. How can I assist you today?")
        
        while True:
            with sr.Microphone() as source:
                print("Listening...")
                recognizer.adjust_for_ambient_noise(source)
                try:
                    audio = recognizer.listen(source, timeout=5)
                except sr.WaitTimeoutError:
                    print("Timeout occurred while waiting for audio.")
                    speak_response("Can you please repeat that?")
                    continue

                try:
                    print("Recognizing...")
                    converted_text = recognizer.recognize_google(audio)
                    print("You said:", converted_text)

                    print("Lowercased text:", converted_text.lower())

                    if any(pattern in converted_text.lower() for pattern in goodbye_patterns):
                        print("Goodbye!")
                        engine.say("Goodbye!")
                        engine.runAndWait()
                        break

                    ints = predict_class(converted_text)
                    res = get_response(ints, intents)
                    print(res)

                    engine.say(res)
                    engine.runAndWait()

                except sr.UnknownValueError:
                    print("I'm sorry I could not understand you. Can you please repeat what you said.")
                    speak_response("I'm sorry I could not understand you. Can you please repeat what you said.")
                    continue
                except sr.RequestError as e:
                    print("Sorry, an error occurred. {0}".format(e))
                    continue
    except Exception as e:
        print("An exception occurred:", e)

print("Chatbot is running!")

goodbye_patterns = [pattern.lower() for intent in intents["intents"] if intent["tag"] == "goodbye" for pattern in intent["patterns"]]

listen_and_respond()