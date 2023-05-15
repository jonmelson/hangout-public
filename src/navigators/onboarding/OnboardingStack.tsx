import React from 'react';

import FullName from '../../screens/onboarding/FullName';
import UserName from '../../screens/onboarding/UserName';
import ProfileImage from '../../screens/onboarding/ProfileImage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const OnboardingStack = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { sessionId } = route.params;

  return (
    <Stack.Navigator initialRouteName="FullName">
      <Stack.Screen
        name="FullName"
        component={FullName}
        initialParams={{ sessionId: sessionId }}
      />
      <Stack.Screen
        name="UserName"
        component={UserName}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="ProfileImage"
        component={ProfileImage}
        initialParams={{ sessionId: sessionId }}
      />

      
    </Stack.Navigator>
  );
};

export default OnboardingStack;
