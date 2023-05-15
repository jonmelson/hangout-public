import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

const NewMessage14Icon = (props: SvgProps) => (
  <Svg width={14} height={14} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        stroke="gray"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.417 1.167H5.25c-2.917 0-4.083 1.166-4.083 4.083v3.5c0 2.917 1.166 4.083 4.083 4.083h3.5c2.916 0 4.083-1.166 4.083-4.083V7.583"
      />
      <Path
        fill="gray"
        fillRule="evenodd"
        d="m5.444 8.696 1.594-.604 5.703-5.698c.41-.41.597-.887.244-1.24-.352-.352-.83-.165-1.24.244l-5.69 5.684-.61 1.614Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h14v14H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default NewMessage14Icon;
