import React, { useState } from "react";
import { apiPostRequest } from "../../../../api/api";
import SmallLoader from "../../../parts/SmallLoader";

const AddComment = ({ post, addCommentToList }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState("");

  const postComment = async () => {
    const api = "comment/create";
    const body = {
      text: comment,
      post_id: post._id,
    };
    if (!comment) return;
    setLoading(true);
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      addCommentToList(res.result);
      setComment("");
    }
    setLoading(false);
  };

  return (
    <div className="post__content__comment flex__between">
      <input
        onKeyUp={(event) => (event.keyCode === 13 ? postComment() : "")}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        type="text"
        placeholder="Add a comment..."
      />
      <button
        style={{
          opacity: comment || loading ? 1 : 0.5,
          pointerEvents: comment ? "all" : "none",
        }}
        onClick={() => (!loading ? postComment() : " ")}
      >
        {loading ? <SmallLoader /> : "POST"}
      </button>
    </div>
  );
};

export default AddComment;
