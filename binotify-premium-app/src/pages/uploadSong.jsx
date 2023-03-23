import axios from "axios";
import React from "react";
import ReactAudioPlayer from "react-audio-player";
import { MdOutlineArrowBack } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { BASE_API_URL } from "/src/App";
import Sidebar from "/src/components/Sidebar";
import "/src/styles/edit-song-card.scss";
import "/src/styles/list.scss";

export default function UploadSong({ user, setUser }) {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [wrongFile, setWrongFile] = React.useState(false);
  const [audiopath, setAudiopath] = React.useState("");

  const postSong = async () => {
    try {
      if (!file) {
        alert("Please upload an audio");
      }

      let ext = file.name.split(".").pop();
      let new_file_name = `${user.username}_${Date.now()}.${ext}`;
      let res = await axios.post(
        `${BASE_API_URL}/api/song/add`,
        {
          judul: title,
          audio_path: new_file_name,
        },
        {
          headers: {
            "wbd-token": localStorage.getItem("wbd-token"),
          },
        }
      );

      const formData = new FormData();
      formData.append("audio", file);
      res = await axios.post(
        `${BASE_API_URL}/api/songblob?audioPath=${new_file_name}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "wbd-token": localStorage.getItem("wbd-token"),
          },
        }
      );
      navigate("/songs");
      alert("Upload success");
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnChange = (e) => {
    const f = e.target.files[0];
    setFile(e.target.files[0]);
    setAudiopath(URL.createObjectURL(f));

    if (f.type.includes("audio")) {
      setWrongFile(false);
    } else {
      setWrongFile(true);
    }
  };

  return (
    <>
      <Sidebar user={user} setUser={setUser} />
      <div className="main-area">
        <div className="list-container">
          <h2>Add Song</h2>
          <>
            <div className="song-form">
              <div className="song-name">
                <label>Song name</label>
                <br />
                <input
                  className="name"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="song-audiofile">
                <div className="curr-song">
                  <label>Preview song</label>
                  <br />
                  <ReactAudioPlayer src={audiopath} controls />
                </div>
                <div className="upload-song">
                  <label>Song file</label>
                  <br />
                  <input
                    className="name"
                    type="file"
                    onChange={(e) => handleOnChange(e)}
                  />
                  {wrongFile ? (
                    <p className="text-warning file-warn">Wrong file type</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <button className="upload-btn" onClick={postSong}>
                Add
              </button>

              <Link to="/songs">
                <div className="back-btn">
                  <MdOutlineArrowBack size={30} />
                </div>
              </Link>
            </div>
          </>
        </div>
      </div>
    </>
  );
}
