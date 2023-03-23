import React from "react";
import Sidebar from "/src/components/Sidebar";

function Home({ user, setUser }) {
  return (
    <>
      <Sidebar user={user} setUser={setUser} />
      <div
        className="main-area"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: "100vh",
        }}
      >
        <img
          style={{ width: "40%", margin: "auto" }}
          src="/meme.jpeg"
          alt="kita stres"
        />
      </div>
    </>
  );
}

export default Home;
