import React, { useState, useEffect } from "react";
import Backendless from "backendless";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import * as actions from "../../../actions/actions";
import { withRouter } from "react-router-dom";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { useSelector, useDispatch } from "react-redux";
import SmallLoader from "../../parts/SmallLoader";

Backendless.initApp(
  "B23268D6-CFD4-9D2D-FFC9-1D7481067F00",
  "47B6566F-5390-4178-B3BC-6C7AEF56EC74"
);

const UserPageUploader = ({ profile, updateProfile }) => {
  const [images, setImages] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [img_loaded, setImgLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setImgLoaded(!profile.avatar);
    setAvatar(profile.avatar);
    return () => {};
  }, []);

  const handleFileSelect = async (files) => {
    setImgLoaded(false);
    setAvatar("");
    try {
      dispatch({
        type: "SET_DATA_TO_GLOBAL",
        payload: { name: "popup_options", value: false },
      });
      await Backendless.Files.upload(files[0], "/myFiles", true).then(
        (result) => {
          let url = result.fileURL;
          let profile_copy = { ...profile };
          profile_copy.avatar = url;
          setAvatar(url);
          updateProfile(profile_copy);
        }
      );
    } catch (error) {}
  };

  const removeAvatar = () => {
    let profile_copy = { ...profile };
    profile_copy.avatar = "";
    setAvatar("");
    updateProfile(profile_copy);
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: false },
    });
  };

  const showUploader = () => {
    let elem = document.querySelector(".user__page__upload__drop");
    if (elem) elem.click();
  };
  const showActions = () => {
    let options = [
      {
        name: "Upload photo",
        func: () => showUploader(),
      },
      {
        name: "Remove photo",
        func: () => removeAvatar(),
      },
      {
        name: "Cancel",
        func: () =>
          dispatch({
            type: "SET_DATA_TO_GLOBAL",
            payload: { name: "popup_options", value: false },
          }),
      },
    ];
    if (!avatar) {
      options = options.filter((m) => m.name !== "Remove photo");
    }
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: options },
    });
  };
  const onLoad = () => {
    setImgLoaded(true);
  };

  return (
    <div onClick={() => showActions()} className="user__page__upload">
      {img_loaded ? (
        <Dropzone
          className="user__page__upload__drop flex__center"
          onDrop={(acceptedFiles) => handleFileSelect(acceptedFiles)}
        >
          <AddAPhotoIcon />
        </Dropzone>
      ) : (
        ""
      )}
      <img
        style={{
          opacity: img_loaded ? 1 : 0,
          transition: "0.2s all",
        }}
        onLoad={() => onLoad()}
        src={avatar}
        alt=""
      />
      {!img_loaded ? (
        <figure className="user__page__upload__loader">
          <SmallLoader />
        </figure>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserPageUploader;
