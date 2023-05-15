import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Avatar from './Avatar';
import { MessagesOutlineIcon, UserSquareIcon, HangoutBlackLogo } from './Icons';
import { User2 } from '../utils/other';
import { LinearGradient } from 'expo-linear-gradient';

import { supabase } from '../lib/supabase';

import { NavigationProps } from '../utils/navigation';

const Header = (props: NavigationProps) => {
  const { navigation, sessionId } = props;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(' ');
  const [pendingFriendRequests, setPendingFriendRequests] = useState(0);

  const fullName = firstName + ' ' + lastName;

  const handleMessagesPress = () => {
    navigation.navigate('MessagesStack');
  };

  const handleFriendsPress = () => {
    navigation.navigate('Friends');
  };

  const handleAvatarPress = () => {
    navigation.navigate('ProfileStack');
  };

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

  let badge: React.ReactNode = null;

  badge = (
    <LinearGradient
      colors={['#7000FF', '#B174FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.badge}>
      <Text
        style={{
          fontSize: 10,
          color: 'white',
          fontWeight: '500',
        }}>
        {pendingFriendRequests}
      </Text>
    </LinearGradient>
  );

  // Create a subscription to the users table for realtime data
  useEffect(() => {
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

  useEffect(() => {
    const getProfile = async () => {
      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionId);

      if (error) {
        console.error(error);
      } else {
        setFirstName(user?.[0]?.first_name);
        setLastName(user?.[0]?.last_name);
        setAvatarUrl(user?.[0]?.avatar);
      }
    };

    getProfile();
  }, [firstName, lastName, avatarUrl]);

  useEffect(() => {
    getPendingFriendRequests();
  }, [pendingFriendRequests]);

  return (
    <View className="bg-white">
      <View className="mx-4 mt-16 flex flex-row justify-between ">
        <HangoutBlackLogo />

        <View className="flex flex-row items-center space-x-4">
          <TouchableOpacity onPress={handleMessagesPress}>
            <MessagesOutlineIcon color="#333" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleFriendsPress}>
            {pendingFriendRequests > 0 && badge}
            <UserSquareIcon />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAvatarPress}>
            <Avatar source={avatarUrl} name={fullName} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    borderWidth: 2,
    bottom: 12,
    right: -7,
    borderColor: '#fff',
    borderRadius: 18,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default Header;
