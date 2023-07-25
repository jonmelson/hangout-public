import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { supabase } from '../../../lib/supabase';

import {
  ChevronRightIcon,
  ClockIcon,
  CalendarIcon,
  ChevronBackIcon,
} from '../../../components/Icons';

import { shareSchema } from '../../../utils/schemas';

import { useChatContext } from '../../../context/ChatContext';

type Location = {
  latitude?: number;
  longitude?: number;
};

type LocationMetaData = {
  title?: string;
  address?: string;
  geometry?: {
    location?: Location;
  };
};

const NewHangout = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: {
    params?: {
      locationMetaData?: LocationMetaData[];
      sessionId?: string;
    };
  };
}) => {
  const { locationMetaData, sessionId } = route?.params ?? {};

  const { chatClient, startGroupChatRoom } = useChatContext();

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState(locationMetaData || {});
  const [address, setAddress] = useState(
    (locationMetaData && locationMetaData[0]?.address) || '',
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const endDate = new Date();
    endDate.setHours(startDate.getHours() + 1);
    return endDate;
  });

  const [isValid, setIsValid] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedStartTime, setFormattedStartTime] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [formattedEndTime, setFormattedEndTime] = useState('');

  const handleBackPress = () => {
    navigation.navigate('HomeStack');
  };

  const handleTitleChange = (input: string) => {
    setTitle(input);
  };

  const handleDetailsChange = (input: string) => {
    setDetails(input);
  };

  const handleStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (selectedDate) {
      const minutes = Math.ceil(selectedDate.getMinutes() / 5) * 5;
      selectedDate.setMinutes(minutes);
      setStartDate(selectedDate);
      // set end date to one hour after start date
      const oneHourAfterStartDate = new Date(
        selectedDate.getTime() + 60 * 60 * 1000,
      );
      setEndDate(oneHourAfterStartDate);
    }
  };

  const handleEndDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (selectedDate !== undefined) {
      const minutes = Math.ceil(selectedDate.getMinutes() / 5) * 5;
      selectedDate.setMinutes(minutes);
      setEndDate(selectedDate);
    }
  };

  useEffect(() => {
    if (locationMetaData && locationMetaData.length > 0) {
      setAddress(locationMetaData[0]?.address || '');
    }
  }, [locationMetaData]);

  useEffect(() => {
    const handleSharePress = async () => {
      const { data, error } = await supabase
        .from('hangouts')
        .insert([
          {
            user_id: sessionId,
            title: title,
            details: details,
            location: location,
            starts: startDate,
            ends: endDate,
          },
        ])
        .select();
      if (error) {
        console.error(error);
      } else {
        // console.log(data);

        // let { data: users, error } = await supabase
        //   .from('users')
        //   .select('avatar')
        //   .eq('id', data[0].user_id);

        startGroupChatRoom(data[0].id, data[0].user_id, data[0].title);
        navigation.navigate('Home');
        navigation.navigate('SharePage');
      }
    };

    const validateInput = async () => {
      try {
        await shareSchema.validate({
          title: title,
          details: details,
          address: address,
          startDate: startDate,
          endDate: endDate,
        });
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      }
    };
    // Convert the date string to a Date object
    const startDateObj = new Date(startDate);
    const startTimeObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const endTimeObj = new Date(endDate);

    // Format the date using toLocaleString with appropriate options
    const fStartDate = startDateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setFormattedStartDate(fStartDate);

    const fStartTime = startTimeObj
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      .replace(/\s/g, '')
      .toLowerCase();

    setFormattedStartTime(fStartTime);

    const fEndDate = endDateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setFormattedEndDate(fEndDate);

    const fEndTime = endTimeObj
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      .replace(/\s/g, '')
      .toLowerCase();

    setFormattedEndTime(fEndTime);

    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <View className="mt-4">
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            New hangout
          </Text>
        </View>
      ),
      headerLeft: () => (
        <View className="mt-4">
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => (
        <View className="mt-4">
          <TouchableOpacity onPress={handleSharePress} disabled={!isValid}>
            <Text
              style={{ fontSize: 16, fontWeight: '500' }}
              className={
                isValid ? 'text-[#3478F6]' : 'text-[#3478F6] opacity-50'
              }>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });

    validateInput();
  }, [
    navigation,
    sessionId,
    title,
    details,
    address,
    startDate,
    endDate,
    isValid,
  ]);

  return (
    <ScrollView>
      <View className="flex flex-col space-y-1">
        <View className="rounded-b-xl bg-white px-4 py-6">
          <View className="">
            <TextInput
              placeholder="Add title..."
              onChangeText={input => {
                handleTitleChange(input);
              }}
              value={title}
              style={{
                fontSize: 20,
              }}
            />
          </View>
        </View>

        <View className="flex flex-col  rounded-xl bg-white p-4">
          <Text style={{ fontWeight: '500', fontSize: 20 }} className="mb-3">
            Details
          </Text>
          <TextInput
            placeholder="Add optional details..."
            onChangeText={input => {
              handleDetailsChange(input);
            }}
            value={details}
            className="text-gray-500"
          />
        </View>

        <TouchableOpacity
          className="flex flex-col rounded-xl bg-white p-4"
          onPress={() => navigation.navigate('ChooseLocation')}>
          <Text style={{ fontWeight: '500', fontSize: 20 }} className="mb-3">
            Location
          </Text>

          {address !== '' ? (
            <View className="mb-1 flex flex-row items-center justify-between">
              <View>
                <Text className="text-gray-500">{address}</Text>
              </View>
              <View>
                <ChevronRightIcon />
              </View>
            </View>
          ) : (
            <View className="mb-1 flex flex-row items-center justify-between">
              <Text className="text-[#C5C5C7]">Add location</Text>
              <ChevronRightIcon />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex flex-col space-y-3 rounded-xl bg-white p-4">
          <Text style={{ fontWeight: '500', fontSize: 20 }}>Time</Text>
          <View className="flex flex-col space-y-2">
            <View className="flex flex-row items-center justify-between">
              <Text>Starts</Text>
              <TouchableOpacity
                className="rounded-xl bg-gray-100 px-3 py-1"
                onPress={() => {
                  setShowEndPicker(false);
                  setShowStartPicker(!showStartPicker);
                }}>
                <View className="flex flex-row space-x-2">
                  <View className="flex flex-row items-center space-x-1">
                    <CalendarIcon />
                    <Text>{formattedStartDate}</Text>
                  </View>

                  <View className="flex flex-row items-center space-x-1">
                    <ClockIcon />
                    <Text>{formattedStartTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {showStartPicker && (
              <View>
                <DateTimePicker
                  value={startDate}
                  mode="datetime"
                  display="spinner"
                  onChange={handleStartDateChange}
                  themeVariant="light"
                  minimumDate={new Date()}
                  maximumDate={undefined}
                  minuteInterval={5}
                />
              </View>
            )}
          </View>

          <View className="flex flex-col space-y-2">
            <View className="flex flex-row items-center justify-between">
              <Text>End</Text>
              <TouchableOpacity
                className="rounded-xl bg-gray-100 px-3 py-1"
                onPress={() => {
                  setShowStartPicker(false);
                  setShowEndPicker(!showEndPicker);
                }}>
                <View className="flex flex-row space-x-2">
                  <View className="flex flex-row items-center space-x-1">
                    <CalendarIcon />
                    <Text>{formattedEndDate}</Text>
                  </View>

                  <View className="flex flex-row items-center space-x-1">
                    <ClockIcon />
                    <Text>{formattedEndTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {showEndPicker && (
              <View>
                <DateTimePicker
                  value={endDate}
                  mode="datetime"
                  display="spinner"
                  onChange={handleEndDateChange}
                  themeVariant="light"
                  minimumDate={new Date()}
                  maximumDate={undefined}
                  minuteInterval={5}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default NewHangout;
