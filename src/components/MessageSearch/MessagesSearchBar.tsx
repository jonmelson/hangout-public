import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Keyboard,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Feather, Entypo } from '@expo/vector-icons';

interface SearchBarProps {
  clicked: boolean;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  clicked,
  searchQuery,
  setSearchQuery,
  setClicked,
}) => {
  const handleCancel = () => {
    Keyboard.dismiss();
    setClicked(false);
    setSearchQuery(''); // Clear the search query after dismissing the keyboard and updating clicked state
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }>
        <Feather
          name="search"
          size={20}
          color="#808080"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={handleInputChange}
          onFocus={() => {
            setClicked(true);
          }}
          placeholder={!clicked ? 'Search messages' : ''}
          placeholderTextColor="#808080"
        />
      </View>
      {clicked && (
        <View style={styles.cancelButtonContainer}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '97%',
    backgroundColor: 'white',
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: 'row',
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    borderColor: '#808080',
    borderWidth: 1,
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: 'row',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderColor: '#808080',
    borderWidth: 1,
  },
  searchIcon: {
    marginLeft: 1,
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: '90%',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
  },
  cancelButtonContainer: {
    marginRight: 4,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
});
