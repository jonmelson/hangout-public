import { useTheme } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Button,
  Text,
} from 'react-native';
import {
  AutoCompleteInput,
  FileUploadPreview,
  ImageUploadPreview,
  useMessageInputContext,
} from 'stream-chat-expo';
import { useChatContext } from '../../context/ChatContext';

import { MessageSendIcon, MessageImageIcon } from '../Icons';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fullWidth: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    height: 40,
    marginBottom: 2,
  },
  autocompleteContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    width: '100%',
  },
});

export const InputBox = () => {
  const { colors } = useTheme();
  const { currentChannel } = useChatContext();
  const { toggleAttachmentPicker, sendMessage, text } =
    useMessageInputContext();
  const { additionalTextInputProps: contextAdditionalTextInputProps } =
    useMessageInputContext();
  const [textHeight, setTextHeight] = useState(0);

  const additionalTextInputProps = useMemo(
    () => ({
      ...contextAdditionalTextInputProps,
      placeholder:
        currentChannel && currentChannel?.data?.name
          ? 'Message #' +
            currentChannel?.data.name.toLowerCase().replace(' ', '_')
          : 'Message...',
      placeholderTextColor: '#979A9A',
      style: [
        {
          color: colors.text,
          maxHeight: (textHeight || 17) * 4,
        },
        styles.autoCompleteInput,
      ],
    }),
    [currentChannel?.id, textHeight],
  );

  return (
    <View style={styles.fullWidth}>
      <ImageUploadPreview />
      <FileUploadPreview />
      <View
        className="flex flex-row justify-between items-center"
        style={[
          {
            backgroundColor: 'white',
            borderColor: '#808080',
            borderWidth: 0.5,
            borderRadius: 100,
            paddingHorizontal: 8,
            paddingVertical: 4,
          },
        ]}>
        <View className='pl-2 mb-1'>
          <AutoCompleteInput
            additionalTextInputProps={additionalTextInputProps}
          />
        </View>

        {text !== '' ? (
          <TouchableOpacity onPress={sendMessage}>
            <MessageSendIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleAttachmentPicker}>
            <MessageImageIcon />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
