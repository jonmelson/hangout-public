import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, Touchable } from 'react-native';

import { supabase } from '../../../../lib/supabase';

import { ChevronBackIcon } from '../../../../components/Icons';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { useChatContext } from '../../../../context/ChatContext';

const EditName = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { updateUserName } = useChatContext();

  const handleFirstNameChange = (input: string) => {
    setFirstName(input);
  };

  const handleLastNameChange = (input: string) => {
    setLastName(input);
  };

  const handlePress = async () => {
    await handleSave(firstName, lastName, navigation);
  };

  const handleSave = async (
    firstName: string,
    lastName: string,
    navigation: any,
  ) => {
    const { error } = await supabase
      .from('users')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', sessionId);

    if (error) {
      console.error(error);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionId);

      if (error) {
        console.error(error);
      } else {
        setFirstName(user?.[0]?.first_name);
        setLastName(user?.[0]?.last_name);
      }
    };

    getProfile();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerTitle: () => (
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            Name
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="py-2 pr-4">
          <ChevronBackIcon />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handlePress}>
          <Text
            style={{ fontSize: 16, fontWeight: '500' }}
            className="text-[#3478F6]">
            Save
          </Text>
        </TouchableOpacity>
      ),
    });

    const fullName = firstName + ' ' + lastName;
    updateUserName(sessionId, fullName);
  }, [firstName, lastName, navigation]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex flex-col">
        <TextInput
          value={firstName}
          autoFocus={true}
          placeholder={'First name'}
          onChangeText={input => {
            handleFirstNameChange(input);
          }}
          className="border-b border-gray-200 px-4 py-3 text-gray-800"
          keyboardType="default"
        />

        <TextInput
          value={lastName}
          placeholder={'Last name'}
          onChangeText={input => {
            handleLastNameChange(input);
          }}
          className="border-b border-gray-200 px-4 py-3 text-gray-800"
          keyboardType="default"
        />
        <Text className="mt-4 text-center text-gray-500">
          Add your full name so that friends can find you.
        </Text>
      </View>
    </View>
  );
};

export default EditName;
