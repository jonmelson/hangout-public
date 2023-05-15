import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
const TabBarPlus25Icon = (props: SvgProps) => (
  <Svg 
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Path
      fill="url(#a)"
      d="M22.221 0H2.78A2.778 2.778 0 0 0 0 2.779V22.22A2.778 2.778 0 0 0 2.779 25H22.22A2.778 2.778 0 0 0 25 22.221V2.78A2.778 2.778 0 0 0 22.221 0Zm1.39 22.221c0 .771-.626 1.39-1.39 1.39H2.78c-.772 0-1.39-.626-1.39-1.39V2.78c0-.772.625-1.39 1.39-1.39H22.22c.764 0 1.39.625 1.39 1.39V22.22Z"
    />
    <Path
      fill="url(#b)"
      d="M19.45 11.809h-6.252V5.557a.697.697 0 0 0-.694-.695.697.697 0 0 0-.695.695v6.252H5.557a.697.697 0 0 0-.695.695c0 .382.313.694.695.694h6.252v6.252c0 .382.312.695.695.695a.697.697 0 0 0 .694-.695v-6.252h6.252a.697.697 0 0 0 .695-.694.697.697 0 0 0-.695-.695Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={25}
        x2={0}
        y1={12.5}
        y2={12.5}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B174FF" />
        <Stop offset={1} stopColor="#7000FF" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={25}
        x2={0}
        y1={12.5}
        y2={12.5}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B174FF" />
        <Stop offset={1} stopColor="#7000FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default TabBarPlus25Icon;
