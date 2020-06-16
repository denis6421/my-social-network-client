import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { lockBody, timeFromNow } from "../../../../../functions/functions";
import { apiGetRequest } from "../../../../../api/api";
import { Link } from "react-router-dom";
import CommentLoader from "../loaders/CommentLoader";
import UserAvatar from "../../../../parts/UserAvatar";
import { USER_PAGE_ROUTE } from "../../../../../tools/routes";
import SmallLoader from "../../../../parts/SmallLoader";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { connect, useSelector, useDispatch } from "react-redux";
import UserPostCreateComment from "../../../../user-page/user-post-popup/UserPostCreateComment";
const Comment = ({ comment, handleRemove, user, loading_comment }) => {
  console.log(comment)
  let is_loading = loading_comment === comment._id;
  return (
    <li className="flex__start">
      <UserAvatar img={comment.user.avatar} />
      <span>
        <h5>
          <Link to={USER_PAGE_ROUTE.replace(":id", comment.username)}>
            {comment.username}
          </Link>
          {` ${comment.text}`}
        </h5>
        <p>{timeFromNow(comment.created_at)}</p>
      </span>
      {user._id === comment.user._id ? (
        <button
          style={{
            opacity: is_loading ? 1 : 0,
            pointerEvents: loading_comment ? "none" : "all",
          }}
          onClick={() => (!loading_comment ? handleRemove(comment._id) : "")}
          className="feed__comment__remove"
        >
          {is_loading ? <SmallLoader /> : <MoreHorizIcon />}
        </button>
      ) : (
        ""
      )}
    </li>
  );
};


const UserPageComment = ({ comment, handleRemove, user, loading_comment }) => {
  console.log(comment)
  let is_loading = loading_comment === comment._id;
  return (
    <li className="flex__start">
      <UserAvatar img={comment.user_details.avatar} />
      <span>
        <h5>
          <Link to={USER_PAGE_ROUTE.replace(":id", comment.user_details.username)}>
            {comment.user_details.username}
          </Link>
          {` ${comment.text}`}
        </h5>
        <p>{timeFromNow(comment.created_at)}</p>
      </span>
      {user._id === comment.user_details._id ? (
        <button
          style={{
            opacity: is_loading ? 1 : 0,
            pointerEvents: loading_comment ? "none" : "all",
          }}
          onClick={() => (!loading_comment ? handleRemove(comment._id) : "")}
          className="feed__comment__remove"
        >
          {is_loading ? <SmallLoader /> : <MoreHorizIcon />}
        </button>
      ) : (
        ""
      )}
    </li>
  );
};

export const CommentsPopup = ({
  post_id,
  returnComment,
  handleComments,
  props_comments,
  allow_add_comment
}) => {
  const [show_page, setShowPage] = useState(false);
  const [loading_comment, setLoadingComment] = useState(false);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);

  const global = useSelector((state) => state.global);
  const user = global.user;
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setShowPage(true);
    }, 20);
    lockBody(true);
    if(props_comments){
      setComments(props_comments);
      setLoading(false);
    }else{
      getComments();
    }
   
    return () => {
      lockBody(false);
    };
  }, []);
  const getComments = async () => {
    const api = `comment/get-by-post?post_id=${post_id}`;
    const res = await apiGetRequest(api);
    if (res.ok) {
      setComments(res.result);
    }
    setLoading(false);
  };
  const close = () => {
    setShowPage(false);
    setTimeout(() => {
      handleComments();
    }, 200);
    lockBody();
  };

  const deleteComment = async (id) => {
    setLoadingComment(id);
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "popup_options", value: false },
    });
    const api = `comment/delete?comment=${id}`;
    const res = await apiGetRequest(api);
    if (res.ok) {
      let new_comments = [...comments];
      new_comments = new_comments.filter((m) => m._id !== id);
      setComments(new_comments);
      returnComment(id);
    }
    setLoadingComment(false);
  };

  const addComment = (comment) => {
    let new_comments = [...comments]
    new_comments = [comment, ...new_comments]
      setComments(new_comments)
      returnComment(comment, true);
  }
  const handleRemove = (id) => {
    const options = [
      {
        name: "Delete",
        func: () => deleteComment(id),
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
   id={show_page ? 'popup--active' : ''}
      className="feed__comments popup flex__center"
    >
      <section onClick={() => close()} className="overlay"></section>
      <section className="popup__content">
        <header className="flex__center">
          <h3>Comments</h3>
          <button
            className="popup__content__close"
            onClick={() => close()}
          >
            <CloseIcon />
          </button>
        </header>
        <ul>
          {!loading
            ? comments && comments.length > 0
              ? comments.map((comment) => {
                  return (
                   allow_add_comment ? 
                    <UserPageComment 
                    handleRemove={handleRemove}
                      key={comment._id}
                      comment={comment}
                      user={user}
                      loading_comment={loading_comment}
                    />
                   
                   : <Comment
                      handleRemove={handleRemove}
                      key={comment._id}
                      comment={comment}
                      user={user}
                      loading_comment={loading_comment}
                    />
                  );
                })
              : ""
            : [...Array(3).keys()].map((m) => {
                return <CommentLoader className="feed__comment__loaders" />;
              })}
        </ul>
       {allow_add_comment ? <UserPostCreateComment
                addComment={addComment}
                post_id={post_id}
                user={user}
              /> : ''}
      </section>
    </div>
  );
};

export default connect(null, { global })(CommentsPopup);
