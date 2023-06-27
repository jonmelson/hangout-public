import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NewMessage14Icon } from './Icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EmptyMessageStateIndicator = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 items-center justify-center text-center"
      style={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 4,
        paddingRight: insets.right + 4,
        backgroundColor: 'white',
      }}>
      <Text
        style={{
          color: '#808080',
          fontWeight: '500',
          fontSize: 16,
          textAlign: 'center',
          alignItems: 'center',
          lineHeight: 22,
        }}>
        No messages to show. Tap <NewMessage14Icon /> to begin the conversation.
      </Text>
    </View>
  );
};

export default EmptyMessageStateIndicator;
