import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';

import { supabase } from '../../../lib/supabase';

import Avatar from '../../../components/Avatar';
import {
  Octicons,
  Feather,
  TabBarGoingIcon,
  ChevronBackIcon,
  ExportSquareIcon,
  Location16Icon,
  InstagramBlueIcon,
  InstagramGradientIcon,
  TwitterBlueIcon,
  TwitterGradientIcon,
} from '../../../components/Icons';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { LocationMetaData } from '../../../utils/other';

import { formatDate } from '../../../utils/utils';

const Profile = ({
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
  const [createdAt, setCreatedAt] = useState('');
  const [blurredImage, setBlurredImage] = useState(null);

  const fullName = firstName + ' ' + lastName;
  const joinedDate = formatDate(createdAt);

  const handleEditPress = () => {
    navigation.navigate('EditProfile');
  };

  const handleEditProfilePhotoPress = () => {
    navigation.navigate('EditProfilePhoto');
  };

  const handleEditLocation = () => {
    navigation.navigate('EditLocation', { sessionId: sessionId });
  };

  const handleEditAbout = () => {
    navigation.navigate('EditAbout', { sessionId: sessionId });
  };

  const handleEditInstagram = () => {
    navigation.navigate('EditInstagram', { sessionId: sessionId });
  };

  const handleEditTwitter = () => {
    navigation.navigate('EditTwitter', { sessionId: sessionId });
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
        setUsername(data?.[0]?.username);
        setAvatarUrl(data?.[0]?.avatar);
        setLocation(JSON.parse(data?.[0]?.location));
        setAbout(data?.[0]?.about);
        setInstagram(data?.[0]?.instagram);
        setTwitter(data?.[0]?.twitter);
        setCreatedAt(data?.[0]?.created_at);
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
            setUsername(payload.new.username);
            setAvatarUrl(payload.new.avatar);
            setLocation(JSON.parse(payload.new.location));
            setAbout(payload.new.about);
            setInstagram(payload.new.instagram);
            setTwitter(payload.new.twitter);
            setCreatedAt(payload.new.created_at);
          },
        )
        .subscribe();
    }
  }, [
    sessionId,
    avatarUrl,
    about,
    location,
    firstName,
    lastName,
    twitter,
    instagram,
  ]);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          className="flex flex-row items-center space-x-2 py-2 pr-4"
          onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            {username}
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          className="py-1 pl-2">
          <View className="items-center">
            <Feather name="menu" color="black" size={25} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, sessionId, username]);

  return (
    <View className="flex-1">
      <View className="flex flex-col">
        {avatarUrl !== '' ? (
          <>
            <View className="h-40">
              <Image
                source={{ uri: avatarUrl }}
                cachePolicy="none"
                style={{ width: '100%', height: '100%' }}
              />
            </View>

            <BlurView
              intensity={80}
              tint="default"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </>
        ) : (
          <View className="h-40"></View>
        )}

        <View className="relative mt-1 rounded-2xl bg-white px-2">
          <View className="absolute -top-10 z-10 mb-2 w-full">
            {avatarUrl == '' ? (
              <TouchableOpacity
                onPress={handleEditProfilePhotoPress}
                className=" flex-col items-center justify-center space-y-2">
                <Avatar source={avatarUrl} name={fullName} size={80} />

                <Text className="text-blue-600">Add profile photo</Text>
              </TouchableOpacity>
            ) : (
              <View className=" flex-col items-center justify-center space-y-2">
                <Avatar source={avatarUrl} name={fullName} size={80} />
              </View>
            )}
          </View>

          <View className="mx-2 mb-4 mt-12 flex flex-col space-y-2">
            {avatarUrl == '' ? (
              <View className="mt-6 flex flex-row items-center  space-x-2">
                <View>
                  <Text className="text-lg font-medium">{fullName}</Text>
                </View>
                <View>
                  <Octicons name="verified" color="#2563eb" size={14} />
                </View>
              </View>
            ) : (
              <View className="flex flex-row items-center  space-x-2">
                <View>
                  <Text className="text-lg font-medium">{fullName}</Text>
                </View>
                <View>
                  <Octicons name="verified" color="#2563eb" size={14} />
                </View>
              </View>
            )}

            {location && location.length > 0 ? (
              <View className="flex flex-row items-center space-x-1">
                <Location16Icon color="#000000" />
                <Text className="text-black">{location[0].address}</Text>
              </View>
            ) : (
              <TouchableOpacity
                className="flex flex-row items-center space-x-1"
                onPress={handleEditLocation}>
                <Location16Icon color="#3478F6" />
                <Text className="text-blue-600">Add location</Text>
              </TouchableOpacity>
            )}

            <View className="flex flex-row space-x-2 ">
              <TouchableOpacity className="w-1/2" onPress={handleEditPress}>
                <LinearGradient
                  colors={['#7000FF', '#B174FF']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 100,
                    overflow: 'hidden',
                    padding: 1,
                  }}
                  className="w-full rounded-full">
                  <View className="flex h-12 flex-row items-center justify-center space-x-2 rounded-full bg-white ">
                    <MaskedView
                      maskElement={
                        <Text
                          style={{
                            backgroundColor: 'transparent',
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          Edit Profile
                        </Text>
                      }>
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#7000FF', '#B174FF']}>
                        <Text
                          style={{
                            opacity: 0,
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          Edit Profile
                        </Text>
                      </LinearGradient>
                    </MaskedView>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity className="w-1/2">
                <LinearGradient
                  colors={['#7000FF', '#B174FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-12 w-full items-center justify-center rounded-full">
                  <View className="flex flex-row items-center justify-center space-x-2">
                    <ExportSquareIcon color="#FFF" />
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        fontWeight: '500',
                      }}>
                      Invite Friends
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mt-1 flex flex-col space-y-3 rounded-2xl bg-white px-4 pb-6 pt-4">
          <Text className="text-xl font-semibold">About</Text>

          {about !== '' ? (
            <Text className="text-gray-800">{about}</Text>
          ) : (
            <TouchableOpacity onPress={handleEditAbout}>
              <Text className="text-blue-600">Add About</Text>
            </TouchableOpacity>
          )}

          <View className="flex flex-col space-y-1">
            {instagram !== '' && twitter === '' ? (
              // Show only Instagram
              <View className="flex flex-row items-center space-x-2">
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
                      style={{ opacity: 0, fontSize: 14, fontWeight: '400' }}>
                      @{instagram}
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </View>
            ) : twitter !== '' && instagram === '' ? (
              // Show only Twitter
              <View className="flex flex-row items-center space-x-2">
                <TwitterGradientIcon />
                <MaskedView
                  maskElement={<Text className="text-white">@{twitter}</Text>}>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#7000FF', '#B174FF']}>
                    <Text
                      style={{ opacity: 0, fontSize: 14, fontWeight: '400' }}>
                      @{twitter}
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </View>
            ) : instagram !== '' && twitter !== '' ? (
              // Show both Instagram and Twitter
              <>
                <View className="flex flex-row items-center space-x-2">
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
                        style={{ opacity: 0, fontSize: 14, fontWeight: '400' }}>
                        @{instagram}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </View>

                <View className="flex flex-row items-center space-x-2">
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
                        style={{ opacity: 0, fontSize: 14, fontWeight: '400' }}>
                        @{twitter}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </View>
              </>
            ) : (
              // Show default
              <>
                <TouchableOpacity
                  className="flex flex-row items-center space-x-2"
                  onPress={handleEditInstagram}>
                  <InstagramBlueIcon />
                  <Text className="text-blue-600">Add Instagram</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex flex-row items-center space-x-2"
                  onPress={handleEditTwitter}>
                  <TwitterBlueIcon />
                  <Text style={{ color: '#3478F6' }}>Add Twitter</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      <View className="mt-12 flex flex-col items-center justify-center space-y-4 ">
        <View>
          <TabBarGoingIcon name="going" color="gray" />
        </View>
        <View>
          <Text className="text-gray-500">Joined hangout on {joinedDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;
