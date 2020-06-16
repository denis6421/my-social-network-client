import React, { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { lockBody } from "../../../../../functions/functions";
import { apiGetRequest } from "../../../../../api/api";
import UserAvatar from "../../../../parts/UserAvatar";
import { USER_PAGE_ROUTE } from "../../../../../tools/routes";
import { Link } from "react-router-dom";
import CommentLoader from "../loaders/CommentLoader";
const LikesPopup = ({post_id, handleLikes}) =>  {
  const [show_page, setShowPage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [likes, setLikes] = useState([])

useEffect(() => {
  setTimeout(() => {
    setShowPage(true)
  }, 20);
  lockBody(true);
  getLikes();
  return () => {
    lockBody(false);
  }
}, [])

  const getLikes = async () => {
    setLoading(true)
    const api = `like/get-by-post?post_id=${post_id}`;
    const res = await apiGetRequest(api);
    if (res.ok) {
     setLikes(res.result)
    }
  setLoading(false)
  };
 const  close = () => {
   setShowPage(false)
    setTimeout(() => {
    handleLikes();
    }, 200);
    lockBody();
  };


    return (
      <div
      id={show_page ? 'popup--active' : ''}
        className="feed__likes popup flex__center"
      >
        <section onClick={() => close()} className="overlay"></section>
        <section className="popup__content">
          <header className="flex__center">
            <h3>Likes</h3>
            <button
              className="popup__content__close"
              onClick={() => close()}
            >
              <CloseIcon />
            </button>
          </header>
          <ul>
            {!loading
              ? likes && likes.length > 0
                ? likes.map((m) => {
                    return (
                      <li className="flex__start" key={m._id}>
                        <UserAvatar img={m.user.avatar} />
                        <Link to={USER_PAGE_ROUTE.replace(":id", m.username)}>
                          {m.username}
                        </Link>
                      </li>
                    );
                  })
                : ""
              : [...Array(3).keys()].map((m) => {
                  return <CommentLoader className="feed__comment__loaders" />;
                })}
          </ul>
        </section>
      </div>
    );
  
}

export default LikesPopup;
