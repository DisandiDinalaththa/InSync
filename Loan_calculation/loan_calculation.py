import speech_recognition as sr
import pyttsx3
import re
from word2number import w2n

# Calculation formula for the loan payment
def calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years):
    monthly_interest_rate = annual_interest_rate / 12 / 100
    total_months = loan_term_years * 12
    # Calculate monthly payment using the loan formula
    monthly_payment = (loan_amount * monthly_interest_rate * (1 + monthly_interest_rate) ** total_months) / \
                      (((1 + monthly_interest_rate) ** total_months) - 1)
    return monthly_payment

# Function to convert text to speech
def speak(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

# Function to preprocess text
def preprocess_text(text):
    processed_text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return processed_text.lower()

# Function to convert words representing numbers to numerical values
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
    
    # If word contains "years", it's likely a term, else check for digit or word representation
    if "years" in word:
        num_words = word.split(" ")
        for w in num_words:
            if w.isdigit():
                return int(w)
            elif w.lower() in words_dict:
                return words_dict[w.lower()]
    
    # If word is digit, return integer value, else check dictionary for word representation
    if word.isdigit():
        return int(word)
    elif word.isalpha():
        return words_dict.get(word.lower(), None)
    else:
        return None

# Function to get a yes or no response from audio input
def get_yes_no_response(recognizer, audio):
    try:
        response = recognizer.recognize_google(audio)
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

# Main function to run the loan calculator
def main():
    # Initialize speech recognizer
    recognizer = sr.Recognizer()
    breakdown_response = None
    loan_term_years = None
    remaining_principal = None
    annual_interest_rate = None
    monthly_payment = None

    speak("Welcome to the loan calculator.")

    # Get the loan amount from the user
    loan_amount = None
    while loan_amount is None:
        speak("What is the loan amount?")
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)

        try:
            # Convert speech to text and preprocess
            loan_amount_text = recognizer.recognize_google(audio)
            loan_amount_text = preprocess_text(loan_amount_text)
            # Convert text to numerical value
            loan_amount = w2n.word_to_num(loan_amount_text)
        except sr.UnknownValueError:
            speak("Sorry, I didn't catch that. Can you repeat?")
        except sr.RequestError:
            speak("Sorry, I'm unable to process your request at the moment.")

    # Get the annual interest rate from the user
    annual_interest_rate = None
    while annual_interest_rate is None:
        speak("What is the annual interest rate?")
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)

        try:
            # Convert speech to text and preprocess
            annual_interest_rate_text = recognizer.recognize_google(audio)
            annual_interest_rate_text = preprocess_text(annual_interest_rate_text)
            # Extract numerical value from text
            annual_interest_rate = float(re.findall(r'\d+', annual_interest_rate_text)[0])
        except sr.UnknownValueError:
            speak("Sorry, I didn't catch that. Can you repeat?")
        except sr.RequestError:
            speak("Sorry, I'm unable to process your request at the moment.")

    # Get the loan term in years from the user
    loan_term_years = None
    while loan_term_years is None:
        speak("What is the loan term in years?")
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)

        try:
            # Convert speech to text and preprocess
            loan_term_years_text = recognizer.recognize_google(audio)
            loan_term_years_text = preprocess_text(loan_term_years_text)
            # Convert word representation to numerical value
            loan_term_years = convert_word_to_number(loan_term_years_text)
        except sr.UnknownValueError:
            speak("Sorry, I didn't catch that. Can you repeat?")
        except sr.RequestError:
            speak("Sorry, I'm unable to process your request at the moment.")

        if loan_term_years is None:
            speak("Sorry, I couldn't understand the loan term in years. Can you please repeat with a valid number?")

    # Calculate monthly payment based on user inputs
    monthly_payment = calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years)

    # Speak the calculated monthly payment
    speak(f"The monthly payment is {monthly_payment:.2f} LKR.")

    # Calculate and speak the breakdown for month 1
    remaining_principal = loan_amount
    interest_payment = remaining_principal * (annual_interest_rate / 12 / 100)
    principal_payment = monthly_payment - interest_payment
    speak(f"Month 1: Capital Payment: {principal_payment:.2f} LKR, Interest Payment: {interest_payment:.2f} LKR")

    # Ask the user if they need the loan breakdown
    breakdown_response = None
    while breakdown_response is None:
        speak("Do you need the loan breakdown? Please say yes or no.")
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)
            breakdown_response = get_yes_no_response(recognizer, audio)

        # Provide the loan breakdown if requested
        if breakdown_response == "yes":
            print("Here's your loan breakdown:")
            for month in range(1, loan_term_years * 12 + 1):
                interest_payment = remaining_principal * (annual_interest_rate / 12 / 100)
                principal_payment = monthly_payment - interest_payment
                print(f"Month {month}: Capital Payment: {principal_payment:.2f} LKR, Interest Payment: {interest_payment:.2f} LKR")
                remaining_principal -= principal_payment
            speak("The loan breakdown has been displayed.")
        
        elif breakdown_response == "no":
            speak("Thank you for being with us.")
        else:
            speak("Please say yes or no.")

if __name__ == "__main__":
    main()
