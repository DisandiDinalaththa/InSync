import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Opening from '../components/opening'; 

export default function LoadingPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../public/images/logo.png')} style={styles.logo} /> 
      </View>
      <View style={styles.upperContainer}>
        <Text style={styles.appName}>InSync</Text>
        <Text style={styles.description}>AI-Powered Customer Representative</Text>
      </View>
      
      <Opening size={wp('20%')} /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFF', 
  },
  upperContainer: {
    alignItems: 'center', 
    marginTop: hp('1%') 
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: hp('1%'), // Adjust margin from top responsively
  },
  appName: {
    fontSize: hp('12%'), // Adjust font size responsively
    fontWeight: 'bold',
    color: '#333333', 
    marginBottom: hp('1%'), // Adjust margin from appName to description responsively
  },
  description: {
    fontSize: hp('2%'), // Adjust font size responsively
    fontWeight: '600', 
    color: '#666666', 
    justifyContent:'center',
    lineHeight: hp('3%'), // Adjust the space between lines of text
    marginBottom: hp('3%'), // Adjust margin from description to logo responsively
  },
  logo: {
    width: wp('30%'), // Adjust logo size responsively
    height: wp('30%'),
    borderRadius: wp('100%'), // Adjust border radius responsively
  },
});
