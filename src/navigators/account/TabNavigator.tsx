import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../../screens/account/main/Home';
import Going from '../../screens/account/main/Going';

import {
  TabBarHomeIcon,
  TabBarPlus25Icon,
  TabBarGoingIcon,
} from '../../components/Icons';

const Stack = createBottomTabNavigator();
const EmptyScreen = () => {
  return null;
};

const TabNavigator = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};
  return (
    <>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{
            sessionId: sessionId,
          }}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => {
              let iconName = focused ? 'home-outline' : 'home';
              return <TabBarHomeIcon name={iconName} />;
            },
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="NewHangoutStack"
          component={EmptyScreen}
          options={{
            tabBarLabel: 'New Hangout',
            tabBarIcon: ({}) => <TabBarPlus25Icon />,
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('NewHangoutStackTemp');
            },
          })}
        />

        <Stack.Screen
          name="Going"
          component={Going}
          initialParams={{ sessionId: sessionId }}
          options={{
            tabBarLabel: 'Going',
            tabBarIcon: ({ focused }) => {
              let iconName = focused ? 'going-outline' : 'going';
              let iconColor = focused ? '#333' : 'gray';
              return <TabBarGoingIcon name={iconName} color={iconColor} />;
            },
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default TabNavigator;
