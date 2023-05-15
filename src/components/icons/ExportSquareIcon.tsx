import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface ExportSquareIconProps extends SvgProps {
  color: string;
}

const ExportSquareIcon = ({ color, ...props }: ExportSquareIconProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m13 11 8.2-8.2m.8 4V2h-4.8M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
    />
  </Svg>
);
export default ExportSquareIcon;
