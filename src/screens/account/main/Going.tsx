import React, { useState, useEffect } from 'react';

import { Text, View, SectionList } from 'react-native';
import RoquefortText from '../../../components/RoquefortText';

import Event from '../../../components/Event';
import Selector from '../../../components/Selector';
import GradientButton from '../../../components/GradientButton';
import BottomCreateIndicator from '../../../components/BottomCreateIndicator';

import { supabase } from '../../../lib/supabase';

import { NavigationProps } from '../../../utils/navigation';

import { Hangout, Section } from '../../../utils/other';

import { getFriendsMetaData } from '../../../utils/queries';

const Going = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};
  const [friends, setFriends] = useState<any>([]);
  const [hangouts, setHangouts] = useState<any>([]);
  const [isGoing, setIsGoing] = useState<any>([]);
  const [newIsGoing, setNewIsGoing] = useState<any>([]);
  const [mergedData, setMergedData] = useState<any>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [upcomingSections, setUpcomingSections] = useState<Section[]>([]);
  const [hostingSections, setHostingSections] = useState<Section[]>([]);
  const [pastSections, setPastSections] = useState<Section[]>([]);
  const [showPast, setShowPast] = useState(false);

  const handleTabPress = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

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
      .channel('friends-changes2')
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
      .channel('hangouts-changes2')
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
      .channel('is-going-changes2')
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
    if (pastSections[0] && pastSections[0].data.length > 0) {
      setShowPast(true);
    } else {
      setShowPast(false);
      setActiveTab(0);
    }
  }, [pastSections]);

  useEffect(() => {
    if (mergedData) {
      const today = new Date().getTime();

      // const upcomingHangouts = mergedData.filter(
      //   (item: Hangout) => new Date(item.starts).getTime() > today,
      // );

      const upcomingHangouts = mergedData
        .filter((item: Hangout) => {
          // Assuming `username` is the property of the `item` object
          return item.going.some(
            (goingItem: any) => goingItem.id === sessionId,
          );
        })
        .filter((item: Hangout) => new Date(item.starts).getTime() > today);

      // console.log(upcomingHangouts[1].going[0].id);

      const hostingHangouts = mergedData.filter(
        (item: Hangout) =>
          new Date(item.starts).getTime() > today && item.user_id === sessionId,
      );

      const pastHangouts = mergedData
        .filter((item: Hangout) => {
          // Assuming `username` is the property of the `item` object
          return item.going.some(
            (goingItem: any) => goingItem.id === sessionId,
          );
        })
        .filter((item: Hangout) => new Date(item.starts).getTime() < today);

      // Set upcoming
      setUpcomingSections([{ title: 'Upcoming', data: upcomingHangouts }]);

      // Set hosting
      setHostingSections([{ title: 'Hosting', data: hostingHangouts }]);

      // Set past
      setPastSections([{ title: 'Past', data: pastHangouts }]);
    } else {
      setUpcomingSections([]);
      setHostingSections([]);
      setPastSections([]);
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
    <View className="flex-1 items-center justify-center bg-white">
      <Selector
        leftTab="Upcoming"
        middleTab="Hosting"
        rightTab="Past"
        activeTab={activeTab}
        handleTabPress={handleTabPress}
        showPast={showPast}
      />

      <View className="w-full flex-1 bg-white">
        {activeTab === 0 && (
          <>
            {upcomingSections[0] && upcomingSections[0].data.length > 0 ? (
              <SectionList
                sections={upcomingSections}
                renderItem={({ item }) => (
                  <View className="py-4">
                    <Event
                      {...item}
                      sessionId={sessionId}
                      navigation={navigation}
                    />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <View className="flex-1 bg-white">
                <View className="flex-1 justify-center">
                  <View className="mx-12 flex flex-col items-center justify-center space-y-4 ">
                    <Text
                      style={{
                        fontSize: 48,
                      }}
                      className="text-center">
                      🔍
                    </Text>
                    <RoquefortText className="text-center text-2xl">
                      Find something to do!
                    </RoquefortText>
                    <Text
                      style={{ fontSize: 16 }}
                      className="text-center text-gray-500">
                      Explore upcoming hangouts on the home page. Select to
                      confirm.
                    </Text>
                  </View>
                  <View className="mt-4 px-12">
                    <GradientButton
                      onPress={() => navigation.navigate('Home')}
                      title="Explore hangouts"
                      disabled={false}
                      size={20}
                    />
                  </View>
                </View>
                <BottomCreateIndicator />
              </View>
            )}
          </>
        )}

        {activeTab === 1 && (
          <>
            {hostingSections[0] && hostingSections[0].data.length > 0 ? (
              <SectionList
                sections={hostingSections}
                renderItem={({ item }) => (
                  <View className="py-4">
                    <Event
                      {...item}
                      sessionId={sessionId}
                      navigation={navigation}
                    />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <View className="flex-1 bg-white">
                <View className="flex-1 justify-center">
                  <View className="mx-12 flex flex-col items-center justify-center space-y-4 ">
                    <Text
                      style={{
                        fontSize: 48,
                      }}
                      className="text-center">
                      🧑🏼👩🏽‍🦱👨🏼‍🦱🧔🏻
                    </Text>
                    <RoquefortText className="text-center text-2xl">
                      Bring your friends together!
                    </RoquefortText>
                    <Text
                      style={{ fontSize: 16 }}
                      className="text-center text-gray-500">
                      Create a new hangout to get started
                    </Text>
                  </View>
                  <View className="mt-4 px-12">
                    <GradientButton
                      onPress={() => navigation.navigate('NewHangoutStackTemp')}
                      title="New hangout"
                      disabled={false}
                      size={20}
                    />
                  </View>
                </View>
                <BottomCreateIndicator />
              </View>
            )}
          </>
        )}

        {activeTab === 2 && (
          <>
            {pastSections[0] && pastSections[0].data.length > 0 ? (
              <SectionList
                sections={pastSections}
                renderItem={({ item }) => (
                  <View className="py-4">
                    <Event
                      {...item}
                      sessionId={sessionId}
                      navigation={navigation}
                    />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

export default Going;
