import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingScreen from './src/component/LoadingScreen';
import LandingScreen from './src/component/LandingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // loading spinner duration 
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
