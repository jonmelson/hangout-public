import React from 'react';

import TabNavigator from './TabNavigator';
import Friends from '../../screens/account/Friends';
import PublicProfile from '../../screens/account/profile/PublicProfile';
import ProfileStack from './ProfileStack';
import Details from '../../screens/account/Details';
import EditHangoutStack from './EditHangoutStack';
import NewMessages from '../../screens/account/messaging/NewMessages';
import ChatRoom from '../../screens/account/messaging/ChatRoom';
import SharePage from '../../screens/account/SharePage';
import NewHangoutStack from './NewHangoutStack';
import FeedbackPopup from '../../screens/account/FeedbackPopup';

import { SearchContextProvider } from '../../context/SearchContext';

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

  return (
    <SearchContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="HomeStack">
        <Stack.Screen
          name="HomeStack"
          component={TabNavigator}
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
          name="EditHangoutStack"
          component={EditHangoutStack}
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
          name="NewMessages"
          component={NewMessages}
          initialParams={{ sessionId: sessionId }}
        />

        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          initialParams={{ sessionId: sessionId }}
        />

        <Stack.Screen
          name="SharePage"
          component={SharePage}
          initialParams={{ sessionId: sessionId }}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'none',
          }}
        />

        <Stack.Screen
          name="FeedbackPopup"
          component={FeedbackPopup}
          initialParams={{ sessionId: sessionId }}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </SearchContextProvider>
  );
};

export default AccountStack;
