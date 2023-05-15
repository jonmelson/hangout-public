import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const InfoCircleIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 16v-5m0-9C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z"
    />
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12.005 8h-.01"
    />
  </Svg>
);
export default InfoCircleIcon;
