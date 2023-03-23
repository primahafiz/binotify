import { BASE_URL } from "../utils/const.js";
import { addButtonListener } from "../utils/utils.js";
import {
  enableEmptyWarning,
  makeWarningText,
  submitListeners,
} from "./common.js";

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

// Register
function postRegister(target) {
  const formData = new FormData(target);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/api/register`, false);
  xhr.send(formData);

  if (xhr.status != 200) {
    console.log(JSON.parse(xhr.responseText)["error"]);
  } else {
    window.location.href = `${BASE_URL}/login`;
  }
}

// Submit
const regForm = document.querySelector(".auth-form");
submitListeners(regForm, postRegister);

// Unique warning
function checkUnique(field, idField, message) {
  const uniqueField = document.querySelector(idField);
  uniqueField.querySelector(".field").addEventListener("focusout", (e) => {
    if (e.target.value != "") {
      const formData = new FormData();
      formData.append(field, e.target.value);

      let xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE_URL}/api/check/${field}`, true);
      xhr.send(formData);

      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          const response = JSON.parse(xhr.responseText);
          if (
            uniqueField.querySelector(".text-warning") == null &&
            !response["is_available"]
          ) {
            const warning = makeWarningText(message);
            uniqueField.appendChild(warning);
            uniqueField
              .querySelector(".field")
              .classList.add("box-shadow-warning");
          } else if (uniqueField.querySelector(".text-warning") != null) {
            uniqueField.querySelector(".text-warning").remove();
            uniqueField
              .querySelector(".field")
              .classList.remove("box-shadow-warning");
          }
        }
      };
    }
  });
}

checkUnique("email", "#required-email", "Email is already in use");
checkUnique("username", "#required-username", "Username is already in use");

// Empty warning
enableEmptyWarning("#required-email", "You need to enter your email.");
enableEmptyWarning(
  "#required-username",
  "You need to enter username for your profile."
);
enableEmptyWarning("#required-pass", "You need to enter your password.");
enableEmptyWarning(
  "#required-retype-pass",
  "You need to retype your password."
);

// Buttons
addButtonListener(".login-btn", "login");
