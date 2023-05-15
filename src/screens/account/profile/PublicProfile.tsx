import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
} from 'react-native';

import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

import { openBrowserAsync } from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import Avatar from '../../../components/Avatar';
import {
  Octicons,
  Ionicons,
  ChevronBackIcon,
  TabBarGoingIcon,
  FontAwesome,
  MoreIcon,
  MessagesOutlineIcon,
  Location16Icon,
} from '../../../components/Icons';

import { useChatContext } from '../../../context/ChatContext';

import { formatDate } from '../../../utils/utils';

import { LocationMetaData } from '../../../utils/other';

import { supabase } from '../../../lib/supabase';

const PublicProfile = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { userId?: string; sessionId?: string } };
}) => {
  const { userId, sessionId } = route?.params ?? {};

  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState<LocationMetaData[]>([]);
  const [about, setAbout] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const [isFriend, setIsFriend] = useState(false);
  const [requested, setRequested] = useState(false);

  const fullName = firstName + ' ' + lastName;
  const joinedDate = formatDate(createdAt);

  const { startDMChatRoom } = useChatContext();
 
  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Report user'],
        tintColor: '#333',
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
          console.log('Cancel');
        } else if (buttonIndex === 1) {
          // Report User
          console.log('Report User');
        }
      },
    );

  const showAlert = (id: string | undefined) => {
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

  const handleCancelRequest = async (id: string | undefined) => {
    const { data, error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('from_user_id', sessionId)
      .eq('to_user_id', id);

    setRequested(false);
  };

  const handleRequest = async (id: string | undefined) => {
    const { data, error } = await supabase
      .from('friend_requests')
      .insert([{ from_user_id: sessionId, to_user_id: id, status: 'pending' }]);

    setRequested(true);
  };

  const handleInstagramPress = () => {
    openBrowserAsync(`https://www.instagram.com/${instagram}`);
  };

  const handleTwitterPress = () => {
    openBrowserAsync(`https://www.twitter.com/${twitter}`);
  };

  const test = async () => {
    console.log('test');
    await startDMChatRoom({ id: userId });
  };

  async function getProfile() {
    try {
      setLoading(true);
      // if (!session?.user) throw new Error('No user on the session!');

      let { data, error, status } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data?.[0]?.avatar);
        setFirstName(data?.[0]?.first_name);
        setLastName(data?.[0]?.last_name);
        setUsername(data?.[0]?.username);
        setLocation(JSON.parse(data?.[0]?.location));
        setAbout(data?.[0]?.about);
        setInstagram(data?.[0]?.instagram);
        setTwitter(data?.[0]?.twitter);
        setCreatedAt(data?.[0]?.created_at);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const checkFriendship = async () => {
    // Check if the userId and sessionId are in the friends table
    const { data: friendsData, error: friendsError } = await supabase
      .from('friends')
      .select()
      .or('user_id_1.eq.' + userId + ',user_id_2.eq.' + userId)
      .or('user_id_1.eq.' + sessionId + ',user_id_2.eq.' + sessionId);

    if (friendsError) {
      console.error(friendsError);
      return;
    }

    // If the user is already a friend
    if (friendsData && friendsData.length > 0) {
      setIsFriend(true);
      setRequested(false);
      return;
    }

    // If not, check if userId and sessionId are in the friend_requests table
    const { data: requestsData, error: requestsError } = await supabase
      .from('friend_requests')
      .select()
      .or('from_user_id.eq.' + userId + ',to_user_id.eq.' + userId)
      .or('from_user_id.eq.' + sessionId + ',to_user_id.eq.' + sessionId);

    if (requestsError) {
      console.error(requestsError);
      return;
    }

    // If a friend request exists and it's pending
    if (
      requestsData &&
      requestsData.length > 0 &&
      requestsData[0].status === 'pending'
    ) {
      setIsFriend(false);
      setRequested(true);
    } else {
      setIsFriend(false);
      setRequested(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      getProfile();

      // Subscribe to changes in the users table
      const userSubscription = supabase
        .channel('changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
          },
          payload => {
            setAvatarUrl(payload.new.avatar);
            setFirstName(payload.new.first_name);
            setLastName(payload.new.last_name);
            setUsername(payload.new.username);
            setLocation(JSON.parse(payload.new.location));
            setAbout(payload.new.about);
            setInstagram(payload.new.instagram);
            setTwitter(payload.new.twitter);
            setCreatedAt(payload.new.created_at);
          },
        )
        .subscribe();

      // Subscribe to changes in the friends table
      const friendsSubscription = supabase
        .channel('friends_changes')
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
              checkFriendship();
            } else if (payload.eventType === 'UPDATE') {
              checkFriendship();
            } else if (payload.eventType === 'DELETE') {
              checkFriendship();
            }
          },
        )
        .subscribe();

      // Subscribe to changes in the friend_request table
      const friendRequestSubscription = supabase
        .channel('friend_requests_changes')
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
              checkFriendship();
            } else if (payload.eventType === 'UPDATE') {
              checkFriendship();
            } else if (payload.eventType === 'DELETE') {
              checkFriendship();
            }
          },
        )
        .subscribe();
    }
  }, [sessionId]);

  useEffect(() => {
    checkFriendship();
  }, [userId, sessionId]);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerShown: true,
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          className="flex flex-row items-center space-x-2"
          onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
          <Text className="font-semibold">{username}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={onPress}>
          <MoreIcon />
        </TouchableOpacity>
      ),
    });
  }, [navigation, sessionId, username]);

  return (
    <View className="flex-1">
      <View className="flex flex-col">
        {avatarUrl !== '' ? (
          <>
            <View className="h-40">
              <Image
                source={{ uri: avatarUrl }}
                cachePolicy="none"
                style={{ width: '100%', height: '100%' }}
              />
            </View>

            <BlurView
              intensity={80}
              tint="default"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </>
        ) : (
          <View className="h-40"></View>
        )}
        <View className="relative rounded-2xl bg-white px-2 py-6">
          <View className="absolute -top-10 z-10 flex w-full flex-col items-center justify-center space-y-2">
            <View className="overflow-hidden rounded-full border-4 border-white">
              <Avatar source={avatarUrl} name={fullName} size={90} />
            </View>
          </View>

          <View className="mx-2 mt-12 flex flex-col space-y-2">
            <View className="flex flex-row items-center  space-x-2">
              <View>
                <Text className="text-lg font-medium">{fullName}</Text>
              </View>
              <View>
                <Octicons name="verified" color="#2563eb" size={14} />
              </View>
            </View>

            {location && location.length > 0 && (
              <View className="flex flex-row items-center space-x-1">
                <Location16Icon color="#000000" />
                <Text className="text-black">{location[0].address}</Text>
              </View>
            )}

            {isFriend ? (
              <View className="mt-2 flex flex-row space-x-2">
                <TouchableOpacity className="w-1/2">
                  <LinearGradient
                    colors={['#7000FF', '#B174FF']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 100,
                      overflow: 'hidden',
                      padding: 1,
                    }}
                    className="w-full rounded-full">
                    <View className="flex h-12 flex-row items-center justify-center space-x-2 rounded-full bg-white">
                      <MaskedView
                        maskElement={
                          <Text
                            style={{
                              backgroundColor: 'transparent',
                              fontSize: 16,
                              fontWeight: '500',
                            }}>
                            Friends
                          </Text>
                        }>
                        <LinearGradient
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          colors={['#7000FF', '#B174FF']}>
                          <Text
                            style={{
                              opacity: 0,
                              fontSize: 16,
                              fontWeight: '500',
                            }}>
                            Friends
                          </Text>
                        </LinearGradient>
                      </MaskedView>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => test()} className="w-1/2">
                  <LinearGradient
                    colors={['#7000FF', '#B174FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="h-12 w-full items-center justify-center rounded-full">
                    <View className="flex flex-row items-center justify-center space-x-2">
                      <MessagesOutlineIcon color="#FFF" />
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'white',
                          fontWeight: '500',
                        }}>
                        Message
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {requested ? (
                  <TouchableOpacity
                    onPress={() => showAlert(userId)}
                    className="mt-2 ">
                    <LinearGradient
                      colors={['#7000FF', '#B174FF']}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 100,
                        overflow: 'hidden',
                        padding: 1,
                      }}
                      className="w-full rounded-full">
                      <View className="flex h-12 flex-row items-center justify-center space-x-2 rounded-full bg-white">
                        <MaskedView
                          maskElement={
                            <Text
                              style={{
                                backgroundColor: 'transparent',
                                fontSize: 16,
                                fontWeight: '500',
                              }}>
                              Requested
                            </Text>
                          }>
                          <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#7000FF', '#B174FF']}>
                            <Text
                              style={{
                                opacity: 0,
                                fontSize: 16,
                                fontWeight: '500',
                              }}>
                              Requested
                            </Text>
                          </LinearGradient>
                        </MaskedView>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleRequest(userId)}
                    className="mt-2 ">
                    <LinearGradient
                      colors={['#7000FF', '#B174FF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="h-12 w-full items-center justify-center rounded-full">
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'white',
                          fontWeight: '500',
                        }}>
                        Add friend
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
        {about !== '' ||
          instagram !== '' ||
          twitter !== '' && (
            <View className="flex flex-col space-y-3 rounded-2xl bg-white p-4">
              <Text className="text-xl font-semibold">About</Text>
              {about !== '' && (
                <View>
                  <Text className="text-gray-800">{about}</Text>
                </View>
              )}
              <View className="flex flex-col space-y-1">
                {instagram && (
                  <TouchableOpacity
                    className="flex flex-row items-center space-x-2"
                    onPress={handleInstagramPress}>
                    <FontAwesome name="instagram" color="purple" size={18} />
                    <Text style={{ color: 'purple' }}>{instagram}</Text>
                  </TouchableOpacity>
                )}

                {twitter && (
                  <TouchableOpacity
                    className="flex flex-row items-center space-x-2"
                    onPress={handleTwitterPress}>
                    <FontAwesome name="twitter" color="blue" size={18} />
                    <Text style={{ color: 'blue' }}>{twitter}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
      </View>
      <View className="mt-12 flex flex-col items-center justify-center space-y-4">
        <View>
          <TabBarGoingIcon name="going" color="gray" />
        </View>
        <View>
          <Text className="text-gray-500">Joined hangout on {joinedDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default PublicProfile;
