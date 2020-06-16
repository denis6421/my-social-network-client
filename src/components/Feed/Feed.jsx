import React, { useEffect, useState, useCallback } from "react";
import Post from "./post/Post";
import { apiGetRequest } from "../../api/api";
import { useSelector, useDispatch } from "react-redux";
import LikesPopup from "./post/parts/likes/LikesPopup";
import PostAddIcon from "@material-ui/icons/PostAdd";
import HandlePost from "./post/HandlePost";
import InfiniteScroll from "react-infinite-scroll-component";
import SmallLoader from "../parts/SmallLoader";
import { findObjectIndex } from "../../functions/functions";
import CloudOffIcon from "@material-ui/icons/CloudOff";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState(false);
  const [page_loaded, setPageLoaded] = useState(false);
  const [add_post, setAddPost] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(3);
  const [post_to_edit, setPostToEdit] = useState(false)
  const [has_more, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false);

  const global = useSelector((state) => state.global);
  const user = global.user;

  useEffect(() => {
getPosts()
    setPageLoaded(true);
   
    return () => {};
  }, []);

  const addPost = (value) => {
    setAddPost(value);
    setPostToEdit(false)
  };


const  getPosts = async() => {
    const api = `post/all?skip=${skip * limit}&limit=${limit}`;
    const res = await apiGetRequest(api);
    if (res.ok) {
        if(res.result.length === 0) setHasMore(false)
      setPosts([...posts, ...res.result]);
      setSkip(skip + 1)
    }
  
  };

  const handleLikes = (likes) => {
    setLikes(likes);
  };
const updatePostInList = (post) => {
  let new_posts = [...posts]
  let index = findObjectIndex(new_posts, '_id', post._id)
  if(index >= 0) new_posts.splice(index,1, post)
  setPosts(new_posts)
  
}
  const addToPosts = (post) => {
    let new_posts = [...posts];
    new_posts = [post, ...new_posts];
    setPosts(new_posts);
  };


  const editPost = (post_to_edit) => {
    setPostToEdit(post_to_edit)
    setAddPost(true);
  }
  return page_loaded ? (
    <div className="feed">
    
      {add_post ? (
        <HandlePost
        updatePostInList = {updatePostInList}
        post_to_edit = {post_to_edit}
        addToPosts={addToPosts} closePost={setAddPost} />
      ) : (
        ""
      )}
      {likes ? <LikesPopup handleLikes={handleLikes} post_id={likes} /> : ""}

      <div className="feed__posts">
        <button
          onClick={() => addPost(true)}
          className="add__post flex__start"
        >
          <PostAddIcon />
          <h5>Create post</h5>
        </button>
        <InfiniteScroll
        className='feed__posts__list'
          dataLength={posts.length}
          next={getPosts}
          hasMore={has_more}
          loader={<SmallLoader />}
        >
          {posts && posts.length > 0
            ? posts.map((m) => {
                return (
                  <Post
                  editPost ={editPost}
                    user={user}
                    handleLikes={handleLikes}
                    key={m._id}
                    post={m}
                  />
                );
              })
            : 
            !has_more ? 
            <div className="no__data">
            <CloudOffIcon />
            <p>No posts in feed</p>
            <button onClick={() => setAddPost(true)} className="flex__center">
              {" "}
              <PostAddIcon />
              Create post
            </button>
          </div> : ''}
         
         
          
        </InfiniteScroll>
        
      </div>
    </div>
  ) : (
    ""
  );
};

export default Feed;
