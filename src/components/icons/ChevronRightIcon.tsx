import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const ChevronRightIcon = (props: SvgProps) => (
  <Svg
    width={9}
    height={18}
    fill="none"
    {...props}>
    <Path
      d="m.902 16.92 6.52-6.52c.77-.77.77-2.03 0-2.8L.903 1.08"
      stroke="gray"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ChevronRightIcon;
