import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { StreamChat, Channel } from 'stream-chat';
import { OverlayProvider, Chat } from 'stream-chat-expo';

import { supabase } from '../lib/supabase';

import { STREAM_API_KEY } from '@env';

import { useNavigation } from '@react-navigation/native';

type ChatContextType = {
  currentChannel?: Channel;
  setCurrentChannel: (channel: Channel) => void;
  startDMChatRoom: (chatWithUser: any) => Promise<void>;
};

export const ChatContext = createContext<ChatContextType>({
  currentChannel: undefined,
  setCurrentChannel: (channel: Channel | undefined) => {},
  startDMChatRoom: async (chatWithUser: any) => {},
});

const myMessageTheme = {
  messageSimple: {
    content: {
      textContainer: {
        backgroundColor: '#7000FF',
      },
      markdown: {
        text: {
          color: 'white',
        },
      },
    },
  },
};

const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
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
            name: user.username,
            image: user.avatar,
          },
          client.devToken(user.id),
        );
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

    await newChannel.watch();
    setCurrentChannel(newChannel);

    navigation.replace('MessagesStack', { screen: 'ChatRoom' });
  };

  if (!chatClient) {
    return <ActivityIndicator />;
  }

  const value = {
    chatClient,
    currentChannel,
    setCurrentChannel,
    startDMChatRoom,
  };

  return (
    <OverlayProvider value={{ style: myMessageTheme }}>
      <Chat client={chatClient}>
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
      </Chat>
    </OverlayProvider>
  );
};

export const useChatContext = () => useContext(ChatContext);

export default ChatContextProvider;
