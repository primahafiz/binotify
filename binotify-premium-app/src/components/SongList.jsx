import React from "react";
import ReactAudioPlayer from "react-audio-player";
import "/src/styles/list.scss";

export default function SongList({
  num,
  song,
  setSongEdit,
  setEdit,
  isEven = false,
}) {
  return (
    <div className={`row list-item ${isEven ? "even-row" : ""}`}>
      <div className="col-2 list-number">{num}.</div>
      <div className="col-4">
        <div className="name-container">{song.title}</div>
      </div>
      <div className="col-3">
        <ReactAudioPlayer src={song.audio_path} controls />
      </div>
      <div className="col-3">
        <button
          className="list-btn bg-green"
          onClick={() => {
            setEdit(true);
            setSongEdit(song);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
