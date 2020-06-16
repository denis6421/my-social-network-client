import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Feed from "../Feed/Feed";
import UserPage from "../user-page/UserPage";
import PopupWithFunctions from "../parts/PopupWithFunctions";
import Navbar from "../navbar/Navbar";
import { USER_PAGE_ROUTE } from "../../tools/routes";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const global = useSelector((state) => state.global);
  const user  = global.user
  return (
    user ? <div className="dashboard">
      {global.popup_options ? <PopupWithFunctions /> : ""}

      <Router>
        <Navbar />
        <Switch>
          <Route exact path={USER_PAGE_ROUTE} render={() => <UserPage />} />
          <Route exact path={"/"} render={() => <Feed />} />
        </Switch>
      </Router>
    </div> : ''
  );
};

export default Dashboard;
