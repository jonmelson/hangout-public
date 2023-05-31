import React, { useState, useRef, useEffect } from 'react';

import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { ChevronBackIcon } from '../../components/Icons';

import GradientButton from '../../components/GradientButton';

import { supabase } from '../../lib/supabase';

import { fullNameSchema } from '../../utils/schemas';

const FullName = ({ navigation, route }: { navigation: any; route: any }) => {
  const { sessionId } = route.params ?? {};
  const inputRef = useRef<TextInput>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleBackPress = async () => {
    supabase.auth.signOut();
  };

  const validateInput = async () => {
    try {
      await fullNameSchema.validate({
        firstName: firstName,
        lastName: lastName,
      });
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  async function updateUser() {
    const { data, error } = await supabase
      .from('users')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', sessionId);

    navigation.navigate('UserName');
  }

  useEffect(() => {
    validateInput();
  }, [firstName, lastName]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerShown: true,
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity
          className="flex flex-row items-center space-x-2 py-2 pr-4"
          onPress={handleBackPress}>
          <ChevronBackIcon />
          <Text style={{fontSize:16, fontWeight:"600"}}>Back</Text>
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
            Add your name
          </Text>
          <Text className="text-center text-gray-500">
            Add your full name so that friends can find you.
          </Text>
          <TextInput
            value={firstName}
            ref={inputRef}
            autoFocus={true}
            keyboardType="default"
            onChangeText={firstName => {
              setFirstName(firstName);
              validateInput();
            }}
            placeholder={'First Name'}
            className="h-42 mt-3 w-full rounded-full border border-gray-400 bg-neutral-100 p-4"
          />
          <TextInput
            value={lastName}
            onChangeText={lastName => {
              setLastName(lastName);
              validateInput();
            }}
            placeholder={'Last Name'}
            className="h-42 mb-20 mt-3 w-full rounded-full border border-gray-400 bg-neutral-100 p-4"
          />
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

export default FullName;
