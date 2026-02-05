import React from 'react';
import './CircularNotchedBox.css'

export interface CircularNotchedBoxProps {
  width?: number,
  cornerRadius?: number,
  bgColor?: string
}

const CircularNotchedBox: React.FC<CircularNotchedBoxProps> = ({
  width = 100,
  cornerRadius = 20,
  bgColor = "#fff"
}) => {
  const cornerH: number = cornerRadius / 2;
  const halfWidth:number = width / 2
  const maskedH: number = cornerRadius + halfWidth;
  const lateralH:number = cornerH + halfWidth;
  const borderRadius:string = cornerRadius + 'px ' + cornerRadius + 'px 0 0';

  return (
    <>
    <div className="notched-box">
      <div className="left" style={{height: lateralH, borderRadius: borderRadius, backgroundColor: bgColor}}></div>
      <div className="middle" style={{maxWidth: width}}>
        <svg className="notch" style={{width: width, height: width}}>
          <defs>			
            <mask id="circle-cutout">
              <rect id="masked" x="0" y={halfWidth} width={width} height={maskedH} fill="#fff"></rect>
              <circle id="mask" cx={halfWidth} cy={halfWidth} r={halfWidth} fill="#000"></circle>
            </mask>
          </defs>
          <rect x="0" y="0" width={width} height={width} id="background" mask="url(#circle-cutout)" fill={bgColor}></rect>
        </svg>
      </div>
      <div className="right" style={{height: lateralH, borderRadius: borderRadius, backgroundColor: bgColor}}></div>
    </div>
    </>
  );
};
export default CircularNotchedBox;