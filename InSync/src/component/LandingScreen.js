import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LandingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Landing Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5F5', // light purple background
  },
});

export default LandingScreen;
