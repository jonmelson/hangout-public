import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import {
  NewMessage14Icon,
  NewMessage22Icon,
  ChevronBackIcon,
} from '../../../components/Icons';

import { MessageSearchList } from '../../../components/MessageSearch';

import { SearchContext } from '../../../context/SearchContext';

import { Channel, ChannelSort } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';
import { useChatContext } from '../../../context/ChatContext';
import EmptyMessageStateIndicator from '../../../components/EmptyMessageStateIndicator';

import { ChannelPreviewMessenger } from '../../../components/ChannelPreview';

const additionalFlatListProps = {
  keyboardDismissMode: 'on-drag' as const,
  getItemLayout: (_: any, index: number) => ({
    index,
    length: 65,
    offset: 65 * index,
  }),
};

const options = {
  presence: true,
  state: true,
  watch: true,
};

const sort: ChannelSort = { last_message_at: -1 };

const Messages = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const { setCurrentChannel } = useChatContext();

  const { searchQuery, loading, loadMore, messages, refreshing, refreshList } =
    useContext(SearchContext);

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

  const EmptySearchIndicator = () => (
    <View style={styles.emptyIndicatorContainer}>
      {/* <Search height={112} width={112} /> */}
      <Text style={[styles.emptyIndicatorText, { color: '#808080' }]}>
        {`No results for "${searchQuery}"`}
      </Text>
    </View>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column' }}>
      {/* {(!!searchQuery || (messages && messages.length > 0)) && (
        <MessageSearchList
          EmptySearchIndicator={EmptySearchIndicator}
          loading={loading}
          loadMore={loadMore}
          messages={messages}
          refreshing={refreshing}
          refreshList={refreshList}
          // setChannelWithId={setChannelWithId}
        />
      )} */}

      <View style={[styles.channelListContainer]}>
        <ChannelList
          additionalFlatListProps={additionalFlatListProps}
          filters={filters}
          HeaderNetworkDownIndicator={() => null}
          maxUnreadCount={99}
          onSelect={onSelect}
          options={options}
          Preview={ChannelPreviewMessenger}
          sort={sort}
          EmptyStateIndicator={EmptyMessageStateIndicator}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  channelListContainer: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    flex: 1,
    backgroundColor: 'black',
  },
  emptyIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyIndicatorText: { paddingTop: 28 },
  flex: {
    flex: 1,
  },
  searchContainer: {
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',
    margin: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    includeFontPadding: false, // for android vertical text centering
    padding: 0, // removal of default text input padding on android
    paddingHorizontal: 10,
    paddingTop: 0, // removal of iOS top padding for weird centering
    textAlignVertical: 'center', // for android vertical text centering
  },
});

export default Messages;
