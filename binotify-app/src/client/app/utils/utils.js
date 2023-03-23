import { BASE_URL } from "./const.js";

export function find_get_parameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

export function addButtonListener(query, relLink) {
  const button = document.querySelector(query);
  try {
    button.addEventListener("click", () => {
      window.location.href = `${BASE_URL}/${relLink}`;
    });
  } catch (e) {
    console.log(e);
  }
}
