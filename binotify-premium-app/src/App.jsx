import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "/src/pages/home";
import Login from "/src/pages/login";
import Register from "/src/pages/register";
import Songs from "/src/pages/songs";
import Subscription from "/src/pages/subscription";
import UploadSong from "/src/pages/uploadSong";
import "/src/styles/App.scss";

export const BASE_API_URL = "http://localhost:8081";

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("wbd-token");
      const res = await axios.get(`${BASE_API_URL}/api/check_login`, {
        headers: {
          "wbd-token": token,
        },
      });
      setUser(res.data);
    } catch (err) {
      if (window.location.pathname !== "/login") {
        // redirect to login page
        window.location.replace(
          window.location.href.replace(window.location.pathname, "") + "/login"
        );
      }
      console.log("JWT not valid");
    }
  };

  useEffect(() => {
    getUser();
    console.log("Get data user");
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route
              path="/login"
              element={<Login user={user} setUser={setUser} />}
            />
            <Route path="/register" element={<Register user={user} />} />
          </Route>
          <Route>
            <Route
              exact
              path="/"
              element={<Home user={user} setUser={setUser} />}
            />
            <Route
              path="/add_song"
              element={<UploadSong user={user} setUser={setUser} />}
            />
            <Route
              path="/songs"
              element={<Songs user={user} setUser={setUser} />}
            />
            <Route
              path="/subscription"
              element={<Subscription user={user} setUser={setUser} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
