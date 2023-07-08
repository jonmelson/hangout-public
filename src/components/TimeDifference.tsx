import React from 'react';
import { View, Text } from 'react-native';

interface TimeDifferenceProps {
  timestamp?: string; // Make the `timestamp` prop optional
}

const TimeDifference: React.FC<TimeDifferenceProps> = ({ timestamp }) => {
  if (!timestamp) {
    // Handle the case when `timestamp` is undefined
    return null; // or any fallback UI
  }

  const getCurrentTime = () => {
    return new Date();
  };

  const parseTimestamp = () => {
    return new Date(timestamp);
  };

  const calculateTimeDifference = () => {
    const currentTime = getCurrentTime();
    const parsedTimestamp = parseTimestamp();

    const timeDifference = currentTime.getTime() - parsedTimestamp.getTime();

    return timeDifference;
  };

  const formatTime = (timeDifference: number) => {
    const minutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (timeDifference < 60000) {
      return 'Just now';
    } else if (weeks > 0) {
      return `${weeks}w`;
    } else if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }

    return '';
  };

  const timeDifference = calculateTimeDifference();
  const formattedTime = formatTime(timeDifference);

  return (
    <View>
      <Text style={{ fontSize: 14, fontWeight: '400', color: '#808080' }}>
        {formattedTime}
      </Text>
    </View>
  );
};

export default TimeDifference;
