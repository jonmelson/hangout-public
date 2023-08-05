import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditHangout from '../../screens/account/EditHangout';
import EditChooseLocation from '../../screens/account/EditChooseLocation';

const Stack = createNativeStackNavigator();

const EditHangoutStack = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  return (
    <Stack.Navigator initialRouteName="EditHangout">
      <Stack.Screen
        name="EditHangout"
        component={EditHangout}
        initialParams={{ sessionId: sessionId }}
      />
      <Stack.Screen
        name="EditChooseLocation"
        component={EditChooseLocation}
        initialParams={{ sessionId: sessionId }}
      />
    </Stack.Navigator>
  );
};

export default EditHangoutStack;
