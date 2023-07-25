import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ChevronBackIcon } from '../../../../components/Icons';

import { supabase } from '../../../../lib/supabase';

const EditAbout = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const [about, setAbout] = useState('');

  const handleAboutChange = (input: string) => {
    setAbout(input);
  };

  const handleSave = async (about: string, navigation: any) => {
    const { error } = await supabase
      .from('users')
      .update({ about: about })
      .eq('id', sessionId);

    if (error) {
      console.error(error);
    } else {
      navigation.goBack();
    }
  };

  const handlePress = async () => {
    await handleSave(about, navigation);
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
        setAbout(user?.[0]?.about);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerTitle: () => (
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            About
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
  }, [navigation, about]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex flex-col">
        <TextInput
          value={about}
          multiline={true}
          autoFocus={true}
          placeholder={'Add about...'}
          onChangeText={input => {
            handleAboutChange(input);
          }}
          className="border-b border-gray-200 px-4 py-3 text-gray-800"
          keyboardType="default"
        />
      </View>
    </View>
  );
};

export default EditAbout;
