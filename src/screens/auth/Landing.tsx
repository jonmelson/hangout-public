import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useFonts } from 'expo-font';

import GradientText from '../../components/GradientText';

import HangoutGradientLogo from '../../components/icons/HangoutGradientLogo';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationProps } from '../../utils/navigation';

const Landing = (props: NavigationProps) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    'Roquefort-Strong': require('../../../assets/fonts/Roquefort/Roquefort-Strong.otf'),
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
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <View className="mx-6 flex-1 justify-between">
        <View className="mt-8 items-center">
          <HangoutGradientLogo />
        </View>

        <View className="mx-4">
          <GradientText
            text="Real Friends, Real Life."
            style={{
              fontFamily: 'Roquefort-Strong',
              fontSize: 75,
              fontWeight: 'bold',
            }}
          />
        </View>

        <View className="mb-4 px-12">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignUpAuth');
            }}
            className="mb-4">
            <LinearGradient
              colors={['#7000FF', '#B174FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-[58px] w-full items-center justify-center rounded-full">
              <View className="flex flex-row items-center justify-center space-x-1">
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '500',
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    Sign Up
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LoginAuth');
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
                color: 'black',
              }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Landing;
