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
        <Text className="text-xs font-bold text-black">
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
    <View className="flex flex-row items-center justify-center">
      {sortedUsers.slice(0, maxAvatars).map((user, index) => (
        <Avatar
          key={index}
          name={user.first_name + ' ' + user.last_name}
          style={[
            styles.avatar,
            {
              zIndex: maxAvatars - index,
              marginLeft: -48 * index,
              marginTop: -32 * index,
            },
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
  avatar: {
    borderWidth: 4,
    borderColor: '#fff',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    bottom: 5,
    right: 18,
    backgroundColor: 'white',
    borderRadius: 14,
    width: 32,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'purple',
    zIndex: 10,
  },
});

export default AvatarGroup;
