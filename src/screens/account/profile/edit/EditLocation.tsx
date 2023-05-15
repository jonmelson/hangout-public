import React, { useState, useEffect } from 'react';

import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import SearchBar from '../../../../components/SearchBar';
import { Location24Icon } from '../../../../components/Icons';

import { GOOGLE_MAPS_API_KEY } from '@env';

import * as Location from 'expo-location';

import { supabase } from '../../../../lib/supabase';

interface Prediction {
  description: string;
  place_id: string;
  reference: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

const EditLocation = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const handleTextChange = () => {
    if (searchText.length > 0) {
      fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAPS_API_KEY}&input=${searchText}`,
      )
        .then(response => response.json())
        .then(data => {
          // console.log(data);
          setPredictions(data.predictions);
        })
        .catch(error => console.log(error));
    } else {
      setPredictions([]);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_MAPS_API_KEY}&place_id=${placeId}`,
    );
    const data = await response.json();
    return data.result.geometry.location;
  };

  const handleCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Please grant location permissions');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
    )
      .then(response => response.json())
      .then(async data => {
        setSearchText(data.results[0].formatted_address);
        setPredictions([]);

        const placeId = data.results[0].place_id;
        const geometry = await getPlaceDetails(placeId);

        const { data: locationData, error } = await supabase
          .from('users')
          .update({
            location: [
              {
                address: data.results[0].formatted_address,
                geometry: geometry,
              },
            ],
          })
          .eq('id', sessionId);
      })
      .catch(error => console.log(error));
    navigation.goBack();
  };

  const handlePredictionPress = async (prediction: Prediction) => {
    setSearchText(prediction.description);
    setPredictions([]);

    const geometry = await getPlaceDetails(prediction.place_id);

    const { data: locationData, error } = await supabase
      .from('users')
      .update({
        location: [
          {
            address: prediction.description,
            geometry: geometry,
          },
        ],
      })
      .eq('id', sessionId);

    navigation.goBack();
  };

  const renderItem = ({ item, index }: { item: Prediction; index: number }) => {
    if (index === predictions.length - 1) {
      // Render a custom component for the last item
      return (
        <View className="mr-1 mt-3 flex flex-row items-center justify-end">
          <Text>powered by </Text>
          <Image
            source={require('../../../../../assets/images/google/google_on_white.png')}
          />
        </View>
      );
    } else {
      // Render the default item component
      return (
        <TouchableOpacity
          onPress={() => handlePredictionPress(item)}
          className="border-b border-gray-300 px-1 py-2">
          <Text className="font-medium">{item.description}</Text>
        </TouchableOpacity>
      );
    }
  };

  useEffect(() => {
    handleTextChange();
  }, [searchText]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Choose location',
      presentation: 'modal',
      headerShadowVisible: false,
      headerTitle: () => (
        <View className="mt-4">
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#141416' }}>
            Choose location
          </Text>
        </View>
      ),
      headerLeft: () => (
        <View className="mt-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, sessionId]);

  return (
    <View className="flex-1 bg-white">
      <View className="mx-4">
        <View className="my-4">
          <SearchBar
            placeholder="Search"
            searchTerm={searchText}
            setSearchTerm={setSearchText}
          />
        </View>

        {searchText === '' && (
          <TouchableOpacity
            className="mb-4 flex flex-row items-center space-x-1"
            onPress={handleCurrentLocation}>
            <View>
              <Location24Icon color="#333" />
            </View>
            <View>
              <Text className="font-medium">Use Current Location</Text>
            </View>
          </TouchableOpacity>
        )}

        <FlatList data={predictions} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default EditLocation;
