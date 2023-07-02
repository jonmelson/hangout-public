import React from 'react';
import { Text as DefaultText } from 'react-native';

import { useFonts } from 'expo-font';

const RoquefortText = (props: any) => {
  const { fontType } = props;
  const [fontsLoaded] = useFonts({
    'Roquefort-Standard': require('../../assets/fonts/Roquefort/Roquefort-Standard.otf'),
    'Roquefort-Semi-Strong': require('../../assets/fonts/Roquefort/Roquefort-Semi-Strong.otf'),
    'Roquefort-Strong': require('../../assets/fonts/Roquefort/Roquefort-Strong.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <DefaultText {...props} style={[props.style, { fontFamily: fontType }]} />
  );
};

export default RoquefortText;
