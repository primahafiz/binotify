import React from "react";
import axios from "axios";
import { BASE_API_URL } from "/src/App";
import "/src/styles/list.scss";

async function sendVerdict(creator_id, subscriber_id, status ,setReqVerdict){
  // send verdict to rest
  console.log("TOKEN");
  console.log(localStorage.getItem("wbd-token"));
  const response = await axios({
    method: "put",
    url: `${BASE_API_URL}/api/subscription/verify`,
    headers: {
      "wbd-token": localStorage.getItem("wbd-token"),
    },
    data: {
      "creator_id": creator_id,
      "subscriber_id": subscriber_id,
      "status": status
    }
  });
  
  if(response.status === 200){
    setReqVerdict(status);
  }
}

export default function SubsList({ num, creator_id, subscriber_id, verdict, isEven = false }) {
  const [reqVerdict, setReqVerdict] = React.useState(verdict);
  console.log(isEven);
  return (
    <div className={`row list-item ${isEven ? "even-row" : ""}`}>
      <div className="col-2 list-number">{num}.</div>
      <div className="col-4">
        <div className="name-container">{creator_id}</div>
      </div>
      <div className="col-3">{subscriber_id}</div>
      { reqVerdict === "PENDING" ? (
        <div className="col-3">
          <button className="list-btn" onClick={() => {
              sendVerdict(creator_id, subscriber_id, "ACCEPTED", setReqVerdict);
            }}>Approve</button>
          <button className="list-btn bg-red"onClick={() => {
              sendVerdict(creator_id, subscriber_id, "REJECTED", setReqVerdict);
            }}>Reject</button>
        </div>
        ) : (
          <div className="col-3">
            {reqVerdict}
          </div>
        )
      }
    </div>
  );
}
