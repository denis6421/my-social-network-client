import React, { useState } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const UserAvatar = ({ img, className }) => {
  const [img_loaded, setImagesLoaded] = useState(false);
  const onLoad = () => {
    setImagesLoaded(true);
  };
  return (
    <figure
      className={className ? `user__avatar ${className}` : "user__avatar"}
    >
      {img ? (
        <>
          <img
            style={{
              opacity: img_loaded ? 1 : 0,
            }}
            onLoad={() => onLoad()}
            src={img}
            alt=""
          />
          <aside></aside>
        </>
      ) : (
        <AccountCircleIcon />
      )}
    </figure>
  );
};

export default UserAvatar;
