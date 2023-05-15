import React, { useState, useEffect } from 'react';

import { View, Text, TouchableOpacity, Alert } from 'react-native';

import GoingButton from './GoingButton';
import AvatarIconGroup from './AvatarGroup';
import { ClockIcon, CalendarIcon } from './Icons';

import { supabase } from '../lib/supabase';

import { EventProps } from '../utils/other';

const Event = (props: EventProps) => {
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

  const [isGoing, setIsGoing] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handlePress = async () => {
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
  }, [going, sessionId]);

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
        <View className="mx-4 flex flex-row items-center  justify-between">
          {/* Icon */}
          <View style={{ width: '30%' }}>
            <AvatarIconGroup userId={user_id} users={going} />
          </View>

          {/* Info */}
          <View style={{ width: '70%' }} className="flex  flex-col">
            <View>
              <Text className="text-lg ">{title}</Text>
            </View>

            <View className="mt-1">
              <Text
                numberOfLines={1}
                ellipsizeMode="clip"
                className="text-xs text-gray-500">
                {location[0].address}
              </Text>
            </View>

            <View className="mt-1 flex flex-row items-center space-x-2">
              <View className="flex flex-row items-center space-x-1">
                <CalendarIcon />
                <Text>{newDate}</Text>
              </View>

              <View className="flex flex-row items-center space-x-1">
                <ClockIcon />
                <Text>{newTime}</Text>
              </View>
            </View>

            {sessionId !== user_id ? (
              <View className="mt-4">
                <GoingButton onPress={handlePress} isGoing={isGoing} />
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default Event;
