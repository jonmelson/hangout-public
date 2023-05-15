import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const MoreIcon = (props: SvgProps) => (
  <Svg 
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      fill="#333"
      d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"
    />
  </Svg>
);
export default MoreIcon;
