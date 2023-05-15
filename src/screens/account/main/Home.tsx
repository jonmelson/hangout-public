import React, { useState, useEffect } from 'react';
import { Text, View, SectionList, ActivityIndicator } from 'react-native';
import RoquefortText from '../../../components/RoquefortText';

import Header from '../../../components/Header';
import Event from '../../../components/Event';
import GradientButton from '../../../components/GradientButton';

import { supabase } from '../../../lib/supabase';

import BottomCreateIndicator from '../../../components/BottomCreateIndicator';

import { Hangout, Section } from '../../../utils/other';

import { getFriendsMetaData } from '../../../utils/queries';

import { NavigationProps } from '../../../utils/navigation';

const Home = (props: NavigationProps) => {
  const { navigation, sessionId } = props;

  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<any>([]);
  const [hangouts, setHangouts] = useState<any>([]);
  const [isGoing, setIsGoing] = useState<any>([]);
  const [newIsGoing, setNewIsGoing] = useState<any>([]);
  const [mergedData, setMergedData] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);

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
            console.log('The user has INSERTED HANGOUT');
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
            console.log('The user has INSERTED1');
            const temp = payload.new;
            setNewIsGoing((prevState: any) => [...prevState, temp]);
          } else if (payload.eventType == 'DELETE') {
            console.log('The user has DELETE1');
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

  // console.log('hereere');
  // console.log(isGoing);

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
      setLoading(true);
      const today = new Date().toDateString();
      const upcoming = mergedData.filter(
        (item: Hangout) => new Date(item.starts) > new Date(),
      );

      const todayHangouts = mergedData.filter(
        (item: Hangout) => new Date(item.starts).toDateString() === today,
      );
      const upcomingHangouts = upcoming.filter(
        (item: Hangout) => new Date(item.starts).toDateString() !== today,
      );

      setSections([
        { title: 'Today', data: todayHangouts },
        { title: 'Upcoming', data: upcomingHangouts },
      ]);
      setLoading(false);
    } else {
      setSections([]);
      setLoading(false);
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

  return (
    <>
      <Header navigation={navigation} sessionId={sessionId} />
      {friends && friends.length > 0 ? (
        <View className="flex-1 bg-white">
          {sections[0].data.length > 0 || sections[1].data.length > 0 ? (
            <>
              {loading ? (
                <View className="items-center justify-center">
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : (
                <SectionList
                  sections={sections}
                  renderSectionHeader={({ section }) => {
                    if (section.data.length === 0) {
                      return null;
                    }

                    return (
                      <View className="bg-white pt-4 pb-2">
                        <View className="ml-4 border-b border-gray-300">
                          <Text className="mb-1 text-gray-500">
                            {section.title}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                  renderItem={({ item }) => (
                    <View className="py-2">
                      <Event
                        {...item}
                        sessionId={sessionId}
                        navigation={navigation}
                      />
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </>
          ) : (
            <>
              <View className="flex-1 pt-40">
                <View className="mx-12 flex flex-col items-center justify-center space-y-4 ">
                  <Text
                    style={{
                      fontSize: 48,
                    }}
                    className="text-center">
                    🏄‍♂️️
                  </Text>
                  <RoquefortText
                    style={{
                      fontSize: 24,
                      fontWeight: '500',
                    }}
                    className="text-center">
                    Let's do something!
                  </RoquefortText>
                  <Text
                    style={{ fontSize: 16 }}
                    className="text-center text-gray-500">
                    Nothing upcoming... Create a new hangout to get started
                  </Text>
                </View>
                <View className="mt-4 px-12">
                  <GradientButton
                    onPress={() => navigation.navigate('NewHangoutStackTemp')}
                    disabled={false}
                    title="New hangout"
                    size={20}
                    padding={12}
                  />
                </View>
              </View>
              <BottomCreateIndicator />
            </>
          )}
        </View>
      ) : (
        <View className="flex-1 bg-white">
          <View className="flex-1 pt-40">
            <View className="mx-12 flex flex-col items-center justify-center space-y-4 ">
              <Text
                style={{
                  fontSize: 48,
                }}
                className="text-center">
                🧑🏼👩🏽‍🦱👨🏼‍🦱🧔🏻
              </Text>
              <RoquefortText
                style={{
                  fontSize: 24,
                  fontWeight: '500',
                }}
                className="text-center">
                Life's better together!
              </RoquefortText>
              <Text
                style={{ fontSize: 16 }}
                className="text-center text-gray-500">
                Add your friends to get started
              </Text>
            </View>
            <View className="mt-4 px-12">
              <GradientButton
                onPress={() => navigation.navigate('Friends')}
                title="Add friends"
                disabled={false}
                size={20}
                padding={12}
              />
            </View>
          </View>
          <BottomCreateIndicator />
        </View>
      )}
    </>
  );
};

export default Home;
