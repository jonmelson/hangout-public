import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
  TouchableWithoutFeedback,
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
} from '../../components/Icons';

import { supabase } from '../../lib/supabase';

import { hangoutUrl, hangoutInviteMessage } from '../../utils/constants';

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

  const [newDate, setNewDate] = useState<any>([]);
  const [newTime, setNewTime] = useState<any>([]);
  const [isGoing, setIsGoing] = useState(false);

  const handleGoingPress = async () => {
    if (isGoing === false) {
      const { data, error } = await supabase
        .from('is_going')
        .insert([{ hangout_id: id, user_id: sessionId }]);

      setIsGoing(true);
    } else if (isGoing === true) {
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
    Share.share({
      url: hangoutUrl + '/' + id,
      message: hangoutInviteMessage + ' ' + title,
      title: 'Hangout',
    });
  };

  const handleUserPress = (userId: any, sessionId: any) => {
    if (userId === sessionId) {
      navigation.replace('ProfileStack', { screen: 'ProfileScreen' });
    } else {
      navigation.replace('PublicProfile', {
        userId: userId,
        sessionId: sessionId,
      });
    }
  };

  useEffect(() => {
    going.forEach((item: any) => {
      if (item.id === sessionId) {
        setIsGoing(true);
      }
    });
  }, [going]);

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
    <View className="flex flex-col space-y-2">
      <View className="rounded-2xl bg-white px-4 pb-4 pt-4">
        <View className="items-center">
          <View className="h-1 w-10 rounded-full bg-gray-300"></View>
        </View>
        <View className="flex flex-col space-y-4">
          <View>
            <Text className="text-xl font-semibold">{title}</Text>
          </View>

          {newDate && newDate.length > 1 && (
            <View className="flex flex-row items-center space-x-2">
              <View className="flex flex-col space-y-1">
                <View className="flex flex-row space-x-2">
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
              <View className="flex flex-col space-y-1">
                <View className="flex flex-row space-x-2">
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
            <View className="flex flex-col space-y-1">
              <View className="flex flex-row space-x-2">
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
            <View>
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
                  navigation.navigate('EditHangout', {
                    id: id,
                    user_id: user_id,
                    title: title,
                    details: details,
                    location: location,
                    starts: starts,
                    ends: ends,
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
              <Text style={{ fontSize: 14, color: 'white', fontWeight: '400' }}>
                Open in Maps
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="flex h-16 flex-row items-center justify-between rounded-2xl bg-white  px-4"
        onPress={() => {}}>
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
                      handleUserPress(item.id, user_id);
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
                        <Text className="text-gray-500">@{item.username}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      )}
    </View>
  );
};

export default Details;
