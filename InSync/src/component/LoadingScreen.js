import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
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
    width: 100, // Adjust the width and height of logo 
    height: 100,
    marginBottom: 30, // Add margin for spacing
    borderRadius: 100,
  },
  loadingContainer: {
    marginTop: 20, // Add space between the text and activity indicator(loading spinner)
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6A0DAD', // purple color
    marginBottom: 10, // Add space at the bottom of the text
  },
});

export default LoadingScreen;
