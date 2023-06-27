import { useTheme } from '@react-navigation/native';
import Dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useMessageContext } from 'stream-chat-expo';
import { useChatContext } from '../../context/ChatContext';

export const MessageHeader = () => {
  const { message } = useMessageContext();
  const { chatClient } = useChatContext();

  return (
    <View>
      {message && (
        <>
          {message.user?.id !== chatClient?.userID ? (
            <View>
              <Text style={{ fontSize: 12, color: '#808080' }}>
                {message.user?.name}
              </Text>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  header: {
    paddingLeft: 2,
  },
  messageDate: {
    color: 'grey',
    fontSize: 10,
    marginLeft: 6,
  },
  messageUserName: {
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    fontWeight: '900',
  },
  userBar: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
});
