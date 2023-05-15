import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import {
  NewMessage14Icon,
  NewMessage22Icon,
  ChevronBackIcon,
} from '../../../components/Icons';

import SearchBar from '../../../components/SearchBar';

import { Channel } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';
import { useChatContext } from '../../../context/ChatContext';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Messages = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const { setCurrentChannel } = useChatContext();

  const onSelect = (chanel: Channel) => {
    setCurrentChannel(chanel);
    navigation.navigate('ChatRoom');
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Messages',
      headerShown: true,
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          className="flex flex-row items-center space-x-2"
          onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('NewMessages')}>
          <View className="items-center">
            <NewMessage22Icon />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return <ChannelList onSelect={onSelect} />;
};

export default Messages;
