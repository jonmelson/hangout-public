import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../screens/account/main/Home';
import Messages from '../../screens/account/messaging/Messages';
import ProfileStack from './ProfileStack';
import FriendsStack from './FriendsStack';
import { Alert, StyleSheet, View } from 'react-native';
import {
  TabBarHomeIcon,
  TabBarSearchIcon,
  TabBarPlus25Icon,
  TabBarMessagingIcon,
} from '../../components/Icons';
import { supabase } from '../../lib/supabase';
import TabAvatar from '../../components/TabAvatar';

export type User2 = {
  about?: string;
  avatar?: string | null;
  created_at?: string;
  email?: string | null;
  first_name?: string;
  id?: string;
  instagram?: string;
  last_active?: string | null;
  last_name?: string;
  phone?: string;
  registered?: boolean;
  twitter?: string;
  username?: string;
};

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

  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [pendingFriendRequests, setPendingFriendRequests] = React.useState(0);

  const fullName = firstName + ' ' + lastName;

  async function getProfile() {
    try {
      let { data, error, status } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionId);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstName(data?.[0]?.first_name);
        setLastName(data?.[0]?.last_name);
        setAvatarUrl(data?.[0]?.avatar);
      }

      // downloadImage(avatarPath);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  const getPendingFriendRequests = async () => {
    const { data: friendRequestData, error: friendRequestError } =
      await supabase
        .from('friend_requests')
        .select('*')
        .eq('to_user_id', sessionId)
        .eq('status', 'pending');

    if (friendRequestError) {
      console.error(friendRequestError);
    } else {
      if (friendRequestData.length > 0) {
        setPendingFriendRequests(friendRequestData.length);
      } else {
        setPendingFriendRequests(0);
      }
    }
  };

  // Create a subscription to the users table for realtime data
  React.useEffect(() => {
    if (sessionId) {
      // Subscribe to changes in the users table
      const channel = supabase
        .channel('db_changes_1')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${sessionId}`,
          },
          payload => {
            const user: User2 = payload.new;
            const avatar = user.avatar;
            setAvatarUrl(avatar as string);
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friend_requests',
          },
          payload => {
            // Check if the updated friend data involves the users you're interested in
            if (payload.eventType === 'INSERT') {
              getPendingFriendRequests();
              // console.log('Inserted');
            } else if (payload.eventType === 'UPDATE') {
              getPendingFriendRequests();
              // console.log('Updated');
            } else if (payload.eventType === 'DELETE') {
              // console.log('Deleted');
              getPendingFriendRequests();
            }
          },
        )
        .subscribe();
    }
  }, [sessionId, pendingFriendRequests]);

  React.useEffect(() => {
    if (sessionId) {
      getProfile();

      // Subscribe to changes in the users table
      const userSubscription = supabase
        .channel('changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
          },
          payload => {
            setAvatarUrl(payload.new.avatar);
            setFirstName(payload.new.first_name);
            setLastName(payload.new.last_name);
          },
        )
        .subscribe();
    }
  }, [sessionId, avatarUrl]);

  return (
    <>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home-outline' : 'home';
                return <TabBarHomeIcon name={iconName} />;
              case 'Search':
                iconName = focused ? 'search-outline' : 'search';
                return (
                  <View className="flex flex-col items-center">
                    <TabBarSearchIcon name={iconName} />
                    {pendingFriendRequests > 0 && (
                      <View
                        style={{
                          backgroundColor: 'purple',
                          height: 5,
                          width: 5,
                          borderRadius: 50,
                          position: 'absolute',
                          bottom: -8,
                        }}></View>
                    )}
                  </View>
                );
              case 'NewHangoutStack':
                return <TabBarPlus25Icon />;
              case 'Messaging':
                iconName = focused ? 'message-outline' : 'message';
                return <TabBarMessagingIcon name={iconName} />;
              case 'Profile':
                if (focused) {
                  return (
                    <TabAvatar
                      source={avatarUrl}
                      name={fullName}
                      size={26}
                      style={styles.border}
                    />
                  );
                } else {
                  return (
                    <TabAvatar source={avatarUrl} name={fullName} size={26} />
                  );
                }

              default:
                return null;
            }
          },
          tabBarStyle: {
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderTopColor: 'white',
          },
        })}>
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{
            sessionId: sessionId,
          }}
        />
        <Stack.Screen
          name="Search"
          component={FriendsStack}
          initialParams={{
            sessionId: sessionId,
          }}
        />
        <Stack.Screen
          name="NewHangoutStack"
          component={EmptyScreen}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('NewHangoutStackTemp');
            },
          })}
        />
        <Stack.Screen
          name="Messaging"
          component={Messages}
          initialParams={{
            sessionId: sessionId,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileStack}
          initialParams={{ sessionId: sessionId }}
        />
      </Stack.Navigator>
    </>
  );
};
const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: '#000000',
  },
});
export default TabNavigator;
