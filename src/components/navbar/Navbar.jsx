import React, { useState } from "react";
import Logo from "../../images/logo.svg";
import { Link, withRouter } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import { USER_PAGE_ROUTE, DASHBOARD_ROUTE } from "../../tools/routes";
import UserAvatar from "../parts/UserAvatar";
import { removeCookie } from "../../tools/cookies";
import { TOKEN } from "../../tools/variable";
import { connect, useSelector, useDispatch } from "react-redux";
import PostAddIcon from "@material-ui/icons/PostAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SearchIcon from '@material-ui/icons/Search';
const Navbar = () => {
  const [show_search, setShowSearch] = useState(false)
  const global = useSelector((state) => state.global);
  const user = global.user;
  const dispatch = useDispatch();
  const logout = () => {
    removeCookie(TOKEN);
    window.location.reload();
  };



  return (
    <nav className="navbar">
      <div className="navbar__flex flex__between">
        <Link className="navbar__logo" to={""}>
          <img src={Logo} alt="" />
        </Link>
       
        <NavbarSearch
        setShowSearch = {setShowSearch} 
        show_component = {show_search}
        />
        <div className="navbar__flex__actions flex__start">
          <button
          onClick = {() => setShowSearch(true)}
          className="navbar__flex__actions__search flex__start">
            <SearchIcon />
          </button>
        <Link to={DASHBOARD_ROUTE}>
           <HomeOutlinedIcon />
          </Link>
          <Link to={USER_PAGE_ROUTE.replace(":id", user.username)}>
            <UserAvatar img={user.avatar} />
          </Link>
          <button className="flex__start" onClick={() => logout()}>
            <ExitToAppIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
