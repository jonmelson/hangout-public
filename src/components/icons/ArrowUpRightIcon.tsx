import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const ArrowUpRightIcon = (props: SvgProps) => (
  <Svg width={14} height={15} fill="none" {...props}>
    <Path
      stroke="gray"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m1 13.5 12-12M1 1.5h12v12"
    />
  </Svg>
);
export default ArrowUpRightIcon;
