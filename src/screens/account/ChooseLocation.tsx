import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';

import SearchBar from '../../components/SearchBar';
import { Location24Icon, ChevronBackIcon } from '../../components/Icons';

import { GOOGLE_MAPS_API_KEY } from '@env';
import GoogleIcon from '../../components/icons/google/GoogleIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Location from 'expo-location';

interface Prediction {
  title: string;
  address: string;
  coordinates: string;
  place_id: string;
  reference: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

const ChooseLocation = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { sessionId?: string } };
}) => {
  const { sessionId } = route?.params ?? {};
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recentSearches, setRecentSearches] = useState<Prediction[]>([]);

  const getPlaceDetails = async (placeId: string) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_MAPS_API_KEY}&place_id=${placeId}`,
    );
    const data = await response.json();

    const title = data.result.name;
    const address = data.result.formatted_address;
    const coordinates = data.result.geometry.location;

    return { title, address, coordinates };
  };

  const handleTextChange = () => {
    if (searchText.length > 0) {
      fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAPS_API_KEY}&input=${searchText}`,
      )
        .then(response => response.json())
        .then(async data => {
          const predictionsWithTitles = await Promise.all(
            data.predictions.map(async (prediction: Prediction) => {
              const { title, address, coordinates } = await getPlaceDetails(
                prediction.place_id,
              );
              return {
                ...prediction,
                title: title,
                address: address,
                coordinates: coordinates,
              };
            }),
          );
          setPredictions(predictionsWithTitles);
        })
        .catch(error => console.log(error));
    } else {
      setPredictions([]);
    }
  };

  const handleCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'denied') {
      Alert.alert(
        'Location Permission Required',
        'Please grant location permissions to access your current location. Open app settings to enable location permissions.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
      );
      return;
    }

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
        const placeId = data.results[0].place_id;
        const { title, address, coordinates } = await getPlaceDetails(placeId);

        setSearchText(address);
        setPredictions([]);

        navigation.navigate('NewHangout', {
          locationMetaData: [
            {
              title: title,
              address: address,
              geometry: coordinates,
            },
          ],
          sessionId: sessionId,
        });
      })
      .catch(error => console.log(error));
  };

  const handlePredictionPress = async (prediction: Prediction) => {
    const title = prediction.title;
    const address = prediction.address;
    const geometry = prediction.coordinates;

    try {
      // Retrieve the existing past searches from AsyncStorage
      const storedSearches = await AsyncStorage.getItem('pastSearches');
      let pastSearches: Prediction[] = [];

      if (storedSearches) {
        pastSearches = JSON.parse(storedSearches);
      }

      // Add the selected prediction to the beginning of the array
      pastSearches.unshift(prediction);

      // Limit the array to the most recent three searches
      pastSearches = pastSearches.slice(0, 3);

      // Store the modified pastSearches array in AsyncStorage
      await AsyncStorage.setItem('pastSearches', JSON.stringify(pastSearches));
    } catch (error) {
      console.log('Error saving prediction to AsyncStorage:', error);
    }

    setSearchText(address);
    setPredictions([]);

    navigation.navigate('NewHangout', {
      locationMetaData: [
        { title: title, geometry: geometry, address: address },
      ],
      sessionId: sessionId,
    });
  };

  const renderItem = ({ item, index }: { item: Prediction; index: number }) => {
    if (index === predictions.length - 1) {
      // Render a custom component for the last item
      return (
        <View className="mr-1 mt-3 flex flex-row items-center justify-end">
          <Text>powered by </Text>

          <GoogleIcon />
        </View>
      );
    } else {
      // Render the default item component
      return (
        <TouchableOpacity
          onPress={() => handlePredictionPress(item)}
          className="border-b border-gray-300 mx-1 py-2">
          <Text
            style={{ fontSize: 16, color: '#333333', fontWeight: '500' }}
            className="mb-1">
            {item.title}
          </Text>
          <Text style={{ fontSize: 14, color: '#808080' }}>{item.address}</Text>
        </TouchableOpacity>
      );
    }
  };

  useEffect(() => {
    // Retrieve the past searches from AsyncStorage when the component mounts
    const getPastSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem('pastSearches');
        if (storedSearches) {
          const pastSearchesData = JSON.parse(storedSearches);
          setRecentSearches(pastSearchesData);
        }
      } catch (error) {
        console.log('Error retrieving past searches from AsyncStorage:', error);
      }
    };

    getPastSearches();
  }, []);

  useEffect(() => {
    handleTextChange();
  }, [searchText]);

  useEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      gestureDirection: 'horizontal',
      headerTitle: () => (
        <View className="mt-4">
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
            Choose location
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.pop()}
          className="mt-3 py-2 pr-4">
          <ChevronBackIcon />
        </TouchableOpacity>
      ),
    });
  }, [navigation, sessionId]);

  return (
    <View className="flex-1 bg-white">
      <View className="mx-4">
        <View className="mb-4 mt-2">
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

        {recentSearches.length > 0 && searchText === '' && (
          <View className="flex flex-col">
            <View className="border-b border-gray-300 mx-1 py-2">
              <Text style={{ fontSize: 16, fontWeight: '500',  }}>
                Recent
              </Text>
            </View>

            <FlatList data={recentSearches} renderItem={renderItem} />
          </View>
        )}

        <FlatList data={predictions} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default ChooseLocation;
