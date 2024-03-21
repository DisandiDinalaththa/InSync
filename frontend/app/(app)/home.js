import { View, Text, Pressable, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// (app) protected folder 
export default function Home() {
    const { logout, user } = useAuth();
    const handleLogout = async () => {
        await logout();
        console.log("User logged out", user);
    };
    console.log('user data: ', user);

    const [recording, setRecording] = useState(false);
    const handleRecordingToggle = () => {
        setRecording(!recording);
    };

    const renderRecordingButton = () => {
        if (recording) {
            return (
                <TouchableOpacity onPress={handleRecordingToggle}>
                    <Image
                        source={require('../../public/images/voiceLoading.gif')}
                        style={styles.recordingIcon}
                    />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={handleRecordingToggle}>
                    <Image
                        source={require('../../public/images/recordingIcon.png')}
                        style={styles.recordingIcon}
                    />
                </TouchableOpacity>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.maincontainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: wp(4), marginTop: hp(2) }}>
                    <Pressable onPress={handleLogout}>
                        <Text style={{ color: 'blue', fontWeight: 'bold' }}>Sign Out</Text>
                    </Pressable>
                </View>

                <View style={styles.logoContainer}>
                    <Image source={require('../../public/images/logo.png')} style={styles.logo} />
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Hi! I'm Cloudy</Text>
                    <Text style={{ fontSize: hp(2), fontWeight:'500', color: '#6B7280', textAlign: 'center', marginTop: hp(1), margin: hp(1) }}>Now you can interact with our AI agent to get answers for your queries!</Text>
                </View>

                {/* Added card containers */}
                <View style={styles.messageContainer}>
                    <View style={styles.cardContainer}>
                        <View style={styles.cardContent}>
                            <Image source={require('../../public/images/logo.png')} style={styles.cardlogo} />
                            <View style={styles.textContainer}>
                                <Text style={styles.cardText}>Loan Calculation</Text>
                                <Text style={styles.cardTextTwo}>Empowering your financial  decisions with smart numbers!</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={styles.cardContent}>
                            <Image source={require('../../public/images/logo.png')} style={styles.cardlogo} />
                            <View style={styles.textContainer}>
                                <Text style={styles.cardText}>Stop unauthorized transactions</Text>
                                <Text style={styles.cardTextTwo}>Notify your bank immediately to prevent any more unauthorised transactions</Text>
                            </View>
                        </View>
                    </View>
                    
                </View>

                {/* End of added card containers */}

                <View style={styles.buttonContainer}>
                    {renderRecordingButton()}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: hp(5),
    },
    logo: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
    },
    titleContainer: {
        flex: 1,
        marginTop: hp(2),
        
    },
    title: {
        fontSize: wp(5),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#374151',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(2),
        marginBottom: hp(2),
        marginLeft: hp(1),
        marginRight: hp(1),
    },
    recordingIcon: {
        width: hp(12),
        height: hp(12),
        borderRadius: hp(5),
    },
    // Added styles for card containers
    messageContainer: {
      alignItems: 'stretch',
      marginBottom: hp(10),
    },
  cardContainer: {
      backgroundColor: '#F3E5F5', // light purple 
      padding: wp(4),
      borderRadius: wp(5),
      margin: hp(2),
    },
  cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: wp(2),
    },
  cardlogo: {
      height: hp(4),
      width: hp(4),
      borderRadius: hp(2),
      marginRight: wp(5),
    },
  textContainer: {
      flex: 1,
    },
  cardText: {
      fontSize: wp(4.8),
      fontWeight: 'bold',
      color: '#374151', // gray-700
    },
  cardTextTwo: {
      fontSize: wp(4.2),
      color: '#6B7280', 
    },
});
