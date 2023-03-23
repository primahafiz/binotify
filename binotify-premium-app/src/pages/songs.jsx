import axios from "axios";
import React, { useEffect } from "react";
import {
  MdOutlineAdd,
  MdOutlineArrowBack,
  MdOutlineArrowForward,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "/src/App";
import EditSongCard from "../components/EditSongCard";
import Sidebar from "/src/components/Sidebar";
import SongList from "/src/components/SongList";
import "/src/styles/list.scss";

function Songs({ user, setUser }) {
  if (!user || user?.role !== "singer") {
    console.log("This page is not accessible");
  }

  const itemPerPage = 5;
  const [lastItem, setLastItem] = React.useState(0);
  const [edit, setEdit] = React.useState(false);
  const [songList, setSongList] = React.useState([]);
  const [displayList, setDisplayList] = React.useState([]);
  const [songEdit, setSongEdit] = React.useState({});

  const getSongList = async () => {
    const response = await axios.get(`${BASE_API_URL}/api/song`, {
      headers: {
        "wbd-token": localStorage.getItem("wbd-token"),
      },
    });
    setSongList(response.data);
    console.log(response.data);
    setDisplayList(response.data.slice(lastItem, itemPerPage));
  };

  useEffect(() => {
    getSongList();
  }, []);

  return (
    <>
      <Sidebar user={user} setUser={setUser} />
      <div className="main-area">
        <div className="list-container">
          <h2>{edit ? "Edit Song" : "Song"}</h2>
          {edit ? (
            <EditSongCard user={user} song={songEdit} setEdit={setEdit} />
          ) : (
            <>
              <Link
                to="/add_song"
                className="btn-add"
                style={{ textDecoration: "none" }}
              >
                <button className="btn">
                  <MdOutlineAdd size={20} />
                  Add Song
                </button>
              </Link>
              <div className="row list-header">
                <div className="col-2">Number</div>
                <div className="col-4">Title</div>
                <div className="col-3">Audio</div>
                <div className="col-3"></div>
              </div>

              {displayList.map((song, index) => {
                return (
                  <SongList
                    key={lastItem + index + 1}
                    num={lastItem + index + 1}
                    song={song}
                    isEven={(lastItem + index + 1) % 2 === 0}
                    setSongEdit={setSongEdit}
                    setEdit={setEdit}
                  />
                );
              })}
            </>
          )}

          {edit ? (
            ""
          ) : (
            <div className="pagination-btn">
              {lastItem < itemPerPage ? (
                <div></div>
              ) : (
                <div className="arrow-btn">
                  <MdOutlineArrowBack
                    size={30}
                    onClick={() => {
                      setDisplayList(
                        songList.slice(lastItem - itemPerPage, lastItem)
                      );
                      setLastItem(lastItem - itemPerPage);
                    }}
                  />
                </div>
              )}
              {lastItem + itemPerPage < songList.length ? (
                <div className="arrow-btn">
                  <MdOutlineArrowForward
                    size={30}
                    onClick={() => {
                      setDisplayList(
                        songList.slice(
                          lastItem + itemPerPage,
                          lastItem + 2 * itemPerPage
                        )
                      );
                      setLastItem(lastItem + itemPerPage);
                    }}
                  />
                </div>
              ) : (
                <div></div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Songs;
