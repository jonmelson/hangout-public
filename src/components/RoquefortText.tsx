import React from 'react';
import { Text as DefaultText } from 'react-native';

import { useFonts } from 'expo-font';

const RoquefortText = (props: any) => {
  const [fontsLoaded] = useFonts({
    'Roquefort-Standard': require('../../assets/fonts/Roquefort/Roquefort-Standard.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <DefaultText
      {...props}
      style={[props.style, { fontFamily: 'Roquefort-Standard' }]}
    />
  );
};

export default RoquefortText;
