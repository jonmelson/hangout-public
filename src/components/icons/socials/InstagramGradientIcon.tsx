import * as React from 'react';
import Svg, {
  SvgProps,
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';
const InstagramGradientIcon = (props: SvgProps) => (
  <Svg 
    width={16}
    height={16}
    fill="none"
    {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="url(#b)"
        d="M14.46 11.222c0 .263-.025.523-.073.778a3.934 3.934 0 0 1-.216.74l.022-.022a2.642 2.642 0 0 1-.601.912 2.506 2.506 0 0 1-.896.584l-.021.022c-.22.082-.459.147-.705.199-.25.047-.506.073-.77.073-.428.013-.808.026-1.133.03-.324.009-1.029.009-2.11.009h-2.11c-.325 0-.705-.013-1.133-.043-.277 0-.54-.026-.792-.074a3.805 3.805 0 0 1-.726-.216l.021.022a2.641 2.641 0 0 1-.912-.601 2.743 2.743 0 0 1-.601-.896v-.021a4.945 4.945 0 0 1-.199-.705 4.111 4.111 0 0 1-.074-.77v-.021a18.48 18.48 0 0 1-.043-1.12V5.89c0-.325.013-.705.043-1.133 0-.277.026-.545.074-.8s.121-.502.216-.74l-.021.044a2.65 2.65 0 0 1 .6-.935c.264-.263.567-.458.913-.583.22-.082.458-.147.705-.2.25-.047.515-.077.791-.094.415-.013.792-.026 1.12-.03a188.12 188.12 0 0 1 2.12-.01c1.08 0 1.78 0 2.11.01.324.008.704.017 1.133.03.263.013.518.043.77.095a4.5 4.5 0 0 1 .726.199h-.022c.346.138.653.337.912.592.264.255.463.558.602.904v.022a4.143 4.143 0 0 1 .272 1.474c.013.415.026.791.03 1.12.009.333.009 1.038.009 2.12v2.11c0 .324-.009.704-.022 1.132h-.021l.013.005Zm1.082-8.459A4.033 4.033 0 0 0 13.237.437h-.022a6.059 6.059 0 0 0-.925-.268 4.827 4.827 0 0 0-1.008-.104h-.021a30.74 30.74 0 0 0-1.142-.052C9.773.004 9.06.004 7.98.004c-1.082 0-1.795 0-2.141.009a30.73 30.73 0 0 0-1.142.052A4.94 4.94 0 0 0 3.68.169c-.333.069-.653.16-.956.268h.044A4.034 4.034 0 0 0 .442 2.742l-.022.021c-.113.29-.2.601-.26.926-.06.324-.1.661-.112 1.007-.013.428-.026.813-.03 1.155-.01.337-.01 1.05-.01 2.132 0 1.08 0 1.812.01 2.149.008.337.017.722.03 1.155.013.332.052.661.112.985.06.325.147.64.26.947.22.541.531 1.012.934 1.415.402.402.86.704 1.37.912h.044c.276.125.58.22.903.29.325.069.662.112 1.008.125h.022c.428.013.813.026 1.154.03C6.193 16 6.906 16 7.987 16c1.081 0 1.795 0 2.14-.009.347-.008.736-.017 1.164-.03a7.105 7.105 0 0 0 1.016-.112c.333-.06.653-.156.956-.281l-.043.021a4.359 4.359 0 0 0 1.414-.925c.402-.394.704-.856.912-1.384v-.043c.126-.303.216-.619.281-.947.06-.325.095-.653.095-.986.013-.428.026-.813.03-1.155.005-.341.01-1.05.01-2.132v-2.14c0-.346-.014-.727-.044-1.142a5.28 5.28 0 0 0-.393-2.015l.021.043h-.004Zm-2.348.978a.921.921 0 0 1-.281.674.921.921 0 0 1-.675.281.92.92 0 0 1-.675-.28.92.92 0 0 1-.28-.675.92.92 0 0 1 .28-.675.92.92 0 0 1 .675-.281c.264 0 .489.095.675.28.185.187.28.412.28.676Zm-5.215 6.897c-.736 0-1.363-.26-1.882-.779a2.563 2.563 0 0 1-.778-1.88c0-.736.26-1.363.778-1.882A2.563 2.563 0 0 1 7.98 5.32c.735 0 1.362.26 1.88.778.52.52.779 1.146.779 1.881 0 .736-.26 1.363-.778 1.881a2.563 2.563 0 0 1-1.881.779Zm0-6.755c-.567 0-1.103.104-1.6.312a4.14 4.14 0 0 0-1.298.895A4.433 4.433 0 0 0 4.2 6.378a4.122 4.122 0 0 0-.311 1.6c0 .567.103 1.103.311 1.6.22.498.515.934.882 1.31.368.373.8.667 1.298.874.497.22 1.033.333 1.6.333.566 0 1.102-.112 1.6-.333a3.88 3.88 0 0 0 1.297-.873c.367-.372.661-.809.882-1.31a4.123 4.123 0 0 0 .311-1.6c0-.567-.104-1.103-.311-1.6a4.289 4.289 0 0 0-2.18-2.184 4.122 4.122 0 0 0-1.6-.312Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={15.961}
        x2={0.009}
        y1={8.002}
        y2={8.002}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B174FF" />
        <Stop offset={1} stopColor="#7000FF" />
      </LinearGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h15.957v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default InstagramGradientIcon;