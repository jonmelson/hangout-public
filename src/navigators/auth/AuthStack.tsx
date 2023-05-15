import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Landing from '../../screens/auth/Landing';
import SignUpAuth from '../../screens/auth/SignUpAuth';
import LoginAuth from '../../screens/auth/LoginAuth';
import VerifyAuth from '../../screens/auth/VerifyAuth';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} />

      <Stack.Screen name="SignUpAuth" component={SignUpAuth} />

      <Stack.Screen name="LoginAuth" component={LoginAuth} />

      <Stack.Screen name="VerifyAuth" component={VerifyAuth} />
    </Stack.Navigator>
  );
};

export default AuthStack;
