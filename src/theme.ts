import type { DeepPartial, Theme } from 'stream-chat-expo';

export const theme: DeepPartial<Theme> = {
  channelListMessenger: {
    flatList: {
      backgroundColor: 'white',
    },
    flatListContent: {
      backgroundColor: 'white',
    },
  },
};

export const myMessageTheme: DeepPartial<Theme> = {
  messageSimple: {
    content: {
      containerInner: {
        backgroundColor: '#7000FF',
        borderColor: '#7000FF',
        borderRadius: 100,
      },
      markdown: {
        text: {
          color: '#FCFCFC',
        },
      },
    },
  },
};
