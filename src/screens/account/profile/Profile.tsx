import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  Share,
  StyleSheet,
} from 'react-native';

import { Image } from 'expo-image';

import { supabase } from '../../../lib/supabase';

import Avatar from '../../../components/Avatar';
import {
  Octicons,
  Feather,
  TabBarGoingIcon,
  Location16Icon,
} from '../../../components/Icons';
import RoquefortText from '../../../components/RoquefortText';
import Selector from '../../../components/Selector';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { LocationMetaData } from '../../../utils/other';

import { hangoutUrl, profileInviteMessage } from '../../../utils/constants';
import { formatDate } from '../../../utils/utils';
import { Hangout, Section } from '../../../utils/other';
import TabAvatar from '../../../components/TabAvatar';

import Event from '../../../components/Event';
import { getFriendsMetaData } from '../../../utils/queries';

const Profile = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

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
  const [blurredImage, setBlurredImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [friends, setFriends] = useState<any>([]);
  const [hangouts, setHangouts] = useState<any>([]);
  const [isGoing, setIsGoing] = useState<any>([]);
  const [newIsGoing, setNewIsGoing] = useState<any>([]);
  const [mergedData, setMergedData] = useState<any>(null);

  const [upcomingSections, setUpcomingSections] = useState<Section[]>([]);
  const [hostingSections, setHostingSections] = useState<Section[]>([]);

  const fullName = firstName + ' ' + lastName;
  const joinedDate = formatDate(createdAt);

  const handleRefresh = () => {
    setRefreshing(true);

    // Perform the necessary data fetching or operations here
    getProfile();
    // Once the data fetching or operations are complete, set refreshing to false
    setRefreshing(false);
  };

  const handleInviteFriends = () => {
    Share.share({
      url: hangoutUrl + '/' + username,
      message: profileInviteMessage,
      title: 'Hangout',
    });
  };

  const handleTabPress = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };
  const handleEditPress = () => {
    navigation.navigate('EditProfile');
  };

  const handleEditProfilePhotoPress = () => {
    navigation.navigate('EditProfilePhoto');
  };

  const handleEditLocation = () => {
    navigation.navigate('EditLocation', { sessionId: sessionId });
  };

  const handleEditAbout = () => {
    navigation.navigate('EditAbout', { sessionId: sessionId });
  };

  const handleEditInstagram = () => {
    navigation.navigate('EditInstagram', { sessionId: sessionId });
  };

  const handleEditTwitter = () => {
    navigation.navigate('EditTwitter', { sessionId: sessionId });
  };

  async function getProfile() {
    try {
      setLoading(true);
      // if (!session?.user) throw new Error('No user on the session!');

      let { data, error, status } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionId);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstName(data?.[0]?.first_name);
        setLastName(data?.[0]?.last_name);
        setUsername(data?.[0]?.username);
        setAvatarUrl(data?.[0]?.avatar);
        setLocation(JSON.parse(data?.[0]?.location));
        setAbout(data?.[0]?.about);
        setInstagram(data?.[0]?.instagram);
        setTwitter(data?.[0]?.twitter);
        setCreatedAt(data?.[0]?.created_at);
      }

      // downloadImage(avatarPath);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sessionId) {
      getProfile();

      // Subscribe to changes in the users table
      const userSubscription = supabase
        .channel('changes1')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
          },
          payload => {
            setFirstName(payload.new.first_name);
            setLastName(payload.new.last_name);
            setUsername(payload.new.username);
            setAvatarUrl(payload.new.avatar);
            setLocation(JSON.parse(payload.new.location));
            setAbout(payload.new.about);
            setInstagram(payload.new.instagram);
            setTwitter(payload.new.twitter);
            setCreatedAt(payload.new.created_at);
          },
        )
        .subscribe();
    }
  }, [
    sessionId,
    avatarUrl,
    about,
    location,
    firstName,
    lastName,
    twitter,
    instagram,
  ]);

  // Fetch initial data for friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data: friendsData, error: friendError } = await supabase
          .from('friends')
          .select('friends_id, user_id_1, user_id_2')
          .or(`user_id_1.eq.${sessionId},user_id_2.eq.${sessionId}`);

        if (!friendError) {
          const friendsIds = getFriendsMetaData(friendsData, sessionId);
          setFriends(friendsIds);
          // console.log(friendsIds);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriends();
  }, []);

  // Fetch initial data for hangouts
  useEffect(() => {
    const fetchHangouts = async () => {
      try {
        const friendIds = friends.map((friend: any) => friend.friendId);
        const userIds = [sessionId, ...friendIds];
        const { data: hangoutsData, error: hangoutsError } = await supabase
          .from('hangouts')
          .select('*')
          .in('user_id', userIds);

        if (!hangoutsError) {
          setHangouts(hangoutsData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchHangouts();
  }, [friends]);

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

  // Fetch realtime data
  useEffect(() => {
    const friendsSubscription = supabase
      .channel('friends-changes3')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
        },
        payload => {
          if (payload.eventType == 'INSERT') {
            // Get the ids from the inserted table
            // console.log('The user has INSERTED');
            const { friends_id, user_id_1, user_id_2 } = payload.new;
            const friendsData = [{ friends_id, user_id_1, user_id_2 }];
            const newFriendsMetaData = getFriendsMetaData(
              friendsData,
              sessionId,
            );
            setFriends([...friends, ...newFriendsMetaData]);
          } else if (payload.eventType == 'DELETE') {
            // Gets the old data, checks if the ids
            // console.log('The user has DELETED');
            const deletedId = payload.old.friends_id;
            setFriends(
              friends.filter(
                (friend: any) => friend.friends_table_id !== deletedId,
              ),
            );
          }
        },
      )
      .subscribe();

    // Subscribe to hangouts table changes using Supabase's real-time functionality
    const hangoutsSubscription = supabase
      .channel('hangouts-changes3')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hangouts',
        },
        payload => {
          if (payload.eventType == 'INSERT') {
            // Get the ids from the inserted table
            // console.log('The user has INSERTED HANGOUT');
            const newHangout = payload.new;
            // console.log('Friends');
            // console.log(friends);
            // console.log('New Hangout');
            // console.log(newHangout);
            const isFriend = friends.some(
              (friend: any) => friend.friendId === newHangout.user_id,
            );
            const isCurrentUser = sessionId === newHangout.user_id;

            // console.log('is Friend');
            // console.log(isFriend);
            // console.log('is CurrentUser');
            // console.log( isCurrentUser );

            if (isFriend || isCurrentUser) {
              setHangouts((prevState: any) => [...prevState, newHangout]);
            }
          } else if (payload.eventType == 'DELETE') {
            // Gets the old data, checks if the ids
            // console.log('The user has DELETE');
            const deletedHangoutId = payload.old.id;
            setHangouts((prevState: any) =>
              prevState.filter(
                (hangout: any) => hangout.id !== deletedHangoutId,
              ),
            );
          } else if (payload.eventType == 'UPDATE') {
            // Gets the old data, checks if the ids
            // console.log('The user has UPDATE');
            const updatedHangout = payload.new;
            const isFriend = friends.some(
              (friend: any) => friend.friendId === updatedHangout.user_id,
            );
            const isCurrentUser = sessionId === updatedHangout.user_id;

            if (isFriend || isCurrentUser) {
              setHangouts((prevState: any) =>
                prevState.map((hangout: any) =>
                  hangout.id === updatedHangout.id ? updatedHangout : hangout,
                ),
              );
            }
          }
        },
      )
      .subscribe();

    const isGoingSubscription = supabase
      .channel('is-going-changes3')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'is_going',
        },
        payload => {
          if (payload.eventType == 'INSERT') {
            // console.log('The user has INSERTED2');
            const temp = payload.new;
            setNewIsGoing((prevState: any) => [...prevState, temp]);
          } else if (payload.eventType == 'DELETE') {
            // console.log('The user has DELETE2');
            const deletedIsGoingId = payload.old.is_going_id;
            setIsGoing((prevState: any) =>
              prevState.filter(
                (going: any) => going.is_going_id !== deletedIsGoingId,
              ),
            );
            setNewIsGoing((prevState: any) =>
              prevState.filter(
                (going: any) => going.is_going_id !== deletedIsGoingId,
              ),
            );
          }
        },
      )
      .subscribe();

    // return () => {
    //   friendsSubscription.unsubscribe();
    //   hangoutsSubscription.unsubscribe();
    //   isGoingSubscription.unsubscribe();
    // };
  }, [friends, hangouts, isGoing]);

  // Merge the fetch data and whenever hangouts or isGoing is updated
  useEffect(() => {
    const mergeDataFunction = async () => {
      const newData = await Promise.all(
        hangouts.map(async (hangout: any) => {
          const goingIds = isGoing
            .filter((item: any) => item.hangout_id === hangout.id)
            .map((item: any) => item.user_id);

          // console.log('Going Ids');
          // console.log(goingIds);
          const { data: goingMetaData, error } = await supabase
            .from('users')
            .select('*')
            .in('id', goingIds);
          if (error) {
            console.error('Error fetching user data:', error);
          }
          // console.log('Going Meta Data');
          // console.log(goingMetaData);
          return {
            ...hangout,
            going: goingMetaData ?? [],
          };
        }),
      );

      setMergedData(newData);
    };
    if (hangouts && isGoing) {
      mergeDataFunction();
      // console.log('Fetched MERGED DATA');
    }
  }, [hangouts, isGoing]);

  useEffect(() => {
    if (mergedData) {
      const today = new Date().getTime();

      // const upcomingHangouts = mergedData.filter(
      //   (item: Hangout) => new Date(item.starts).getTime() > today,
      // );

      const goingHangouts = mergedData
        .filter((item: Hangout) => {
          // Assuming `username` is the property of the `item` object
          return item.going.some(
            (goingItem: any) =>
              goingItem.id === sessionId && item.user_id !== sessionId,
          );
        })
        .filter((item: Hangout) => new Date(item.starts).getTime() > today);

      // console.log(upcomingHangouts[1].going[0].id);

      const hostingHangouts = mergedData.filter(
        (item: Hangout) =>
          new Date(item.starts).getTime() > today && item.user_id === sessionId,
      );

      // Set upcoming
      setUpcomingSections([{ title: 'Going', data: goingHangouts }]);

      // Set hosting
      setHostingSections([{ title: 'Hosting', data: hostingHangouts }]);
    } else {
      setUpcomingSections([]);
      setHostingSections([]);
    }
  }, [mergedData]);

  useEffect(() => {
    const uniqueIsGoingIds = new Set();

    newIsGoing.forEach((item: any) => {
      const existsInHangout = hangouts.some(
        (hangout: any) => hangout.id === item.hangout_id,
      );

      const existsInIsGoing = uniqueIsGoingIds.has(item.is_going_id);

      if (existsInHangout && !existsInIsGoing) {
        setIsGoing((prevState: any) => {
          const nextState = [...prevState, item];
          uniqueIsGoingIds.add(item.is_going_id);
          return nextState;
        });
      }
    });
  }, [newIsGoing]);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerShadowVisible: false,
      headerLeft: () => (
        <RoquefortText
          fontType="Roquefort-Semi-Strong"
          style={{ fontSize: 26, fontWeight: '500', color: '#333333' }}>
          Profile
        </RoquefortText>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          className="py-1 pl-2">
          <View className="items-center">
            <Feather name="menu" color="black" size={25} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, sessionId, username]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        className="flex-1">
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

          <View
            className={`relative mt-1 ${
              avatarUrl == '' ? 'h-[258px]' : 'h-[233px]'
            } rounded-2xl bg-white px-2 pb-2`}>
            {avatarUrl == '' ? (
              <View className="absolute -top-[60px] z-10 mb-2 w-full">
                <TouchableOpacity
                  onPress={handleEditProfilePhotoPress}
                  className="flex flex-col items-center justify-center space-y-1">
                  <TabAvatar
                    source={avatarUrl}
                    name={fullName}
                    size={120}
                    style={styles.avatar}
                  />

                  <Text className="text-blue-600">Add profile photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="absolute -top-[60px] z-10 mb-2 w-full">
                <View className=" flex-col items-center justify-center space-y-2">
                  <Avatar source={avatarUrl} name={fullName} size={120} />
                </View>
              </View>
            )}

            <View className="text-cemter relative mx-2 mb-2 mt-16 flex flex-col justify-center">
              {avatarUrl == '' ? (
                <View className="mb-2 mt-6 flex flex-row  items-center  space-x-2">
                  <View>
                    <Text className="text-lg font-medium">{fullName}</Text>
                  </View>
                  <View>
                    <Octicons name="verified" color="#2563eb" size={14} />
                  </View>
                </View>
              ) : (
                <View className="mb-2 flex flex-row  items-center  space-x-2">
                  <View>
                    <Text className="text-lg font-medium">{fullName}</Text>
                  </View>
                  <View>
                    <Octicons name="verified" color="#2563eb" size={14} />
                  </View>
                </View>
              )}

              {about !== '' ? (
                <Text className="mb-3 text-gray-800">{about}</Text>
              ) : (
                <TouchableOpacity onPress={handleEditAbout}>
                  <Text className="mb-3 text-blue-600">Add About</Text>
                </TouchableOpacity>
              )}

              {location && location.length > 0 ? (
                <View className="mb-4 flex flex-row items-center space-x-1">
                  <Location16Icon color="#000000" />
                  <Text className="text-black">{location[0].address}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  className="mb-4 flex flex-row items-center space-x-1"
                  onPress={handleEditLocation}>
                  <Location16Icon color="#3478F6" />
                  <Text className="text-blue-600">Add location</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handleEditPress}>
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
                  <View className="flex h-12 flex-row items-center justify-center space-x-2 rounded-full bg-white ">
                    <MaskedView
                      maskElement={
                        <Text
                          style={{
                            backgroundColor: 'transparent',
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          Edit Profile
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
                          Edit Profile
                        </Text>
                      </LinearGradient>
                    </MaskedView>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View className="relative mt-2 rounded-2xl bg-white p-4">
            <Selector
              leftTab="Going"
              rightTab="Hosting"
              activeTab={activeTab}
              handleTabPress={handleTabPress}
            />
            <View className="w-full flex-1 bg-white">
              {activeTab === 0 && (
                <>
                  {upcomingSections[0] &&
                  upcomingSections[0].data.length > 0 ? (
                    <>
                      {upcomingSections[0].data.map((item, idx) => {
                        return (
                          <Event
                            {...item}
                            key={idx}
                            sessionId={sessionId}
                            navigation={navigation}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <View className="mt-4">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('NewHangoutStackTemp')
                        }
                        className="flex h-[48px] w-full">
                        <LinearGradient
                          colors={['#7000FF', '#B174FF']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          className="h-12 w-full items-center justify-center  rounded-full">
                          <View className="flex w-full flex-row items-center justify-center  space-x-1">
                            <View>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: '500',
                                  textAlign: 'center',
                                  color: 'white',
                                }}>
                                Create hangout
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
              {activeTab === 1 && (
                <>
                  {hostingSections[0] && hostingSections[0].data.length > 0 ? (
                    <>
                      {hostingSections[0].data.map((item, idx) => {
                        return (
                          <Event
                            {...item}
                            key={idx}
                            sessionId={sessionId}
                            navigation={navigation}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <View className="mt-4">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('NewHangoutStackTemp')
                        }
                        className="flex h-[48px] w-full">
                        <LinearGradient
                          colors={['#7000FF', '#B174FF']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          className="h-12 w-full items-center justify-center  rounded-full">
                          <View className="flex w-full flex-row items-center justify-center  space-x-1">
                            <View>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: '500',
                                  textAlign: 'center',
                                  color: 'white',
                                }}>
                                Create hangout
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </View>

        <View className="mt-12 flex flex-col items-center justify-center space-y-4 ">
          <View>
            <TabBarGoingIcon name="going" color="gray" />
          </View>
          <View>
            <Text className="text-gray-500">
              Joined hangout on {joinedDate}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 6,
    borderColor: '#fff',
  },
});
export default Profile;
