import React, { useState } from "react";
import { apiPostRequest } from "../../../api/api";
import SmallLoader from "../../parts/SmallLoader";

const UserPostCreateComment = ({user,post_id, addComment }) =>  {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState('')
  const postComment = async () => {
  
    const api = "comment/create";
    if(!comment) return
    const body = {
      text: comment,
      post_id,
    };
    setLoading(true)
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      let body = {
        ...res.result,
        user_details: {
          username: res.result.username,
          _id:res.result.user_id,
          avatar:user.avatar
        },
      };
     addComment(body);
     setComment('')
    }
    setLoading(false)
  };


    return (
      <div className="user__page__create__comment flex__between">
        <input
         onKeyUp={(event) => (event.keyCode === 13 ? postComment() : "")}
        placeholder='Add a comment...'
          value={comment}
          onChange={(e) =>   setComment(e.target.value) }
          type="text"
        />
        <button 
        style ={{
            opacity:comment ? 1  :0.5
        }}
        onClick={() => comment ?  postComment()  :''}>{loading ? <SmallLoader />  :'POST'}</button>
      </div>
    );
  
}

export default UserPostCreateComment;
