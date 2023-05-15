import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { supabase } from '../../lib/supabase';

import {
  ChevronRightIcon,
  ClockIcon,
  CalendarIcon,
  ChevronBackIcon,
} from '../../components/Icons';

import { shareSchema } from '../../utils/schemas';

interface LocationMetaData {
  address?: string;
  geometry?: {
    location?: Location;
  };
}

interface Location {
  latitude?: number;
  longitude?: number;
}

const EditHangout = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { id, user_id, title, details, location, starts, ends } = route.params;

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDetails, setUpdatedDetails] = useState(details);
  const [updatedLocation, setUpdatedLocation] = useState(location);
  const [updatedAddress, setUpdatedAddress] = useState(
    location && location[0]?.address,
  );
  const [startDate, setStartDate] = useState<Date>(starts);
  const [endDate, setEndDate] = useState<Date>(ends);

  const [isValid, setIsValid] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedStartTime, setFormattedStartTime] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [formattedEndTime, setFormattedEndTime] = useState('');

  const handleTitleChange = (input: string) => {
    setUpdatedTitle(input);
  };

  const handleDetailsChange = (input: string) => {
    setUpdatedDetails(input);
  };

  const handleStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowStartPicker(false);

    if (selectedDate) {
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
      setEndDate(selectedDate);
    }
  };

  const showAlert = () => {
    Alert.alert(
      'Delete?',
      'Are you sure you want to delete this hangout?',
      [
        {
          text: 'Cancel',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: handleDeleteHangout,
        },
      ],
      { cancelable: false },
    );
  };

  const handleDeleteHangout = async () => {
    const { data, error } = await supabase
      .from('hangouts')
      .delete()
      .eq('id', id);
    navigation.navigate('Home');
  };

  const handleSavePress = async () => {
    const { data, error } = await supabase
      .from('hangouts')
      .update([
        {
          title: updatedTitle,
          details: updatedDetails,
          location: updatedLocation,
          starts: startDate,
          ends: endDate,
        },
      ])
      .eq('id', id);

    if (error) {
      console.error(error);
    } else {
      navigation.getParent()?.navigate('HomeStack', { screen: 'Home' });
    }
  };

  useEffect(() => {
    setUpdatedLocation(location);
    setUpdatedAddress(location && location[0]?.address);
  }, [location]);

  useEffect(() => {
    const validateInput = async () => {
      try {
        await shareSchema.validate({
          title: updatedTitle,
          details: updatedDetails,
          address: updatedAddress,
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
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#141416' }}>
            Edit hangout
          </Text>
        </View>
      ),
      headerLeft: () => (
        <View className="mt-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => (
        <View className="mt-4">
          <TouchableOpacity disabled={!isValid} onPress={handleSavePress}>
            <Text className={isValid ? 'text-blue-700' : 'text-blue-300'}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });

    validateInput();
  }, [
    navigation,
    updatedTitle,
    updatedDetails,
    updatedAddress,
    updatedLocation,
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
              value={updatedTitle}
              style={{
                fontSize: 20,
              }}
            />
          </View>
        </View>
        <View className="flex flex-col space-y-3 rounded-xl bg-white p-4">
          <Text className="text-lg">Details</Text>
          <TextInput
            placeholder="Add details..."
            onChangeText={input => {
              handleDetailsChange(input);
            }}
            value={updatedDetails}
            className="py-1 text-gray-500"
          />
        </View>
        <TouchableOpacity
          className="flex flex-col rounded-xl bg-white p-4"
          onPress={() =>
            navigation.navigate('EditChooseLocation', {
              id: id,
              user_id: user_id,
              title: title,
              details: details,
              location: location,
              starts: starts,
              ends: ends,
            })
          }>
          <View className="mb-2">
            <Text className="text-lg">Location</Text>
          </View>

          <View className="mb-1 flex flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500">{updatedAddress}</Text>
            </View>
            <View>
              <ChevronRightIcon />
            </View>
          </View>
        </TouchableOpacity>
        <View className="flex flex-col space-y-3 rounded-xl bg-white p-4">
          <Text className="text-lg">Time</Text>
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
                  value={new Date(startDate)}
                  mode="datetime"
                  display="spinner"
                  onChange={handleStartDateChange}
                  themeVariant="light"
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
                  value={new Date(endDate)}
                  mode="datetime"
                  display="spinner"
                  onChange={handleEndDateChange}
                  themeVariant="light"
                />
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          className="flex flex-col items-center rounded-xl bg-white p-4"
          onPress={showAlert}>
          <Text className="font-semibold text-red-500">Delete hangout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditHangout;
