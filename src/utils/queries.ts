import React from 'react';
import { supabase } from '../lib/supabase';

// Returns a list of friends of the current user
export const getFriendsMetaData = (
  friendsData:
    | { friends_id: string; user_id_1: string; user_id_2: string }[]
    | null,
  sessionId?: string,
) => {
  if (!friendsData) {
    return [];
  }

  const friendMetaData: { friends_table_id: string; friendId: string }[] = [];

  for (const item of friendsData) {
    if (item.user_id_1 !== sessionId) {
      friendMetaData.push({
        friends_table_id: item.friends_id,
        friendId: item.user_id_1,
      });
    } else if (item.user_id_2 !== sessionId) {
      friendMetaData.push({
        friends_table_id: item.friends_id,
        friendId: item.user_id_2,
      });
    }
  }

  return friendMetaData;
};
