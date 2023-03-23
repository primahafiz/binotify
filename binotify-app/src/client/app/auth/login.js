import { BASE_URL } from "../utils/const.js";
import { addButtonListener } from "../utils/utils.js";
import { enableEmptyWarning, submitListeners } from "./common.js";

// Check if not login
window.onload = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/api/login`, false);
  xhr.send(new FormData());
  if (xhr.status == 200) {
    // window.location.href = `${BASE_URL}/home`;
    console.log("User has logged in");
  }
};

// Login
function postLogin(target) {
  const formData = new FormData(target);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/api/login`, false);
  xhr.send(formData);

  if (xhr.status != 200) {
    console.log(JSON.parse(xhr.responseText)["error"]);
  } else {
    window.location.href = `${BASE_URL}/home`;
  }
}

// Submit
const loginForm = document.querySelector(".auth-form");
submitListeners(loginForm, postLogin);

// Warnings
enableEmptyWarning(
  "#required-id",
  "Please enter your Spotify username or email address."
);
enableEmptyWarning("#required-pass", "Please enter your password.");

// Buttons
addButtonListener(".reg-btn", "register");
