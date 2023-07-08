import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Avatar from '../Avatar';
import { useChatContext } from '../../context/ChatContext';

type MessageSearchAvatarProps = {
  channel: any;
};

const MessageSearchAvatar = (props: MessageSearchAvatarProps) => {
  const { channel } = props;
  const { chatClient } = useChatContext();
  const [members, setMembers] = useState<
    { role: string; image: string; name: string }[]
  >([]);

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
    <>
      <Avatar source={channel.user.image} name={channel.user.name} size={52} />

      {/* {members.length == 1 && (
        <Avatar source={members[0].image} name={members[0].name} size={52} />
      )}

      {members.length === 2 && channel.data.type === 'messaging' && (
        <Avatar
          source={members.filter(item => item.role === 'member')[0].image}
          name={members.filter(item => item.role === 'member')[0].name}
          size={52}
        />
      )}
      {members.length >= 2 && channel.data.type === 'livestream' && (
        <View
          className={`relative flex justify-center pr-4  ${
            sortedUsers.length > 1 ? 'items-start pr-0' : 'items-center'
          }`}>
          {members &&
            sortedUsers
              .slice(0, maxAvatars)
              .map((user, index) => (
                <Avatar
                  key={index}
                  name={user.name}
                  style={[
                    index === 0
                      ? styles.foregroundStyle
                      : styles.backgroundStyle,
                  ]}
                  source={user.image}
                  size={52}
                />
              ))}
          {badge}
        </View>
      )} */}
    </>
  );

  return null;
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    bottom: 0,
    right: -6,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7000FF',
    zIndex: 10,
  },
  foregroundStyle: {
    zIndex: 2,
    top: 1,
    right: 3,
  },
  backgroundStyle: {
    position: 'absolute',
    top: -5,
    left: 5,
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default MessageSearchAvatar;
