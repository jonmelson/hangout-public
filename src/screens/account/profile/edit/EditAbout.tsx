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
      title: 'About',
      headerShown: true,
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handlePress}>
          {/* <Text className="text-blue-600">Done</Text> */}
          <Text className="text-blue-600">Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, about]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex flex-col">
        <TextInput
          value={about}
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
