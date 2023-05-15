import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const GoingButtonPlusIcon = (props: SvgProps) => (
  <Svg width={24} height={23} fill="none" {...props}>
    <Path
      fill="url(#a)"
      d="M12.77 10.73V2.5h-1.54v8.23H3v1.54h8.23v8.23h1.54v-8.23H21v-1.54h-8.23Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={21}
        x2={3}
        y1={11.5}
        y2={11.5}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B174FF" />
        <Stop offset={1} stopColor="#7000FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default GoingButtonPlusIcon;
