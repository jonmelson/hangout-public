import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Profile from '../../screens/account/profile/Profile';
import EditProfile from '../../screens/account/profile/edit/EditProfile';
import EditProfilePhoto from '../../screens/account/profile/edit/EditProfilePhoto';
import EditName from '../../screens/account/profile/edit/EditName';
import EditUsername from '../../screens/account/profile/edit/EditUsername';
import EditLocation from '../../screens/account/profile/edit/EditLocation';
import EditAbout from '../../screens/account/profile/edit/EditAbout';
import EditInstagram from '../../screens/account/profile/edit/EditInstagram';
import EditTwitter from '../../screens/account/profile/edit/EditTwitter';

import Settings from '../../screens/account/profile/Settings';
import About from '../../screens/account/profile/About';
import DeactivateAccount from '../../screens/account/profile/DeactivateAccount';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const ProfileStack = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={Profile}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="EditProfilePhoto"
        component={EditProfilePhoto}
        initialParams={{ sessionId: sessionId }}
        options={{
          title: '',
          presentation: 'modal',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="EditName"
        component={EditName}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="EditUsername"
        component={EditUsername}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="EditLocation"
        component={EditLocation}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="EditAbout"
        component={EditAbout}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="EditInstagram"
        component={EditInstagram}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen
        name="EditTwitter"
        component={EditTwitter}
        initialParams={{ sessionId: sessionId }}
      />

      <Stack.Screen name="Settings" component={Settings} />

      <Stack.Screen name="About" component={About} />

      <Stack.Screen
        name="DeactivateAccount"
        component={DeactivateAccount}
        initialParams={{ sessionId: sessionId }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
