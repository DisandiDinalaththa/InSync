# Import necessary libraries
import random
import json
import pickle
import numpy as np
import tensorflow as tf

import nltk
from nltk.stem import WordNetLemmatizer

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import SGD

# Initialize the WordNet lemmatizer from NLTK
lemmatizer = WordNetLemmatizer()

# Load intents from JSON file
intents = json.loads(open('intents.json').read())

# Initialize empty lists and variables
words = []       # stores all words in the patterns
classes = []     # stores all intent tags
documents = []   # stores tuples of words and their tags
ignoreLetters = ['?', '!', '.', ',', "'"]  # Characters to ignore

# Iterate through each intent in the JSON file
for intent in intents['intents']:
    # Iterate through each pattern in the intent
    for pattern in intent['patterns']:
        # Tokenize words in the pattern
        wordList = nltk.word_tokenize(pattern)
        # Add words to the words list
        words.extend(wordList)
        # Append tuple of words and intent tag to documents list
        documents.append((wordList, intent['tag']))
        # Add intent tag to classes list if not already present
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lemmatize and filter out ignore letters from words, then sort them
words = [lemmatizer.lemmatize(word) for word in words if word not in ignoreLetters]
words = sorted(set(words))

# Sort intent tags
classes = sorted(set(classes))

# Save words and classes into pickle files for future use
pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

# Initialize an empty list for training data
training = []
# Create a list of zeros for representing empty intent outputs
outputEmpty = [0] * len(classes)

# Iterate through each document
for document in documents:
    bag = []  # Initialize an empty bag of words
    # Get word patterns from the document and lemmatize them
    wordPatterns = document[0]
    wordPatterns = [lemmatizer.lemmatize(word.lower()) for word in wordPatterns]
    # Create a bag of words for the document
    for word in words:
        bag.append(1) if word in wordPatterns else bag.append(0)

    # Create the output row corresponding to the document's intent
    outputRow = list(outputEmpty)
    outputRow[classes.index(document[1])] = 1
    # Append the bag of words and output row to the training data
    training.append(bag + outputRow)

# Shuffle the training data
random.shuffle(training)
# Convert training data into numpy array
training = np.array(training)

# Split training data into input (X) and output (Y)
trainX = training[:, :len(words)]
trainY = training[:, len(words):]

# Define a sequential model
model = Sequential()
# Add input layer with 128 neurons and ReLU activation function
model.add(Dense(128, input_shape=(len(trainX[0]),), activation='relu'))
# Add dropout layer to prevent overfitting
model.add(Dropout(0.5))
# Add a hidden layer with 64 neurons and ReLU activation function
model.add(Dense(64, activation='relu'))
# Add dropout layer to prevent overfitting
model.add(Dropout(0.5))
# Add output layer with softmax activation for multiclass classification
model.add(Dense(len(trainY[0]), activation='softmax'))

# Define Stochastic Gradient Descent optimizer
sgd = SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
# Compile the model with categorical cross-entropy loss function and the defined optimizer
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Train the model with the training data
hist = model.fit(trainX, trainY, epochs=200, batch_size=5, verbose=1)
# Save trained model
model.save('chatbotmodel.h5')
print('Done')
