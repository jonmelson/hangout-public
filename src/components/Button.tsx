import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { ButtonProps } from '../utils/other';

const Button = (props: ButtonProps) => {
  const { onPress, title = 'Save', size = 20, padding = 16 } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={{
          fontSize: size,
          textAlign: 'center',
          color: 'black',
          padding: padding,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
