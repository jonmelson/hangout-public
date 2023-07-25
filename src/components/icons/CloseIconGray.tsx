import * as React from 'react';
import Svg, { SvgProps, G, Rect, Path, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const CloseIconGray = (props: SvgProps) => (
  <Svg width={30} height={30} fill="none" {...props}>
    <G filter="url(#a)">
      <Rect width={30} height={30} fill="#F2F2F7" rx={15} />
      <Path
        fill="#3C3C43"
        fillOpacity={0.6}
        d="M10.049 19.181a.859.859 0 0 0 .006 1.187c.33.324.883.318 1.187.013L15 16.623l3.752 3.752a.853.853 0 0 0 1.187-.007.853.853 0 0 0 .006-1.187l-3.752-3.751 3.752-3.758a.847.847 0 0 0-.006-1.187.853.853 0 0 0-1.188-.006L15 14.229l-3.758-3.75a.853.853 0 0 0-1.187.006c-.324.324-.317.882-.006 1.187L13.8 15.43 10.05 19.18Z"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default CloseIconGray;
