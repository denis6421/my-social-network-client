import React, { useEffect, useState } from "react";
import { getCookie } from "./tools/cookies";
import { TOKEN } from "./tools/variable";
import { SIGNUP_ROUTE, LOGIN_ROUTE, DASHBOARD_ROUTE } from "./tools/routes";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import Signup from "./components/auth/Signup";
import { apiGetRequest } from "./api/api";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

const App = (props) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getCookie(TOKEN);
    if (!token) {
       handleNoAuth()
    
    } else {
      login(token);
    }
    return () => {};
  }, []);

  const login = async () => {
    const api = "auth/login-by-jwt";
    const res = await apiGetRequest(api);
    let url = window.location.pathname
    if (res.ok) {
      dispatch({
        type: "SET_DATA_TO_GLOBAL",
        payload: { name: "user", value: res.result },
      });
      // props.history.push(DASHBOARD_ROUTE);
    } else {
      await handleNoAuth()
    }
    setLoaded(true);
  };
  const handleNoAuth = () => {
    let url = window.location.pathname.split('/')[1]
      if(url === 'login' || url === 'signup') {
        
      } else{
        props.history.push(LOGIN_ROUTE);
      }
    
    setLoaded(true);
  }

  return loaded ? (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path={SIGNUP_ROUTE} render={() => <Signup />} />
          <Route  path={LOGIN_ROUTE} render={() => <Login />} />
          <Route path={DASHBOARD_ROUTE} render={() => <Dashboard />} />
        </Switch>
      </Router>
    </div>
  ) : null;
};

export default withRouter(App);
