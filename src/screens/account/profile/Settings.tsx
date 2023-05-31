import React, { useEffect } from 'react';

import { View, Text, Linking, TouchableOpacity } from 'react-native';
import {
  ChevronRightIcon,
  ExportSquareIcon,
  InfoCircleIcon,
  ProfileCircleIcon,
  MessageQuestionIcon,
  ChevronBackIcon,
} from '../../../components/Icons';

import { supabase } from '../../../lib/supabase';

import { message } from '../../../utils/utils';

import { handleContactUsPress } from '../../../utils/utils';

import { NavigationProps } from '../../../utils/navigation';

const Settings = (props: NavigationProps) => {
  const { navigation, sessionId } = props;

  const handleEditProfilePress = () => {
    navigation.navigate('EditProfile');
  };

  const handleShareInvitePress = () => {
    const content = message('TBR');

    Linking.openURL(`sms:&body=${content}`);
  };

  const handleHelpPress = () => {
    handleContactUsPress();
  };

  const handleAboutPress = () => {
    navigation.navigate('About');
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerTitle: () => (
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            Settings
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
    <View className="flex-1">
      <View className="flex flex-col space-y-2">
        <View className="flex flex-col rounded-b-xl bg-white">
          {/* Edit Profile */}
          <TouchableOpacity className="" onPress={handleEditProfilePress}>
            <View className="flex flex-row items-center justify-between p-3">
              <View className="flex flex-row items-center space-x-2">
                <ProfileCircleIcon />
                <Text>Edit Profile</Text>
              </View>
              <View>
                <ChevronRightIcon />
              </View>
            </View>
          </TouchableOpacity>

          {/* Share invite link */}
          <TouchableOpacity className="" onPress={handleShareInvitePress}>
            <View className="flex flex-row items-center justify-between p-3">
              <View className="flex flex-row items-center space-x-2">
                <ExportSquareIcon color="#333" />
                <Text>Share invite link</Text>
              </View>
              <View>
                <ChevronRightIcon />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col rounded-xl bg-white">
          {/* Help */}

          <TouchableOpacity className="" onPress={handleHelpPress}>
            <View className="flex flex-row items-center justify-between p-3">
              <View className="flex flex-row items-center space-x-2">
                <MessageQuestionIcon />
                <Text>Help</Text>
              </View>
              <View>
                <ChevronRightIcon />
              </View>
            </View>
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity className="" onPress={handleAboutPress}>
            <View className="flex flex-row items-center justify-between p-3">
              <View className="flex flex-row items-center space-x-2">
                <InfoCircleIcon />
                <Text>About</Text>
              </View>
              <View>
                <ChevronRightIcon />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View className="rounded-xl bg-white p-4">
          {/* Logout */}
          <TouchableOpacity
            className=""
            onPress={() => supabase.auth.signOut()}>
            <Text className="text-center text-red-500 ">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Settings;
