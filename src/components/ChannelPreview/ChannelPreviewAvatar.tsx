import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Avatar from '../Avatar';

type ChannelPreviewAvatarProps = {
  channel: any;
};

const ChannelPreviewAvatar = (props: ChannelPreviewAvatarProps) => {
  const { channel } = props;
  const [members, setMembers] = useState<
    { role: string; image: string; name: string }[]
  >([]);

  const queryMembers = async (channel: any) => {
    let sort = { created_at: -1 };
    const query = await channel.queryMembers({}, sort, {});
    const tempMembers = query.members.map((obj: any) => ({
      role: obj.role,
      image: obj.user.image,
      name: obj.user.name,
    }));

    setMembers(tempMembers);
  };

  useEffect(() => {
    if (channel) {
      queryMembers(channel);
    }
  }, [channel]);

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
      {members.length == 1 && (
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
          className={`relative flex justify-center pr-2 ${
            sortedUsers.length > 1 ? 'items-start' : 'items-center'
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
                  size={44}
                />
              ))}
          {badge}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    bottom: -10,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 25,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7000FF',
    zIndex: 10,
    fontSize: 10,
  },
  foregroundStyle: {
    zIndex: 2,
    borderWidth: 10,
    top: 5,
    right: 3,
    borderColor: '#fff',
  },
  backgroundStyle: {
    position: 'absolute',
    top: -5,
    left: 13,
    zIndex: 1,
    borderWidth: 4,
    borderColor: '#fff',
  },
});

export default ChannelPreviewAvatar;
