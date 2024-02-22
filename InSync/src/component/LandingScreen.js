import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FeedbackForm from './FeedbackForm';

const LandingScreen = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  const toggleFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to My App</Text>
      <TouchableOpacity onPress={toggleFeedback} style={{ position: 'absolute', top: 40, left: 20 }}>
        <Feather name="menu" size={24} color="black" />
      </TouchableOpacity>
      {showFeedback && <FeedbackForm />}
    </View>
  );
};

export default LandingScreen;
