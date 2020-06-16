import React, { useEffect, useState } from "react";
import Backendless from "backendless";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ImageSlider from "../../../parts/slider/ImageSlider";
import { useDispatch } from "react-redux";
import { findObjectIndex } from "../../../../functions/functions";

Backendless.initApp(
  "B23268D6-CFD4-9D2D-FFC9-1D7481067F00",
  "47B6566F-5390-4178-B3BC-6C7AEF56EC74"
);



const upload = async(file) => {
  let new_file = ''
  await Backendless.Files.upload(file, "/myFiles", true).then(
    (result) => {
      let url = result.fileURL;
       new_file = {
        name: file.name,
        url,
      };
     
    }
  );
  return new_file
}

const PostUploader = ({
  setAllImagesLoaded,
  updateForm,
  error,
  post_to_edit,
}) => {
  const [images, setImages] = useState(false);
  const [is_error, setIsError] = useState(false);
  const [index_to_replace, setIndexToReplace] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (images.length === 0 && error) {
      setIsError(true);
    }
  }, [error]);

  useEffect(() => {
    setImages(post_to_edit ? post_to_edit.images : "");
    console.log(post_to_edit);
  }, [post_to_edit]);
  const handleFileSelect = async (files) => {
    setIsError(false);
    setAllImagesLoaded(false);
    let arr =images ?  [...images] : [];
  



    if(Number.isInteger(index_to_replace)){
        let elem = {name:files[0].name}
        console.log(elem)
        arr[index_to_replace] = elem
        setImages(arr);
       await upload(files[0]).then(new_file => {
        arr.splice(index_to_replace,1, new_file)
        setImages(arr);
        updateForm("images", arr);
        setIndexToReplace('')
       })
      
    }else{
      for (let i = 0; i < files.length; i++) {
        arr = [...arr, { name: files[i].name }];
      }
      setImages(arr);
      for (let file of files) {
        try {
        await  upload(file).then(new_file => {
          arr = arr.filter((m) => m.name !== file.name);
          arr = [...arr, new_file];
        })

        } catch (error) {}
      }
      setImages(arr);
      updateForm("images", arr);
    }
   
  };

  const loadingStatus = (value, index) => {
    if (value) setAllImagesLoaded(true);
  };

  const editImage = (index) => {
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: false },
    });
    setIndexToReplace(index)
    let elem = document.querySelector(".handle__post__uploader__dropzone");
    elem.click();
  };
  const deleteImage = (index, img) => {
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: false },
    });
    let new_images = [...images];

    new_images.splice(index, 1);
    setImages([]);
    setTimeout(() => {
      setImages(new_images);
      updateForm("images", new_images);
    }, 50);
  };
  const handleActions = (index, img) => {
    let options = [
      {
        name: "Change",
        func: () => editImage(index),
      },
      {
        name: "Delete",
        func: () => deleteImage(index, img),
      },
      {
        name: "Close",
        func: () =>
          dispatch({
            type: "SET_DATA_TO_GLOBAL",
            payload: { name: "popup_options", value: false },
          }),
      },
    ];
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: options },
    });
  };

  return (
    <div className="handle__post__uploader">
      <Dropzone
        style={{
          border: is_error ? "1px solid red" : "",
        }}
        className="handle__post__uploader__dropzone flex__center"
        onDrop={(acceptedFiles) => handleFileSelect(acceptedFiles)}
      >
        <CloudUploadIcon />
        Add Images
      </Dropzone>
      {Array.isArray(images) ? (
        <ImageSlider
          rerender={images}
          handleActions={handleActions}
          limit={3}
          property_name="url"
          list={images ? images : []}
          className="uploader__slider"
          to_show={images.length === 1 ? 1 : images.length === 2 ? 2 : 3}
          to_scroll={1}
          loadingStatus={loadingStatus}
          loader={true}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default PostUploader;
