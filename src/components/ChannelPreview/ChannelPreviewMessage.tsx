import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'stream-chat-expo';
import TimeDifference from '../TimeDifference';

const styles = StyleSheet.create({
  bold: { fontWeight: 'bold' },
  message: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#808080',
    justifyContent: 'center',
  },
});

export const ChannelPreviewMessage = ({ latestMessagePreview }: any) => {
  const {
    theme: {
      colors: { grey },
    },
  } = useTheme();

  const lastMessagePreview = latestMessagePreview.previews[1];

  return lastMessagePreview ? (
    <View
      className="flex flex-row"
      style={{ width: '70%', alignItems: 'center' }}>
      {latestMessagePreview &&
        latestMessagePreview.messageObject &&
        Object.keys(latestMessagePreview.messageObject).length !== 0 && (
          <>
            <View className="mr-1">
              <Text
                numberOfLines={1}
                style={[
                  styles.message,
                  lastMessagePreview.bold ? styles.bold : {},
                  { color: grey },
                ]}>
                {lastMessagePreview.text !== 'Empty message...'
                  ? lastMessagePreview.text
                  : null}
              </Text>
            </View>
            <View
              className="mr-1"
              style={{
                width: 2.5,
                height: 2.5,
                borderRadius: 50,
                backgroundColor: '#808080',
                justifyContent: 'center',
              }}></View>
            <TimeDifference
              timestamp={latestMessagePreview.messageObject.updated_at}
            />
          </>
        )}
    </View>
  ) : null;
};
