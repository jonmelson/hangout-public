import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
const MessagesChevronRightIcon = (props: SvgProps) => (
  <Svg width={18} height={18} fill="none" {...props}>
    <Path
      stroke="#E2E2E2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m6.683 14.94 4.89-4.89a1.49 1.49 0 0 0 0-2.1l-4.89-4.89"
    />
  </Svg>
);
export default MessagesChevronRightIcon;
