import * as React from 'react';
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';



const MessageSendIcon = (props: SvgProps) => (
  <Svg width={32} height={32} fill="none" {...props}>
    <Rect width={32} height={32} fill="url(#a)" rx={16} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M21.564 13.773 16 8.207l-5.564 5.565M16 23.791V8.364"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={32}
        x2={0}
        y1={16}
        y2={16}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B174FF" />
        <Stop offset={1} stopColor="#7000FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default MessageSendIcon;
