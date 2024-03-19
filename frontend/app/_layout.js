import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import {Slot, useRouter, useSegments} from "expo-router";
import "../global.css";
import { AuthContextProvider, useAuth } from '../context/authContext';


const MainLayout = () => {
  const {isAuthenticated} = useAuth ();
  const segments = useSegments();
  const router = useRouter();

  useEffect(()=> {
    //check if user is authenticated or not
    if (typeof isAuthenticated == 'undefined')return;
    const inApp = segments[0] == '(app)';
    if (isAuthenticated && !inApp){
      //redirect home
      router.replace('home');
    }else if (isAuthenticated == false){
      //redirect to signIn
      router.replace('signIn');
    } 
  },[isAuthenticated]);
  
  return <Slot/>
}


export default function Rootlayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  )
}