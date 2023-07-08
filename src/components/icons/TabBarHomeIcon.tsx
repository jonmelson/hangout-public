import * as React from 'react';
import Svg, { Path, Defs, G, ClipPath } from 'react-native-svg';

interface Props {
  name: string;
}

const TabBarHomeIcon = (props: Props) => {
  const { name } = props;

  switch (name) {
    case 'home':
      return (
        <Svg width={26} height={27} fill="none" {...props}>
          <Path
            d="M23.927 26.002a1.95 1.95 0 0 0 1.469-.611A2.01 2.01 0 0 0 26 23.915V8.777a2.087 2.087 0 0 0-1.007-1.794L14.053.294a1.573 1.573 0 0 0-.474-.22 2.327 2.327 0 0 0-1.157 0c-.16.04-.312.108-.449.2L.84 7.08a2.138 2.138 0 0 0-.56.65A1.95 1.95 0 0 0 0 8.777v15.138a2.009 2.009 0 0 0 .605 1.476 1.951 1.951 0 0 0 1.469.61h7.52v-5.934a3.348 3.348 0 0 1 .995-2.437 3.36 3.36 0 0 1 4.823 0 3.346 3.346 0 0 1 .994 2.437v5.935h7.52Zm-7.534-9.373A4.55 4.55 0 0 0 13 15.205a4.55 4.55 0 0 0-3.386 1.424 4.68 4.68 0 0 0-1.41 3.438v4.55H1.39V8.393l11.61-7.091 11.615 7.091v16.205h-6.819v-4.55a4.699 4.699 0 0 0-1.404-3.42Z"
            fill="gray"
          />
        </Svg>
      );
    case 'home-outline':
      return (
        <Svg width={26} height={26} fill="none" {...props}>
          <G clipPath="url(#a)">
            <Path
              d="M25.727 7.735a2.047 2.047 0 0 0-.735-.754L14.053.293a1.573 1.573 0 0 0-.475-.221 2.327 2.327 0 0 0-1.156 0c-.16.04-.312.108-.449.201L.839 7.08a2.138 2.138 0 0 0-.56.65A1.95 1.95 0 0 0 0 8.775v15.139a2.009 2.009 0 0 0 .605 1.475A1.95 1.95 0 0 0 2.074 26h7.52v-5.934a3.347 3.347 0 0 1 .995-2.438 3.36 3.36 0 0 1 4.822 0 3.348 3.348 0 0 1 .995 2.438V26h7.52a1.95 1.95 0 0 0 1.47-.61A2.009 2.009 0 0 0 26 23.913V8.775a2.033 2.033 0 0 0-.273-1.04Z"
              fill="#333"
            />
          </G>
          <Defs>
            <ClipPath id="a">
              <Path fill="#fff" d="M0 0h26v26H0z" />
            </ClipPath>
          </Defs>
        </Svg>
      );
    default:
      return (
        <Svg width={26} height={27} fill="none" {...props}>
          <Path
            d="M23.927 26.002a1.95 1.95 0 0 0 1.469-.611A2.01 2.01 0 0 0 26 23.915V8.777a2.087 2.087 0 0 0-1.007-1.794L14.053.294a1.573 1.573 0 0 0-.474-.22 2.327 2.327 0 0 0-1.157 0c-.16.04-.312.108-.449.2L.84 7.08a2.138 2.138 0 0 0-.56.65A1.95 1.95 0 0 0 0 8.777v15.138a2.009 2.009 0 0 0 .605 1.476 1.951 1.951 0 0 0 1.469.61h7.52v-5.934a3.348 3.348 0 0 1 .995-2.437 3.36 3.36 0 0 1 4.823 0 3.346 3.346 0 0 1 .994 2.437v5.935h7.52Zm-7.534-9.373A4.55 4.55 0 0 0 13 15.205a4.55 4.55 0 0 0-3.386 1.424 4.68 4.68 0 0 0-1.41 3.438v4.55H1.39V8.393l11.61-7.091 11.615 7.091v16.205h-6.819v-4.55a4.699 4.699 0 0 0-1.404-3.42Z"
            fill="gray"
          />
        </Svg>
      );
  }
};

export default TabBarHomeIcon;