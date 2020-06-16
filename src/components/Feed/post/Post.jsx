import React, { useState, useEffect } from "react";
import { apiPostRequest, apiGetRequest } from "../../../api/api";
import {
  generateLastComments,
} from "../../../functions/functions";
import { Link, withRouter } from "react-router-dom";
import PostLike from "./parts/PostLike";
import ImageSlider from "../../parts/slider/ImageSlider";
import { USER_PAGE_ROUTE } from "../../../tools/routes";
import UserAvatar from "../../parts/UserAvatar";
import { CommentsPopup } from "./parts/comments/CommentsPopup";
import AddComment from "./parts/AddComment";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const Post = ({ post, user, handleLikes, editPost}) => {
  const [last_comments_num, changeCommentsNum] = useState(2);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [show_more_comments_btn, SetShowMoreComments] = useState(false);
  const [show_comment_popup, setShowCommentPopup] = useState(false);
  const [page_loaded, setPageLoaded] = useState(false);

  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    setComments(post.comments);
    setLikes(post.likes);
    SetShowMoreComments(post.comments && post.comments.length > 2);
    setPageLoaded(true);
    return () => {};
  }, []);

  const addCommentToList = (comment) => {
    let new_comments = [...comments];
    new_comments = [comment, ...new_comments];
    setComments(new_comments);
    changeCommentsNum(last_comments_num + 1);
  };

  const returnComment = (id) => {
    let new_comments = [...comments];
    new_comments = new_comments.filter((m) => m._id !== id);
    setComments(new_comments);
  };



  const deletePost = async (id) => {
    const api = `post/delete?post_id=${id}`;
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: false },
    });
    const res = await apiGetRequest(api);
    if (res.ok) {
      setPageLoaded(false);
    }
  };

   const  edit = (post) =>{
       editPost(post)
       dispatch({
        type: "SET_DATA_TO_GLOBAL",
        payload: { name: "popup_options", value: false },
      })
    }

const goToProfile = (username) => {
  dispatch({
    type: "SET_DATA_TO_GLOBAL",
    payload: { name: "popup_options", value: false },
  })
    history.push(USER_PAGE_ROUTE.replace(':id', username))
    
}
  const handleActions = (post) => {
    let options = [
      {
        name: "View Profile",
        func: () => goToProfile(post.user_details.username),
      },
      {
        name: "Edit",
        func: () => edit(post),
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
   
    if (user._id !== post.user_details._id) {
      options = options.filter((m) => m.name !== "Delete")
      .filter((m) => m.name !== "Edit")
    }
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: options },
    });
  };

  const postLike = async () => {
    const api = "like/create";
    const body = {
      post_id: post._id,
    };
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      let new_likes = [...likes];
      setLikes([...new_likes, res.result]);
    }
  };
  const removeLike = async () => {
    const body = {
      post_id: post._id,
    };
    const api = "like/delete";
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      let new_likes = [...likes];
      setLikes(new_likes.filter((m) => m.user_id !== res.result));
    }
  };

  return page_loaded ? (
    <div className="post">
      {show_comment_popup ? (
        <CommentsPopup
          handleComments={setShowCommentPopup}
          post_id={post._id}
          returnComment={returnComment}
        />
      ) : null}
      <header className="post__header flex__start">
        <UserAvatar img={post ? post.user_details.avatar : ""} />
        <Link to={USER_PAGE_ROUTE.replace(":id", post.user_details.username)}>
          {post.user_details.username}
        </Link>
        <button 
        className='post__options__btn'
        onClick={() => handleActions(post)}>
          <MoreHorizIcon />
        </button>
      </header>
      <ImageSlider
        to_show={1}
        to_scroll={1}
        dots={true}
        infinite={false}
        list={post.images ? post.images : []}
        property_name="url"
        className="post__images"
        limit={1}
        placeholder={true}
      />
      <section className="post__content flex__column">
        <PostLike
          likes={likes}
          user_id={user._id}
          postLike={postLike}
          removeLike={removeLike}
          post_id={post._id}
          handleLikes={handleLikes}
        />
        <h3>
          <Link to={USER_PAGE_ROUTE.replace(":id", post.user_details.username)}>
            {post.user_details.username}
          </Link>
          {`${post.text}`}
        </h3>
        {comments && comments.length > 0 ? (
          <section className="post__content__comments">
            {show_more_comments_btn ? (
              <button
                onClick={() => setShowCommentPopup(true)}
              >{`View all ${comments.length} comments`}</button>
            ) : (
              ""
            )}
            <ul>
              {generateLastComments(comments, last_comments_num).map((m) => {
                return (
                  <li className="flex__start" key={m._id}>
                    <Link
                      to={USER_PAGE_ROUTE.replace(
                        ":id",
                        post.user_details.username
                      )}
                    >
                      {`${m.username}`}
                    </Link>
                    <p>{`${m.text}`}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          ""
        )}
      </section>
      <AddComment addCommentToList={addCommentToList} post={post} />
    </div>
  ) : null;
};

export default withRouter(Post);
