import React, { createContext, useContext, useEffect, useState } from 'react';

import { StreamChat, Channel } from 'stream-chat';
import { OverlayProvider, Chat, ThemeProvider } from 'stream-chat-expo';

import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

import { STREAM_API_KEY } from '@env';

type ChatContextType = {
  chatClient?: StreamChat;
  currentChannel?: Channel;
  setCurrentChannel: (channel: Channel) => void;
  startDMChatRoom: (chatWithUser: any) => Promise<void>;
  startGroupChatRoom: (
    hangoutId: any,
    userId: any,
    hangoutName: any,
    // hangoutImage?: any,
  ) => Promise<void>;
  navigateToGroupChatRoom: (hangoutId: any) => Promise<void>;
  joinGroupChatRoom: (hangoutId: any, userId: any) => Promise<void>;
  // joinGroupChatRoom: (hangoutId: any, userId: any, name: any) => Promise<void>;
  updateGroupChatRoomName: (hangoutId: any, newName: any) => Promise<void>;
  updateUserImage: (userId: any, image: any) => Promise<void>;
  updateUserName: (userId: any, name: any) => Promise<void>;
  setChannelWithId: (
    channelId: string,
    channelType: string,
    messageId?: string,
  ) => Promise<void>;
};

export const ChatContext = createContext<ChatContextType>({
  chatClient: undefined,
  currentChannel: undefined,
  setCurrentChannel: (channel: Channel | undefined) => {},
  startDMChatRoom: async (chatWithUser: any) => {},
  startGroupChatRoom: async (
    hangoutId: any,
    userId: any,
    hangoutName: any,
    // hangoutImage: any,
  ) => {},
  navigateToGroupChatRoom: async (hangoutId: any) => {},
  joinGroupChatRoom: async (hangoutId: any, userId: any) => {},
  // joinGroupChatRoom: async (hangoutId: any, userId: any, name: any) => {},
  updateGroupChatRoomName: async (hangoutId: any, newName: any) => {},
  updateUserImage: async (userId: any, image: any) => {},
  updateUserName: async (userId: any, name: any) => {},
  setChannelWithId: async (
    channelId: any,
    channelType: any,
    messageId: any,
  ) => {},
});

export function ChatContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = useNavigation();
  const [chatClient, setChatClient] = useState<StreamChat>();
  const [currentChannel, setCurrentChannel] = useState<Channel>();

  const getSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.log(error);
      }

      if (session?.user.id) {
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session?.user.id);

        if (error) {
          console.log(error);
          return null;
        }

        return user[0]; // Assuming the query returns an array with a single user object
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  useEffect(() => {
    const init = async () => {
      const user = await getSession();

      const client = StreamChat.getInstance(STREAM_API_KEY);

      if (user) {
        await client.connectUser(
          {
            id: user.id,
            name: user.first_name + ' ' + user.last_name,
            image: user.avatar,
          },
          client.devToken(user.id),
        );

        // Don't show if the user is online or offline
        await client.upsertUser({
          id: user.id,
          invisible: true,
        });

        setChatClient(client);
      }
    };

    init();
  }, []);

  useEffect(() => {
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [chatClient]);

  const startDMChatRoom = async (chatWithUser: any) => {
    if (!chatClient) {
      return;
    }

    const newChannel = chatClient.channel('messaging', {
      members: [chatClient.userID, chatWithUser.id],
    });

    setCurrentChannel(newChannel);

    await newChannel.watch();

    navigation.navigate('ChatRoom');
  };

  const startGroupChatRoom = async (
    hangoutId: any,
    userId: any,
    hangoutName: any,
    // hangoutImage?: any,
  ) => {
    if (!chatClient) {
      return;
    }

    const channelId = `room-${hangoutId}`;
    const eventChannel = chatClient.channel('livestream', channelId, {
      name: hangoutName,
      members: [userId],
      // image: hangoutImage,
    });

    await eventChannel.watch();
  };

  const navigateToGroupChatRoom = async (hangoutId: any) => {
    if (!chatClient) {
      return;
    }

    const channelId = `room-${hangoutId}`;
    const eventChannel = chatClient.channel('livestream', channelId);

    await eventChannel.watch();
    setCurrentChannel(eventChannel);

    navigation.replace('ChatRoom');
  };

  // const joinGroupChatRoom = async ( hangoutId: any, userId: any, name: any ) =>
  // {
  const joinGroupChatRoom = async (hangoutId: any, userId: any, name: any) => {
    if (!chatClient) {
      return;
    }

    const channelId = `room-${hangoutId}`;
    // console.log(channelId, hangoutId, userId);
    const eventChannel = chatClient.channel('livestream', channelId);
    await eventChannel.addMembers([userId], { text: `${name} is Going.` });
    // await eventChannel.watch({ watchers: { limit: 100 } });
    // setCurrentChannel(eventChannel);

    // navigation.replace('MessagesStack', { screen: 'ChatRoom' });
  };

  const updateGroupChatRoomName = async (hangoutId: any, newName: any) => {
    if (!chatClient) {
      return;
    }

    const channelId = `room-${hangoutId}`;
    // console.log(channelId, hangoutId, userId);
    const eventChannel = chatClient.channel('livestream', channelId);
    await eventChannel.updatePartial({ set: { name: newName } });

    // await eventChannel.watch({ watchers: { limit: 100 } });
    // setCurrentChannel(eventChannel);

    // navigation.replace('MessagesStack', { screen: 'ChatRoom' });
  };

  const updateUserImage = async (userId: any, image: any) => {
    if (!chatClient) {
      return;
    }

    const update = {
      id: userId,
      set: {
        image: image,
      },
    };

    await chatClient.partialUpdateUser(update);
  };

  const updateUserName = async (userId: any, name: any) => {
    if (!chatClient) {
      return;
    }

    const update = {
      id: userId,
      set: {
        name: name,
      },
    };

    await chatClient.partialUpdateUser(update);
  };

  const setChannelWithId = async (
    channelId: any,
    channelType: any,
    messageId: any,
  ) => {
    if (!chatClient) {
      return;
    }
    // console.log(channelId, channelType, messageId);

    const eventChannel = chatClient.channel(channelType, channelId);

    await eventChannel.watch();
    setCurrentChannel(eventChannel);

    navigation.navigate('ChatRoom');
  };

  if (!chatClient) {
    return null;
  }

  const value = {
    chatClient,
    currentChannel,
    setCurrentChannel,
    startDMChatRoom,
    startGroupChatRoom,
    navigateToGroupChatRoom,
    joinGroupChatRoom,
    updateGroupChatRoomName,
    setChannelWithId,
    updateUserImage,
    updateUserName,
  };

  return (
    <OverlayProvider value={{ style: theme }}>
      <Chat client={chatClient}>
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
      </Chat>
    </OverlayProvider>
  );
}

export const useChatContext = () => useContext(ChatContext);
