import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';

import TabNavigator from './TabNavigator';
import Friends from '../../screens/account/Friends';
import PublicProfile from '../../screens/account/profile/PublicProfile';
import MessagesStack from './MessagesStack';
import ProfileStack from './ProfileStack';
import NewHangoutStack from './NewHangoutStack';
import Details from '../../screens/account/Details';
import EditHangout from '../../screens/account/EditHangout';
import EditChooseLocation from '../../screens/account/EditChooseLocation';

import { Session } from '@supabase/supabase-js';

import { useNavigation } from '@react-navigation/native'; 

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AccountStack = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { sessionId } = route.params;

  const handleDeepLink = (event: any) => {
    const { url } = event;
    let { hostname, path } = Linking.parse(url);
    console.log(path);
    if (path && path.startsWith('profile/')) {
      const username = path.split('/').pop();
      navigation.navigate('PublicProfile', {
        userId: username,
        sessionId: sessionId,
      });
      console.log(username);
      // Navigate to the profile screen with the extracted username
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  return ( 
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="HomeStack">
        <Stack.Screen
          name="HomeStack"
          component={TabNavigator}
          initialParams={{ sessionId: sessionId  }}
        />

        <Stack.Screen
          name="MessagesStack"
          component={MessagesStack}
          initialParams={{ sessionId: sessionId }}
        />

        <Stack.Screen
          name="Friends"
          component={Friends}
          initialParams={{ sessionId: sessionId }}
        />

        <Stack.Screen
          name="ProfileStack"
          component={ProfileStack}
          initialParams={{ sessionId: sessionId }}
        />

        <Stack.Screen name="PublicProfile" component={PublicProfile} />

        <Stack.Screen
          name="NewHangoutStackTemp"
          component={NewHangoutStack}
          initialParams={{ sessionId: sessionId }}
          options={{ presentation: 'modal' }}
        />

        <Stack.Screen
          name="Details"
          component={Details}
          initialParams={{ sessionId: sessionId }}
          options={{
            title: '',
            headerShadowVisible: false,
            presentation: 'modal',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EditHangout"
          component={EditHangout}
          options={{ presentation: 'modal', headerShown: true }}
        />

        <Stack.Screen
          name="EditChooseLocation"
          component={EditChooseLocation}
          options={{ presentation: 'modal', headerShown: true }}
        />
      </Stack.Navigator> 
  );
};

export default AccountStack;
