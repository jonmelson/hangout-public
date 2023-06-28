import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ChannelPreviewLatestMessage = (latestMessagePreview: any) => {
  if (Object.keys(latestMessagePreview).length === 0) {
    return null;
  }

  //   console.log(latestMessagePreview.messageObject.user);
  return (
    <>
      <Text>Hi</Text>
    </>
    // <>
    //   {latestMessagePreview.messageObject.name && (
    //     <View>
    //       <Text>{latestMessagePreview.messageObject.name}</Text>
    //     </View>
    //   )}
    // </>
  );
};

export default ChannelPreviewLatestMessage;
