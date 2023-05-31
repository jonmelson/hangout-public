import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Avatar from './Avatar';

import { AvatarIconGroupProps } from '../utils/other';

const AvatarGroup = (props: AvatarIconGroupProps) => {
  const { users, userId } = props;

  let badge: React.ReactNode = null;

  if (users.length > 2) {
    badge = (
      <View style={styles.badge}>
        <Text className="text-xs text-black">
          {'+'}
          {users.length - 2}
        </Text>
      </View>
    );
  }

  // reorder the users array based on userId
  const sortedUsers = [...users];
  const userIndex = sortedUsers.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    const [user] = sortedUsers.splice(userIndex, 1);
    sortedUsers.unshift(user);
  }

  // calculate the maximum number of avatars to show
  const maxAvatars = sortedUsers.length > 1 ? 2 : 1;

  return (
    <View
      className={`relative flex w-20 flex-1 justify-center ${
        sortedUsers.length > 1 ? 'items-start' : 'items-center'
      }`}>
      {sortedUsers.slice(0, maxAvatars).map((user, index) => (
        <Avatar
          key={index}
          name={user.first_name + ' ' + user.last_name}
          style={[
            index === 0 ? styles.foregroundStyle : styles.backgroundStyle,
          ]}
          source={user.avatar}
          size={70}
        />
      ))}
      {badge}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    bottom: 40,
    right: -6,
    backgroundColor: 'white',
    borderRadius: 14,
    width: 28,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'purple',
    zIndex: 10,
  },
  foregroundStyle: { 
    zIndex: 2,
    borderWidth: 4,
    borderColor: '#fff',
  },
  backgroundStyle: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
    borderWidth: 4,
    borderColor: '#fff',
  },
});

export default AvatarGroup;
