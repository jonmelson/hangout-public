import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
const ClockIcon = (props: SvgProps) => (
  <Svg width={18} height={18} fill="none" {...props}>
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 9c0 4.14-3.36 7.5-7.5 7.5-4.14 0-7.5-3.36-7.5-7.5 0-4.14 3.36-7.5 7.5-7.5 4.14 0 7.5 3.36 7.5 7.5Z"
    />
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.783 11.385 9.458 9.998c-.405-.24-.735-.818-.735-1.29V5.633"
    />
  </Svg>
);
export default ClockIcon;
