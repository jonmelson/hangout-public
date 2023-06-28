import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { ChevronBackIcon, MoreIcon } from '../../../components/Icons';

import { useActionSheet } from '@expo/react-native-action-sheet';
import { useChatContext } from '../../../context/ChatContext';
import Avatar from '../../../components/Avatar';
import {
  Channel,
  MessageList,
  MessageInput,
  useMessagesContext,
  useMessageContext,
  useChannelContext,
  Colors,
  Sound,
} from 'stream-chat-expo';

import MessageAvatarGroup from '../../../components/MessageAvatarGroup';

import { MessageHeader } from '../../../components/Channel/MessageHeader';

import {
  InlineDateSeparator,
  InputButtons,
  SendButton,
  InputBox,
} from '../../../components/Channel';
import { myMessageTheme } from '../../../theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const { currentChannel, chatClient } = useChatContext();
  const { message } = useMessageContext();
  const [memberName, setMemberName] = useState('');
  const [memberImage, setMemberImage] = useState('');
  const [groupInfo, setGroupInfo] = useState();

  const insets = useSafeAreaInsets();

  const MyEmptyComponent = () => null;
  const handleDeleteChannel = async () => {
    await currentChannel?.hide();
    navigation.navigate('Messages');
  };

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
          onPress: handleDeleteChannel,
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

  const queryMembers = async (channel: any) => {
    if (memberName !== '' || !groupInfo) {
      let sort = { created_at: -1 };
      const query = await channel.queryMembers({}, sort, {});
      const members = query.members;

      if (channel.data.type === 'messaging') {
        const memberName = members
          .filter((obj: any) => obj.role === 'member')
          .map((obj: any) => obj.user.name);
        const memberImage = members
          .filter((obj: any) => obj.role === 'member')
          .map((obj: any) => obj.user.image);

        setMemberName(memberName[0]);
        setMemberImage(memberImage[0]);
      } else if (channel.data.type === 'livestream') {
        const group = members.map((obj: any) => ({
          role: obj.role,
          image: obj.user.image,
          name: obj.user.name,
        }));
        setGroupInfo(group);
      }
    }
  };

  useEffect(() => {
    if (currentChannel) {
      queryMembers(currentChannel);
    }

    navigation.setOptions({
      title: '',
      headerShown: true,
      headerShadowVisible: true,
      headerLeft: () => (
        <TouchableOpacity
          className="flex flex-row items-center space-x-2 py-2 pr-4"
          onPress={() => navigation.navigate('Messages')}>
          <ChevronBackIcon />

          {currentChannel?.data?.type === 'messaging' &&
            memberName &&
            memberImage && (
              <View className="flex flex-row items-center justify-center space-x-2">
                <Avatar source={memberImage} name={memberName} />
                <Text style={{ fontSize: 16, fontWeight: '600' }}>
                  {memberName}
                </Text>
              </View>
            )}

          {currentChannel?.data?.type === 'livestream' && groupInfo && (
            <View className="flex flex-row items-center justify-center space-x-2">
              <MessageAvatarGroup members={groupInfo} />
              <Text className="font-semibold">
                {currentChannel?.data?.name}
              </Text>
            </View>
          )}
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
  }, [currentChannel, memberName, memberImage, groupInfo]);

  if (!currentChannel) {
    // Render a loading state or handle the case when currentChannel is undefined
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ paddingBottom: insets.bottom, backgroundColor: 'white' }}>
      <Channel
        myMessageTheme={myMessageTheme}
        channel={currentChannel}
        DateHeader={MyEmptyComponent}
        Input={InputBox}
        MessageFooter={MyEmptyComponent}
        MessageHeader={MessageHeader}>
        <MessageList InlineDateSeparator={InlineDateSeparator} />

        <MessageInput />
      </Channel>
    </View>
  );
};

export default ChatRoom;
