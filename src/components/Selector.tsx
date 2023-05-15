import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type SelectorProps = {
  leftTab: string;
  middleTab: string;
  rightTab: string;
  activeTab: number;
  handleTabPress: (tabIndex: number) => void;
  showPast: boolean;
};

const Selector = (props: SelectorProps) => {
  const { leftTab, middleTab, rightTab, activeTab, handleTabPress, showPast } =
    props;
  
  
  return (
    <View
      className={`${
        showPast ? 'mx-24' : 'mx-10'
        } mt-16 flex flex-row items-center justify-between mb-2`}>
      

      <TouchableOpacity
        className={`w-${showPast ? '1/2' : '1/3'} p-2  ${
          activeTab === 0 ? 'rounded-full bg-violet-600' : ''
        }`}
        onPress={() => handleTabPress(0)}>
        <Text
          className={`text-center ${
            activeTab === 0 ? 'font-semibold text-white' : ''
          }`}>
          {leftTab}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-${showPast ? '1/2' : '1/3'} p-2 ${
          activeTab === 1 ? 'rounded-full bg-violet-600' : ''
        }`}
        onPress={() => handleTabPress(1)}>
        <Text
          className={`text-center ${
            activeTab === 1 ? 'font-semibold text-white' : ''
          }`}>
          {middleTab}
        </Text>
      </TouchableOpacity>

      {showPast && (
        <TouchableOpacity
          className={`w-1/3 p-2  ${
            activeTab === 2 ? 'rounded-full bg-violet-600' : ''
          }`}
          onPress={() => handleTabPress(2)}>
          <Text
            className={`text-center ${
              activeTab === 2 ? 'font-semibold text-white' : ''
            }`}>
            {rightTab}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Selector;
