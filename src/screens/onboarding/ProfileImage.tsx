import React, { useState, useEffect } from 'react';
import { Text, View, Alert, TouchableOpacity } from 'react-native';

import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import GradientButton from '../../components/GradientButton';

import { AddPhotoIcon, ChevronBackIcon } from '../../components/Icons';

import { useActionSheet } from '@expo/react-native-action-sheet';

// import * as ImagePicker from 'expo-image-picker';

import { supabase } from '../../lib/supabase';

import { User2 } from '../../utils/other';

const ProfileImage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { sessionId } = route.params ?? {};
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const fullName = firstName + ' ' + lastName;

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
          await supabase.storage.from('avatars').update(path, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (updateImageError) {
          console.log(updateImageError);
        } else {
          console.log('Image updated successfully!');
        }

        const { data: updateUser, error: updateUserError } = await supabase
          .from('users')
          .update({ avatar: updateImage?.path })
          .eq('id', sessionId);

        if (updateUserError) {
          console.log(updateUserError);
        } else {
          console.log('Avatar updated successfully');
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
        }
        const { data: user, error: userError } = await supabase
          .from('users')
          .update({ avatar: image?.path })
          .eq('id', sessionId);
        if (userError) {
          console.log(userError);
        } else {
          console.log('Avatar updated successfully');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // async function downloadImage(path: string) {
  //   try {
  //     const { data, error } = await supabase.storage
  //       .from('avatars')
  //       .download(path);

  //     if (error) {
  //       throw error;
  //     }

  //     const fr = new FileReader();
  //     fr.readAsDataURL(data);
  //     fr.onload = () => {
  //       setAvatarUrl(fr.result as string);
  //     };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.log('Error downloading image: ', error.message);
  //     }
  //   }
  // }

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

  // useEffect(() => {
  //   if (avatarPath) {
  //     downloadImage(avatarPath);
  //   }
  // }, [avatarPath]);

  useEffect(() => {
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
          className="flex flex-row items-center space-x-2"
          onPress={() => navigation.goBack()}>
          <ChevronBackIcon />
          <Text className="font-semibold">Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex-1 justify-around bg-white">
      <View className="mx-4 mt-4">
        <Text className="text-center text-lg font-medium">Add a photo</Text>
        <Text className="text-center text-gray-500">
          Upload a photo of yourself. You can change this at anytime.
        </Text>
      </View>
      <View className="mx-4 items-center">
        {avatarUrl ? (
          <TouchableOpacity onPress={onPress}>
            <Avatar source={avatarUrl} name={fullName} size={200} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onPress}>
            <AddPhotoIcon />
          </TouchableOpacity>
        )}
      </View>
      <View className="mx-4">
        <GradientButton
          onPress={() => handleNextPress()}
          title="Next"
          disabled={false}
          size={16}
          padding={10}
          iconName="arrow-forward"
          iconSize={20}
          iconColor="white"
        />
        <Button
          onPress={() => handleSkipPress()}
          title="Skip"
          size={16}
          padding={10}
        />
      </View>
    </View>
  );
};

export default ProfileImage;
