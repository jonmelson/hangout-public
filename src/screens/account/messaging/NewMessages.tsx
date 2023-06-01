import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';

import Avatar from '../../../components/Avatar';
import { ChevronBackIcon } from '../../../components/Icons';

import { supabase } from '../../../lib/supabase';

import { useChatContext } from '../../../context/ChatContext';

import { getFriendsMetaData } from '../../../utils/queries';

const NewMessages = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};
  const [friends, setFriends] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sendTo, setSendTo] = useState([]);

  const { startDMChatRoom } = useChatContext();

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // Fetch initial data for friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data: friendsList, error: friendError } = await supabase
          .from('friends')
          .select('friends_id, user_id_1, user_id_2')
          .or(`user_id_1.eq.${sessionId},user_id_2.eq.${sessionId}`);

        if (!friendError) {
          const data = getFriendsMetaData(friendsList, sessionId);
          const friendsIds = data.map(item => item.friendId);
          const { data: friendsData, error } = await supabase
            .from('users')
            .select('id,avatar,first_name,last_name,username')
            .in('id', friendsIds);

          setFriends(friendsData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriends();
  }, []);

  // Filter search
  useEffect(() => {
    const newFilteredUsers = friends.filter((user: any) => {
      const { first_name, last_name, username } = user;
      const lowercaseQuery = searchQuery.toLowerCase();

      return (
        first_name.toLowerCase().includes(lowercaseQuery) ||
        last_name.toLowerCase().includes(lowercaseQuery) ||
        username.toLowerCase().includes(lowercaseQuery)
      );
    });

    setFilteredUsers(newFilteredUsers);
  }, [searchQuery, friends]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerTitle: () => (
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            New messages
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          className="py-2 pr-4"
          onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-white">
      <View className="mt-4 flex flex-row items-center border-b border-gray-300">
        <Text className="mb-2 ml-4 font-semibold text-gray-600">To: </Text>
        <TextInput
          className="mb-2 w-full"
          keyboardType="default"
          onChangeText={handleSearchQueryChange}
          autoFocus={true}
        />
      </View>
      <View className="mt-2 flex-1">
        {searchQuery.length > 0 ? (
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                key={item.id}
                className="mx-4 flex flex-row space-x-2 py-2"
                onPress={() => startDMChatRoom(item)}>
                <View>
                  <Avatar
                    key={item.id}
                    name={item.first_name + ' ' + item.last_name}
                    source={item.avatar}
                    size={45}
                  />
                </View>

                <View className="flex flex-col justify-center space-y-1">
                  <View>
                    <Text className="font-semibold">
                      {item.first_name + ' ' + item.last_name}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-500">@{item.username}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={{ padding: 20 }}>
                No users found for the search query "{searchQuery}"
              </Text>
            )}
          />
        ) : null}
      </View>
    </View>
  );
};

export default NewMessages;
