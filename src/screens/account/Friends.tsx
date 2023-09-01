import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Share,
  RefreshControl,
} from 'react-native';

import { supabase } from '../../lib/supabase';

import Avatar from '../../components/Avatar';
import SearchBar from '../../components/SearchBar';
import { Feather, EvilIcons, ExportSquareIcon } from '../../components/Icons';

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hangoutUrl, profileInviteMessage } from '../../utils/constants';
import { ScrollView } from 'react-native-gesture-handler';

const Friends = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};
  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState<any>([]);
  const [allUsers, setAllUsers] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<any>([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<any>([]);

  const [results, setResults] = useState<any>([]);
  const [username, setUsername] = useState('');
  const insets = useSafeAreaInsets();

  const handleRefresh = () => {
    setRefreshing(true);

    // Perform the necessary data fetching or operations here
    getFriends();
    getAllUsers();
    // Once the data fetching or operations are complete, set refreshing to false
    setRefreshing(false);
  };

  const showAlert = (id: string) => {
    Alert.alert(
      'Cancel Request?',
      'Are you sure you want to cancel this request?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleCancelRequest(id),
        },
      ],
      { cancelable: false },
    );
  };

  const getProfile = async () => {
    try {
      // if (!session?.user) throw new Error('No user on the session!');

      let { data, error, status } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionId);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data?.[0]?.username);
      }

      // downloadImage(avatarPath);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  const getFriends = async () => {
    const { data: friendData, error: friendError } = await supabase
      .from('friends')
      .select('user_id_1, user_id_2')
      .or(`user_id_1.eq.${sessionId},user_id_2.eq.${sessionId}`);

    const filteredFriendIds = filterFriendsBySessionId(friendData);

    if (friendError) {
      console.error(friendError);
    } else {
      // Retrieve user information for each friend request
      const users = await Promise.all(
        filteredFriendIds.map(async friend => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', friend)
            .single();

          if (userError) {
            console.error(userError);
          } else {
            return userData;
          }
        }),
      );

      // Set the state with the list of friends' names
      setFriends(users);
    }
  };

  const getAllUsers = async () => {
    const { data: allUsersData, error: allUsersError } = await supabase
      .from('users')
      .select('*');

    if (allUsersError) {
      console.error(allUsersError);
    } else {
      // Filter out the user with username 'test_name'
      const filteredUsers = allUsersData.filter(
        user =>
          user.username !== 'test_account' &&
          user.first_name !== null && // Exclude users with null username
          user.id !== sessionId &&
          !friends.some(
            // Exclude already added friends
            (friend: any) => friend.id === user.id,
          ),
      );

      // Sort the filtered users by first_name
      const sortedUsers = filteredUsers.sort((a, b) => {
        const nameA = a?.first_name || ''; // Use optional chaining
        const nameB = b?.first_name || ''; // Use optional chaining
        return nameA.localeCompare(nameB);
      });

      setAllUsers(sortedUsers);
    }
  };

  const getReceivedFriendRequests = async () => {
    const { data: friendRequestData, error: friendRequestError } =
      await supabase
        .from('friend_requests')
        .select('*')
        .eq('to_user_id', sessionId)
        .eq('status', 'pending');

    if (friendRequestError) {
      console.error(friendRequestError);
    } else {
      // Retrieve user information for each friend request
      const users = await Promise.all(
        friendRequestData.map(async friendRequest => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', friendRequest.from_user_id)
            .single();

          if (userError) {
            console.error(userError);
          } else {
            return userData;
          }
        }),
      );

      setReceivedFriendRequests(users);
    }
  };

  const getSentFriendRequests = async () => {
    const { data: friendRequestData, error: friendRequestError } =
      await supabase
        .from('friend_requests')
        .select('*')
        .eq('from_user_id', sessionId)
        .eq('status', 'pending');

    if (friendRequestError) {
      console.error(friendRequestError);
    } else {
      // Retrieve user information for each friend request
      const users = await Promise.all(
        friendRequestData.map(async friendRequest => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', friendRequest.to_user_id)
            .single();

          if (userError) {
            console.error(userError);
          } else {
            return userData;
          }
        }),
      );

      setSentFriendRequests(users);
    }
  };

  const filterFriendsBySessionId = (
    friendsData: { user_id_1: string; user_id_2: string }[] | null,
  ) => {
    if (!friendsData) {
      return [];
    }

    const friendIds: string[] = [];

    for (const friend of friendsData) {
      if (friend.user_id_1 !== sessionId) {
        friendIds.push(friend.user_id_1);
      } else if (friend.user_id_2 !== sessionId) {
        friendIds.push(friend.user_id_2);
      }
    }

    return friendIds;
  };

  const handleCancelRequest = async (id: string) => {
    const { data, error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('from_user_id', sessionId)
      .eq('to_user_id', id);
  };

  const handleRequest = async (id: string) => {
    const { data, error } = await supabase
      .from('friend_requests')
      .insert([{ from_user_id: sessionId, to_user_id: id, status: 'pending' }]);
  };

  const handlePublicProfile = (id: string) => {
    navigation.navigate('PublicProfile', { userId: id, sessionId: sessionId });
  };

  const handleAcceptRequest = async (id: string) => {
    // Update friend request status in friend_requests table
    const { data: requestData, error: requestError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('from_user_id', id)
      .eq('to_user_id', sessionId);

    if (requestError) {
      console.error(requestError);
      return;
    }

    console.log('Friend request accepted and friend added to friends table');
  };

  const handleInvite = async () => {
    Share.share({
      url: hangoutUrl,
      title: 'Hangout',
    });
  };

  const renderFriendItem = ({ item }: { item: any }) => {
    const fullName = item.first_name + ' ' + item.last_name;
    return (
      <TouchableOpacity
        className="flex flex-row items-center space-x-2 pt-5"
        onPress={() => {
          handlePublicProfile(item.id);
        }}>
        <Avatar source={item.avatar} name={fullName} size={45} />
        <View className="flex flex-col">
          <View className="flex flex-row space-x-1">
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
              }}>
              {item.first_name} {item.last_name}
            </Text>
          </View>
          <View className="flex flex-row space-x-1">
            <Text className="text-sm text-gray-500">
              {'@'}
              {item.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFriendRequestItem = ({ item }: { item: any }) => {
    const fullName = item.first_name + ' ' + item.last_name;

    return (
      <TouchableOpacity
        className="mt-2 flex flex-row items-center justify-between"
        onPress={() => {
          handlePublicProfile(item.id);
        }}>
        <View className="flex flex-row items-center space-x-2">
          <Avatar source={item.avatar} name={fullName} size={45} />
          <View className="flex flex-col">
            <View className="flex flex-row space-x-1">
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {item.first_name} {item.last_name}
              </Text>
            </View>
            <View className="flex flex-row space-x-1">
              <Text className="text-sm text-gray-500">
                {'@'}
                {item.username}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="flex h-10 flex-row items-center rounded-full border border-violet-600 px-4"
          onPress={() => handleAcceptRequest(item.id)}>
          <View>
            <EvilIcons name="plus" size={30} color="#9333ea" />
          </View>
          <View>
            <Text className="mr-1 text-lg text-violet-600">Accept</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderResultItem = ({ item }: { item: any }) => {
    const fullName = item.first_name + ' ' + item.last_name;
    const isFriendRequest = sentFriendRequests.some(
      (request: any) => request.id === item.id,
    );

    return (
      <TouchableOpacity
        className="mt-2 flex flex-row items-center justify-between"
        onPress={() => {
          handlePublicProfile(item.id);
        }}>
        <View className="flex flex-row items-center space-x-2">
          <Avatar source={item.avatar} name={fullName} size={45} />
          <View className="flex flex-col">
            <View className="flex flex-row space-x-1">
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {item.first_name} {item.last_name}
              </Text>
            </View>
            <View className="flex flex-row space-x-1">
              <Text className="text-sm text-gray-500">
                {'@'}
                {item.username}
              </Text>
            </View>
          </View>
        </View>

        {isFriendRequest ? (
          <TouchableOpacity onPress={() => showAlert(item.id)}>
            <LinearGradient
              colors={['#7000FF', '#B174FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex h-9 flex-row items-center justify-center space-x-2 rounded-full bg-white px-5">
              <Text className="text-white">Requested</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => handleRequest(item.id)}>
            <LinearGradient
              colors={['#7000FF', '#B174FF']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 100,
                overflow: 'hidden',
                padding: 1,
              }}
              className="w-full items-center rounded-full">
              <View className="flex h-9 flex-row items-center justify-center space-x-2 rounded-full bg-white px-5">
                <MaskedView
                  maskElement={<Text className="text-white">Add friend</Text>}>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#7000FF', '#B174FF']}>
                    <Text
                      style={{
                        opacity: 0,
                        fontSize: 14,
                        fontWeight: '400',
                      }}>
                      Add friend
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (sessionId) {
      getProfile();
      getFriends();
      getReceivedFriendRequests();
      getSentFriendRequests();
      // Subscribe to changes in the users, friends and friend_requests table
      const userSubscription = supabase
        .channel('o_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
          },
          payload => {
            setUsername(payload.new.username);
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friends',
          },
          payload => {
            // Check if the updated friend data involves the users you're interested in
            if (payload.eventType === 'INSERT') {
              getFriends();
            } else if (payload.eventType === 'UPDATE') {
              getFriends();
            } else if (payload.eventType === 'DELETE') {
              getFriends();
            }
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friend_requests',
          },
          payload => {
            // Check if the updated friend data involves the users you're interested in
            if (payload.eventType === 'INSERT') {
              getReceivedFriendRequests();
              getSentFriendRequests();
            } else if (payload.eventType === 'UPDATE') {
              getReceivedFriendRequests();
              getSentFriendRequests();
            } else if (payload.eventType === 'DELETE') {
              getReceivedFriendRequests();
              getSentFriendRequests();
            }
          },
        )
        .subscribe();
    }
  }, [sessionId, username]);

  useEffect(() => {
    getAllUsers();
  }, [friends, allUsers]);

  useEffect(() => {
    if (searchText.length > 0) {
      const getResults = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .neq('id', sessionId)
          .or(
            `first_name.ilike.%${searchText}%,last_name.ilike.%${searchText}%,username.ilike.%${searchText}%`,
          );

        if (error) {
          console.error(error);
        } else {
          setResults(data);
        }
      };
      getResults();
    } else {
      setResults([]);
    }
  }, [searchText, sessionId]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerShadowVisible: false,
    });
  }, [navigation, sessionId]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: insets.top,
          paddingLeft: insets.left,
          width: '100%',
          backgroundColor: 'white',
        }}>
        <View style={{ backgroundColor: '#F3F3F3' }} className="flex w-full">
          <View
            className={` ${
              searchText === '' ? 'rounded-b-2xl px-4' : 'pl-4'
            }  bg-white  py-2`}>
            <SearchBar
              placeholder="Search for people"
              searchTerm={searchText}
              setSearchTerm={setSearchText}
            />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full flex-1 flex-col pt-2"
          style={{ backgroundColor: searchText === '' ? '#F3F3F3' : 'white' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {/* Before Searching */}
          {searchText === '' && (
            <>
              {receivedFriendRequests.length !== 0 && (
                <View className="mb-2 w-full rounded-2xl bg-white px-4 pb-6 pt-4">
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={receivedFriendRequests}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderFriendRequestItem}
                    scrollEnabled={false}
                    ListHeaderComponent={
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                        }}>
                        Added me
                      </Text>
                    }
                  />
                </View>
              )}

              <View className="flex h-[57px] flex-col justify-center rounded-2xl  bg-white px-4">
                <TouchableOpacity onPress={handleInvite}>
                  <View className="flex flex-row items-center space-x-2">
                    <ExportSquareIcon color="black" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: 'black',
                      }}>
                      Invite friends
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {friends.length !== 0 && (
                <View className="mt-2 w-full rounded-2xl bg-white px-4 pb-6 pt-4">
                  <FlatList
                    data={friends}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderFriendItem}
                    scrollEnabled={false}
                    ListHeaderComponent={
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '500',
                        }}>
                        My friends
                      </Text>
                    }
                  />
                </View>
              )}

              {receivedFriendRequests.length === 0 && friends.length === 0 && (
                <View className="mt-2 flex flex-col justify-center rounded-2xl bg-white p-4">
                  <Text style={{ fontSize: 20, fontWeight: '500' }}>
                    My friends
                  </Text>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 16,
                      color: '#808080',
                    }}
                    className="px-5 pb-4 pt-6 text-center">
                    You haven’t added any friends yet. Use the search bar to
                    find your friends.
                  </Text>
                </View>
              )}

              <View className="mt-2 w-full rounded-2xl bg-white px-4 pb-6 pt-4">
                <FlatList
                  data={allUsers}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderFriendItem}
                  scrollEnabled={false}
                  ListHeaderComponent={
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '500',
                      }}>
                      Suggested
                    </Text>
                  }
                />
              </View>
            </>
          )}

          {/* After Searching */}
          {searchText !== '' && (
            <View className="flex-1 px-4">
              <TouchableOpacity className="mb-4" onPress={handleInvite}>
                <View className="flex flex-row items-center space-x-2">
                  <ExportSquareIcon color="black" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: 'black',
                    }}>
                    Invite friends
                  </Text>
                </View>
              </TouchableOpacity>
              {results.length !== 0 && (
                <View>
                  {/* Render the friends from results */}
                  {results.some((item: any) =>
                    friends.some((friend: any) => friend.id === item.id),
                  ) && (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={results.filter((item: any) =>
                        friends.some((friend: any) => friend.id === item.id),
                      )}
                      keyExtractor={item => item.id.toString()}
                      renderItem={renderFriendItem}
                      ListHeaderComponent={
                        <Text className="text-lg font-semibold">
                          My Friends
                        </Text>
                      }
                      scrollEnabled={false}
                      className="mb-4"
                    />
                  )}

                  {/* Render the non-matching friends from results */}
                  {results.some(
                    (item: any) =>
                      !friends.some((friend: any) => friend.id === item.id),
                  ) && (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={results.filter(
                        (item: any) =>
                          !friends.some((friend: any) => friend.id === item.id),
                      )}
                      keyExtractor={item => item.id.toString()}
                      renderItem={renderResultItem}
                      scrollEnabled={false}
                      ListHeaderComponent={
                        <Text className="text-lg font-semibold">Results</Text>
                      }
                    />
                  )}
                </View>
              )}

              {results.length === 0 && (
                <View className="flex-1 items-center justify-center">
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#808080',
                    }}>
                    No results found.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Friends;
