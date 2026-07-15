import React from 'react';
import './CircularNotchedBox.css'

export interface CircularNotchedBoxProps {
  width?: number,
  cornerRadius?: number,
  bgColor?: string,
  side?: string,
  pos?: string
}

const CircularNotchedBox: React.FC<CircularNotchedBoxProps> = ({
  width = 100,
  cornerRadius = 20,
  bgColor = "#fff",
  side = 'top',
  pos = 'middle'
}) => {
  let cornerH: number = cornerRadius / 2;
  let halfWidth:number = width / 2
  let maskedH: number = cornerRadius + halfWidth;
  let lateralH:number = cornerH + halfWidth;
  let borderRadius:string = cornerRadius + 'px ' + cornerRadius + 'px 0 0';
  let initSize = pos === 'init' ? 'calc(20% - ' + halfWidth + 'px)' : pos === 'end' ? 'calc(80% - ' + halfWidth + 'px)' : 'calc(50% - ' + halfWidth + 'px)';
  let endSize = pos === 'init' ? 'calc(80% - ' + halfWidth + 'px)' : pos === 'end' ? 'calc(20% - ' + halfWidth + 'px)' : 'calc(50% - ' + halfWidth + 'px)';
  
  switch (side) {
    case 'bottom':
      cornerH      = cornerRadius / 2;
      halfWidth    = width / 2
      maskedH      = cornerRadius + halfWidth;
      lateralH     = cornerH + halfWidth;
      borderRadius = '0 0 ' + cornerRadius + 'px ' + cornerRadius + 'px';

      return (
        <div className="notched-box bottom" style={{alignItems: 'start'}}>
          <div className="left" style={{
            height: lateralH,
            borderRadius: borderRadius,
            backgroundColor: bgColor,
            width: initSize
          }}></div>

          <div className="middle" style={{maxWidth: width}}>

            <svg className="notch" style={{
              width: width,
              height: lateralH
            }}>
              <defs>			
                <mask id="circle-cutout">
                  <rect id="masked" x="0" y="0" width={width} height={halfWidth} fill="#fff"></rect>
                  <circle id="mask" cx={halfWidth} cy={halfWidth} r={halfWidth} fill="#000"></circle>
                </mask>
              </defs>
              <rect x="0" y="0" width={width} height={width} id="background" mask="url(#circle-cutout)" fill={bgColor}></rect>
            </svg>

          </div>

          <div className="right" style={{
            height: lateralH,
            borderRadius: borderRadius,
            backgroundColor: bgColor,
            width: endSize
          }}></div>
        </div>
      );
    break;

    case 'left':
      return (
        <div className="notched-box"></div>
      );
    break;

    case 'right':
      return (
        <div className="notched-box"></div>
      );
    break;

    default:
      cornerH      = cornerRadius / 2;
      halfWidth    = width / 2
      maskedH      = cornerRadius + halfWidth;
      lateralH     = cornerH + halfWidth;
      borderRadius = cornerRadius + 'px ' + cornerRadius + 'px 0 0';

      return (
        <div className="notched-box top" style={{alignItems: 'end'}}>
          <div className="left" style={{height: lateralH, borderRadius: borderRadius, background: bgColor, width: initSize}}></div>
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
          <div className="right" style={{height: lateralH, borderRadius: borderRadius, background: bgColor, width: endSize}}></div>
        </div>
      );
  }
};
export default CircularNotchedBox;