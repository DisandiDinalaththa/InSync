import React, { useRef, useState } from 'react';
import { View, Image, Text, TextInput, Pressable, Alert, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/loading';
import KeyboardView from '../components/keyboardView';
import { useAuth } from '../context/authContext';



export default function SignUP() {
  const router = useRouter();
  const {register} = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef ("");
  const passwordRef =  useRef("");
  const usernameRef = useRef("");

  const  handleRegister = async() => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current){
      Alert.alert('Sign Up', "Please fill all the inputs!");
      return;
    }
    setLoading (true);

    let response = await register (emailRef.current, passwordRef.current, usernameRef.current );
    setLoading(false);

    //console.log('got result: ', response);
    if(!response.success){
        Alert.alert('Sign Up', response.msg);
    }
  }

  return (
    <KeyboardView>
      <StatusBar style='dark'/>
      <View style={{paddingTop: hp(12), paddingHorizontal: wp(8)}} className="flex-1 gap-10">
        {/*image */}
        <View >
          <Image source={require('../public/images/signup.png')} style={{ width: 200, height: 200, marginLeft: 75 }} /> 
        </View>

        <View className = "gap-10">
          <Text  style={{fontSize: hp(4), paddingTop: hp(1), paddingBottom: hp(2)}} className = "font-bold tracking-wider text-center text-neutral-900 ">Sign Up</Text>

          
          <View className = "gap-4">

            {/*username*/}
            <View style = {{height: hp(6)}} className= "flex-row gap-4 bg-neutral-200 items-center rounded-xl">
              <Feather name="user" size= {hp(2.4)} color="gray" style = {{marginLeft: 12}} />
              <TextInput
                onChangeText={value => usernameRef.current = value} 
                style={{fontSize: hp(2)}}
                className= "flex-1 font-semibold text-neutral-900"
                placeholder="Username"
                placeholderTextColor='gray'
              />
            </View>

            {/* Email */}
            <View style = {{height: hp(6)}} className= "flex-row gap-4 bg-neutral-200 items-center rounded-xl">
              <Octicons name="mail" size= {hp(2.4)} color="gray" style = {{marginLeft: 12}} />
              <TextInput
                onChangeText={value => emailRef.current = value} 
                style={{fontSize: hp(2)}}
                className= "flex-1 font-semibold text-neutral-900"
                placeholder="example@gmail.com"
                placeholderTextColor='gray'
              />
            </View>
            {/* password*/}
            
            <View style = {{height: hp(6)}} className= "flex-row gap-4 bg-neutral-200 items-center rounded-xl">
              <Octicons name="lock" size= {hp(2.7)} color="gray" style = {{marginLeft: 12}}/>
              <TextInput 
                onChangeText={value => passwordRef.current = value} 
                style={{fontSize: hp(2)}}
                className= "flex-1 font-semibold text-neutral-900"
                placeholder=" Password"
                placeholderTextColor='gray'
                secureTextEntry
              />
            </View>
            
            {/*Button*/}
            <View>
              {
                loading?(
                  <View className="flex-row justify-center">
                    <Loading size={hp(18)}/>
                  </View>
                  
                ):(
                  
                  <TouchableOpacity onPress={handleRegister} style={{height: hp(5),  backgroundColor: '#F3C623', padding: 7, marginTop: 40, borderRadius: 15, width:120, alignItems:"center", marginLeft: 120, marginBottom: 12}} >
                    <Text style={{fontSize:hp(2.5)}} className="text-white font-bold tracking-wider "> Sign Up</Text>
                  </TouchableOpacity>
                )
              }
            </View>
            

            <View className="flex-row justify-center">
              <Text style={{fontSize:hp(1.8)}} className="font-semibold text-neutral-700" >Already have an account? </Text>
              <Pressable onPress={() => router.push('signIn')}>
                <Text style={{fontSize:hp(1.8), marginBottom: hp(4)}} className="font-semibold text-blue-900">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardView>
  )
}
