import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';

import { Feather } from './Icons';

interface SearchBarProps {
  placeholder: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  searchTerm,
  setSearchTerm,
}) => {
  const handleClear = () => setSearchTerm('');

  return (
    <View className="flex h-10 flex-row items-center rounded-full border border-gray-500 bg-white px-3">
      <Feather name="search" size={24} color="gray" />
      <TextInput
        className="ml-2 flex-1"
        placeholder={placeholder}
        value={searchTerm}
        onChangeText={value => setSearchTerm(value)}
      />
      {searchTerm ? (
        <TouchableOpacity onPress={handleClear}>
          <Feather name="x" size={24} color="gray" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;
