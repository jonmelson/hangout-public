import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ChevronBackIcon } from '../../../../components/Icons';

import { supabase } from '../../../../lib/supabase';

const EditTwitter = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};
  const [twitter, setTwitter] = useState('');

  const handleTwitterChange = (input: string) => {
    setTwitter(input);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('users')
      .update({ twitter: twitter })
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
        setTwitter(user?.[0]?.twitter);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Add twitter',
      headerShown: true,
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          {/* <Text className="text-blue-600">Done</Text> */}
          <Text className="text-blue-600">Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, twitter]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex flex-col">
        <View className="flex flex-row border-b border-gray-200 px-4 py-3 text-gray-800">
          <View className="">
            <Text className="text-gray-500">twitter.com/ </Text>
          </View>
          <View>
            <TextInput
              value={twitter}
              autoFocus={true}
              placeholder={''}
              autoCapitalize="none"
              onChangeText={input => {
                handleTwitterChange(input);
              }}
              keyboardType="default"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditTwitter;
