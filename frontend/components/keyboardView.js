import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

export default function KeyboardView({ children }) {
  const behavior = Platform.OS === 'ios' ? 'padding' : null;

  return (
    <KeyboardAvoidingView behavior={behavior} style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
