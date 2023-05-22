import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import AuthStack from './src/navigators/auth/AuthStack';
import OnboardingStack from './src/navigators/onboarding/OnboardingStack';
import AccountStack from './src/navigators/account/AccountStack';

import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';

import * as Linking from 'expo-linking';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [newUser, setNewUser] = useState(true);

  const linking = {
    prefixes: ['hangout://', 'https://hangout.social'],
    config: {
      screens: {
        Account: {
          path: 'account',
          screens: {
            PublicProfile: {
              path: 'profile/:username',
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    async function checkIfUserExists(id: string | undefined) {
      const { data: users } = await supabase
        .from('users')
        .select('onboarded')
        .eq('id', id)
        .limit(1);

      if (
        users &&
        users.length > 0 &&
        (users[0].onboarded === null || users[0].onboarded === false)
      ) {
        setNewUser(true);
      } else {
        setNewUser(false);
      }
    }

    const userSubscription = supabase
      .channel('user-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        payload => {
          if (payload.eventType == 'UPDATE') {
            // Get the ids from the inserted table
            // console.log('Updated');
            if (payload.new.onboarded === true) {
              setNewUser(false);
            } else if (
              payload.new.onboarded === null ||
              payload.new.onboarded === false
            ) {
              setNewUser(true);
            }
          }
        },
      )
      .subscribe();

    async function getSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.log(error);
      } else {
        setSession(session);

        if (session && session.user) {
          checkIfUserExists(session.user.id);
        }
      }
    }

    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkIfUserExists(session?.user.id);
    });
  }, [newUser]);

  return (
    <ActionSheetProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" translucent={true} hidden={false} />
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            {!session || !session.user ? (
              <Stack.Screen name="Auth" component={AuthStack} />
            ) : (
              <>
                {newUser ? (
                  <Stack.Screen
                    name="Onboarding"
                    component={OnboardingStack}
                    initialParams={{
                      sessionId: session.user.id,
                    }}
                  />
                ) : (
                  <Stack.Screen
                    name="Account"
                    component={AccountStack}
                    initialParams={{
                      sessionId: session.user.id,
                    }}
                  />
                )}
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ActionSheetProvider>
  );
}
