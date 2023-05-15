import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AccountStackParamList, NavigationProps } from '../../utils/navigation';

import Home from '../../screens/account/main/Home';
import Going from '../../screens/account/main/Going';

import {
  TabBarHomeIcon,
  TabBarPlus25Icon,
  TabBarGoingIcon,
} from '../../components/Icons';

const Stack = createBottomTabNavigator<AccountStackParamList>();
const EmptyScreen = () => {
  return null;
};

const TabNavigator = (props: NavigationProps) => {
  const { navigation, sessionId } = props;
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
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => {
              let iconName = focused ? 'home-outline' : 'home';
              return <TabBarHomeIcon name={iconName} />;
            },
            headerShown: false,
          }}>
          {() => <Home navigation={navigation} sessionId={sessionId} />}
        </Stack.Screen>

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
          options={{
            tabBarLabel: 'Going',
            tabBarIcon: ({ focused }) => {
              let iconName = focused ? 'going-outline' : 'going';
              let iconColor = focused ? '#333' : 'gray';
              return <TabBarGoingIcon name={iconName} color={iconColor} />;
            },
          }}>
          {() => <Going navigation={navigation} sessionId={sessionId} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default TabNavigator;
