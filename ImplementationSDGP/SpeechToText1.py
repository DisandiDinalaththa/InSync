import speech_recognition as sr
from gtts import gTTS
import pygame
import io

def speak(text):
    tts = gTTS(text=text, lang='en')
    audio_data = io.BytesIO()
    tts.write_to_fp(audio_data)
    audio_data.seek(0)
    pygame.mixer.init()
    pygame.mixer.music.load(audio_data)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)

def process_text(text):
    if "hello" in text.lower():
        return "Hello! How can I assist you?"
    elif "thank you" in text.lower():
        return "You're welcome!"
    else:
        return "I'm sorry, I didn't understand."

def chatbot():
    r = sr.Recognizer()

    while True:
        with sr.Microphone() as source:
            print("How can I assist you..")
            speak("How can I assist you..")
            audio = r.listen(source)

        try:
            recognized_text = r.recognize_google(audio)
            print("You said: \n" + recognized_text)
            processed_response = process_text(recognized_text)
            speak(processed_response)
            print("Bot: " + processed_response)
            
            if "goodbye" in recognized_text.lower():
                print("Bot: Goodbye!")
                speak("Goodbye!")
                break

        except Exception as e:
            print("Error : " + str(e))
            speak("Sorry, I could not understand you.")

if __name__ == "__main__":
    chatbot()
