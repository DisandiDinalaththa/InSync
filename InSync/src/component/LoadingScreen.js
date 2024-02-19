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
    width: 200, // Adjust the width and height according to your logo size
    height: 200,
    marginBottom: 20, // Add margin for spacing
    borderRadius: 0,
  },
  loadingText: {
    fontSize: 18,
    color: '#6A0DAD', // purple color
  },
});

export default LoadingScreen;
