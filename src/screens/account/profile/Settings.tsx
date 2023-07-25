import React, { useEffect } from 'react';

import {
  View,
  Text,
  Share,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  ChevronRightIcon,
  ExportSquareIcon,
  InfoCircleIcon,
  ProfileCircleIcon,
  MessageQuestionIcon,
  ChevronBackIcon,
} from '../../../components/Icons';
import * as MailComposer from 'expo-mail-composer';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { hangoutUrl, profileInviteMessage } from '../../../utils/constants';

import { supabase } from '../../../lib/supabase';

import { handleContactUsPress } from '../../../utils/utils';

import { NavigationProps } from '../../../utils/navigation';

const Settings = (props: NavigationProps) => {
  const { navigation, sessionId } = props;

  const handleLogout = async () => {
    try {
      // Clear the hasShownFeedbackPopup value from AsyncStorage
      await AsyncStorage.removeItem('hasShownFeedbackPopup');
      supabase.auth.signOut();
      // Perform any other logout actions you may have
      // ...
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };
  const handleEditProfilePress = () => {
    navigation.navigate('EditProfile');
  };

  const handleShareInvitePress = () => {
    Share.share({
      url: hangoutUrl,
      title: 'Hangout',
    });
  };

  const handleHelpPress = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Restore "Mail"?',
        'To continue, download "Mail" from the App Store.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Show in App Store',
            onPress: () => {
              // Open the app store link for the user to download an email app
              Linking.openURL(
                // 'https://play.google.com/store/apps/category/COMMUNICATION',
                'https://apps.apple.com/us/app/mail/id1108187098',
              );
            },
          },
        ],
      );
      return;
    }
    const bccRecipients = ['jon.melson@gmail.com'];
    const ccRecipients = ['jon.melson@gmail.com'];
    const recipients = ['hello@hangout.social'];
    const subject = 'Give use feedback!';
    const body = "What's not working? \n\nWhat features should we add?";

    try {
      await MailComposer.composeAsync({
        recipients,
        subject,
        body,
        bccRecipients,
        ccRecipients,
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while trying to compose the email.',
      );
    }
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
          <TouchableOpacity className="" onPress={handleLogout}>
            <Text className="text-center text-red-500 ">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Settings;
