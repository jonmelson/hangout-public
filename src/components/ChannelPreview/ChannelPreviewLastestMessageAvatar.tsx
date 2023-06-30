import React, { useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { AvatarProps } from '../../utils/other';

const ChannelPreviewLastestMessageAvatar = (props: AvatarProps) => {
  const { source, name, size = 24, style } = props;
  const [isLoading, setIsLoading] = useState(true);

  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

  const fontSize = size * 0.4;

  const handleImageLoadStart = () => {
    setIsLoading(true);
  };

  const handleImageLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <>
      {source !== '' ? (
        <View
          style={[{ width: size, height: size, marginRight: 4 }, style]}
          className="items-center justify-center rounded-full">
          <Image
            source={{ uri: source }}
            style={[{ width: size, height: size }]}
            onLoadStart={handleImageLoadStart}
            onLoad={handleImageLoadEnd}
            className="items-center justify-center rounded-full"
            cachePolicy="none"
          />
        </View>
      ) : (
        <View
          style={[{ width: size, height: size, marginRight: 4 }, style]}
          className="items-center justify-center rounded-full bg-gray-300">
          <Text className="text-black" style={[{ fontSize }]}>
            {initials}
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 4,
    borderColor: '#fff',
    position: 'relative',
  },
});

export default ChannelPreviewLastestMessageAvatar;
