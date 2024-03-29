import { View, Text, Pressable, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontAwesome } from '@expo/vector-icons';
import SpeechToText from '../../components/SpeechToText';
 
export default function Home() {
    const { logout, user } = useAuth();
    const handleLogout = async () => {
        await logout();
        console.log("User logged out", user);
    };
    console.log('user data: ', user);
      

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.mainContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: wp(4), marginTop: hp(2) }}>
                    <Pressable onPress={handleLogout}>
                        <FontAwesome name="sign-out" size={30} color="#60BAAE" />
                    </Pressable>
                </View>
                {/* speech to text*/}
                <SpeechToText/>
   
   
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFF',
    }
    
});
