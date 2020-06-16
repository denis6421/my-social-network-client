import React, { useState, useEffect } from "react";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import validator from "validator";

const TextInput = ({ input, updateForm, textarea, value, error }) => {
  const { property_name, name } = input;
  const [is_error, setIsError] = useState(false);
  const [active, setActive] = useState(false);

  const validate = (value) => {
    let is_error;
    const { validation } = input;
    switch (validation) {
      case "email":
        is_error = !validator.isEmail(value);
     
      default:
        break;
    }
    if (is_error) {
      setIsError(true);
    }
  };
  useEffect(() => {
    if (!value && error) setIsError(true);
    return () => {};
  }, [error]);

  const handleChange = (value) => {

    updateForm(property_name, value);
  };
 const  handleBlur  =() => {
  setActive(false)
  if(value)  validate(value);
  }

 const  handleFocus = () => {
  setIsError(false)
    setActive(true)
  }
  return (
    <div className="text__input">
      {textarea ? (
        <textarea
          style={{
            border: is_error ? "1px solid red" : "",
          }}
          onFocus={() => handleFocus()}
          value={value}
          placeholder={name}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : (
        <input
          style={{
            border: is_error ? "1px solid red" : "",
          }}
          onBlur = {() =>handleBlur()}
          onFocus={() => handleFocus()}
          value={value}
          placeholder={name}
          onChange={(e) => handleChange(e.target.value)}
          type={input.type}
        />
      )}
      {!textarea ? 
      
      value && is_error && !active ? (
        <HighlightOffOutlinedIcon 
        className='text__input__error'
        />
      ) : value && !is_error && !active ? (
        <CheckCircleOutlinedIcon 
        className='text__input__valid'
        />
      ) : (
        ""
      )  :''}
    </div>
  );
};

export default TextInput;
