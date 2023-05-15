import React, { useState, useEffect } from 'react';

import Avatar from '../../../../components/Avatar';
import {
  ChevronRightIcon,
  FontAwesome,
  InstagramBlueIcon,
  InstagramGradientIcon,
  TwitterBlueIcon,
  TwitterGradientIcon,
} from '../../../../components/Icons';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import {
  handleContactUsPress,
  formatPhoneNumber,
} from '../../../../utils/utils';

import { LocationMetaData } from '../../../../utils/other';
import { supabase } from '../../../../lib/supabase';

const EditProfile = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};

  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState<LocationMetaData[]>([]);
  const [about, setAbout] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [phone, setPhone] = useState('');

  const fullName = firstName + ' ' + lastName;
  const formattedPhoneNumber = formatPhoneNumber(phone);

  const handleEditProfilePhoto = () => {
    navigation.navigate('EditProfilePhoto');
  };

  const handleEditName = () => {
    navigation.navigate('EditName');
  };

  const handleEditUsername = () => {
    navigation.navigate('EditUsername');
  };

  const handleEditLocation = () => {
    navigation.navigate('EditLocation');
  };

  const handleEditAbout = () => {
    navigation.navigate('EditAbout');
  };

  const handleEditInstagram = () => {
    navigation.navigate('EditInstagram');
  };

  const handleEditTwitter = () => {
    navigation.navigate('EditTwitter');
  };

  const handleDeactivateAccount = () => {
    navigation.navigate('DeactivateAccount');
  };

  async function getProfile() {
    try {
      setLoading(true);
      // if (!session?.user) throw new Error('No user on the session!');

      let { data, error, status } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionId);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstName(data?.[0]?.first_name);
        setLastName(data?.[0]?.last_name);
        setAvatarUrl(data?.[0]?.avatar);
        setUsername(data?.[0]?.username);
        setLocation(JSON.parse(data?.[0]?.location));
        setAbout(data?.[0]?.about);
        setInstagram(data?.[0]?.instagram);
        setTwitter(data?.[0]?.twitter);
        setPhone(data?.[0]?.phone);
      }
      // downloadImage(avatarPath);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sessionId) {
      getProfile();

      // Subscribe to changes in the users table
      const userSubscription = supabase
        .channel('changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
          },
          payload => {
            setFirstName(payload.new.first_name);
            setLastName(payload.new.last_name);
            setAvatarUrl(payload.new.avatar);
            setUsername(payload.new.username);
            setLocation(JSON.parse(payload.new.location));
            setAbout(payload.new.about);
            setInstagram(payload.new.instagram);
            setTwitter(payload.new.twitter);
            setPhone(payload.new.phone);
          },
        )
        .subscribe();
    }
  }, [
    sessionId,
    avatarUrl,
    firstName,
    lastName,
    username,
    about,
    location,
    instagram,
    twitter,
  ]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Edit Profile',
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      ),
      // headerRight: () => (
      //   <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
      //     <Text className="text-blue-500">Save</Text>
      //   </TouchableOpacity>
      // ),
    });
  }, [navigation, sessionId]);

  return (
    <ScrollView>
      <View>
        <View className="flex flex-col space-y-2">
          <View className="flex h-40 flex-col items-center space-y-2 rounded-b-xl bg-white p-4">
            <TouchableOpacity onPress={handleEditProfilePhoto}>
              <Avatar source={avatarUrl} name={fullName} size={80} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row items-center space-x-1"
              onPress={handleEditProfilePhoto}>
              <Text className="text-center text-blue-600">
                Change profile picture
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="flex h-24 w-full flex-row items-center justify-between rounded-xl bg-white p-4"
            onPress={handleEditName}>
            <View className="flex  flex-col justify-center space-y-2 ">
              <Text className="font-medium">Name</Text>
              <Text className="text-gray-500">{fullName}</Text>
            </View>
            <View>
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex h-24 w-full flex-row items-center justify-between rounded-xl bg-white p-4"
            onPress={handleEditUsername}>
            <View className="flex  flex-col justify-center space-y-2 ">
              <Text className="font-medium">Username</Text>
              <Text className="text-gray-500">{username}</Text>
            </View>
            <View>
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex h-24 w-full flex-row items-center justify-between rounded-xl bg-white p-4"
            onPress={handleEditLocation}>
            <View className="flex  flex-col justify-center space-y-2 ">
              <Text className="font-medium">Location</Text>

              {location && location.length > 0 ? (
                <Text className="text-gray-500">{location[0].address}</Text>
              ) : (
                <Text className="text-blue-600">Add location...</Text>
              )}
            </View>
            <View>
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex h-24 w-full flex-row items-center justify-between rounded-xl bg-white p-4"
            onPress={handleEditAbout}>
            <View className="flex  flex-col justify-center space-y-2 ">
              <Text className="font-medium">About</Text>
              {about ? (
                <Text className="text-gray-500">{about}</Text>
              ) : (
                <Text className="text-blue-600">Add about...</Text>
              )}
            </View>
            <View>
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>

          <View className="flex h-28 flex-col space-y-2 rounded-xl bg-white p-4">
            <Text className="font-medium">Social</Text>
            <View className="flex flex-col space-y-1">
              {instagram !== '' ? (
                <TouchableOpacity
                  className="flex flex-row items-center space-x-2"
                  onPress={handleEditInstagram}>
                  <InstagramGradientIcon />
                  <MaskedView
                    maskElement={
                      <Text className="text-white">@{instagram}</Text>
                    }>
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      colors={['#7000FF', '#B174FF']}>
                      <Text
                        style={{
                          opacity: 0,
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        @{instagram}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="flex flex-row items-center space-x-2"
                  onPress={handleEditInstagram}>
                  <InstagramBlueIcon />
                  <Text className="text-blue-600">Add Instagram</Text>
                </TouchableOpacity>
              )}
              {twitter !== '' ? (
                <TouchableOpacity
                  className="flex flex-row items-center space-x-2"
                  onPress={handleEditTwitter}>
                  <TwitterGradientIcon />
                  <MaskedView
                    maskElement={
                      <Text className="text-white">@{twitter}</Text>
                    }>
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      colors={['#7000FF', '#B174FF']}>
                      <Text
                        style={{
                          opacity: 0,
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        @{twitter}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="flex flex-row items-center space-x-2"
                  onPress={handleEditTwitter}>
                  <TwitterBlueIcon />
                  <Text style={{ color: '#3478F6' }}>Add Twitter</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View className="flex h-96 flex-col space-y-6 p-4">
            <View className="flex flex-row justify-between">
              <Text className="text-gray-500">Phone Number</Text>
              <Text className="text-gray-500">{formattedPhoneNumber}</Text>
            </View>
            <View className="flex flex-col space-y-4">
              <Text className="font-semibold text-gray-600">
                How do I change my profile's phone number?
              </Text>
              <Text className="text-gray-500">
                We only allow one account per phone number, but if you recently
                updated your phone number we can sync your existing account to a
                new number.
              </Text>
            </View>
            <View className="flex justify-center">
              <Text className="text-center text-gray-500 ">
                <TouchableOpacity onPress={handleContactUsPress}>
                  <Text className="text-blue-600">Click here</Text>
                </TouchableOpacity>{' '}
                to send us a message, and we will update this for you.
              </Text>
            </View>

            <TouchableOpacity
              className="items-center"
              onPress={handleDeactivateAccount}>
              <Text className="text-red-500">Deactivate account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
