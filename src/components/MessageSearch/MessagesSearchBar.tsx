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
import { SearchBarIcon } from '../Icons';

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
    setSearchQuery('');
    setClicked(false);
    Keyboard.dismiss();
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
  };
  // styles
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: 'white',
      paddingLeft: 16,
      paddingRight: clicked ? 0 : 16,
      paddingVertical: 8,
    },
    searchBar__unclicked: {
      height: 44,
      width: '100%',
      paddingHorizontal: 16,
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 50,
      alignItems: 'center',
      borderColor: '#808080',
      borderWidth: 1,
    },
    searchBar__clicked: {
      height: 44,
      paddingHorizontal: 16,
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
      fontSize: 16,
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

  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }>
        <SearchBarIcon />
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
