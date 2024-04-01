import { View, Text } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

export default function Opening({size}) {
    return (
      <View style={{height: size, aspectRatio: 1}}>
        <LottieView style={{flex: 1}} source={require('../public/images/init .json')} autoPlay loop />
      </View>
    )
  }