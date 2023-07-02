import * as React from 'react';
import Svg, { SvgProps, Path, G, Defs, ClipPath } from 'react-native-svg';

interface Props {
  name: string;
}

const TabBarSearchIcon = (props: Props) => {
  const { name } = props;
  switch (name) {
    case 'search':
      return (
        <Svg width={25} height={25} fill="none" {...props}>
          <Path
            fill="gray"
            d="M11.2 21.4C5.6 21.4 1 16.8 1 11.2S5.6 1 11.2 1s10.2 4.6 10.2 10.2-4.6 10.2-10.2 10.2Zm0-19.067c-4.867 0-8.867 4-8.867 8.867 0 4.867 4 8.867 8.867 8.867 4.867 0 8.867-4 8.867-8.867 0-4.867-4-8.867-8.867-8.867Z"
          />
          <Path
            fill="gray"
            d="M23.333 24a.605.605 0 0 1-.466-.2l-5.4-5.4a.644.644 0 0 1 0-.933.645.645 0 0 1 .933 0l5.4 5.4a.644.644 0 0 1 0 .933.605.605 0 0 1-.467.2Z"
          />
        </Svg>
      );
    case 'search-outline':
      return (
        <Svg width={25} height={25} fill="none" {...props}>
          <G fill="#333" stroke="#333" clipPath="url(#a)">
            <Path d="M11.2 21.4C5.6 21.4 1 16.8 1 11.2S5.6 1 11.2 1s10.2 4.6 10.2 10.2-4.6 10.2-10.2 10.2Zm0-19.067c-4.867 0-8.867 4-8.867 8.867 0 4.867 4 8.867 8.867 8.867 4.867 0 8.867-4 8.867-8.867 0-4.867-4-8.867-8.867-8.867Z" />
            <Path d="M23.333 24a.605.605 0 0 1-.466-.2l-5.4-5.4a.644.644 0 0 1 0-.933.645.645 0 0 1 .933 0l5.4 5.4a.644.644 0 0 1 0 .933.605.605 0 0 1-.467.2Z" />
          </G>
          <Defs>
            <ClipPath id="a">
              <Path fill="#fff" d="M0 0h25v25H0z" />
            </ClipPath>
          </Defs>
        </Svg>
      );
    default:
      return (
        <Svg width={25} height={25} fill="none" {...props}>
          <Path
            fill="gray"
            d="M11.2 21.4C5.6 21.4 1 16.8 1 11.2S5.6 1 11.2 1s10.2 4.6 10.2 10.2-4.6 10.2-10.2 10.2Zm0-19.067c-4.867 0-8.867 4-8.867 8.867 0 4.867 4 8.867 8.867 8.867 4.867 0 8.867-4 8.867-8.867 0-4.867-4-8.867-8.867-8.867Z"
          />
          <Path
            fill="gray"
            d="M23.333 24a.605.605 0 0 1-.466-.2l-5.4-5.4a.644.644 0 0 1 0-.933.645.645 0 0 1 .933 0l5.4 5.4a.644.644 0 0 1 0 .933.605.605 0 0 1-.467.2Z"
          />
        </Svg>
      );
  }
};

export default TabBarSearchIcon;
