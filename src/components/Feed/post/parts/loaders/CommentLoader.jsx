import React from "react";

const CommentLoader = (props) => {
    const {className} = props
  return (
    <div className={className ? `${className} flex__start` : 'flex__start'}>
      <figure className="rounded__loader"></figure>
      <span>
        <div className="loader__figure"></div>
        <div className="loader__figure"></div>
      </span>
    </div>
  );
};
export default CommentLoader;
