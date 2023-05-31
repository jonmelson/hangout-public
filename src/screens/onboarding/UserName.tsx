import React, { useState, useRef, useEffect } from 'react';

import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, ChevronBackIcon } from '../../components/Icons';

import GradientButton from '../../components/GradientButton';

import { supabase } from '../../lib/supabase';

import { userNameSchema } from '../../utils/schemas';

const UserName = ({ navigation, route }: { navigation: any; route: any }) => {
  const { sessionId } = route.params ?? {};
  const [userName, setUserName] = useState('');
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

  const handleInput = (input: string) => {
    setUserName(input);
    validateInput(input);
  };

  async function updateUser() {
    const { data, error } = await supabase
      .from('users')
      .update({ username: userName })
      .eq('id', sessionId);

    navigation.navigate('ProfileImage');
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerShown: true,
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity
          className="flex flex-row items-center space-x-2 py-2 pr-4"
          onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <View className="flex-1 justify-between bg-white">
        <View className="mx-4 mt-48 flex flex-1 flex-col items-center">
          <Text className="mb-1 text-center text-lg font-medium">
            Create username
          </Text>
          <Text className="text-center">
            Add a username. You can change this at any time.
          </Text>

          <View className="mt-3 h-12 w-full justify-center rounded-full border border-gray-400 bg-neutral-100 px-4">
            <View className="flex flex-row items-center justify-between">
              <View>
                <TextInput
                  autoFocus={true}
                  value={userName}
                  placeholder={'Username'}
                  maxLength={20}
                  autoCapitalize="none"
                  onChangeText={input => {
                    handleInput(input);
                  }}
                  keyboardType="default"
                />
              </View>
              <View>
                {userName !== '' && (
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
        </View>
        <View className="mx-4 mb-4">
          <GradientButton
            onPress={() => updateUser()}
            title="Next"
            disabled={!isValid}
            size={16}
            iconName="arrow-forward"
            iconSize={20}
            iconColor="white"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserName;
