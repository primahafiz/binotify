import React, { useEffect } from "react";
import axios from "axios";
import {
  MdOutlineArrowBack,
  MdOutlineArrowForward,
} from "react-icons/md";
import { BASE_API_URL } from "../App";
import Sidebar from "/src/components/Sidebar";
import SubsList from "/src/components/SubsList";
import "/src/styles/list.scss";

function Subscription({ user, setUser }) {
  if (!user || user?.role !== "admin") {
    console.log("This page is not accessible");
  }

  const itemPerPage = 5;
  const [lastItem, setLastItem] = React.useState(0);
  const [pendingList, setPendingList] = React.useState([]);
  const [displayList, setDisplayList] = React.useState([]);
  

  const getPendingList = async () => {
    const response = await axios.get(`${BASE_API_URL}/api/subscription/pending`, {
      headers: {
        "wbd-token": localStorage.getItem("wbd-token"),
      },
    });
    response.data['data'].forEach((item, i) => {
      item.id = i+1
    });
    setPendingList(response.data['data']);
    console.log(response.data['data']);
    setDisplayList(response.data['data'].slice(lastItem, itemPerPage));
  };

  useEffect(() => {
    getPendingList();
  }, []);

  return (
    <>
      <Sidebar user={user} setUser={setUser} />
      <div className="main-area">
        <div className="list-container">
          <h2>Subscription</h2>

          <div className="row list-header">
            <div className="col-2">Number</div>
            <div className="col-4">Creator ID</div>
            <div className="col-3">User ID</div>
            <div className="col-3"></div>
          </div>
          {displayList.map((pending) => {
                return (
                  <SubsList
                    num={pending.id}
                    creator_id={pending.creator_id}
                    subscriber_id={pending.subscriber_id}
                    verdict={"PENDING"}
                    isEven={pending.id % 2 === 0}
                  />
                );
          })}

          <div className="pagination-btn">
            {lastItem < itemPerPage ? (
              <div></div>
            ) : (
              <div className="arrow-btn">
                <MdOutlineArrowBack
                  size={30}
                  onClick={() => {
                    setDisplayList(
                      pendingList.slice(lastItem - itemPerPage, lastItem)
                    );
                    setLastItem(lastItem - itemPerPage);
                  }}
                />
              </div>
            )}
            {lastItem + itemPerPage < pendingList.length ? (
              <div className="arrow-btn">
                <MdOutlineArrowForward
                  size={30}
                  onClick={() => {
                    setDisplayList(
                      pendingList.slice(
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
        </div>
      </div>
    </>
  );
}

export default Subscription;
