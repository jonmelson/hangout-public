import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

import { Feather, SearchBarIcon, TabBarSearchIcon } from '../Icons';

interface SearchBarProps {
  placeholder: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MessagesSearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  searchTerm,
  setSearchTerm,
}) => {
  const handleClear = () => setSearchTerm('');

  return (
    <View style={styles.container} className="w-full">
      <View
        style={
          searchTerm ? styles.searchBar__clicked : styles.searchBar__unclicked
        }>
        <SearchBarIcon />
        <TextInput
          className="ml-2 flex-1"
          placeholder={placeholder}
          value={searchTerm}
          onChangeText={value => setSearchTerm(value)}
        />
      </View>

      {searchTerm && (
        <View style={styles.cancelButtonContainer}>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
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

export default MessagesSearchBar;
