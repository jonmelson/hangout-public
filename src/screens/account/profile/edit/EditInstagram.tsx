import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ChevronBackIcon } from '../../../../components/Icons';

import { supabase } from '../../../../lib/supabase';

const EditInstagram = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const [instagram, setInstagram] = useState('');

  const handleInstagramChange = (input: string) => {
    setInstagram(input);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('users')
      .update({ instagram: instagram })
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
        setInstagram(user?.[0]?.instagram);
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
            Add instagram
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
        <TouchableOpacity onPress={handleSave}> 
          <Text
            style={{ fontSize: 16, fontWeight: '500' }}
            className="text-[#3478F6]">
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, instagram]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex flex-col">
        <View className="flex flex-row border-b border-gray-200 px-4 py-3 text-gray-800">
          <View className="">
            <Text className="text-gray-500">instagram.com/ </Text>
          </View>
          <View>
            <TextInput
              value={instagram}
              autoFocus={true}
              placeholder={''}
              autoCapitalize="none"
              onChangeText={input => {
                handleInstagramChange(input);
              }}
              className=""
              keyboardType="default"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditInstagram;
