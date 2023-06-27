import React from 'react';
import {IconProps, RootSvg, RootPath} from 'stream-chat-expo';

export const QuestionReaction: React.FC<IconProps> = props => (
  <RootSvg height={21} width={21} {...props} viewBox="0 0 24 24">
    <RootPath
      d="M6.71647 7.74398C4.3152 5.09321 8.41588 -0.0805922 12.1318 0.0365103C18.5803 -0.634167 21.7119 8.10949 16.0436 11.9277C14.9463 12.6765 14.2623 13.4714 14.2623 14.0072C14.2623 16.0796 11.7577 17.027 10.2507 15.526C9.16761 14.4472 9.79465 10.157 11.038 10.157C12.6876 9.03921 16.1505 6.45586 13.7065 4.73126C11.7755 3.71992 10.9703 5.06837 9.71271 7.20106C9.36 7.80431 7.50026 8.52467 6.71647 7.74398ZM10.7073 18.6985C8.11365 20.2634 8.86182 24 11.769 24C16.397 23.6203 14.3163 16.9064 10.7073 18.6985Z"
      {...props}
    />
  </RootSvg>
);
