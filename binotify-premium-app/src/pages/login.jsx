import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_API_URL } from "/src/App";
import "/src/styles/auth.scss";

function Login({ user, setUser }) {
  if (user) {
    console.log("Has login, redirect to home");
  }

  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: null,
    password: null,
  });

  const [usernameWarn, setUsernameWarn] = useState(<></>);
  const [usernameWarnClass, setUsernameWarnClass] = useState("");

  const [passwordWarn, setPasswordWarn] = useState(<></>);
  const [passwordWarnClass, setPasswordWarnClass] = useState("");

  const handleUsername = (e) => {
    if (!e.target.value) {
      setUsernameWarn(<p className="text-warning">Username can't be empty</p>);
      setUsernameWarnClass("box-shadow-warning");
    } else {
      setUsernameWarn(<></>);
      setUsernameWarnClass("");
    }
    setUserData({ ...userData, username: e.target.value });
  };

  const handlePassword = (e) => {
    if (!e.target.value) {
      setPasswordWarn(
        <p className="text-warning">You need to pass your password</p>
      );
      setPasswordWarnClass("box-shadow-warning");
    } else {
      setPasswordWarn(<></>);
      setPasswordWarnClass("");
    }
    setUserData({ ...userData, password: e.target.value });
  };

  const postLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_API_URL}/api/login`, {
        username: userData.username,
        password: userData.password,
      });
      setUser(res.data);
      localStorage.setItem("wbd-token", res.headers["wbd-token"]);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data ? err.response.data["err"] : "Something went wrong"
      );
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
        <p style={{ fontWeight: "600" }}>Premium</p>
      </div>
      <div>
        <hr className="line" />
      </div>
      <div className="auth-body">
        <h3 className="mb-1">To continue, log in to Spotify.</h3>
        <form className="auth-form" onSubmit={postLogin}>
          <div className="field-container">
            <label htmlFor="username">Username</label>
            <br />
            <input
              className={`field ${usernameWarnClass}`}
              type="text"
              placeholder="Username"
              onChange={handleUsername}
            />
            <br />
            {usernameWarn}
          </div>

          <div className="field-container">
            <label htmlFor="password">Password</label>
            <br />
            <input
              className={`field ${passwordWarnClass}`}
              type="password"
              placeholder="Password"
              onChange={handlePassword}
            />
            <br />
            {passwordWarn}
          </div>

          <input
            className="btn bg-light-green mt-4"
            type="submit"
            value="LOG IN"
          />
        </form>

        <hr className="line line-bottom" />
        <h2 className="text-bigger mb-15">Don't have an account?</h2>
        <Link to="/register">
          <button className="btn reg-btn mt-2">SIGN UP</button>
        </Link>
      </div>
    </>
  );
}

export default Login;
