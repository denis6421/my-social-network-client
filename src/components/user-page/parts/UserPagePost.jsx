import React, { useState } from "react";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import FigureWithLoader from "../../parts/FigureWithLoader";

const UserPagePost = ({ m, i, handlePostPopup }) => {
  const [img_loaded, setImageLoaded] = useState(false);

  const onLoad = () => {
    setImageLoaded(true);
  };

  return (
    <li onClick={() => handlePostPopup(true, i)}>
      {m.images.length > 1 ? <PermMediaIcon /> : null}
      <img
        style={{
          opacity: img_loaded ? 1 : 0,
          transition: "0.2s all",
        }}
        onLoad={() => onLoad()}
        src={m.images[0] ? m.images[0].url : ""}
        alt=""
      />
      {!img_loaded ? <FigureWithLoader /> : ""}
    </li>
  );
};

export default UserPagePost;
