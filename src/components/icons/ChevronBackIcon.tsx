import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const ChevronBackIcon = (props: SvgProps) => (
  <Svg width={9} height={18} fill="none" {...props}>
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m8.098 16.84-6.52-6.52c-.77-.77-.77-2.03 0-2.8L8.098 1"
    />
  </Svg>
);
export default ChevronBackIcon;
