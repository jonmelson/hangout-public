import React, { useEffect } from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronBackIcon, ArrowUpRightIcon } from '../../../components/Icons';

import { openBrowserAsync } from 'expo-web-browser';
import { TERMS_OF_USE, PRIVACY_POLICY } from '@env';

const About = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    navigation.setOptions({ 
      headerShown: true,
      headerShadowVisible: false,
      headerTitle: () => (
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            About
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex-1">
      <View className="flex flex-col space-y-2">
        <View className="flex flex-col rounded-b-xl bg-white">
          <TouchableOpacity
            className=""
            onPress={() => openBrowserAsync(PRIVACY_POLICY)}>
            <View className="flex flex-row items-center justify-between p-3">
              <View className="flex flex-row items-center space-x-2">
                <Text>Privacy Policy</Text>
              </View>
              <View>
                <ArrowUpRightIcon />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className=""
            onPress={() => openBrowserAsync(TERMS_OF_USE)}>
            <View className="flex flex-row items-center justify-between p-3">
              <View className="flex flex-row items-center space-x-2">
                <Text>Terms of Use</Text>
              </View>
              <View>
                <ArrowUpRightIcon />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default About;
