import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BASE_API_URL } from "/src/App";
import "/src/styles/auth.scss";

import { validateEmail, validateUsername } from "./utils";

function Register({ user }) {
  if (user) {
    console.log("Has login, redirect to home");
  }

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: null,
    username: null,
    email: null,
    password: null,
    retypePassword: null,
  });

  const [emailWarn, setEmailWarn] = useState(<></>);
  const [emailWarnClass, setEmailWarnClass] = useState("");

  const [unameWarn, setUnameWarn] = useState(<></>);
  const [unameWarnClass, setUnameWarnClass] = useState("");

  const [passwordWarn, setPasswordWarn] = useState(<></>);
  const [passwordWarnClass, setPasswordWarnClass] = useState("");

  const [retypePasswordWarn, setRetypePasswordWarn] = useState(<></>);
  const [retypePasswordWarnClass, setRetypePasswordWarnClass] = useState("");

  const [nameWarn, setNameWarn] = useState(<></>);
  const [nameWarnClass, setNameWarnClass] = useState("");

  function handleEmpty(value, variable, setVarWarn, setVarWarnClass) {
    if (!value) {
      setVarWarn(
        <p className="text-warning">You need to pass your {variable}</p>
      );
      setVarWarnClass("box-shadow-warning");
    } else {
      setVarWarn(<></>);
      setVarWarnClass("");
    }
  }

  const handleEmail = (e) => {
    if (!validateEmail(e.target.value)) {
      setEmailWarn(
        <p className="text-warning">Your email is in invalid format.</p>
      );
      setEmailWarnClass("box-shadow-warning");
    }
    handleEmpty(e.target.value, "email", setEmailWarn, setEmailWarnClass);
    setUserData({ ...userData, email: e.target.value });
  };

  const handleUname = (e) => {
    if (!validateUsername(e.target.value)) {
      setUnameWarn(
        <p className="text-warning">Your username is in invalid format.</p>
      );
      setUnameWarnClass("box-shadow-warning");
    }
    handleEmpty(e.target.value, "username", setUnameWarn, setUnameWarnClass);
    setUserData({ ...userData, username: e.target.value });
  };

  const handlePassword = (e) => {
    handleEmpty(
      e.target.value,
      "password",
      setPasswordWarn,
      setPasswordWarnClass
    );
    setUserData({ ...userData, password: e.target.value });
  };

  const handleRetypePassword = (e) => {
    handleEmpty(
      e.target.value,
      "retype password",
      setRetypePasswordWarn,
      setRetypePasswordWarnClass
    );
    userData.retypePassword = e.target.value;
  };

  const handleName = (e) => {
    handleEmpty(e.target.value, "name", setNameWarn, setNameWarnClass);
    userData.name = e.target.value;
  };

  const postRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_API_URL}/api/register`, {
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        retypePassword: userData.retypePassword,
      });
      navigate("/login");
      alert("Register success");
    } catch (err) {
      alert(err.response.data["err"]);
    }
    return;
  };

  return (
    <>
      <div className="auth-head">
        <img
          className="auth-logo"
          src="/logo-black.png"
          alt="logo"
          style={{ marginBottom: "3px" }}
        />
        <p style={{ fontWeight: "500" }}>Premium</p>
      </div>

      <div>
        <hr className="line" />
      </div>

      <div className="auth-body" style={{ marginTop: "0" }}>
        <form className="auth-form form-reg" onSubmit={(e) => postRegister(e)}>
          <div className="field-container">
            <label htmlFor="name">What is your name?</label>
            <br />
            <input
              className={`field ${nameWarnClass}`}
              type="text"
              placeholder="Enter your name."
              onChange={handleName}
            />
            <br />
            {nameWarn}
          </div>

          <div className="field-container">
            <label htmlFor="email">What is your email?</label>
            <br />
            <input
              className={`field ${emailWarnClass}`}
              type="text"
              placeholder="Enter your email."
              onChange={handleEmail}
            />
            <br />
            {emailWarn}
          </div>

          <div className="field-container">
            <label htmlFor="username">What is your username?</label>
            <br />
            <input
              className={`field ${unameWarnClass}`}
              type="text"
              placeholder="Enter your username."
              onChange={handleUname}
            />
            <br />
            {unameWarn}
          </div>

          <div className="field-container">
            <label htmlFor="password">Create a password</label>
            <br />
            <input
              className={`field ${passwordWarnClass}`}
              type="password"
              placeholder="Enter your password."
              onChange={handlePassword}
            />
            <br />
            {passwordWarn}
          </div>

          <div className="field-container">
            <label htmlFor="password">Retype your password</label>
            <br />
            <input
              className={`field ${retypePasswordWarnClass}`}
              type="password"
              placeholder="Re-enter your password."
              onChange={handleRetypePassword}
            />
            <br />
            {retypePasswordWarn}
          </div>

          <input
            className="btn bg-light-green mt-4"
            type="submit"
            value="SIGN UP"
          />
        </form>

        <hr className="line line-bottom" />
        <h2 className="text-bigger login-link">
          Have an account?
          <a href="/login" style={{ marginLeft: "3px" }}>
            Log in.
          </a>
        </h2>
      </div>
    </>
  );
}

export default Register;
