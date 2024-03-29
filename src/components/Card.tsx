import React, { useState, useEffect, useRef } from 'react';

import { View, Text, TouchableOpacity, Alert, Share } from 'react-native';

import CardGoingButton from './CardGoingButton';
import Avatar from './Avatar';
import AvatarGroup from './AvatarGroup';
import { ClockIcon, CalendarIcon, ExportSquareIcon } from './Icons';
import MapView, { Marker } from 'react-native-maps';
import CardEditDetailsButton from '../components/CardEditDetailsButton';

import { LinearGradient } from 'expo-linear-gradient';

import { hangoutUrl } from '../utils/constants';

import { supabase } from '../lib/supabase';

import { EventProps } from '../utils/other';
import { useChatContext } from '../context/ChatContext';
import useIsGoing from '../hooks/useIsGoing';

const Card = (props: EventProps) => {
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
    navigation,
    sessionId,
  } = props;

  const { joinGroupChatRoom, removeUserFromGroupChatRoom } = useChatContext();

  if (!id || !sessionId) {
    // If id or sessionId is undefined, you might want to handle it here
    return null; // or return some placeholder content
  }

  const { isGoing, setIsGoing } = useIsGoing(id, sessionId); // Use the useIsGoing hook

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState(location);

  const address = location && location[0] ? location[0].address : '';
  const locationTitle = location && location[0] ? location[0].title : '';

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    setNewLocation(location);
  }, [location]);

  useEffect(() => {
    mapRef.current?.animateToRegion({
      latitude: newLocation[0].geometry.lat,
      longitude: newLocation[0].geometry.lng,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    });
  }, [newLocation]);

  useEffect(() => {
    setNewLocation(location);
  }, [location]);

  const handleShareHangout = () => {
    let message =
      title + '\n' + newDate + ' ' + newTime.replace(/\s/g, '') + '\n';

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

  const handlePress = async () => {
    if (isGoing === false) {
      const { data, error } = await supabase
        .from('is_going')
        .insert([{ hangout_id: id, user_id: sessionId }]);
      joinGroupChatRoom(id, sessionId);
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
    removeUserFromGroupChatRoom(id, sessionId);
  };

  const showAlert = () => {
    Alert.alert(
      'Not going?',
      'Are you sure you want to remove this hangout from your going',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Canceled'),
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

  useEffect(() => {
    setIsGoing(going.some(item => item.id === sessionId));
  }, [going, sessionId, isGoing]);

  useEffect(() => {
    const isSameDay = () => {
      const startDate = new Date(starts);
      const endDate = new Date(ends);
      return (
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate()
      );
    };

    let displayTime;
    if (isSameDay()) {
      const startTime = new Date(starts)
        .toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })
        .replace(/\s/g, '')
        .toLowerCase();

      const endTime = new Date(ends)
        .toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })
        .replace(/\s/g, '')
        .toLowerCase();

      displayTime = `${startTime} - ${endTime}`;
    } else {
      const startTime = new Date(starts)
        .toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })
        .replace(/\s/g, '')
        .toLowerCase();

      displayTime = startTime;
    }

    const formattedDate = new Date(starts).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setNewDate(formattedDate);
    setNewTime(displayTime);
  }, [starts, ends]);

  return (
    <>
      <TouchableOpacity
        className="mx-2 rounded-2xl bg-white px-2 py-4 shadow-md"
        onPress={() =>
          navigation.navigate('Details', {
            going: going,
            id: id,
            user_id: user_id,
            title: title,
            details: details,
            location: location,
            starts: starts,
            ends: ends,
            created_at: created_at,
            sessionId: sessionId,
          })
        }>
        <View className="flex flex-col space-y-3">
          <View
            className={`flex flex-row ${
              sessionId !== user_id || going.length > 1 ? 'items-center' : ''
            }`}>
            {/* Icon */}
            <View className="items-center justify-center">
              <AvatarGroup userId={user_id} users={going} />
            </View>

            {/* Info */}
            <View className="ml-5 flex flex-1 flex-col justify-center">
              <View>
                <Text style={{ fontSize: 20, fontWeight: '500' }}>{title}</Text>
              </View>

              <View className="mt-1">
                <Text
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  style={{ fontSize: 12, fontWeight: '400', color: '#808080' }}>
                  {location[0].address}
                </Text>
              </View>

              <View className="mt-2 flex flex-row items-center space-x-2">
                <View className="flex flex-row items-center space-x-1">
                  <CalendarIcon />
                  <Text style={{ fontSize: 14, fontWeight: '400' }}>
                    {newDate}
                  </Text>
                </View>

                <View className="flex flex-row items-center space-x-1">
                  <ClockIcon />
                  <Text style={{ fontSize: 14, fontWeight: '400' }}>
                    {newTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Map */}
          <View className="flex h-[100px] items-center justify-center ">
            <MapView
              ref={mapRef}
              style={{ borderRadius: 20 }}
              className="h-full w-full rounded-xl"
              initialRegion={{
                latitude: newLocation[0].geometry.lat,
                longitude: newLocation[0].geometry.lng,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }}
              mapType="mutedStandard"
              scrollEnabled={false}
              zoomEnabled={false}>
              <Marker
                coordinate={{
                  latitude: newLocation[0].geometry.lat,
                  longitude: newLocation[0].geometry.lng,
                }}
              />
            </MapView>
          </View>

          {/* Going Button */}
          {sessionId !== user_id ? (
            <View className="mt-2">
              <CardGoingButton onPress={handlePress} isGoing={isGoing} />
            </View>
          ) : (
            <View className="mt-2 flex flex-row">
              <CardEditDetailsButton
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
                }
              />
              <TouchableOpacity
                className="w-1/2 pl-1"
                onPress={handleShareHangout}>
                <LinearGradient
                  colors={['#7000FF', '#B174FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-12 w-full items-center justify-center rounded-full">
                  <View className="flex flex-row items-center justify-center space-x-2">
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
      </TouchableOpacity>
    </>
  );
};

export default Card;
