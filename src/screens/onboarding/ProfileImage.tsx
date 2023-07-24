import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import Avatar from '../../components/Avatar';
import GradientButton from '../../components/GradientButton';

import { AddPhotoIcon, ChevronBackIcon } from '../../components/Icons';

import { useActionSheet } from '@expo/react-native-action-sheet';

import * as ImagePicker from 'expo-image-picker';

import { supabase } from '../../lib/supabase';

import { User2 } from '../../utils/other';

import { useChatContext } from '../../context/ChatContext';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileImage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { sessionId } = route.params ?? {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { updateUserImage } = useChatContext();

  const handleRefresh = () => {
    // Perform your refresh action here
    // You can update the state or make an API call
    getProfile();
    // Once the refresh is complete, set refreshing to false
    setRefreshing(false);
  };

  const fullName = firstName + ' ' + lastName;

  const insets = useSafeAreaInsets();

  const { showActionSheetWithOptions } = useActionSheet();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const input = result.assets[0];
      // console.log(input);
      uploadImage(input);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera is required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      const input = result.assets[0];
      uploadImage(input);
    }
  };

  const uploadImage = async (result: any) => {
    try {
      setIsLoading(true);
      const path = sessionId + '/avatar.png';
      const file = {
        uri: result.uri,
        name: result.fileName,
        type: result.type,
      };

      // Check if file with same name already exists
      const { data: fileList, error } = await supabase.storage
        .from('avatars')
        .list(sessionId, {
          limit: 1,
          offset: 0,
          search: 'avatar.png',
        });

      if (error) {
        throw error;
      }

      // Replace existing file
      if (fileList && fileList.length > 0) {
        const { data: updateImage, error: updateImageError } =
          await supabase.storage.from('avatars').update(path, file);

        if (updateImageError) {
          console.log(updateImageError);
        } else {
          console.log('Image updated successfully!');
          let imagePath = updateImage.path;
          let imageMetadata = await supabase.storage
            .from('avatars')
            .getPublicUrl(imagePath, {
              transform: {
                width: 100,
                height: 100,
                resize: 'fill',
              },
            });

          let updateUserAvatar = await supabase
            .from('users')
            .update({ avatar: imageMetadata.data.publicUrl })
            .eq('id', sessionId);

          updateUserImage(sessionId, imageMetadata.data.publicUrl);

          if (updateUserAvatar.error) {
            console.log('Error updating user avatar:', updateUserAvatar.error);
          } else {
            setAvatarUrl(imageMetadata.data.publicUrl);
          }
        }
      }

      // Upload new file
      else {
        const { data: image, error: imageError } = await supabase.storage
          .from('avatars')
          .upload(path, file);

        if (imageError) {
          console.log(imageError);
        } else {
          console.log('Image uploaded successfully!');
          let imagePath = image?.path;
          let imageMetadata = await supabase.storage
            .from('avatars')
            .getPublicUrl(imagePath, {
              transform: {
                width: 100,
                height: 100,
                resize: 'fill',
              },
            });

          let updateUserAvatar = await supabase
            .from('users')
            .update({ avatar: imageMetadata.data.publicUrl })
            .eq('id', sessionId);

          updateUserImage(sessionId, imageMetadata.data.publicUrl);
          console.log('Avatar updated successfully');
          setAvatarUrl(imageMetadata.data.publicUrl);
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error uploading image:', error);
    }
  };

  const onPress = () => {
    const options = ['Take new photo', 'Select photo', 'Cancel'];

    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      selectedIndex => {
        switch (selectedIndex) {
          case 0:
            // Take new photo
            takePhoto();
            break;
          case 1:
            // Select photo
            pickImage();
            break;
          case cancelButtonIndex:
            // Canceled
            console.log('Cancel');
            break;

          default:
            break;
        }
      },
    );
  };

  async function handleNextPress() {
    console.log('next');
    const { data, error } = await supabase
      .from('users')
      .update({ onboarded: true })
      .eq('id', sessionId);

    console.log(error);
  }

  async function handleSkipPress() {
    const { data, error } = await supabase
      .from('users')
      .update({ onboarded: true })
      .eq('id', sessionId);
  }

  const getProfile = async () => {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionId);

    if (userError) {
      console.error(userError);
    } else {
      setFirstName(userData?.[0]?.first_name);
      setLastName(userData?.[0]?.last_name);
      setAvatarUrl(userData[0].avatar);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (sessionId) {
      // Subscribe to changes in the users table
      const channel = supabase
        .channel('db_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${sessionId}`,
          },
          payload => {
            const user: User2 = payload.new;
            const fName = user.first_name;
            const lName = user.last_name;
            const avatar = user.avatar;
            setAvatarUrl(avatar as string | null);
            setFirstName(fName as string);
            setLastName(lName as string);
          },
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

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
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: 'white',
      }}>
      <ScrollView
        contentContainerStyle={{ justifyContent: 'space-between', flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View className="mx-4 mt-10">
          <Text className="text-center text-lg font-medium">Add a photo</Text>
          <Text className="text-center text-gray-500">
            Upload a photo of yourself. You can change this at anytime.
          </Text>
        </View>
        <View className="mx-4 items-center">
          {isLoading ? (
            <ActivityIndicator color="purple" size="small" />
          ) : avatarUrl ? (
            <TouchableOpacity onPress={onPress}>
              <Avatar source={avatarUrl} name={fullName} size={200} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPress}>
              <AddPhotoIcon />
            </TouchableOpacity>
          )}
        </View>
        <View className="mx-4 flex flex-col space-y-4">
          <GradientButton
            onPress={() => handleNextPress()}
            title="Next"
            disabled={false}
            size={16}
            iconName="arrow-forward"
            iconSize={20}
            iconColor="white"
          />

          <TouchableOpacity onPress={() => handleSkipPress()}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                textAlign: 'center',
                color: 'black',
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileImage;
