import * as React from 'react';
import Svg, { Path, Defs, G, ClipPath } from 'react-native-svg';

interface Props {
  name: string;
  color?: string
}

const TabBarGoingIcon = (props: Props) => {
  const { name, color = 'gray' } = props;

  switch (name) {
    case 'going':
      return (
        <Svg width={26} height={26} fill="none" {...props}>
          <G clipPath="url(#a)">
            <Path
              d="M18.791 18.791H16.96l.175-8.768-8.567 8.716-1.3-1.3 8.716-8.566-8.768.175V7.215h11.57v11.576h.006ZM26 13c0 7.17-5.83 13-13 13S0 20.17 0 13 5.83 0 13 0s13 5.83 13 13Zm-1.502 0c0-6.338-5.154-11.498-11.498-11.498C6.656 1.502 1.502 6.662 1.502 13c0 6.337 5.154 11.498 11.498 11.498 6.344 0 11.498-5.154 11.498-11.498Z"
              fill={color}
            />
          </G>
          <Defs>
            <ClipPath id="a">
              <Path fill="#fff" d="M0 0h26v26H0z" />
            </ClipPath>
          </Defs>
        </Svg>
      );

    case 'going-outline':
      return (
        <Svg width={26} height={26} fill="none" {...props}>
          <Path
            d="M13 0C5.83 0 0 5.83 0 13s5.83 13 13 13 13-5.83 13-13S20.17 0 13 0Zm3.952 18.791.175-8.768-8.566 8.716-1.3-1.3 8.716-8.566-8.768.175V7.215h11.576v11.576h-1.833Z"
            fill={color}
          />
        </Svg>
      );

    default:
      return (
        <Svg width={26} height={26} fill="none" {...props}>
          <Path
            d="M13 0C5.83 0 0 5.83 0 13s5.83 13 13 13 13-5.83 13-13S20.17 0 13 0Zm3.952 18.791.175-8.768-8.566 8.716-1.3-1.3 8.716-8.566-8.768.175V7.215h11.576v11.576h-1.833Z"
            fill={color}
          />
        </Svg>
      );
  }
};

export default TabBarGoingIcon;
