import React from 'react';
import { Text } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import { GradientTextProps } from '../utils/other';

const GradientText = (props: GradientTextProps) => {
  const { text, style } = props;
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>{text}</Text>
      }>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['#7000FF', '#B174FF']}>
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
