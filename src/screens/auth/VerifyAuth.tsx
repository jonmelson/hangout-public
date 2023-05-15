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
import { ChevronBackIcon } from '../../components/Icons';

import GradientButton from '../../components/GradientButton';

import { supabase } from '../../lib/supabase';

import { verifyOTPSchema } from '../../utils/schemas';



const VerifyAuth = ({ navigation, route }: { navigation: any; route: any }) => {
  const { phone } = route.params;

  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validateInput = async (input: string) => {
    try {
      await verifyOTPSchema.validate({ verifyOTP: input });
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  const handleInput = (input: string) => {
    setOTP(input);
    validateInput(input);
  };

  async function onResendOTP() {
    let { data, error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });
  }

  async function verifyOTP() {
    setLoading(true);

    let { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: 'sms',
    });

    if (error) Alert.alert(error.message);

    setLoading(false);
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
      <View className="flex-1 justify-between bg-white">
        <View className="mx-4 mt-48 flex flex-1 flex-col items-center">
          <Text
            className="text-center"
            style={{
              fontSize: 20,
            }}>
            Enter the code we just texted you
          </Text>

          <View className="mt-4 flex w-full flex-col space-y-2 rounded-full">
            <TextInput
              value={otp}
              autoFocus={true}
              placeholder="******"
              className="w-full rounded-full"
              secureTextEntry={true}
              placeholderTextColor="#bfbfbf"
              keyboardType="number-pad"
              onChangeText={input => {
                handleInput(input);
              }}
              style={{
                height: 44,
                padding: 10,
                marginTop: 20,
                marginBottom: 10,
                backgroundColor: '#F3F3F3',
                textAlign: 'center',
              }}
            />
            <View className="flex flex-row items-center justify-center space-x-1 text-center">
              <Text>Didn't get a code?</Text>

              <TouchableOpacity onPress={onResendOTP}>
                <Text className="text-blue-500">Tap to resend.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="mx-4 mb-4">
          <GradientButton
            onPress={() => {
              verifyOTP();
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

export default VerifyAuth;
