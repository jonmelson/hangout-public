import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ChevronBackIcon, Ionicons } from '../../../../components/Icons';

import { userNameSchema } from '../../../../utils/schemas';

import { supabase } from '../../../../lib/supabase';

const EditUsername = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const [username, setUserame] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateInput = async (input: string) => {
    try {
      await userNameSchema.validate({ userName: input });
      const exists = await checkIfUsernameExistsInDatabase(input);
      setIsValid(!exists);
    } catch (error) {
      setIsValid(false);
    }
  };

  async function checkIfUsernameExistsInDatabase(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);

    if (error) {
      console.log(error);
      return false;
    }

    if (data.length > 0) {
      // Username exists in database
      return true;
    }

    return false; // Username doesn't exist in database
  }

  const handleUsernameChange = (input: string) => {
    setUserame(input);
    validateInput(input);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('users')
      .update({ username: username })
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
        setUserame(user?.[0]?.username);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Username',
      headerShown: true,
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} disabled={!isValid}>
          <Text className={`text-blue-600 ${isValid ? '' : 'opacity-50'}`}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, username, handleSave]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex flex-row items-center justify-between border-b border-gray-200 px-4 py-3 text-gray-800">
        <View>
          <TextInput
            value={username}
            autoFocus={true}
            placeholder={'Username'}
            autoCapitalize="none"
            onChangeText={input => {
              handleUsernameChange(input);
            }}
            keyboardType="default"
          />
        </View>
        <View>
          {username !== '' && (
            <>
              {!isValid ? (
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color="#FF3A2F"
                />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={25}
                  color="#65C466"
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default EditUsername;
