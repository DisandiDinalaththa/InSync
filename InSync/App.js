import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingScreen from './src/LoadingScreen';
import LandingScreen from './src/LandingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Change the duration as per your requirement
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <LoadingScreen /> : <LandingScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
