import React, { useState } from "react";
import { signup_inputs } from "./signup_inputs";
import TextInput from "../parts/TextInput";
import LoadingBtn from "../parts/LoadingBtn";
import { apiPostRequest } from "../../api/api";
import { withRouter, Link } from "react-router-dom";
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from "../../tools/routes";
import { setCookie } from "../../tools/cookies";
import { TOKEN } from "../../tools/variable";
import { useDispatch } from "react-redux";
import Logo from '../../images/logo.svg'






const Signup = (props) => {
  const [form_data, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validation_error, setValidationError] = useState(false);

  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    setValidationError(false)
    const { username, email, password } = form_data;
    e.preventDefault();
    if (!username || !email || !password) return;
   
    let errors = document.querySelectorAll('.text__input__error')
    if(errors.length > 0) {
      setValidationError(true)
      return
    }
    const body = {
      username,
      email,
      password,
    };
    setLoading(true)
    const api = "user/create";
    const res = await apiPostRequest(api, body);
    if (res.ok) {
      dispatch({
        type: "SET_DATA_TO_GLOBAL",
        payload: { name: "user", value: res.result },
      });
      handleSignupSuccess(res.result);
    }
    setLoading(false)
  };


  
  const handleSignupSuccess = (user) => {
    setCookie(TOKEN, user.token);
    props.history.push(DASHBOARD_ROUTE);
  };

  const updateState = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleValidation = () => {
    const {email, username, password} = form_data
    if(email && username && password) return true
    else return false
  }
  return (
    <div className="auth flex__center">
     <div className='auth__flex'>
     <form onSubmit={(e) => handleSubmit(e)} className="auth__form flex__column">
       <figure className='auth__form__logo'><img src={Logo} alt=""/></figure>
        <section className="auth__form__inputs">
          {signup_inputs.map((m, i) => {
            return <TextInput
            
            value = {form_data[m.property_name]}
            updateForm={updateState} input={m} key={i} />;
          })}
        </section>
        <LoadingBtn 
        disabled  =  {!handleValidation()}
        type="submit" loading={loading} text="Sign up" />
        {validation_error ? 
        <h5 className='auth__form__error'>Email is invalid</h5>
        :''}
      </form>

      <div className='auth__additional flex__center'>
            <h4>Have an account?</h4>
            <Link to ={LOGIN_ROUTE}>
              Log in
            </Link>
      </div>
     </div>
    </div>
  );
};

export default withRouter(Signup);
