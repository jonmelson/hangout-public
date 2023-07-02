import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

type CardEditDetailsButtonProps = {
  onPress: () => void;
};

const CardEditDetailsButton = (props: CardEditDetailsButtonProps) => {
  const { onPress } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#7000FF', '#B174FF']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 50,
          overflow: 'hidden',
          padding: 1,
        }}
        className="w-full rounded-full">
        <View
          className="flex h-[48px] flex-row items-center justify-center space-x-2 rounded-full"
          style={{
            borderRadius: 50,
            backgroundColor: 'white',
          }}>
          <MaskedView
            maskElement={
              <Text
                style={{
                  backgroundColor: 'transparent',
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                Edit details
              </Text>
            }>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#7000FF', '#B174FF']}>
              <Text style={{ opacity: 0, fontSize: 16, fontWeight: '500' }}>
                Edit details
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CardEditDetailsButton;
