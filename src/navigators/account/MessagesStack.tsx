import React from 'react';

import Messages from '../../screens/account/messaging/Messages';
import NewMessages from '../../screens/account/messaging/NewMessages';
import ChatRoom from '../../screens/account/messaging/ChatRoom';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const MessagesStack = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen
        name="Messages"
        component={Messages}
        initialParams={{ sessionId: sessionId }}
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
    </Stack.Navigator>
  );
};

export default MessagesStack;
