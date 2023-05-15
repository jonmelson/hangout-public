import React from 'react';
import { View } from 'react-native';

import { useFonts } from 'expo-font';

import Button from '../../components/Button';
import GradientText from '../../components/GradientText';
import GradientButton from '../../components/GradientButton';

import HangoutGradientLogo from '../../components/icons/HangoutGradientLogo';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationProps } from '../../utils/navigation';

const Landing = (props: NavigationProps) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    'Roquefort-Standard': require('../../../assets/fonts/Roquefort/Roquefort-Standard.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',

        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <View className="mx-6 flex-1 justify-between">
        <View className="mt-4 items-center">
          <HangoutGradientLogo />
        </View>

        <GradientText
          text="Real Friends, Real Life."
          style={{ fontFamily: 'Roquefort-Standard', fontSize: 72 }}
        />

        <View className="px-12">
          <GradientButton
            onPress={() => {
              navigation.navigate('SignUpAuth');
            }}
            title="Sign Up"
            size={20}
            padding={16}
            disabled={false}
          />
          <Button
            onPress={() => {
              navigation.navigate('LoginAuth');
            }}
            title="Login"
            size={20}
            padding={16}
          />
        </View>
      </View>
    </View>
  );
};

export default Landing;
