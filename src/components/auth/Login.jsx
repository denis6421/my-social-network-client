import React, { useState, useEffect } from "react";
import LoadingBtn from "../parts/LoadingBtn";
import { apiPostRequest } from "../../api/api";
import { withRouter } from "react-router-dom";
import { SIGNUP_ROUTE, DASHBOARD_ROUTE } from "../../tools/routes";
import { setCookie } from "../../tools/cookies";
import { TOKEN } from "../../tools/variable";
import { signin_inputs } from "./login_inputs";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextInput from "../parts/TextInput";
import Logo from "../../images/logo.svg";

const Login = (props) => {
  const [form_data, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [is_demo, setIsDemo] = useState(false);
  const [error, setError] = useState('');
  const [demo_loading, setDemoLoading] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    const { username, password } = form_data;
    e.preventDefault();
    if (!username || !password) return;
    const body = {
      username,
      password,
    };
    setLoading(true);
    setError('')
    const api = "auth/login";
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      handleSignupSuccess(res.result);
      setLoading(false);
    }else{
      setError(res.result ? res.result : 'An error has occured.')
      setLoading(false);
    }
  };

  const logitWithDemoAccount = async () => {
    const body = {
      username: "demo account",
      password: "demo123",
    };
    setDemoLoading(true);
    const api = "auth/login";
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      handleSignupSuccess(res.result);
    }else{
      setError(res.result ? res.result : 'An error has occured.')
      setDemoLoading(true);
    }
  };

  const handleValidation = () => {
    const { username, password } = form_data;
    if (username && password) return true;
    else return false;
  };

  useEffect(() => {
    let url = window.location.pathname;
    if (url.indexOf("demo") > -1) {
      setIsDemo(true);
    }
  }, []);

  const handleSignupSuccess = (user) => {
    dispatch({
      type: "SET_DATA_TO_GLOBAL",
      payload: { name: "user", value: user },
    });
    setCookie(TOKEN, user.token);
    props.history.push(DASHBOARD_ROUTE);
  };

  const updateState = (name, value) => {
    setFormData((form_data) => ({ ...form_data, [name]: value }));
  };

  return (
    <div className="auth flex__center">
      <div className="auth__flex">
        <form onSubmit={(e) => handleSubmit(e)} className="auth__form">
          <figure className="auth__form__logo">
            <img src={Logo} alt="" />
          </figure>
          <section className="auth__form__inputs">
            {signin_inputs.map((m, i) => {
              return (
                <TextInput
                  value={form_data[m.property_name]}
                  updateForm={updateState}
                  input={m}
                  key={i}
                />
              );
            })}
          </section>
          <LoadingBtn
            disabled={!handleValidation()}
            type="submit"
            loading={loading}
            text="Sign in"
          />
          {error ? <p className='form__error'>{error}</p> : ''}
        </form>
        {is_demo ? (
          <div className="auth__additional flex__center">
            <LoadingBtn
              type="button"
              handleClick={() => logitWithDemoAccount()}
              loading={demo_loading}
              text="Demo account"
            />
          </div>
        ) : (
          ""
        )}
        <div className="auth__additional flex__center">
          <h4>Don't have an account?</h4>
          <Link to={SIGNUP_ROUTE}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
