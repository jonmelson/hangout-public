import React, { useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { AvatarProps } from '../utils/other';

const HeaderAvatar = (props: AvatarProps) => {
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
          style={[{ width: size, height: size }, style]}
          className="items-center justify-center rounded-full">
          <Image
            source={{ uri: source }}
            style={[{ width: size, height: size }]}
            onLoadStart={handleImageLoadStart}
            onLoad={handleImageLoadEnd}
            className="items-center justify-center rounded-full"
            cachePolicy="none"
          />
          {isLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator color="purple" size="small" />
            </View>
          )}
        </View>
      ) : (
        <View
          style={[{ width: size, height: size }, style]}
          className="items-center justify-center rounded-full bg-gray-300">
          <Text className="text-black" style={[{ fontSize }]}>
            {initials}
          </Text>
        </View>
      )}
    </>
  );
};

export default HeaderAvatar;
