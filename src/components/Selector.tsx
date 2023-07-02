import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type SelectorProps = {
  leftTab: string;
  rightTab: string;
  activeTab: number;
  handleTabPress: (tabIndex: number) => void;
};

const Selector = (props: SelectorProps) => {
  const { leftTab, rightTab, activeTab, handleTabPress } = props;

  return (
    <View className="flex flex-row items-center justify-between">
      <TouchableOpacity className="w-1/2" onPress={() => handleTabPress(0)}>
        <Text
          className={`text-center ${activeTab === 0 ? 'font-semibold' : ''}`}>
          {leftTab}
        </Text>
        <View
          className={`${
            activeTab === 0
              ? 'mt-2 border border-violet-600'
              : 'mt-2 border border-gray-200'
          }`}></View>
      </TouchableOpacity>

      <TouchableOpacity className="w-1/2" onPress={() => handleTabPress(1)}>
        <Text
          className={`text-center ${activeTab === 1 ? 'font-semibold' : ''}`}>
          {rightTab}
        </Text>
        <View
          className={`${
            activeTab === 1
              ? 'mt-2 border border-violet-600'
              : 'mt-2 border border-gray-200'
          }`}></View>
      </TouchableOpacity>
    </View>
  );
};

export default Selector;
