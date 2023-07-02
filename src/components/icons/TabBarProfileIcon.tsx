import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

interface Props {
  name: string;
}

const TabBarProfileIcon = (props: Props) => {
  const { name } = props;
  switch ( name )
  {
    case 'profile': return (
      <Svg width={24} height={24} fill="none" {...props}>
        <G
          stroke="gray"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)">
          <Path d="M12.125 13.06a.962.962 0 0 0-.25 0 3.34 3.34 0 0 1-2.328-1.073 3.597 3.597 0 0 1-.954-2.451C8.593 7.585 10.11 6 12 6c.893-.002 1.75.36 2.387 1.01a3.597 3.597 0 0 1 1.02 2.457 3.607 3.607 0 0 1-.932 2.494 3.348 3.348 0 0 1-2.35 1.1ZM19 20.177c-1.909 1.82-4.408 2.829-7 2.824-2.7 0-5.151-1.067-7-2.824.104-1.014.727-2.005 1.838-2.782 2.846-1.961 7.499-1.961 10.324 0 1.111.777 1.734 1.768 1.838 2.782Z" />
          <Path d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Z" />
        </G>
        <Defs>
          <ClipPath id="a">
            <Path fill="#fff" d="M0 0h24v24H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    );
    case 'profile-outline': return (
      <Svg width={24} height={24} fill="none" {...props}>
        <G
          stroke="#333333"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)">
          <Path d="M12.125 13.06a.962.962 0 0 0-.25 0 3.34 3.34 0 0 1-2.328-1.073 3.597 3.597 0 0 1-.954-2.451C8.593 7.585 10.11 6 12 6c.893-.002 1.75.36 2.387 1.01a3.597 3.597 0 0 1 1.02 2.457 3.607 3.607 0 0 1-.932 2.494 3.348 3.348 0 0 1-2.35 1.1ZM19 20.177c-1.909 1.82-4.408 2.829-7 2.824-2.7 0-5.151-1.067-7-2.824.104-1.014.727-2.005 1.838-2.782 2.846-1.961 7.499-1.961 10.324 0 1.111.777 1.734 1.768 1.838 2.782Z" />
          <Path d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Z" />
        </G>
        <Defs>
          <ClipPath id="a">
            <Path fill="#fff" d="M0 0h24v24H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    );
    default: return (
      <Svg width={24} height={24} fill="none" {...props}>
        <G
          stroke="gray"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)">
          <Path d="M12.125 13.06a.962.962 0 0 0-.25 0 3.34 3.34 0 0 1-2.328-1.073 3.597 3.597 0 0 1-.954-2.451C8.593 7.585 10.11 6 12 6c.893-.002 1.75.36 2.387 1.01a3.597 3.597 0 0 1 1.02 2.457 3.607 3.607 0 0 1-.932 2.494 3.348 3.348 0 0 1-2.35 1.1ZM19 20.177c-1.909 1.82-4.408 2.829-7 2.824-2.7 0-5.151-1.067-7-2.824.104-1.014.727-2.005 1.838-2.782 2.846-1.961 7.499-1.961 10.324 0 1.111.777 1.734 1.768 1.838 2.782Z" />
          <Path d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Z" />
        </G>
        <Defs>
          <ClipPath id="a">
            <Path fill="#fff" d="M0 0h24v24H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    );
  }
  
};

export default TabBarProfileIcon;
