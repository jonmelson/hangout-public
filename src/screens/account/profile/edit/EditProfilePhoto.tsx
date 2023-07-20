import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import AddPhotoIcon from '../../../../components/icons/AddPhotoIcon';

import { useActionSheet } from '@expo/react-native-action-sheet';

import * as ImagePicker from 'expo-image-picker';

import Avatar from '../../../../components/Avatar';

import { supabase } from '../../../../lib/supabase';

import { User2 } from '../../../../utils/other';

import { useChatContext } from '../../../../context/ChatContext';

const EditProfilePhoto = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { sessionId } = route.params ?? {};

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { updateUserImage } = useChatContext();
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
      setUploading(true); // Set uploading state to true
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
                width: 500,
                height: 500,
                resize: 'contain',
              },
            });

          let updateUserAvatar = await supabase
            .from('users')
            .update({ avatar: imageMetadata.data.publicUrl })
            .eq('id', sessionId);

          // Update url in GetStream
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
                width: 500,
                height: 500,
                resize: 'contain',
              },
            });

          let updateUserAvatar = await supabase
            .from('users')
            .update({ avatar: imageMetadata.data.publicUrl })
            .eq('id', sessionId);

          // Update url in GetStream
          updateUserImage(sessionId, imageMetadata.data.publicUrl);

          console.log('Avatar updated successfully');
          setAvatarUrl(imageMetadata.data.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false); // Set uploading state to false after upload completion
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

  useEffect(() => {
    const getProfile = async () => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('avatar')
        .eq('id', sessionId);

      if (userError) {
        console.error(userError);
      } else {
        setAvatarUrl(userData[0].avatar);
      }
    };

    getProfile();
  }, [avatarUrl]);

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
            if (payload.eventType == 'INSERT') {
              const user: User2 = payload.new;
              const avatar = user.avatar;
              setAvatarUrl(avatar as string | null);
            } else if (payload.eventType == 'UPDATE') {
              const user: User2 = payload.new;
              const avatar = user.avatar;
              setAvatarUrl(avatar as string | null);
            }
          },
        )
        .subscribe();
    }
  }, [sessionId, avatarUrl]);

  return (
    <View className="flex-1 justify-around bg-white">
      <View className="mx-4">
        <Text className="text-center text-lg font-medium">Add a photo</Text>
        <Text className="text-center text-gray-500">
          Upload a photo of yourself.
        </Text>
      </View>
      <View className="mx-4 items-center">
        {uploading ? ( // Show activity indicator if uploading is true
          <ActivityIndicator size="large" color="purple" />
        ) : avatarUrl ? (
          <TouchableOpacity onPress={onPress}>
            <Avatar source={avatarUrl} name="" size={200} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onPress}>
            <AddPhotoIcon />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <TouchableOpacity
          className="mx-28 flex items-center justify-center rounded-full bg-purple-600 p-4"
          onPress={() => navigation.navigate('ProfileScreen')}>
          <Text className="font-semibold text-white">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfilePhoto;
