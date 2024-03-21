import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/authContext'


// (app) protected folder 
export default function Home() {
  const {logout,user}= useAuth();
  const handleLogout=async ()=>{
    await logout();
  }
  console.log('user data: ',user);

  return (
    <SafeAreaView>
      <View>
        <Text>HOME</Text>
        <Pressable onPress={handleLogout}>
          <Text>signOut</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}