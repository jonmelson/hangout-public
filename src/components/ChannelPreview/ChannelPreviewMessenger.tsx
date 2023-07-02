import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import {
  useTheme,
  useChannelPreviewDisplayName,
  useChannelsContext,
  ChannelAvatar,
  ChannelPreviewTitle,
} from 'stream-chat-expo';

import { formatLatestMessageDate } from '../../utils/utils';
import { TrashCan } from '../TrashCan';
import { Mute } from '../Mute';
import { Unmute } from '../Unmute';
import Avatar from '../Avatar';

import { ChannelPreviewStatus } from './ChannelPreviewStatus';
import { ChannelPreviewMessage } from './ChannelPreviewMessage';
import ChannelPreviewAvatar from './ChannelPreviewAvatar';
import ChannelPreviewLastestMessageAvatar from './ChannelPreviewLastestMessageAvatar';

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
});

export const ChannelPreviewMessenger = (props: any) => {
  const {
    channel,
    latestMessagePreview,
    PreviewAvatar = ChannelAvatar,
    PreviewMessage = ChannelPreviewMessage,
    PreviewStatus = ChannelPreviewStatus,
    PreviewTitle = ChannelPreviewTitle,
    unread,
  } = props;

  const {
    theme: {
      channelPreview: { container, contentContainer, row },
      colors: { border, white_snow, accent_red },
    },
  } = useTheme();

  const displayName = useChannelPreviewDisplayName(channel);
  const { onSelect } = useChannelsContext();

  const [muted, setMuted] = useState(channel.muteStatus().muted);

  const mute = useCallback(async () => {
    setMuted(true);
    await channel.mute();
  }, [channel]);

  const unmute = useCallback(async () => {
    setMuted(false);
    await channel.unmute();
  }, [channel]);

  const renderRightActions = useCallback(
    (_: any, dragX: any) => {
      const trans = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [0.7, 0],
      });

      return (
        <>
          <TouchableOpacity
            onPress={() => channel.delete()}
            style={[
              styles.actionContainer,
              { transform: [{ translateX: trans }] },
            ]}>
            <View
              style={[styles.actionButton, { backgroundColor: accent_red }]}>
              <TrashCan pathFill="white" height={21} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (muted ? unmute() : mute())}
            style={[
              styles.actionContainer,
              { transform: [{ translateX: trans }] },
            ]}>
            <View style={[styles.actionButton, { backgroundColor: '#4f4dc1' }]}>
              {muted ? (
                <Unmute pathFill="white" height={21} />
              ) : (
                <Mute pathFill="white" height={21} />
              )}
            </View>
          </TouchableOpacity>
        </>
      );
    },
    [accent_red, channel, mute, muted, unmute],
  );

  return (
    <TouchableOpacity
      onPress={() => {
        if (onSelect) {
          onSelect(channel);
        }
      }}
      style={[{ backgroundColor: 'white' }, container, styles.container]}
      testID="channel-preview-button">
      <View style={[styles.avatarContainer]}>
        <View style={[styles.circle, unread ? styles.circleFill : undefined]} />
        <ChannelPreviewAvatar channel={channel} />
      </View>

      <View
        style={[
          styles.contentContainer,
          contentContainer,
          { borderColor: border },
        ]}>
        <View style={[styles.row, row]}>
          <View style={[styles.title]}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: '#333333',
                marginBottom: 2,
              }}>
              {displayName}
            </Text>
          </View>

          <PreviewStatus
            channel={channel}
            formatLatestMessageDate={formatLatestMessageDate}
            latestMessagePreview={latestMessagePreview}
          />
        </View>

        <View className="flex flex-row items-center space-x-2">
          {latestMessagePreview &&
            latestMessagePreview.messageObject &&
            Object.keys(latestMessagePreview.messageObject).length !== 0 &&
            channel.data.type === 'livestream' && (
              <ChannelPreviewLastestMessageAvatar
                source={latestMessagePreview.messageObject.user.image}
                name={latestMessagePreview.messageObject.user.name}
                size={16}
              />
            )}
          <ChannelPreviewMessage latestMessagePreview={latestMessagePreview} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
