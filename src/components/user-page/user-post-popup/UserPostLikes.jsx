import React, { Component, useEffect, useState } from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { apiPostRequest } from "../../../api/api";
import { timeFromNow } from "../../../functions/functions";
import UserLikesLoader from "../loaders/UserLikesLoader";
const UserPostLikes = ({ likes, liked, post }) => {
  const [likes_amount, setLikesAmount] = useState([]);
  const [liked_by_user, setLikedByUser] = useState(false);

  useEffect(() => {
    setLikesAmount(likes);
    setLikedByUser(liked);

    return () => {};
  }, []);

  const handleLike = async () => {
    const api = liked_by_user ? "like/delete" : "like/create";
    const body = {
      post_id: post._id,
    };
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      setLikesAmount(liked_by_user ? likes_amount - 1 : likes_amount + 1);
      setLikedByUser(!liked_by_user);
    }
  };

  return (
    <div className="user__page__post__likes">
      <button className="like__btn" onClick={() => handleLike()}>
        {liked_by_user ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </button>
      <h4>{`${likes_amount ? likes_amount.toLocaleString() : 0} likes`}</h4>
      {post ? <h5>{timeFromNow(post.created_at)}</h5> : ""}
    </div>
  );
};

export default UserPostLikes;
