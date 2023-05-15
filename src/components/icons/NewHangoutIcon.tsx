import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface NewHangoutIconProps extends SvgProps {
  size?: number;
}

const NewHangoutIcon = ({ size = 25, ...props }: NewHangoutIconProps) => {
  const viewBox =
    size === 25
      ? `0 0 ${size} ${size}`
      : `0 0 ${size + size / 1.5} ${size + size / 1.5}`;

  return (
    <Svg width={size} height={size} fill="none" viewBox={viewBox} {...props}>
      <Path
        d="M22.221 0H2.78A2.778 2.778 0 0 0 0 2.779V22.22A2.778 2.778 0 0 0 2.779 25H22.22A2.778 2.778 0 0 0 25 22.221V2.78A2.778 2.778 0 0 0 22.221 0Zm1.39 22.221c0 .771-.626 1.39-1.39 1.39H2.78c-.772 0-1.39-.626-1.39-1.39V2.78c0-.772.625-1.39 1.39-1.39H22.22c.764 0 1.39.625 1.39 1.39V22.22Z"
        fill="url(#a)"
      />
      <Path
        d="M19.45 11.809h-6.252V5.557a.697.697 0 0 0-.694-.695.697.697 0 0 0-.695.695v6.252H5.557a.697.697 0 0 0-.695.695c0 .382.313.694.695.694h6.252v6.252c0 .382.312.695.695.695a.697.697 0 0 0 .694-.695v-6.252h6.252a.697.697 0 0 0 .695-.694.697.697 0 0 0-.695-.695Z"
        fill="url(#b)"
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={size}
          y1={size / 2}
          x2={0}
          y2={size / 2}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#B174FF" />
          <Stop offset={1} stopColor="#7000FF" />
        </LinearGradient>
        <LinearGradient
          id="b"
          x1={size}
          y1={size / 2}
          x2={0}
          y2={size / 2}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#B174FF" />
          <Stop offset={1} stopColor="#7000FF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default NewHangoutIcon;
