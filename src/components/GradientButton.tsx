import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Ionicons } from './Icons';

import { LinearGradient } from 'expo-linear-gradient';

import { GradientButtonProps } from '../utils/other';

const GradientButton = (props: GradientButtonProps) => {
  const {
    onPress,
    title = 'Save',
    size = 20, 
    disabled = true,
    iconName,
    iconSize = 25,
    iconColor = 'white',
  } = props;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={['#7000FF', '#B174FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ 
          opacity: disabled ? 0.2 : 1,
        }}
        className="rounded-full h-12 items-center justify-center">
        <View className="flex flex-row items-center justify-center space-x-1">
          <View>
            <Text
              style={{
                fontSize: size,
                textAlign: 'center',
                color: 'white',
              }}>
              {title}
            </Text>
          </View>

          {iconName && (
            <View>
              <Ionicons name={iconName} size={iconSize} color={iconColor} />
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
