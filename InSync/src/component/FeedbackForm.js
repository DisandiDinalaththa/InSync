import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackChange = (text) => {
    setFeedback(text);
  };

  const handleSubmit = () => {
    // Handle submission logic here
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  return (
    <View style={{ marginTop: 20 }}>
      <TextInput
        placeholder="Enter your feedback"
        onChangeText={handleFeedbackChange}
        value={feedback}
        multiline
        style={{ borderWidth: 2, borderColor: 'black', padding: 10, height: 150, width: 300 }}
      />
      <Button title="Submit Feedback" onPress={handleSubmit} />
    </View>
  );
};

export default FeedbackForm;
