import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Avatar from './Avatar';

type User = {
  role: string;
  name: string;
  image: string;
};

type MessageAvatarGroupProps = {
  members: User[];
};

const MessageAvatarGroup = (props: MessageAvatarGroupProps) => {
  const { members } = props;
  let badge: React.ReactNode = null;

  if (members.length > 2) {
    badge = (
      <View style={styles.badge}>
        <Text className="text-xs text-black">
          {'+'}
          {members.length - 2}
        </Text>
      </View>
    );
  }

  // reorder the users array based on userId
  const sortedUsers = [...members];
  const userIndex = sortedUsers.findIndex(user => user.role === 'owner');

  if (userIndex !== -1) {
    const [user] = sortedUsers.splice(userIndex, 1);
    sortedUsers.unshift(user);
  }

  // calculate the maximum number of avatars to show
  const maxAvatars = sortedUsers.length > 1 ? 2 : 1;

  return (
    <View
      className={`relative flex pr-2 justify-center ${
        sortedUsers.length > 1 ? 'items-start' : 'items-center'
      }`}>
      {sortedUsers.slice(0, maxAvatars).map((user, index) => (
        <Avatar
          key={index}
          name={user.name}
          style={[
            index === 0 ? styles.foregroundStyle : styles.backgroundStyle,
          ]}
          source={user.image}
          size={28}
        />
      ))}
      {/* {badge} */}
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
    borderWidth: 2,
    borderColor: '#fff',
  },
  backgroundStyle: {
    position: 'absolute',
    top: -3,
    left: 5,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default MessageAvatarGroup;
