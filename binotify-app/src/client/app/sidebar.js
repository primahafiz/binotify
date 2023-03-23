import { addButtonListener } from "./utils/utils.js";

addButtonListener(".home-btn", "home");
addButtonListener(".search-btn", "search");
addButtonListener(".song-btn", "song_list");
addButtonListener(".album-btn", "album_list");
addButtonListener(".singer-btn", "singer_list");
addButtonListener(".add-song-btn", "add_song");
addButtonListener(".add-album-btn", "add_album");
addButtonListener(".user-list-btn", "user_list");

const bars = document.querySelector(".bars");
const sidebar = document.querySelector(".sidebar-box");
bars.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-active");
  bars.classList.toggle("fa-bars");
  bars.classList.toggle("fa-times");
});
