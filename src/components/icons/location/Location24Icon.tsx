import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface LocationIconProps extends SvgProps {
  color: string;
}

const Location24Icon = ({ color, ...props }: LocationIconProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      stroke={color}
      strokeWidth={1.5}
      d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z"
    />
    <Path
      stroke={color}
      strokeWidth={1.5}
      d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"
    />
  </Svg>
);
export default Location24Icon;
