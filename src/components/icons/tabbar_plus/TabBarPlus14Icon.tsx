import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const TabBarPlus14Icon = (props: SvgProps) => (
  <Svg width={14} height={14} fill="none" {...props}>
    <Path
      fill="url(#a)"
      d="M12.444 0H1.556C.696 0 0 .696 0 1.556v10.888C0 13.304.696 14 1.556 14h10.888c.86 0 1.556-.696 1.556-1.556V1.556C14 .696 13.304 0 12.444 0Zm.778 12.444c0 .432-.35.778-.778.778H1.556a.778.778 0 0 1-.778-.778V1.556c0-.432.35-.778.778-.778h10.888a.78.78 0 0 1 .778.778v10.888Z"
    />
    <Path
      fill="url(#b)"
      d="M10.892 6.613H7.39V3.112A.39.39 0 0 0 7 2.723a.39.39 0 0 0-.388.389v3.5H3.112a.39.39 0 0 0-.389.39.39.39 0 0 0 .389.389h3.5v3.5a.39.39 0 0 0 .39.39.39.39 0 0 0 .389-.39v-3.5h3.5a.39.39 0 0 0 .39-.39.39.39 0 0 0-.39-.388Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={14}
        x2={0}
        y1={7}
        y2={7}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B174FF" />
        <Stop offset={1} stopColor="#7000FF" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={14}
        x2={0}
        y1={7}
        y2={7}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B174FF" />
        <Stop offset={1} stopColor="#7000FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default TabBarPlus14Icon;
