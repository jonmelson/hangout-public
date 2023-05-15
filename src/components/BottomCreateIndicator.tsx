import React from 'react';
import { View, Text } from 'react-native';

import { TabBarPlus14Icon, ChevronDownIcon } from './Icons';

const BottomCreateIndicator = () => {
  return (
    <View className="mt-12 flex flex-col items-center justify-center bg-gray-200 pb-2 pt-4">
      <View className="flex flex-row items-center justify-center space-x-1">
        <Text
          style={{
            fontSize: 16,
          }}
          className="text-center text-gray-500">
          Tap
        </Text>
        <TabBarPlus14Icon />
        <Text
          style={{
            fontSize: 16,
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
