import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { CloseIconGray } from '../../components/Icons';
import { LinearGradient } from 'expo-linear-gradient';

import MessageFeedbackIcon18 from '../../components/icons/MessageFeedbackIcon18';
import RoquefortText from '../../components/RoquefortText';
import MaleTechnologist from '../../components/icons/MaleTechnologist';

const FeedbackPopup = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: {
    params?: {
      sessionId?: string;
    };
  };
}) => {
  const { sessionId } = route?.params ?? {};

  useEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
    });
  }, [sessionId]);

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('HomeStack');
        }}
        className="absolute right-4 top-4 z-50">
        <CloseIconGray />
      </TouchableOpacity>

      <View className="flex-1 flex-col items-center justify-center space-y-4 px-4">
        <MaleTechnologist />
        <RoquefortText
          className="text-center text-2xl"
          fontType="Roquefort-Standard">
          We’re in testing mode!
        </RoquefortText>

        <View className="flex flex-col space-y-0.5">
          <Text
            className="flex items-center text-center"
            style={{ fontSize: 16, fontWeight: '500', color: '#808080' }}>
            Welcome to hangout! We would love your
          </Text>
          <View className="flex flex-row items-center justify-center space-x-1">
            <Text
              className="flex items-center text-center"
              style={{ fontSize: 16, fontWeight: '500', color: '#808080' }}>
              feedback - Tap
            </Text>
            <MessageFeedbackIcon18 />
            <Text
              className="flex items-center text-center"
              style={{ fontSize: 16, fontWeight: '500', color: '#808080' }}>
              on the home screen to
            </Text>
          </View>
          <Text
            className="flex items-center text-center"
            style={{ fontSize: 16, fontWeight: '500', color: '#808080' }}>
            give us feedback and ideas!
          </Text>
        </View>

        <Text
          className="text-center"
          style={{ fontSize: 16, fontWeight: '500', color: '#808080' }}>
          Thanks for your support!
        </Text>
      </View>

      <View className="w-full justify-end px-4">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HomeStack');
          }}>
          <LinearGradient
            colors={['#7000FF', '#B174FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-12 items-center justify-center rounded-full">
            <View className="flex flex-row items-center justify-center space-x-1">
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '500',
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  Continue
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackPopup;
