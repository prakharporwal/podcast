import React, { createRef, useEffect, useRef } from "react";
import "./ProgressBar.css";

interface IProps {
  progress: number;
  total: number;
  updateProgress: (x: any) => void;
  converting?: number;
}

const ProgressBar: React.FunctionComponent<IProps> = (props) => {
  useEffect(() => {
    console.log(props.progress.toString());
  });

  return (
    // <div className="progress-bar bg-mygrey-400 rounded h-1 w-full overflow-hidden">
    //   <div
    //     className={`inner-bar rounded bg-white h-1`}
    //     style={{ width: `${props.progress.toString()}%` }}
    //   ></div>
    // </div>
    <>
      <div className="progress-bar relative bg-mygrey-400 rounded h-1 w-full box-border">
        {/* <span
          className="inner-bar absolute bg-white hover:bg-mygreen rounded h-1"
          style={{ width: `${props.progress.toString()}%` }}
          onChange={props.onChange}
        ></span> */}
        <input
          type={"range"}
          className="bg-transparent cursor-pointer absolute top-0 w-full"
          value={props.progress}
          onChange={(e) => {
            props.updateProgress(
              (e.target.valueAsNumber / 100) * (props.converting || 100)
            );
          }}
        ></input>
      </div>
    </>
  );
};

// interface ProgressProps {
//   percent: number;
// }

// const InnerProgress: React.FunctionComponent<ProgressProps> = (props) => {
//   useEffect(() => {}, [props.percent]);

//   return (
//
// };

export default ProgressBar;
