import React, { useState, useEffect } from 'react';

import {
  Alert,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';

import GradientButton from '../../components/GradientButton';
import { ChevronBackIcon } from '../../components/Icons';

import { supabase } from '../../lib/supabase';

import { openBrowserAsync } from 'expo-web-browser';
import { TERMS_OF_USE, PRIVACY_POLICY } from '@env';

import { phoneSchema } from '../../utils/schemas';
import { formatInputPhoneNumber, reformatPhoneNumber } from '../../utils/utils';

import { NavigationProps } from '../../utils/navigation';

const SignUpAuth = (props: NavigationProps) => {
  const { navigation } = props;
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateInput = async (input: string) => {
    try {
      await phoneSchema.validate({ phone: input });
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  const handleInput = (input: string) => {
    const formattedInput = formatInputPhoneNumber(input);
    setPhone(formattedInput);
    validateInput(formattedInput);
  };

  async function signUpWithPhone() {
    const fullNumber = reformatPhoneNumber(phone);

    let { data, error } = await supabase.auth.signInWithOtp({
      phone: fullNumber,
    });

    if (error) Alert.alert(error.message);

    navigation.navigate('VerifyAuth', {
      phone: fullNumber,
    });
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerShown: true,
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity
          className="flex flex-row items-center space-x-2"
          onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
          <Text className="font-semibold">Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <View className="flex-1  bg-white">
        <View className="mx-4 mt-48 flex flex-1 flex-col items-center">
          <Text
            className="text-center"
            style={{
              fontSize: 20,
            }}>
            Enter your phone number
          </Text>

          <View className="mt-4 flex w-full flex-row space-x-4 rounded-full bg-gray-200 p-4">
            <Text className="ml-1 font-bold">+1</Text>
            <TextInput
              autoFocus={true}
              value={phone}
              placeholder={'Phone Number'}
              onChangeText={input => {
                handleInput(input);
              }}
              keyboardType="number-pad"
            />
          </View>

          <View className="mt-4 flex flex-col">
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: 'gray',
                }}>
                By entering your phone number you're agreeing to our
              </Text>
            </View>
            <View className="flex flex-row justify-center space-x-1">
              <View>
                <TouchableOpacity
                  onPress={() => openBrowserAsync(TERMS_OF_USE)}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'gray',
                      textDecorationLine: 'underline',
                    }}>
                    Terms of Use
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'gray',
                  }}>
                  and
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => openBrowserAsync(PRIVACY_POLICY)}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'gray',
                      textDecorationLine: 'underline',
                    }}>
                    Privacy Policy.
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'gray',
                  }}>
                  Thanks!
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="mx-4 mb-4">
          <GradientButton
            onPress={() => {
              signUpWithPhone();
            }}
            title="Next"
            size={16}
            padding={10}
            disabled={!isValid}
            iconName="arrow-forward"
            iconSize={20}
            iconColor="white"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpAuth;
