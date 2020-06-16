import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { apiGetRequest, apiPostRequest } from "../../api/api";
import UserPostPopup from "./user-post-popup/UserPostPopup";
import UserPagePost from "./parts/UserPagePost";
import UserAvatar from "../parts/UserAvatar";
import UserPageUploader from "./parts/UserPageUpload";
import { useSelector, useDispatch } from "react-redux";
import HandlePost from "../Feed/post/HandlePost";
import { findObjectIndex } from "../../functions/functions";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import AddIcon from "@material-ui/icons/Add";
import PostAddIcon from "@material-ui/icons/PostAdd";
import LogoLoader from "../parts/LogoLoader";

const ProfileNumbers = ({ profile }) => {
  return (
    <ul className="flex__start">
      <li>
        <h3>{profile.posts.length}</h3>
        <h4>posts</h4>
      </li>
    </ul>
  );
};

const UserPage = (props) => {
  const [profile, setProfile] = useState(false);
  const [show_popup, setShowPopup] = useState(false);
  const [post_index, setPostIndex] = useState("");
  const [post_to_edit, setPostToEdit] = useState("");
  const [updated_post, setUpdatedPost] = useState("");
  const [new_post, setNewPost] = useState(false);

  const global = useSelector((state) => state.global);
  const user = global.user;

  //clear data and load new data every time username in the url changes
  useEffect(() => {
    let username = props.match.params.id;
    setShowPopup(false);
    setProfile(false);
    setTimeout(() => {
      getUser(username);
    }, 200);
    return () => {};
  }, [props.match.params.id]);
  //get user by username api
  const getUser = async (username) => {
    const api = `user/get-by-username?username=${username}`;
    const res = await apiGetRequest(api);
    if (res.ok) {
      setProfile(res.result);
    }
  };
  //select post from posts lists and show post popup
  const handlePostPopup = (val, post_index) => {
    setPostIndex(Number.isInteger(post_index) ? post_index : false);
    setShowPopup(val);
    setUpdatedPost("");
  };

  const updateProfile = async (profile) => {
    const api = "user/update";
    apiPostRequest(api, profile);
    setProfile(profile);
  };

  const removeProfilePost = (post) => {
    let new_profile = { ...profile };
    new_profile.posts = new_profile.posts.filter((m) => m._id !== post);
    setProfile(new_profile);
  };

  const updatePostInList = (post) => {
    setUpdatedPost(post);
    let new_profile = { ...profile };
    let index = findObjectIndex(profile.posts, "_id", post.id);
    new_profile.posts.splice(index, 1, post);
    setProfile(new_profile);
  };

  const closeHandlePost = () => {
    setPostToEdit("");
    setNewPost(false);
  };

  const addToPosts = (post) => {
    let new_profile = { ...profile };
    new_profile.posts = [post, ...new_profile.posts];
    setProfile(new_profile);
  };
  return (
    <div className="user__page">
      {profile ? (
        <>
          {post_to_edit || new_post ? (
            <HandlePost
              updatePostInList={updatePostInList}
              post_to_edit={post_to_edit}
              closePost={closeHandlePost}
              addToPosts={addToPosts}
            />
          ) : (
            ""
          )}
          {show_popup ? (
            <UserPostPopup
              updatePostInList={updatePostInList}
              profile={profile}
              setPostToEdit={setPostToEdit}
              post_index={post_index}
              closePopup={handlePostPopup}
              removeProfilePost={removeProfilePost}
              updated_post={updated_post}
            />
          ) : (
            ""
          )}

          <section className="user__page__info flex__start">
            {user._id === profile._id ? (
              <UserPageUploader
                updateProfile={updateProfile}
                profile={profile}
              />
            ) : (
              <UserAvatar img={profile.avatar} className="user__page__big" />
            )}
            <div className="user__page__info__details">
              <span className="flex__start">
                <h2>{profile.username}</h2>
              </span>
              <ProfileNumbers profile={profile} />
              {profile.posts.length > 0 && user._id === profile._id? (
                <button
                  onClick={() => setNewPost(true)}
                  className="user__page__add__post flex__start"
                >
                  <PostAddIcon />
                  <h5>Create post</h5>
                </button>
              ) : null}
            </div>
          </section>
          <section className="user__page__list">
            <h2>Posts</h2>
            <ul className="user__page__posts flex__start">
              {profile.posts && profile.posts.length > 0 ? (
                profile.posts.map((m, i) => {
                  return (
                    <UserPagePost
                      key={m._id}
                      m={m}
                      handlePostPopup={handlePostPopup}
                      i={i}
                    />
                  );
                })
              ) : (
                <div className="no__data">
                  <CloudOffIcon />
                  <p>Profile don't have posts</p>
                  {profile._id === user._id ? (
                    <button
                      onClick={() => setNewPost(true)}
                      className="flex__center"
                    >
                      {" "}
                      <PostAddIcon />
                      Create post
                    </button>
                  ) : null}
                </div>
              )}
            </ul>
          </section>
        </>
      ) : (
        <LogoLoader />
      )}
    </div>
  );
};

export default withRouter(UserPage);
