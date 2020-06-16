import React from 'react'
import SpinnerLoader from './SpinnerLoader'

const FigureWithLoader = ({spinner}) => {
    return (
        <figure
      
        className="figure__loader"
      >
      {spinner ?  <SpinnerLoader /> : 
      <aside></aside>}
      </figure>
    )
}

export default FigureWithLoader