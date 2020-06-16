import React from "react";
import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { checkIfLiked } from "../../../../functions/functions";

const PostLike = ({ likes, user_id, removeLike, postLike, handleLikes,post_id }) => {
  return (
    <div className="post__content__likes">
      {checkIfLiked(likes, user_id) ? (
        <button onClick={() => removeLike()}>
          <FavoriteIcon />
        </button>
      ) : (
        <button onClick={() => postLike()}>
          <FavoriteBorderIcon />
        </button>
      )}
      <h3 onClick={() => handleLikes(post_id)}>{`${likes.length} likes`}</h3>
    </div>
  );
};

export default PostLike;
