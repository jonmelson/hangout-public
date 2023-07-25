import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

import { openBrowserAsync } from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { getFriendsMetaData } from '../../../utils/queries';

import Event from '../../../components/Event';
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

import { formatDate, handleContactUsPress } from '../../../utils/utils';

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
  const [refreshing, setRefreshing] = useState(false);

  const [isFriend, setIsFriend] = useState(false);
  const [requested, setRequested] = useState(false);

  const [friends, setFriends] = useState<any>([]);
  const [hangouts, setHangouts] = useState<any>([]);
  const [isGoing, setIsGoing] = useState<any>([]);
  const [mergedData, setMergedData] = useState<any>(null);

  const fullName = firstName + ' ' + lastName;
  const joinedDate = formatDate(createdAt);

  const { startDMChatRoom } = useChatContext();

  const handleRefresh = () => {
    setRefreshing(true);

    // Perform the necessary data fetching or operations here
    getProfile();
    getHangoutsOfGoing();
    // Once the data fetching or operations are complete, set refreshing to false
    setRefreshing(false);
  };

  const handleRemoveAsFriend = async (id: string) => {
    // console.log(id, sessionId);

    const { error: tryOne } = await supabase
      .from('friends')
      .delete()
      .match({ user_id_1: sessionId, user_id_2: id });

    const { error: tryTwo } = await supabase
      .from('friends')
      .delete()
      .match({ user_id_1: id, user_id_2: sessionId });
  };

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Report user'],
        tintColor: '#333',
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
          console.log('Cancel');
        } else if (buttonIndex === 1) {
          // Report User
          handleContactUsPress();
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

  const showRemoveAlert = (id: string) => {
    Alert.alert(
      'Remove from friends?',
      'Are you sure you want to remove from friends?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleRemoveAsFriend(id),
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

  const handleMessagePress = async () => {
    startDMChatRoom({ id: userId });
  };

  const friendsSheet = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Remove from friends'],
        tintColor: '#333',
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
          console.log('Cancel');
        } else if (buttonIndex === 1) {
          if (userId) {
            showRemoveAlert(userId);
          } else {
            console.log('userId is undefined');
          }
        }
      },
    );

  const getProfile = async () => {
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
  };

  const getHangouts = async (ids: any) => {
    const hangoutIds = ids.map((obj: any) => obj.hangout_id);

    try {
      const currentTime = new Date(); // Get the current date and time

      const { data: hangoutsData, error: hangoutsError } = await supabase
        .from('hangouts')
        .select('*')
        .in('id', hangoutIds);

      if (!hangoutsError) {
        setHangouts(hangoutsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getHangoutsOfGoing = async () => {
    try {
      const { data: hangoutIdsData, error: hangoutIdsError } = await supabase
        .from('is_going')
        .select('hangout_id')
        .eq('user_id', userId);

      if (!hangoutIdsError) {
        getHangouts(hangoutIdsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getHangoutsOfGoing();
  }, []);

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

  // Fetch initial data for isGoing
  useEffect(() => {
    const fetchIsGoing = async () => {
      try {
        const { data: isGoingData, error: isGoingDataError } = await supabase
          .from('is_going')
          .select('*')
          .in(
            'hangout_id',
            hangouts.map((hangout: any) => hangout.id),
          );
        if (!isGoingDataError) {
          setIsGoing((prevState: any) => [...prevState, ...isGoingData]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchIsGoing();
  }, [hangouts]);

  useEffect(() => {
    const mergeDataFunction = async () => {
      const newData = await Promise.all(
        hangouts.map(async (hangout: any) => {
          const goingIds = isGoing
            .filter((item: any) => item.hangout_id === hangout.id)
            .map((item: any) => item.user_id);

          const { data: goingMetaData, error } = await supabase
            .from('users')
            .select('*')
            .in('id', goingIds);
          if (error) {
            console.error('Error fetching user data:', error);
          }

          // Convert the dates to Date objects for comparison
          const currentDate = new Date();
          const eventStartDate = new Date(hangout.starts);
          const eventEndDate = new Date(hangout.ends);

          // Include only events whose start date has not passed and end time has not passed
          if (eventStartDate > currentDate && eventEndDate > currentDate) {
            return {
              ...hangout,
              going: goingMetaData ?? [],
            };
          } else {
            return null; // Exclude events that have already ended or have end time passed
          }
        }),
      );

      // Remove any null values (excluded events) and sort the events by start time
      const filteredAndSortedData = newData.filter(Boolean).sort((a, b) => {
        const startTimeA = new Date(a.starts).getTime();
        const startTimeB = new Date(b.starts).getTime();
        return startTimeA - startTimeB;
      });

      setMergedData(filteredAndSortedData);
    };

    if (hangouts && isGoing) {
      mergeDataFunction();
    }
  }, [hangouts, isGoing]);

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
  }, [userId, sessionId]);

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
          className="flex flex-row items-center space-x-2 py-2 pr-4"
          onPress={() => navigation.navigate('Search', { screen: 'Friends' })}>
          <ChevronBackIcon />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            {username}
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={onPress} className="py-2 pl-4">
          <MoreIcon />
        </TouchableOpacity>
      ),
    });
  }, [navigation, sessionId, username]);

  return (
    <ScrollView
      className="w-full flex-1 flex-col"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View className="flex flex-col">
        {avatarUrl !== '' ? (
          <>
            <View className="h-28">
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
          <View className="h-28"></View>
        )}
        <View className="relative rounded-2xl bg-white">
          <View className="absolute -top-[60px] z-10 flex  w-full flex-col items-center justify-center">
            <View className="overflow-hidden rounded-full">
              <Avatar source={avatarUrl} name={fullName} size={120} />
            </View>
          </View>

          <View
            className="flex flex-col"
            style={{ margin: 16, paddingTop: 48 }}>
            <View
              className="flex flex-row items-center space-x-2"
              style={{ paddingBottom: 12 }}>
              <View>
                <Text className="text-lg font-medium">{fullName}</Text>
              </View>
              <View>
                <Octicons name="verified" color="#2563eb" size={14} />
              </View>
            </View>

            {about.trim() !== '' && (
              <View style={{ paddingBottom: 12 }}>
                <Text className="text-gray-800">{about}</Text>
              </View>
            )}

            {location && location.length > 0 && (
              <View
                className="flex flex-row items-center space-x-1"
                style={{ paddingBottom: 12 }}>
                <Location16Icon color="#000000" />
                <Text className="text-black">{location[0].address}</Text>
              </View>
            )}

            {isFriend ? (
              <View className="flex flex-row space-x-2 ">
                <TouchableOpacity className="w-1/2" onPress={friendsSheet}>
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

                <TouchableOpacity
                  onPress={handleMessagePress}
                  className="w-1/2">
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
                  <TouchableOpacity onPress={() => showAlert(userId)}>
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
      </View>

      {mergedData && mergedData.length > 0 && (
        <View className="mt-2 flex rounded-2xl bg-white">
          <View style={{ margin: 16 }} className="flex flex-col">
            <Text style={{ fontSize: 20, fontWeight: '500' }}>Hangouts</Text>

            <View className="flex flex-col">
              {mergedData.map((item: any, idx: any) => {
                return (
                  <Event
                    {...item}
                    key={idx}
                    sessionId={userId}
                    navigation={navigation}
                  />
                );
              })}
            </View>
          </View>
        </View>
      )}

      {isFriend && (
        <View className="my-12 flex flex-col items-center justify-center space-y-4">
          <View>
            <TabBarGoingIcon name="going" color="gray" />
          </View>
          <View>
            <Text className="text-gray-500">
              Joined hangout on {joinedDate}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  avatar: {
    borderWidth: 0,
  },
});
export default PublicProfile;
