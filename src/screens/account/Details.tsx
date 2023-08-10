import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import GoingButton from '../../components/GoingButton';
import Avatar from '../../components/Avatar';

import {
  DirectionsIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  MessagesIcon,
  ExportSquareIcon,
  CalendarIcon,
  ClockIcon,
  CloseIconGray,
} from '../../components/Icons';

import { supabase } from '../../lib/supabase';

import { hangoutUrl, hangoutInviteMessage } from '../../utils/constants';

import useIsGoing from '../../hooks/useIsGoing';
import { useChatContext } from '../../context/ChatContext';

import MapView, { Marker } from 'react-native-maps';

const Details = ({ navigation, route }: { navigation: any; route: any }) => {
  const {
    going,
    id,
    user_id,
    title,
    details,
    location,
    starts,
    ends,
    created_at,
    sessionId,
  } = route.params;

  const address = location[0].address;
  const locationTitle = location[0].title;

  const { navigateToGroupChatRoom, joinGroupChatRoom } = useChatContext();

  if (!id || !sessionId) {
    // If id or sessionId is undefined, you might want to handle it here
    return null; // or return some placeholder content
  }

  const { isGoing, setIsGoing } = useIsGoing(id, sessionId); // Use the useIsGoing hook

  const [newDate, setNewDate] = useState<any>([]);
  const [newTime, setNewTime] = useState<any>([]);

 
  const handleGoingPress = async () => {
    if (isGoing === false) {
      const { data, error } = await supabase
        .from('is_going')
        .insert([{ hangout_id: id, user_id: sessionId }]);
      joinGroupChatRoom(id, sessionId);
      setIsGoing(true);
    } else {
      showAlert();
    }
  };

  const notGoing = async () => {
    const { data, error } = await supabase
      .from('is_going')
      .delete()
      .eq('hangout_id', id)
      .eq('user_id', sessionId);

    setIsGoing(false);
    navigation.goBack();
  };

  const handleMapsPress = async () => {
    const location = encodeURIComponent(address);
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${location}`;
    const appleMapsLink = googleMapsLink.replace(
      'https://www.google.com/maps/search/?api=1&query=',
      `http://maps.apple.com/?q=`,
    );

    try {
      const supported = await Linking.canOpenURL(appleMapsLink);

      if (supported) {
        await Linking.openURL(appleMapsLink);
      } else {
        Linking.openURL(googleMapsLink);
        console.log('Apple Maps is not supported on this device.');
      }
    } catch (error) {
      console.error('An error occurred while opening Apple Maps:', error);
    }
  };

  const handleUserPress = (userId: any) => {
    // console.log(userId, sessionId)
    if (userId === sessionId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Search', {
        screen: 'PublicProfile',
        params: {
          userId: userId,
          sessionId: sessionId,
        },
      });
    }
  };

  const handleMessagesPress = () => {
    navigateToGroupChatRoom(id);
  };

  const showAlert = () => {
    Alert.alert(
      'Not going?',
      'Are you sure you want to remove this hangout from your going',
      [
        {
          text: 'Cancel',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => notGoing(),
        },
      ],
      { cancelable: false },
    );
  };

  const onShare = () => {
    let message =
      title +
      '\n' +
      newDate[0].date +
      ' ' +
      newTime[0].time +
      '-' +
      newTime[1].time +
      '\n';

    if (!address.includes(locationTitle)) {
      message += locationTitle + '\n';
    }

    message += address;

    Share.share({
      url: hangoutUrl,
      message: message,
      title: 'Hangout',
    });
  };

  // useEffect(() => {
  //   setIsGoing(going.some((item: any) => item.id === sessionId));
  // }, [going, sessionId, isGoing]);

  useEffect(() => {
    const date1 = new Date(starts);
    const date2 = new Date(ends);

    const startTime = date1
      .toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      .replace(/\s/g, '')
      .toLowerCase();

    const startDate = date1.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const endTime = date2
      .toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      .replace(/\s/g, '')
      .toLowerCase();

    const endDate = date2.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const isSameDay =
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    if (isSameDay) {
      setNewDate([{ date: startDate }]);
      setNewTime([{ time: startTime }, { time: endTime }]);
    } else {
      setNewDate([{ date: startDate }, { date: endDate }]);
      setNewTime([{ time: startTime }, { time: endTime }]);
    }
  }, [starts, ends]);

  return (
    <>
      <View className="relative rounded-2xl bg-white px-4 pb-4 pt-4">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          className="absolute right-4 top-3 z-50">
          <CloseIconGray />
        </TouchableOpacity>

        <View className="flex flex-col">
          <View>
            <Text
              className="w-[90%]"
              style={{
                fontSize: 24,
                fontWeight: '600',
                paddingBottom: 14,
                paddingTop: 4,
              }}>
              {title}
            </Text>
          </View>

          {newDate && newDate.length > 1 && (
            <View
              className="flex flex-row items-center space-x-2"
              style={{ paddingBottom: 14 }}>
              <View className="flex flex-col">
                <View
                  className="flex flex-row space-x-2"
                  style={{ paddingBottom: 8 }}>
                  <CalendarIcon />
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {newDate[0].date}
                  </Text>
                </View>
                <View className="flex flex-row space-x-2">
                  <ClockIcon />
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {newTime[0].time}
                  </Text>
                </View>
              </View>
              <ArrowRightIcon />
              <View className="flex flex-col">
                <View
                  className="flex flex-row space-x-2"
                  style={{ paddingBottom: 8 }}>
                  <CalendarIcon />
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {newDate[1].date}
                  </Text>
                </View>
                <View className="flex flex-row space-x-2">
                  <ClockIcon />
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {newTime[1].time}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {newDate && newDate.length === 1 && (
            <View className="flex flex-col" style={{ paddingBottom: 14 }}>
              <View
                className="flex flex-row space-x-2"
                style={{ paddingBottom: 8 }}>
                <CalendarIcon />
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  {newDate[0].date}
                </Text>
              </View>
              <View className="flex flex-row items-center space-x-2">
                <ClockIcon />
                <View className="flex flex-row items-center space-x-1">
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {newTime[0].time}
                  </Text>
                  <ArrowRightIcon />
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {newTime[1].time}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {details != '' && (
            <View style={{ paddingBottom: 14 }}>
              <Text
                style={{ fontSize: 14, fontWeight: '400', color: '#808080' }}>
                {details}
              </Text>
            </View>
          )}

          {sessionId !== user_id ? (
            <View>
              <GoingButton onPress={handleGoingPress} isGoing={isGoing} />
            </View>
          ) : (
            <View className="flex flex-row space-x-2 ">
              <TouchableOpacity
                className="w-1/2"
                onPress={() =>
                  navigation.navigate('EditHangoutStack', {
                    screen: 'EditHangout',
                    params: {
                      id: id,
                      user_id: user_id,
                      title: title,
                      details: details,
                      location: location,
                      starts: starts,
                      ends: ends,
                    },
                  })
                }>
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
                          Edit details
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
                          Edit details
                        </Text>
                      </LinearGradient>
                    </MaskedView>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity className="w-1/2" onPress={onShare}>
                <LinearGradient
                  colors={['#7000FF', '#B174FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-full rounded-full">
                  <View className="flex h-12 flex-row items-center justify-center space-x-2">
                    <ExportSquareIcon color="#FFF" />
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        fontWeight: '500',
                      }}>
                      Share hangout
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <ScrollView className="flex flex-col space-y-2">
        <View className="h-[175px] items-center justify-center">
          <TouchableWithoutFeedback onPress={handleMapsPress}>
            <MapView
              className="h-full w-full"
              initialRegion={{
                latitude: location[0].geometry.lat,
                longitude: location[0].geometry.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
              }}
              mapType="mutedStandard"
              scrollEnabled={false}
              zoomEnabled={false}>
              <Marker
                coordinate={{
                  latitude: location[0].geometry.lat,
                  longitude: location[0].geometry.lng,
                }}
              />
            </MapView>
          </TouchableWithoutFeedback>
        </View>

        <View className="flex flex-row items-center justify-between rounded-2xl bg-white p-4">
          <View className="w-3/5">
            {location[0].address.includes(location[0].title) ? (
              <>
                <Text
                  style={{ fontSize: 16, fontWeight: '600' }}
                  className="mb-1">
                  {location[0].address}
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{ fontSize: 16, fontWeight: '600' }}
                  className="mb-1">
                  {location[0].title}
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#808080' }}>
                  {location[0].address}
                </Text>
              </>
            )}
          </View>

          <TouchableOpacity className="w-36" onPress={handleMapsPress}>
            <LinearGradient
              colors={['#7000FF', '#B174FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-12 w-full items-center justify-center rounded-full">
              <View className="flex flex-row items-center justify-center space-x-2">
                <DirectionsIcon />
                <Text
                  style={{ fontSize: 14, color: 'white', fontWeight: '400' }}>
                  Open in Maps
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {isGoing && (
          <TouchableOpacity
            className="flex h-16 flex-row items-center justify-between rounded-2xl bg-white  px-4"
            onPress={handleMessagesPress}>
            <View className="flex flex-row items-center space-x-2">
              <LinearGradient
                colors={['#7000FF', '#B174FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-full p-2">
                <MessagesIcon color="#FFF" />
              </LinearGradient>

              <Text className="font-medium">Messages</Text>
            </View>

            <View>
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>
        )}

        {going && (
          <View className="rounded-2xl bg-white px-4 pb-6 pt-2">
            <Text className="py-2 text-xl">Going</Text>
            <View className="flex flex-col space-y-4">
              {going
                .slice()
                .sort((a: any, b: any) => {
                  if (a.id === user_id) {
                    return -1; // `a` is the user, so it should come first
                  }
                  if (b.id === user_id) {
                    return 1; // `b` is the user, so it should come first
                  }
                  return 0; // maintain the original order
                })
                .map((item: any, idx: number) => {
                  return (
                    <TouchableOpacity
                      key={idx}
                      className="flex flex-row space-x-2"
                      onPress={() => {
                        handleUserPress(item.id);
                      }}>
                      <View>
                        <Avatar
                          key={idx}
                          name={item.first_name + ' ' + item.last_name}
                          source={item.avatar}
                          size={45}
                        />
                      </View>

                      <View className="flex flex-col justify-center space-y-1">
                        <View>
                          <Text className=" ">
                            {item.first_name + ' ' + item.last_name}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-gray-500">
                            @{item.username}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Details;
