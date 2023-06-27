import * as React from 'react';
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
const MessageImageIcon = (props: SvgProps) => (
  <Svg 
    width={32}
    height={32}
    fill="none"
    {...props}>
    <Rect width={32} height={32} fill="url(#a)" rx={16} />
    <Path
      fill="#fff"
      d="m7.365 22.427-.018.018a5.671 5.671 0 0 1-.468-1.833c.065.669.239 1.274.486 1.815Zm5.886-7.911a2.181 2.181 0 1 0 0-4.363 2.181 2.181 0 0 0 0 4.363Z"
    />
    <Path
      fill="#fff"
      d="M19.841 6.833h-7.682c-3.336 0-5.326 1.99-5.326 5.326v7.682c0 .999.175 1.87.514 2.603.788 1.742 2.475 2.723 4.812 2.723h7.682c3.337 0 5.326-1.99 5.326-5.326v-7.682c0-3.337-1.99-5.326-5.326-5.326Zm3.832 9.625c-.715-.614-1.87-.614-2.585 0l-3.814 3.273c-.715.614-1.87.614-2.585 0l-.311-.257c-.651-.568-1.687-.623-2.42-.128l-3.429 2.3a4.888 4.888 0 0 1-.32-1.805v-7.682c0-2.585 1.365-3.95 3.95-3.95h7.682c2.585 0 3.95 1.365 3.95 3.95v4.4l-.118-.1Z"
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
export default MessageImageIcon;
