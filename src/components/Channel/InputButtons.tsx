import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, useMessageInputContext } from 'stream-chat-expo';

import { Camera } from '../Camera';
import { MessageImageIcon } from '../Icons';

const styles = StyleSheet.create({
  attachButtonContainer: { paddingHorizontal: 5 },
});

export const InputButtons = () => {
  const {
    giphyActive,
    hasCommands,
    hasFilePicker,
    hasImagePicker,
    toggleAttachmentPicker,
  } = useMessageInputContext();

  const {
    theme: {
      colors: { grey },
      messageInput: { attachButtonContainer },
    },
  } = useTheme();
  if (giphyActive) {
    return null;
  }

  return (
    <>
      {(hasImagePicker || hasFilePicker) && (
        <View
          style={[
            hasCommands ? styles.attachButtonContainer : undefined,
            attachButtonContainer,
          ]}>
          <TouchableOpacity onPress={toggleAttachmentPicker}>
            <MessageImageIcon />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
