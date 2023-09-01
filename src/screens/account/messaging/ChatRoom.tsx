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
import { supabase } from '../../../lib/supabase';

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
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  // const { username } = route?.params ?? {};
  // console.log(username);
  const { sessionId } = route?.params ?? {};
  // const fullName = user.first_name + ' ' + user.last_name;
  const { showActionSheetWithOptions } = useActionSheet();

  const { currentChannel, chatClient } = useChatContext();
  const { message } = useMessageContext();
  const [ownerId, setOwnerId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberImage, setMemberImage] = useState('');
  const [groupInfo, setGroupInfo] = useState();

  const insets = useSafeAreaInsets();

  const MyEmptyComponent = () => null;
  const handleDeleteChannel = async () => {
    await currentChannel?.hide();
    navigation.navigate('Messaging');
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

  const fetchData = async (id: string) => {
    let { data: hangoutData, error: hangoutError } = await supabase
      .from('hangouts')
      .select('*')
      .eq('id', id);

    let { data: goingIds, error: goingError } = await supabase
      .from('is_going')
      .select('user_id')
      .eq('hangout_id', id);

    if (goingIds && hangoutData) {
      const { data: goingMetaData, error } = await supabase
        .from('users')
        .select('*')
        .in(
          'id',
          goingIds.map(going => going.user_id),
        );

      navigation.navigate('Details', {
        going: goingMetaData,
        id: hangoutData?.[0]?.id,
        user_id: hangoutData?.[0]?.user_id,
        title: hangoutData?.[0]?.title,
        details: hangoutData?.[0]?.details,
        location: hangoutData?.[0]?.location,
        starts: hangoutData?.[0]?.starts,
        ends: hangoutData?.[0]?.ends,
        created_at: hangoutData?.[0]?.created_at,
        sessionId: sessionId,
      });
    }
  };

  const handleMorePress = () => {
    const options = ['Open details', 'Delete conversation', 'Cancel'];

    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: 1,
        tintColor: '#333',
      },
      selectedIndex => {
        switch (selectedIndex) {
          case 0:
            // Open details
            const inputString: unknown = currentChannel?.data?.id;

            if (typeof inputString === 'string') {
              const splitArray = (inputString as string).split('room-');

              if (splitArray.length > 1) {
                const filteredString = splitArray[1];
                fetchData(filteredString);
              } else {
                console.log('Delimiter not found in the input string.');
              }
            } else {
              console.log('Invalid input string type.');
            }

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

  const handleMoreProfilePress = () => {
    const options = ['Open profile', 'Delete conversation', 'Cancel'];

    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: 1,
        tintColor: '#333',
      },
      selectedIndex => {
        switch (selectedIndex) {
          case 0:
            // Open details
            navigation.replace('PublicProfile', {
              userId: memberId,
              sessionId: ownerId,
            });
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
        const memberId = members
          .filter((obj: any) => obj.role === 'member')
          .map((obj: any) => obj.user.id);
        const memberName = members
          .filter((obj: any) => obj.role === 'member')
          .map((obj: any) => obj.user.name);
        const memberImage = members
          .filter((obj: any) => obj.role === 'member')
          .map((obj: any) => obj.user.image);
        const ownerId = members
          .filter((obj: any) => obj.role === 'owner')
          .map((obj: any) => obj.user.id);

        setMemberId(memberId[0]);
        setMemberName(memberName[0]);
        setMemberImage(memberImage[0]);
        setOwnerId(ownerId[0]);
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
          onPress={() => navigation.navigate('Messaging')}>
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
        <TouchableOpacity
          onPress={
            currentChannel?.data?.type === 'messaging'
              ? handleMoreProfilePress
              : handleMorePress
          }>
          <View className="items-center">
            <MoreIcon />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [currentChannel, memberId, memberName, memberImage, ownerId, groupInfo]);

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
