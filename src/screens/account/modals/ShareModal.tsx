import React, { useEffect, useState } from 'react';

import { View, TouchableOpacity, Text, Share, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import Avatar from '../../../components/Avatar';
import {
  CalendarIcon,
  ClockIcon,
  ExportSquareIcon,
  CloseIcon,
} from '../../../components/Icons';

import { supabase } from '../../../lib/supabase';

import { LocationMetaData } from '../../../utils/other';

const ShareModal = ({
  navigation,
  sessionId,
  onClose,
}: {
  navigation: any;
  sessionId: any;
  onClose?: () => void;
}) => {
  const [hangoutId, setHangoutId] = useState('');
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState<LocationMetaData[]>([]);
  const [starts, setStarts] = useState<Date>(new Date());
  const [ends, setEnds] = useState<Date>(new Date());

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const address = location && location[0] ? location[0].address : '';

  const fullName = firstName + ' ' + lastName;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      let { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionId);

      if (error) {
        console.error(error);
      } else {
        setFirstName(profile?.[0]?.first_name);
        setLastName(profile?.[0]?.last_name);
        setLocation(profile?.[0]?.location);
        setAvatarUrl(profile?.[0]?.avatar);
      }
    };

    const getHangout = async () => {
      let { data: user, error } = await supabase
        .from('hangouts')
        .select('*')
        .eq('user_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error(error);
      } else {
        setHangoutId(user?.[0]?.id);
        setUserId(user?.[0]?.user_id);
        setTitle(user?.[0]?.title);
        setDetails(user?.[0]?.details);
        setLocation(user?.[0]?.location);
        setStarts(user?.[0]?.starts);
        setEnds(user?.[0]?.ends);
      }
    };

    const fetchData = async () => {
      await getProfile();
      await getHangout();
    };
    fetchData();
  }, []);

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

    setDate(formattedDate);
    setTime(displayTime);
  }, [starts, ends]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
      <View className="h-62 flex w-5/6 flex-col space-y-3 rounded-2xl  bg-white p-4">
        <View className="flex flex-row justify-end">
          <TouchableOpacity onPress={onClose}>
            <View style={{ alignSelf: 'flex-end' }}>
              <CloseIcon />
            </View>
          </TouchableOpacity>
        </View>

        <View className="items-center justify-center  text-center">
          <Text className="mb-4 text-xl">Your hangout is live!</Text>
          <View className="mb-4">
            <Avatar source={avatarUrl} name={fullName} size={80} />
          </View>

          <Text className="mb-1 text-lg">{title}</Text>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="mb-2 text-center text-gray-600">
            {address}
          </Text>

          <View className="mb-4 flex flex-row items-center space-x-2">
            <View className="flex flex-row items-center space-x-1">
              <CalendarIcon />
              <Text>{date}</Text>
            </View>

            <View className="flex flex-row items-center space-x-1">
              <ClockIcon />
              <Text>{time}</Text>
            </View>
          </View>
          <View className="flex flex-row space-x-2">
            <TouchableOpacity
              className="w-2/5"
              onPress={() =>
                navigation.navigate('EditHangout', {
                  id: hangoutId,
                  user_id: userId,
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
                <View
                  className="flex h-12 flex-row items-center justify-center space-x-2"
                  style={{
                    borderRadius: 100,
                    backgroundColor: 'white',
                  }}>
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
                        style={{ opacity: 0, fontSize: 16, fontWeight: '500' }}>
                        Edit details
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity className="w-3/5" onPress={onShare}>
              <LinearGradient
                colors={['#7000FF', '#B174FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-12 w-full items-center justify-center rounded-full">
                <View className="flex flex-row items-center justify-center space-x-2">
                  <ExportSquareIcon color="#FFF" />
                  <Text
                    style={{ fontSize: 16, color: 'white', fontWeight: '500' }}>
                    Share hangout
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShareModal;
