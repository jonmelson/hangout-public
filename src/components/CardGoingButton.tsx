import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { TabBarGoingIcon, GoingButtonPlusIcon } from './Icons';

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import { GoingButtonProps } from '../utils/other';

const CardGoingButton = (props: GoingButtonProps) => {
  const { onPress, isGoing } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      {isGoing ? (
        <LinearGradient
          colors={['#7000FF', '#B174FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-[48px] w-full items-center justify-center rounded-full">
          <View className="flex flex-row items-center justify-center space-x-2">
            <TabBarGoingIcon name="going-outline" color="white" />
            <Text style={{ fontSize: 20, color: 'white', fontWeight: '500' }}>
              Going
            </Text>
          </View>
        </LinearGradient>
      ) : (
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
            className="flex h-[48px] flex-row items-center justify-center space-x-2"
            style={{
              borderRadius: 50,
              backgroundColor: 'white',
            }}>
            <GoingButtonPlusIcon />
            <MaskedView
              maskElement={
                <Text
                  style={{
                    backgroundColor: 'transparent',
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Going
                </Text>
              }>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={['#7000FF', '#B174FF']}>
                <Text style={{ opacity: 0, fontSize: 20, fontWeight: '500' }}>
                  Going
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default CardGoingButton;
