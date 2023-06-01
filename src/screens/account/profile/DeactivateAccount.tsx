import React, { useEffect } from 'react';

import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { ChevronBackIcon } from '../../../components/Icons';

import { NavigationProps } from '../../../utils/navigation';

const DeactivateAccount = (props: NavigationProps) => {
  const { navigation, sessionId } = props;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerTitle: () => (
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            Deactivate account
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
    });
  }, [navigation]);

  return (
    <View className="flex flex-col space-y-4">
      <View className="flex h-72 flex-col space-y-2 rounded-b-xl bg-white p-4">
        <Text className="font-bold">Are you sure you want to deactivate?</Text>
        <Text className="font-medium text-gray-600">
          This will deactivate your account
        </Text>
        <Text className="text-gray-600">
          Your profile will no longer be shown anywhere on hangout
        </Text>
        <Text className="font-medium text-gray-600">
          You have 30 days to reactivate
        </Text>
        <Text className="text-gray-600">
          Log back into your account anytime in the next 30 days and your
          account will return back to normal
        </Text>

        <Text className="font-medium text-gray-600">
          After that, deactivation is permanent
        </Text>
        <Text className="text-gray-600">
          If your account remains deactivated for 30 days, we will permanently
          disable your account
        </Text>
      </View>
      <TouchableOpacity className="rounded-xl bg-white p-4">
        <View className="items-center justify-center text-center">
          <Text className="font-semibold text-red-500">
            Confirm deactivation
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DeactivateAccount;
