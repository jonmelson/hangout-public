import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'stream-chat-expo';
import { Right } from '../Right';
import { MessagesChevronRightIcon } from '../Icons';

const styles = StyleSheet.create({
  date: {
    fontSize: 12,
    marginLeft: 2,
    marginRight: 5,
    textAlign: 'right',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  svg: {
    maxWidth: 16,
    maxHeight: 16,
  },
});

export const ChannelPreviewStatus = React.memo(
  ({ formatLatestMessageDate, latestMessagePreview }: any) => {
    const {
      theme: {
        channelPreview: { date },
        colors: { grey },
      },
    } = useTheme();

    return (
      <View style={styles.flexRow}>
        <MessagesChevronRightIcon />
      </View>
    );
  },
);
