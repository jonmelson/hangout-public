import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  RefreshControl,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

import AsyncStorage from '@react-native-async-storage/async-storage';

import RoquefortText from '../../../components/RoquefortText';
import BottomCreateIndicator from '../../../components/BottomCreateIndicator';
import { LinearGradient } from 'expo-linear-gradient';

import {
  HangoutBlackLogo,
  MessageFeedbackIcon,
} from '../../../components/Icons';

import Card from '../../../components/Card';

import { supabase } from '../../../lib/supabase';

import { Hangout, Section } from '../../../utils/other';

import { getFriendsMetaData } from '../../../utils/queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as MailComposer from 'expo-mail-composer';

const Home = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<any>([]);
  const [hangouts, setHangouts] = useState<any>([]);
  const [isGoing, setIsGoing] = useState<any>([]);
  const [newIsGoing, setNewIsGoing] = useState<any>([]);
  const [mergedData, setMergedData] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  useEffect(() => {
    const checkFeedbackPopup = async () => {
      try {
        // Check if the Feedback popup has been shown before by reading the value from AsyncStorage
        const hasShownFeedbackPopup = await AsyncStorage.getItem(
          'hasShownFeedbackPopup',
        );

        // console.log('hasShownFeedbackPopup:', hasShownFeedbackPopup);

        if (!hasShownFeedbackPopup) {
          // If it hasn't been shown before, set the flag in AsyncStorage and display the popup
          await AsyncStorage.setItem('hasShownFeedbackPopup', 'true');
          setShowFeedbackPopup(true);
        }
      } catch (error) {
        // Handle any errors that occur during AsyncStorage operations
        console.error('Error reading or setting AsyncStorage:', error);
      }
    };

    checkFeedbackPopup();
  }, []);

  useEffect(() => {
    if (showFeedbackPopup) {
      navigation.navigate('FeedbackPopup');
    }
  }, [showFeedbackPopup]);

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Restore "Mail"?',
        'To continue, download "Mail" from the App Store.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Show in App Store',
            onPress: () => {
              // Open the app store link for the user to download an email app
              Linking.openURL(
                // 'https://play.google.com/store/apps/category/COMMUNICATION',
                'https://apps.apple.com/us/app/mail/id1108187098',
              );
            },
          },
        ],
      );
      return;
    }

    const bccRecipients = ['jon.melson@gmail.com'];
    const ccRecipients = ['jon.melson@gmail.com'];
    const recipients = ['hello@hangout.social'];
    const subject = 'Give use feedback!';
    const body = "What's not working? \n\nWhat features should we add?";

    try {
     await MailComposer.composeAsync({
       recipients,
       subject,
       body,
       bccRecipients,
       ccRecipients,
     });
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while trying to compose the email.',
      );
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);

    // Perform the necessary data fetching or operations here
    fetchFriends();
    fetchHangouts();
    // Once the data fetching or operations are complete, set refreshing to false
    setRefreshing(false);
  };

  const fetchFriends = async () => {
    try {
      const { data: friendsData, error: friendError } = await supabase
        .from('friends')
        .select('friends_id, user_id_1, user_id_2')
        .or(`user_id_1.eq.${sessionId},user_id_2.eq.${sessionId}`);

      if (!friendError) {
        const friendsIds = getFriendsMetaData(friendsData, sessionId);
        setFriends(friendsIds);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    const delay = 2000; // Delay in milliseconds (2 seconds in this example)

    setLoading(true);
    const timeoutId = setTimeout(() => {
      // Code to be executed after the delay
      fetchFriends();

      // console.log('Timeout executed!');
      setLoading(false);
    }, delay);

    // Cleanup function to cancel the timeout if the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Fetch initial data for hangouts
  useEffect(() => {
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
          // Filter out duplicates based on is_going_id
          const uniqueIsGoingData = isGoingData.filter(
            (item: any, index: number, self: any[]) =>
              self.findIndex((i: any) => i.is_going_id === item.is_going_id) ===
              index,
          );

          setIsGoing((prevState: any) => {
            const mergedData = [...prevState, ...uniqueIsGoingData];
            const uniqueData = mergedData.filter(
              (item: any, index: number, self: any[]) =>
                self.findIndex(
                  (i: any) => i.is_going_id === item.is_going_id,
                ) === index,
            );
            return uniqueData;
          });
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
      .channel('friends-changes')
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
      .channel('hangouts-changes')
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
      .channel('is-going-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'is_going',
        },
        payload => {
          if (payload.eventType == 'INSERT') {
            // console.log('The user has INSERTED1');
            const temp = payload.new;
            setNewIsGoing((prevState: any) => [...prevState, temp]);
          } else if (payload.eventType == 'DELETE') {
            // console.log('The user has DELETE1');
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
      const today = new Date().toDateString();
      const currentTime = new Date();

      const todayHangouts = mergedData.filter((item: Hangout) => {
        const endTime = new Date(item.ends);
        return endTime > currentTime && endTime.toDateString() === today;
      });

      const sortedTodayHangouts = todayHangouts.sort(
        (a: Hangout, b: Hangout) => {
          const dateA = new Date(a.starts);
          const dateB = new Date(b.starts);
          return dateA.getTime() - dateB.getTime();
        },
      );

      const upcomingHangouts = mergedData.filter(
        (item: Hangout) =>
          new Date(item.ends) > currentTime &&
          new Date(item.ends).toDateString() !== today,
      );

      const sortedUpcomingHangouts = upcomingHangouts.sort(
        (a: Hangout, b: Hangout) => {
          const dateA = new Date(a.starts);
          const dateB = new Date(b.starts);
          return dateA.getTime() - dateB.getTime();
        },
      );

      setSections([
        { title: 'Today', data: sortedTodayHangouts },
        { title: 'Upcoming', data: sortedUpcomingHangouts },
      ]);
    } else {
      setSections([]);
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
      headerShown: false,
    });
  }, []);

  // console.log(sections.length, friends.length);

  return (
    <>
      {loading ? (
        // Show the splash screen while loading is true
        <View
          style={{ paddingTop: 48, backgroundColor: 'white' }}
          className="flex flex-1 flex-col items-center">
          <View className="flex w-full flex-row items-center justify-between bg-white px-4 py-2">
            <HangoutBlackLogo />
            <TouchableOpacity onPress={() => sendEmail()}>
              <MessageFeedbackIcon />
            </TouchableOpacity>
          </View>
          <View
            style={{ backgroundColor: '#F3F3F3', flex: 1 }}
            className="w-full">
            <View className="mt-2 flex flex-col space-y-2">
              <View className="mx-2 rounded-2xl bg-white px-2 py-4 shadow-md">
                <View className="flex flex-col space-y-4">
                  <View className="flex flex-row">
                    <ShimmerPlaceholder
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 40,
                        marginLeft: 14,
                      }}
                    />
                    <View className="ml-4 flex  flex-col justify-center space-y-2">
                      <ShimmerPlaceholder
                        style={{
                          width: '33%',
                          height: 12,
                          marginLeft: 10,
                          borderRadius: 12,
                        }}
                      />
                      <ShimmerPlaceholder
                        style={{
                          width: '66%',
                          height: 12,
                          marginLeft: 10,
                          borderRadius: 12,
                        }}
                      />
                      <ShimmerPlaceholder
                        style={{
                          width: '100%',
                          height: 12,
                          marginLeft: 10,
                          borderRadius: 12,
                        }}
                      />
                    </View>
                  </View>

                  <ShimmerPlaceholder
                    style={{
                      width: '100%',
                      height: 106,
                      borderRadius: 20,
                    }}
                  />

                  <ShimmerPlaceholder
                    style={{
                      width: '100%',
                      height: 48,
                      borderRadius: 40,
                    }}
                  />
                </View>
              </View>

              <View className="mx-2 rounded-2xl bg-white px-2 py-4 shadow-md">
                <View className="flex flex-col space-y-4">
                  <View className="flex flex-row">
                    <ShimmerPlaceholder
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 40,
                        marginLeft: 14,
                      }}
                    />
                    <View className="ml-4 flex  flex-col justify-center space-y-2">
                      <ShimmerPlaceholder
                        style={{
                          width: '33%',
                          height: 12,
                          marginLeft: 10,
                          borderRadius: 12,
                        }}
                      />
                      <ShimmerPlaceholder
                        style={{
                          width: '66%',
                          height: 12,
                          marginLeft: 10,
                          borderRadius: 12,
                        }}
                      />
                      <ShimmerPlaceholder
                        style={{
                          width: '100%',
                          height: 12,
                          marginLeft: 10,
                          borderRadius: 12,
                        }}
                      />
                    </View>
                  </View>

                  <ShimmerPlaceholder
                    style={{
                      width: '100%',
                      height: 106,
                      borderRadius: 20,
                    }}
                  />

                  <ShimmerPlaceholder
                    style={{
                      width: '100%',
                      height: 48,
                      borderRadius: 40,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <>
          {friends.length >= 0 &&
          (sections[0]?.data?.length > 0 || sections[1]?.data?.length > 0) ? (
            <View
              style={{ paddingTop: 48, backgroundColor: 'white' }}
              className="flex w-full flex-1 flex-col items-center justify-center">
              <View className="flex w-full flex-row items-center justify-between bg-white px-4 py-2">
                <HangoutBlackLogo />
                <TouchableOpacity onPress={() => sendEmail()}>
                  <MessageFeedbackIcon />
                </TouchableOpacity>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                className="w-full flex-1 "
                style={{ backgroundColor: '#F3F3F3' }}>
                <View className="flex-1">
                  {loading ? null : (
                    <>
                      {sections[0].data.map((item, idx) => {
                        return (
                          <View className="py-[6px]" key={idx}>
                            <Card
                              {...item}
                              key={idx}
                              sessionId={sessionId}
                              navigation={navigation}
                            />
                          </View>
                        );
                      })}
                      {sections[1].data.map((item, idx) => {
                        return (
                          <View className="py-[6px]" key={idx}>
                            <Card
                              {...item}
                              key={idx}
                              sessionId={sessionId}
                              navigation={navigation}
                            />
                          </View>
                        );
                      })}
                    </>
                  )}
                </View>
              </ScrollView>
            </View>
          ) : friends.length === 0 &&
            sections[0]?.data?.length === 0 &&
            sections[1]?.data?.length === 0 ? (
            <View
              style={{ paddingTop: insets.top }}
              className="flex flex-1 flex-col items-center justify-center">
              <View
                className="absolute left-0 top-0 z-50 flex  w-full bg-white px-4"
                style={{ paddingTop: insets.top }}>
                <View className="flex-1 flex-row items-center justify-between pb-2 pt-2">
                  <HangoutBlackLogo />
                  <TouchableOpacity onPress={() => sendEmail()}>
                    <MessageFeedbackIcon />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-1 justify-center shadow-lg">
                <View className="mx-[7%] flex h-[551px] flex-col items-center rounded-xl bg-white px-4">
                  <View className="flex w-full flex-col items-center">
                    <Image
                      source={require('../../../../assets/images/emptystate/add-friends.png')}
                      className="mt-4"
                    />
                    <RoquefortText
                      fontType="Roquefort-Semi-Strong"
                      style={{
                        fontSize: 24,
                      }}
                      className="mt-4 text-center">
                      Life’s better together
                    </RoquefortText>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: '#808080',
                      }}
                      className="my-3 text-center">
                      Add your friends to get started
                    </Text>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('Search')}
                      className="flex h-[48px] w-full px-4">
                      <LinearGradient
                        colors={['#7000FF', '#B174FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="h-12 w-full items-center justify-center  rounded-full">
                        <View className="flex w-full flex-row items-center justify-center  space-x-1">
                          <View>
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: '500',
                                textAlign: 'center',
                                color: 'white',
                              }}>
                              Add friends
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <BottomCreateIndicator />
            </View>
          ) : friends.length > 0 &&
            sections[0]?.data?.length === 0 &&
            sections[1]?.data?.length === 0 ? (
            <View
              style={{ paddingTop: insets.top }}
              className="flex flex-1 flex-col items-center justify-center">
              <View
                className="absolute left-0 top-0 z-50 flex  w-full bg-white px-4"
                style={{ paddingTop: insets.top }}>
                <View className="flex-1 flex-row items-center justify-between pb-2 pt-2">
                  <HangoutBlackLogo />
                  <TouchableOpacity onPress={() => sendEmail()}>
                    <MessageFeedbackIcon />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-1 justify-center shadow-lg">
                <View className="mx-[7%] flex h-[551px] flex-col items-center rounded-xl bg-white px-4">
                  <View className="flex w-full flex-col items-center">
                    <Image
                      source={require('../../../../assets/images/emptystate/new-hangout.png')}
                      className="mt-4"
                    />
                    <RoquefortText
                      fontType="Roquefort-Semi-Strong"
                      style={{
                        fontSize: 24,
                      }}
                      className="mt-4 text-center">
                      Let's do something!
                    </RoquefortText>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: '#808080',
                      }}
                      className="my-3 text-center">
                      Create a new hangout to get started
                    </Text>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('NewHangoutStackTemp')}
                      className="flex h-[48px] w-full px-4">
                      <LinearGradient
                        colors={['#7000FF', '#B174FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="h-12 w-full items-center justify-center  rounded-full">
                        <View className="flex w-full flex-row items-center justify-center  space-x-1">
                          <View>
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: '500',
                                textAlign: 'center',
                                color: 'white',
                              }}>
                              New Hangout
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <BottomCreateIndicator />
            </View>
          ) : null}
        </>
      )}
    </>
  );
};

export default Home;
