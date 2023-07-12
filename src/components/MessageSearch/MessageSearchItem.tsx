import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'stream-chat-expo';
import type { MessageResponse } from 'stream-chat';

import { MessagesChevronRightIcon } from '../Icons';
import TimeDifference from '../TimeDifference';
import MessageSearchAvatar from './MessageSearchAvatar';
import Avatar from '../Avatar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 8,
    paddingBottom: 5,
  },
  actionContainer: {
    flex: 1,
  },
  actionButton: {
    minWidth: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    height: 60,
    flex: 1,
    justifyContent: 'center',
  },
  avatarContainer: {
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '500', flex: 1, marginBottom: 3 },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 50,
    alignSelf: 'center',
    marginRight: 10,
  },
  circleFill: {
    backgroundColor: '#7000FF',
  },
  bold: { fontWeight: 'bold' },
  message: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#808080',
    justifyContent: 'center',
  },
});

type MessageSearchListProps = {
  item: MessageResponse;
  setChannelWithId: (channelId: string, messageId?: string) => Promise<void>;
};

export const MessageSearchItem: React.FC<MessageSearchListProps> = ({
  item,
  setChannelWithId,
}) => {
  const navigation = useNavigation();
  const {
    theme: {
      channelPreview: { container },
    },
  } = useTheme();

  return (
    <TouchableOpacity
      className="p-4"
      style={[container]}
      onPress={() => {
        if (item.channel?.id) {
          setChannelWithId(item.channel?.id, item.channel?.type, item.id);
        }
      }}>
      <View className="flex flex-row items-center justify-between space-x-4">
        <MessageSearchAvatar channel={item} />
        <View className="flex flex-1 flex-col space-y-2">
          <View>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              {item.user?.name}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            {item.channel?.type === 'livestream' &&
            item.user &&
            typeof item.user.image === 'string' &&
            typeof item.user.name === 'string' ? (
              <Avatar
                source={item.user.image}
                name={item.user.name}
                size={18}
              />
            ) : null}

            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#808080',
                marginLeft: item.channel?.type !== 'livestream' ? 0 : 6,
              }}>
              {item.text}
            </Text>
            <View
              className="h-0.5 w-0.5 rounded-full"
              style={{
                marginHorizontal: 4,
                backgroundColor: '#808080',
              }}></View>
            <TimeDifference timestamp={item.user?.created_at} />
          </View>
        </View>
        <View>
          <MessagesChevronRightIcon />
        </View>
      </View>
    </TouchableOpacity>
  );
};
