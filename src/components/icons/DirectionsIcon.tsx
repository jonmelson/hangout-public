import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const DirectionsIcon = (props: SvgProps) => (
  <Svg width={20} height={21} fill="none" {...props}>
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M4.444 2.185A10 10 0 0 1 9.756.503V.5H10a10 10 0 1 1-5.556 1.685Zm3.92.09A8.385 8.385 0 0 1 18.385 10.5 8.4 8.4 0 0 1 10 18.885a8.386 8.386 0 0 1-1.636-16.61Z"
      clipRule="evenodd"
    />
    <Path
      fill="#fff"
      d="M11.212 5.626a.732.732 0 0 0-.516.213v.001a.732.732 0 0 0 0 1.032l.965.97H6.585a.732.732 0 0 0-.731.731v6.073a.732.732 0 0 0 1.463 0V9.305h4.343l-.963.963a.732.732 0 0 0 .512 1.252h.002a.731.731 0 0 0 .518-.219l.001-.001 2.212-2.212a.731.731 0 0 0 .16-.233l.002-.003v-.004a.734.734 0 0 0 .052-.259.733.733 0 0 0-.017-.266l-.005-.019-.008-.018a.732.732 0 0 0-.16-.233l-2.238-2.214a.732.732 0 0 0-.516-.213Z"
    />
  </Svg>
);
export default DirectionsIcon;
