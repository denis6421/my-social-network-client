import React, { useState, useEffect } from "react";
import FigureWithLoader from "../FigureWithLoader";
const Slide = ({ submitLoadingDone, property_name, slide, loader, handleActions, index, subtractLoaded }) => {
  const [img_loaded, setImgLoaded] = useState(false);
  const [did_mount, setDidMount] = useState(false);

  const onLoad = () => {
    setImgLoaded(true);
    if (submitLoadingDone) {
      submitLoadingDone();
    }
  };

useEffect(() => {

  if (did_mount && submitLoadingDone) {
    console.log('laaa')
    subtractLoaded();
    setImgLoaded(false);
  }
  else{
    setDidMount(true)
  }

  return () => {
    
  };
}, [slide.name])
  return (
 <div 
    onClick = {() => handleActions ? handleActions(index, slide) : ''}
    className="slider__element">
      <img
        src={slide[property_name]}
        style={{
          opacity: img_loaded ? 1 : 0,
        }}
        className="slider__element__placeholder"
        alt=""
      />
      <img
        style={{
          opacity: img_loaded ? 1 : 0,
        }}
        onLoad={() => onLoad()}
        className="slider__element__img"
        src={slide[property_name]}
        alt=""
      />
     { !img_loaded ? <FigureWithLoader
     spinner  ={loader}
     />  :''}
    </div> 
  );
};

export default Slide;
