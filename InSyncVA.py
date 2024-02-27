import speech_recognition as sr
import pyttsx3
import os
from dotenv import load_dotenv
import openai

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY")
openai.api_key = OPENAI_KEY

def SpeakText(command):
    engine = pyttsx3.init()
    engine.say(command)
    engine.runAndWait()

r = sr.Recognizer()

def record_text():
    try: 
        with sr.Microphone() as source2:
            r.adjust_for_ambient_noise(source2, duration=0.2)
            print("I'm listening")
            audio2 = r.listen(source2)
            MyText = r.recognize_google(audio2)
            return MyText
            
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))

    except sr.UnknownValueError:
        print("Unknown error occurred")

def send_to_chatGPT(messages, model="gpt-3.5-turbo"):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.5,
    )

    message = response.choices[0].message.content
    messages.append({"role": "user", "content": message})  # Fix variable name
    return message

# Example usage:
text = record_text()
response = send_to_chatGPT([{"role": "system", "content": "Start conversation."}, {"role": "user", "content": text}])
print(response)
