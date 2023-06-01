import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { ChevronBackIcon, MoreIcon } from '../../../components/Icons';

import { useActionSheet } from '@expo/react-native-action-sheet';
import { useChatContext } from '../../../context/ChatContext';
import { Channel, MessageList, MessageInput } from 'stream-chat-expo';

const ChatRoom = ({
  navigation,
}: // route,
{
  navigation: any;
  // route?: { params?: { username?: string } };
}) => {
  // const { username } = route?.params ?? {};
  // console.log(username);
  // const { sessionId, user } = route?.params ?? {};
  // const fullName = user.first_name + ' ' + user.last_name;
  const { showActionSheetWithOptions } = useActionSheet();

  const { currentChannel } = useChatContext();

  const showAlert = () => {
    Alert.alert(
      'Delete?',
      'Are you sure you want to delete this group message?',
      [
        {
          text: 'Cancel',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => console.log('Confirm'),
        },
      ],
      { cancelable: false },
    );
  };

  const handleMorePress = () => {
    const options = ['Open details', 'Delete conversation', 'Cancel'];

    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: 1,
      },
      selectedIndex => {
        switch (selectedIndex) {
          case 0:
            // Open details
            console.log('Open details');
            break;
          case 1:
            // Delete conversation

            showAlert();
            break;

          case cancelButtonIndex:
            // Canceled
            console.log('Cancel');
            break;

          default:
            break;
        }
      },
    );
  };



  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerShown: true,
      headerShadowVisible: true,
      headerLeft: () => (
        <TouchableOpacity
          className="flex flex-row items-center space-x-2 py-2 pr-4"
          onPress={() => navigation.navigate('Messages')}>
          <ChevronBackIcon />
          <Text className="font-semibold">{currentChannel?.data?.name}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleMorePress}>
          <View className="items-center">
            <MoreIcon />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [currentChannel?.data?.name]);

  if (!currentChannel) {
    // Render a loading state or handle the case when currentChannel is undefined
    return <Text>Loading...</Text>;
  }

  return (
    <Channel channel={currentChannel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
};

export default ChatRoom;
