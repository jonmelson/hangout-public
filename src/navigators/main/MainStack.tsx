import React, { useEffect, useState } from 'react';

import AccountStack from './AccountStack';
import OnboardingStack from './OnboardingStack';

import { SearchContextProvider } from '../../context/SearchContext';

import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

import { ChatContextProvider } from '../../context/ChatContext';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const MainStack = ({ navigation, route }: { navigation: any; route: any }) => {
  const { sessionId } = route.params;
  const [newUser, setNewUser] = useState<boolean | null>(null);

  const checkIfUserExists = async (id: string | undefined) => {
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
  };

  useEffect(() => {
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

    supabase.auth.onAuthStateChange((_event, session) => {
      checkIfUserExists(session?.user.id);
    });
  }, []);

  // console.log(newUser)
  return (
    <ChatContextProvider>
      <SearchContextProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <>
            {!newUser ? (
              <Stack.Screen
                name="AccountStack"
                component={AccountStack}
                initialParams={{ sessionId: sessionId }}
              />
            ) : (
              <Stack.Screen
                name="OnboardingStack"
                component={OnboardingStack}
                initialParams={{ sessionId: sessionId }}
              />
            )}
          </>
        </Stack.Navigator>
      </SearchContextProvider>
    </ChatContextProvider>
  );
};

export default MainStack;
