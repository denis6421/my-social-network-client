import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";
import ImageSlider from "../../parts/slider/ImageSlider";
import UserPostComments from "./UserPostComments";
import UserAvatar from "../../parts/UserAvatar";
import UserPostHeaderLoader from "../loaders/UserPostHeaderLoader";
import UserPostLikes from "./UserPostLikes";
import { apiGetRequest } from "../../../api/api";
import UserPostCreateComment from "./UserPostCreateComment";
import UserLikesLoader from "../loaders/UserLikesLoader";
import { useSelector, useDispatch } from "react-redux";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { CommentsPopup } from "../../Feed/post/parts/comments/CommentsPopup";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import FigureWithLoader from "../../parts/FigureWithLoader";
import { checkIfUser } from "../../../functions/functions";
const checkIfLikedPost = async (post) => {
  const api = `like/get-by-user?post_id=${post._id}`;
  const res = await apiGetRequest(api);
  return res.result ? true : false;
};

const UserPostPopup = ({
  profile,
  post_index,
  closePopup,
  removeProfilePost,
  setPostToEdit,
  updated_post,
}) => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked_by_user, setLikedbyUser] = useState(false);
  const [index, setIndex] = useState(false);
  const [show_popup, setShowPopup] = useState(false);
  const [show_mobile_comments, setMobileComments] = useState(false);
  const [is_mobile, setIsMobile] = useState(false);

  const user = useSelector((state) => state.global.user);
  const dispatch = useDispatch();

  const clearPost = () => {
    setLoading(false);
    setPost(false);
    setComments(false);
    setLikes(false);
    setLikedbyUser(false);
  };

  const getPost = async (index) => {
    const { posts } = profile;

    let post = posts[index];
    if (post) {
      clearPost();
      setLoading(true);
      setIndex(index);
      const api = `post/get-by-id?id=${post._id}`;
      const res = await apiGetRequest(api);
      const liked = await checkIfLikedPost(post);
      if (res.ok) {
        setPost(post);
        setComments(res.result.comments);
        setLikes(res.result.likes);
        setLikedbyUser(liked);
      }

      setLoading(false);
    }
  };

  const onResize = () => {
    let width = window.innerWidth;
    if (width <= 650 && !is_mobile) {
      setIsMobile(true);
    }
    if (width > 650 && is_mobile) {
      setIsMobile(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    setTimeout(() => {
      setShowPopup(true);
    }, 20);
    getPost(post_index);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  useEffect(() => {
    setPost(updated_post);
  }, [updated_post]);

  const close = () => {
    setShowPopup(false);
    setTimeout(() => {
      closePopup();
    }, 200);
  };

  const addComment = (comment) => {
    let new_comments = [...comments];
    new_comments = [comment, ...new_comments];
    setComments(new_comments);
  };
  const removeComment = (id) => {
    let new_comments = [...comments];
    new_comments = new_comments.filter((m) => m._id !== id);
    setComments(new_comments);
  };
  const returnComment = (comment, add) => {
    if (add) addComment(comment);
    else removeComment(comment);
  };
  const deletePost = async (id) => {
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: false },
    });
    const api = `post/delete?post_id=${id}`;
    const res = await apiGetRequest(api);
    if (res.ok) {
      close();
      removeProfilePost(id);
    }
  };

  const showActionsPopup = (post) => {
    const options = [
      {
        name: "Edit",
        func: () => {
          setPostToEdit(post);
          dispatch({
            type: "SET_DATA_TO_GLOBAL",
            payload: { name: "popup_options", value: false },
          });
        },
      },
      {
        name: "Delete",
        func: () => deletePost(post._id),
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
    <div
    id ={show_popup ? 'user__page__post--active' : ''}
      className="user__page__post flex__center"
    >
      <button onClick={() => close()} id="close__user__post">
        <CloseIcon />
      </button>
      <section onClick={() => close()} className="overlay"></section>
      <section className="user__page__post__content flex__between">
        {index > 0 ? (
          <button
            onClick={() => getPost(index - 1)}
            className="upca upca--prev"
          >
            <ChevronLeftRoundedIcon />
          </button>
        ) : (
          ""
        )}
        {index + 1 < profile.posts.length ? (
          <button
            onClick={() => getPost(index + 1)}
            className="upca upca--next"
          >
            <ChevronRightRoundedIcon />
          </button>
        ) : (
          ""
        )}
        <div className='user__page__post__mobile__header flex__center'>
          <button
         onClick = {() => close()}
          ><KeyboardArrowLeftIcon /></button>
        <h5>{profile.username}</h5>
        </div>
        {!loading ? (
          <ImageSlider
            to_show={1}
            to_scroll={1}
            dots={false}
            infinite={false}
            list={post ? post.images : ""}
            property_name="url"
            className="user__page__slider"
            limit={1}
          />
        ) : (
          <div className="user__page__slider__loader">
            <FigureWithLoader />
          </div>
        )}
        <div className="user__page__post__content__right">
          <header className="flex__start">
            {!loading ? (
              <>
                <UserAvatar img={profile.avatar} />
                <h3 className="text__overflow">{profile.username}</h3>
              </>
            ) : (
              <UserPostHeaderLoader />
            )}
           {checkIfUser(profile._id,user._id)  ?<button
              className="user__page__post__content__actions"
              onClick={() => showActionsPopup(post)}
            >
              <MoreHorizIcon />
            </button> : null}
          </header>
          
          <UserPostComments
              loading={loading}
              removeComment={removeComment}
              comments={comments}
              post={post}
              profile={profile}
              is_mobile = {is_mobile}
              setMobileComments = {setMobileComments}
            />
          { is_mobile &&  show_mobile_comments ? (
            <>
              <CommentsPopup
                returnComment={returnComment}
                allow_add_comment={true}
                props_comments={comments}
                handleComments={setMobileComments}
                post_id={post._id}
              />
            </>
          ) : (
            ""
          )}
          {!loading ? (
            <UserPostLikes post={post} likes={likes} liked={liked_by_user} />
          ) : (
            <UserLikesLoader />
          )}
          {post && !is_mobile ? (
            <>
              <UserPostCreateComment
                addComment={addComment}
                post_id={post._id}
                user={user}
              />
            </>
          ) : (
            ""
          )}
        </div>
      </section>
    </div>
  );
};

export default UserPostPopup;
