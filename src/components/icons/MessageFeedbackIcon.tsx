import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
const MessageFeedbackIcon = (props: SvgProps) => (
  <Svg 
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M7 18.43h4l4.45 2.96a.997.997 0 0 0 1.55-.83v-2.13c3 0 5-2 5-5v-6c0-3-2-5-5-5H7c-3 0-5 2-5 5v6c0 3 2 5 5 5Z"
    />
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12 6.86.005 4.64m0 2.25h-.01"
    />
  </Svg>
);
export default MessageFeedbackIcon;
