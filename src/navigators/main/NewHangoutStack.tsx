import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChooseLocation from '../../screens/account/ChooseLocation';
import NewHangout from '../../screens/account/main/NewHangout'; 

const Stack = createNativeStackNavigator();

const NewHangoutStack = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  return (
    <Stack.Navigator initialRouteName="ChooseLocation">
      <Stack.Screen
        name="ChooseLocation"
        component={ChooseLocation}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="NewHangout"
        component={NewHangout}
        initialParams={{ sessionId: sessionId }}
      />

    
    </Stack.Navigator>
  );
};

export default NewHangoutStack;
