import React, { useState, useEffect } from 'react';

import { View, Text, TouchableOpacity, Alert } from 'react-native';

import AvatarIconGroup from './AvatarGroup';
import { ClockIcon, CalendarIcon } from './Icons';

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

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

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
        <View
          className={`flex flex-row justify-between py-4 ${
            sessionId !== user_id || going.length > 1 ? 'items-center' : ''
          }`}>
          {/* Icon */}
          <View className="w-[25%] items-start justify-center">
            <AvatarIconGroup userId={user_id} users={going} />
          </View>

          {/* Info */}
          <View className="ml-3 flex w-[75%] flex-1 flex-col justify-center ">
            <View>
              <Text style={{ fontWeight: '500', fontSize: 20 }}>{title}</Text>
            </View>

            <View className="mt-1">
              <Text
                numberOfLines={1}
                ellipsizeMode="clip"
                style={{ fontWeight: '400', fontSize: 12, color: '#808080' }}>
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
      </TouchableOpacity>
    </>
  );
};

export default Event;
