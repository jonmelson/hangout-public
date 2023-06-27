import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import {
  Channel as StreamChannel,
  MessageInput,
  MessageList,
  LoveReaction,
  ThumbsUpReaction,
  ThumbsDownReaction,
  ChannelProps,
} from 'stream-chat-expo';

import { myMessageTheme } from '../../theme';

import { HahaReaction } from '../icons/HahaReaction';
import { QuestionReaction } from '../icons/QuestionReaction';
import { ExclamationReaction } from '../icons/ExclamationReaction';

import { ChatContext } from '../../context/ChatContext';

import { InlineDateSeparator } from './InlineDateSeparator';
import { InputButtons } from './InputButtons';
import { SendButton } from './SendButton';

const SUPPORTED_REACTIONS = [
  {
    Icon: LoveReaction,
    type: 'love',
  },
  {
    Icon: ThumbsUpReaction,
    type: 'like',
  },
  {
    Icon: ThumbsDownReaction,
    type: 'sad',
  },
  {
    Icon: HahaReaction,
    type: 'hahaha',
  },
  {
    Icon: QuestionReaction,
    type: 'question',
  },
  {
    Icon: ExclamationReaction,
    type: 'exclamation',
  },
];

export const Channel = ({
  children = (
    <View style={StyleSheet.absoluteFill}>
      <MessageList
        StickyHeader={() => null}
        InlineDateSeparator={InlineDateSeparator}
      />
      <MessageInput />
    </View>
  ),
  ...props
}) => {
  // const { channel, messageId } = useContext(ChatContext);
  const headerHeight = useHeaderHeight();

  return null;
  // <StreamChannel
  //   MessageReplies={() => null}
  //   supportedReactions={SUPPORTED_REACTIONS}
  //   myMessageTheme={myMessageTheme}
  //   keyboardVerticalOffset={headerHeight}
  //   MessageAvatar={() => null}
  //   enforceUniqueReaction
  //   allowThreadMessagesInChannel={false}
  //   InputButtons={InputButtons}
  //   SendButton={SendButton}
  //   {...props}>
  //   {children}
  // </StreamChannel>
};
