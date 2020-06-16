import React, { useState, useEffect } from "react";
import PostUploader from "./parts/PostUploader";
import TextInput from "../../parts/TextInput";
import LoadingBtn from "../../parts/LoadingBtn";
import { apiPostRequest } from "../../../api/api";
import CloseIcon from "@material-ui/icons/Close";
import { lockBody } from "../../../functions/functions";

const input = {
  name: "Content",
  property_name: "text",
};

const HandlePost = ({
  closePost,
  addToPosts,
  post_to_edit,
  updatePostInList,
}) => {
  const [show_page, setShowPage] = useState(false);
  const [form_data, setFormData] = useState({});
  const [all_images_loaded, setAllImagesLoaded] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateForm = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    const { images, text } = form_data;
    e.preventDefault();
    if (!text) return;
    setLoading(true);
    if (post_to_edit) update();
    else create();
  };

  const create = async () => {
    const { images, text } = form_data;
    const body = {
      images,
      text,
    };
    const api = "post/create";
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      addToPosts(res.result);
      setTimeout(() => {
        close();
        setLoading(false);
      }, 500);
    }
  };

  const update = async () => {
    const { images, text } = form_data;
    let post = {
      ...post_to_edit,
      text,
      images,
    };
    const api = "post/update";
    const res = await apiPostRequest(api, post);
    if (res.ok) {
      updatePostInList(post);
      setTimeout(() => {
        close();
        setLoading(false);
      }, 500);
    }
  };
  useEffect(() => {
    if (post_to_edit) {
      console.log(post_to_edit);
      setFormData({ text: post_to_edit.text, images:post_to_edit.images });
    }
    setTimeout(() => {
      setShowPage(true);
      lockBody(true);
    }, 20);
    return () => {
      lockBody(false);
    };
  }, []);

  const close = () => {
    setShowPage(false);
    setTimeout(() => {
      closePost();
    }, 200);
  };

  const handleErrors = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 50);
  };
  console.log(all_images_loaded);
  return (
    <div
      style={{
        opacity: show_page ? 1 : 0,
        transition: "0.2s all",
      }}
      className="handle__post flex__center"
    >
      <section className="overlay"></section>
      <form onSubmit={(e) => handleSubmit(e)} className="handle__post__form">
        <button
          className="handle__post__close"
          type="button"
          onClick={() => close()}
        >
          <CloseIcon />
        </button>
        <PostUploader
          setAllImagesLoaded={setAllImagesLoaded}
          updateForm={updateForm}
          error={error}
          post_to_edit={post_to_edit}
        
        />
        <TextInput
          error={error}
          value={form_data.text}
          textarea={true}
          input={input}
          updateForm={updateForm}
        />
        <LoadingBtn
          type={form_data.images && form_data.text ? "submit" : "button"}
          handleClick={handleErrors}
          text="Post"
          disabled={!all_images_loaded}
          loading={loading}
        />
      </form>
    </div>
  );
};

export default HandlePost;
