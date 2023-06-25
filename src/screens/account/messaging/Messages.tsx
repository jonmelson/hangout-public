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

const Messages = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const { setCurrentChannel } = useChatContext();

  const filters = {
    members: { $in: [sessionId || ''] },
  };

  const onSelect = (chanel: Channel) => {
    setCurrentChannel(chanel);
    navigation.navigate('ChatRoom');
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerTitle: () => (
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            Messages
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          className="py-2 pr-4"
          onPress={() => navigation.navigate('Home')}>
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

  return <ChannelList onSelect={onSelect} filters={filters} />;
};

export default Messages;
