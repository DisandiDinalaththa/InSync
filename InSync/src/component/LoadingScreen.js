import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Your App Logo</Text>
        <Text style={styles.loadingText}>Loading Application...</Text>
        <ActivityIndicator size="large" color="#6A0DAD" />
      </View>
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
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A0DAD', // purple color
    marginBottom: 10,
    borderRadius: 0,
  },
  loadingText: {
    fontSize: 18,
    color: '#6A0DAD', // purple color
  },
});

export default LoadingScreen;
