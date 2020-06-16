import React from "react";
import UserAvatar from "../../parts/UserAvatar";
import { Link, withRouter } from "react-router-dom";
import { timeFromNow } from "../../../functions/functions";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { connect } from "react-redux";
import * as actions from "../../../actions/actions";
import { apiGetRequest } from "../../../api/api";
import { USER_PAGE_ROUTE } from "../../../tools/routes";

const UserPostComments = (props) => {
  const { comments, loading, post, profile ,is_mobile, setMobileComments} = props;
  const { user } = props.global;

  const close = () => {
    props.setDataToGlobalReducer("popup_options", false);
  };
  const deleteComment = async (id) => {
    const api = `comment/delete?comment=${id}`;
    const res = await apiGetRequest(api);
    if (res.ok) {
      close();
      props.removeComment(id);
    }
  };

  const showPopup = (m) => {
    const options = [
     
      {
        name: "Delete",
        func: () => deleteComment(m._id),
      },
      {
        name: "Close",
        func: close,
      },
    ];
    props.setDataToGlobalReducer("popup_options", options);
  };
  return (
    <ul className='user__page__popup__comments__list'>
      <li className="flex__start">
        <UserAvatar img={profile.avatar} />
        <span>
          <p>
            <strong>{profile.username}</strong>
            {` ${post ? post.text : ""}`}
          </p>
        </span>
      </li>
      <section
            className="user__page__mobile__comments__btn flex__start"
            onClick={() => setMobileComments(true)}
          >
            {comments.length > 0
              ? `View all ${comments.length} comments`
              : "Add comment"}
          </section>
      {!is_mobile && comments && comments.length > 0 ? (
        comments.map((m) => {
          return (
            <li className="flex__start" key={m._id}>
              <UserAvatar img={m.user_details.avatar} />
              <span>
                <p>
                  <Link
                    to={USER_PAGE_ROUTE.replace(":id", m.user_details.username)}
                  >
                    {m.user_details.username}
                  </Link>
                  {` ${m.text}`}
                </p>

                <h6>{timeFromNow(m.created_at)}</h6>
                {user._id === m.user_details._id ? (
                  <button
                    onClick={() => showPopup(m)}
                    className="user__post__comment__btn"
                  >
                    <MoreHorizIcon />
                  </button>
                ) : (
                  ""
                )}
              </span>
            </li>
          );
        })
      ) : !is_mobile && !loading && comments && comments.length === 0 ? (
        <p
          style={{
            paddingLeft: "10px",
            paddingTop: "10px",
          }}
        >
          No comments
        </p>
      ) : (
        ""
      )}
    </ul>
  );
};

function mapStateToProps({ global }) {
  return { global };
}

export default withRouter(connect(mapStateToProps, actions)(UserPostComments));
