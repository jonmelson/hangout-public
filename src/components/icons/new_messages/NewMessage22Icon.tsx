import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const NewMessage22Icon = (props: SvgProps) => (
  <Svg width={22} height={22} fill="none" {...props}>
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.084 1.833H8.25c-4.583 0-6.417 1.834-6.417 6.417v5.5c0 4.583 1.834 6.417 6.417 6.417h5.5c4.584 0 6.417-1.834 6.417-6.417v-1.833"
    />
    <Path
      fill="#333"
      fillRule="evenodd"
      d="m8.556 13.664 2.503-.949 8.963-8.953c.645-.644.938-1.395.384-1.948-.554-.554-1.306-.26-1.95.383L9.515 11.13l-.96 2.535Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default NewMessage22Icon;
