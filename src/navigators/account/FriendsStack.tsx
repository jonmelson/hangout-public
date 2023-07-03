import React, { useEffect } from 'react';

import Friends from '../../screens/account/Friends';
import PublicProfile from '../../screens/account/profile/PublicProfile';

import { ChatContextProvider } from '../../context/ChatContext';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const FriendsStack = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { sessionId } = route.params;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Friends">
      <Stack.Screen
        name="Friends"
        component={Friends}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen name="PublicProfile" component={PublicProfile} />
    </Stack.Navigator>
  );
};

export default FriendsStack;
