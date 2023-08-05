import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import AuthStack from './src/navigators/auth/AuthStack';
import MainStack from './src/navigators/main/MainStack';

import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import messaging from '@react-native-firebase/messaging';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.log(error);
    } else {
      setSession(session);
    }
    setLoading(false);
  };

  // const requestPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // };

  // useEffect(() => {
  //   requestPermission();
  // }, []);

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [session]);

  if (loading) {
    return <ActivityIndicator />; // Show loading indicator while fetching session
  }

  return (
    <ActionSheetProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" translucent={true} hidden={false} />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <>
              {!session || !session.user ? (
                <Stack.Screen name="Auth" component={AuthStack} />
              ) : (
                <Stack.Screen
                  name="Main"
                  component={MainStack}
                  initialParams={{ sessionId: session.user.id }}
                />
              )}
            </>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ActionSheetProvider>
  );
}
