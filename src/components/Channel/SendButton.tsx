import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import {
  SendButtonProps,
  useMessageInputContext,
  useTheme,
  SendUp,
} from 'stream-chat-expo';

import { MessageSendIcon, MessageImageIcon } from '../Icons';
import { InputButtons } from './InputButtons';

const styles = StyleSheet.create({
  attachButtonContainer: { paddingHorizontal: 5 },
} );

/**
 * UI Component for send button in MessageInput component.
 */
export const SendButton = (props: SendButtonProps) => {
  const { sendMessage } = useMessageInputContext();

  const { disabled = false } = props;

  const {
    theme: {
      colors: { ios_green },
      messageInput: { sendButton },
    },
  } = useTheme();

  return (
    <>
      {disabled ? (
        <InputButtons/>
      ) : (
        <TouchableOpacity
          disabled={disabled}
          onPress={sendMessage}
          style={[sendButton]}
          testID="send-button">
          <MessageSendIcon />
        </TouchableOpacity>
      )}
    </>
  );
};
