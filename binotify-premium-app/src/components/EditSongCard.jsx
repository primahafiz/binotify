import axios from "axios";
import React, { useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import { MdOutlineArrowBack } from "react-icons/md";
import { BASE_API_URL } from "/src/App";
import "/src/styles/edit-song-card.scss";
import "/src/styles/list.scss";

export default function EditSongCard({ user, song, setEdit }) {
  const [title, setTitle] = React.useState(song.title);
  const [wrongFile, setWrongFile] = React.useState(false);
  const [audiopath, setAudiopath] = React.useState(song.audio_path);
  const [file, setFile] = React.useState(null);

  const getAudiopath = async () => {
    const response = await axios.get(
      `${BASE_API_URL}/api/songblob?audioPath=${song.audio_path}`
    );

    if (response.status === 200) {
      setAudiopath(response.config.url);
    }
  };

  useEffect(() => {
    getAudiopath();
  }, []);

  const postSong = async () => {
    try {
      if (!file) {
        alert("Please upload an audio");
      }

      let ext = file.name.split(".").pop();
      let new_file_name = `${user.username}_${Date.now()}.${ext}`;
      let res = await axios.put(
        `${BASE_API_URL}/api/song/update/${song.id}`,
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
      formData.append("new_file_name", new_file_name);
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
      alert("Upload success");
      window.location.reload();
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

  const deleteSong = async () => {
    try {
      let res = await axios.delete(
        `${BASE_API_URL}/api/song/delete/${song.id}`,
        {
          headers: {
            "wbd-token": localStorage.getItem("wbd-token"),
          },
        }
      );

      alert("Delete success");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="song-form">
      <div className="song-name">
        <label>Song name</label>
        <br />
        <input
          className="name"
          type="text"
          value={title}
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
      <div className="btn-container">
        <button className="upload-btn" onClick={postSong}>
          Submit
        </button>
        <button className="upload-btn bg-red" onClick={deleteSong}>
          Delete
        </button>
      </div>

      <div className="back-btn">
        <MdOutlineArrowBack size={30} onClick={() => setEdit(false)} />
      </div>
    </div>
  );
}
