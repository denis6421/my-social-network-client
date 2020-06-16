import React, { Component } from "react";
import SmallLoader from "./SmallLoader";
const LoadingBtn = (props) => {
  const { loading, text, type, disabled, handleClick } = props;

  return (
    <div
      style={{
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? "none" : "all",
        
       
      }}
      className="btn__box flex__center"
    >
      {!loading ? (
        <button 
        style ={{
          background:disabled ? 'lightgray' : '',
         
        }}
        onClick = {() => type === 'button' && handleClick ? handleClick() : ''}
        type={type} className="flex__center">
          {text}
        </button>
      ) : (
        <SmallLoader />
      )}
    </div>
  );
};
export default LoadingBtn;
