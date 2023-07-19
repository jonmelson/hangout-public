import React from 'react';
import { View, Text } from 'react-native';

import { TabBarPlus14Icon, ChevronDownIcon } from './Icons';

const BottomCreateIndicator = () => {
  return (
    <View className="flex flex-col items-center justify-center  pb-2 pt-4 absolute bottom-0 w-full">
      <View className="flex flex-row items-center justify-center space-x-1">
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
          }}
          className="text-center text-gray-500">
          Tap
        </Text>
        <TabBarPlus14Icon />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
          }}
          className="text-center text-gray-500">
          to create your first hangout
        </Text>
      </View>
      <View>
        <ChevronDownIcon />
      </View>
    </View>
  );
};

export default BottomCreateIndicator;
