import { BASE_URL } from "./utils/const.js";
import {addButtonListener, find_get_parameter} from "./utils/utils.js";
import {play_song} from "./player.js"

let role = 'not_logged_in';

// Get page_id param
let page_id = find_get_parameter("page");
if (page_id==null) page_id=1;
let query = find_get_parameter("query");

let username = null;
let email = null;

let xhr = new XMLHttpRequest();
xhr.open("POST", `${BASE_URL}/api/login`, false);
xhr.send(new FormData());
if (xhr.status != 200) {
  console.log("User has not logged in");
} else {
  let data = JSON.parse(xhr.responseText);
  username = data["username"];
  email = data["email"];
}

function display_details(arr){
    let picture = document.getElementById('list-picture');
    picture.src = 'static/uploads/' + arr['Image_path'];
    let title = document.getElementById('list-heading');
    let payload = arr['Judul'];
    payload = payload.concat('<br> <p id="list-subtitle"> ', arr['Penyanyi'],'</p>');
    title.innerHTML = payload;

    let play = document.getElementById('play-button');
    play.style.display = 'block';
    let newPlay = play.cloneNode(true);
    play.parentNode.replaceChild(newPlay, play);
    play = document.getElementById('play-button');
    play.addEventListener("click", () => play_song(arr, role));
    if(arr['Album_id']!=null){
        let album_link = document.getElementsByClassName('album-link')[0];
        album_link.style.display = 'block';
        let new_album_link = album_link.cloneNode(true);
        album_link.parentNode.replaceChild(new_album_link, album_link);
        album_link = document.getElementsByClassName('album-link')[0];
        album_link.addEventListener("click", () => {
            window.location.href = "".concat(`${BASE_URL}/album_songs?album_id=`, arr['Album_id']);
        });
    }
}

function render_page(responseText){
    let tbodyRef = document.getElementById('songs');
    let response = JSON.parse(responseText)['data'];
    for(let i=10; i>0; i--){
        if (tbodyRef.rows[i]!=null){
            tbodyRef.deleteRow(i);
        }
    } 
    // insert rows
    for (let i = 0; i < response.length; i++) {
        let row = tbodyRef.insertRow(-1);
        let cell_0 = row.insertCell(0);
        cell_0.innerHTML = `<img src="/static/uploads/${response[i]['Image_path']}" id=table-image />`;
        let cell_1 = row.insertCell(1);
        cell_1.innerHTML = response[i]['Judul'];
        let cell_2 = row.insertCell(2);
        cell_2.innerHTML = response[i]['Penyanyi'];
        let cell_3 = row.insertCell(3);
        cell_3.innerHTML = response[i]['Genre'];
        let cell_4 = row.insertCell(4);
        cell_4.innerHTML = response[i]['Tanggal_terbit'].substring(0,4);
        let rowRef = document.getElementById('songs').rows[i+1];
        rowRef.addEventListener("click", () => display_details(response[i]));
    }

    let picture = document.getElementById('list-picture');
    picture.src = 'client/assets/empty.png';
    let title = document.getElementById('list-heading');
    let payload = "Welcome to Spotify";
    title.innerHTML = payload;
    let details = document.getElementsByClassName('user-info')[0];
    payload = "";
    if (username != null){
      payload = payload.concat("<p> ", username, "</p> <br>");
      payload = payload.concat("<p> ", email, "</p> <br>");
      payload = payload.concat("<br> <a href='/api/logout'> Logout </p> <br>");
    }else{
      payload = payload.concat("<a href='/login'> Login </p> <br>");
      payload = payload.concat("<a href='/register'> Register </p> <br>");
    }
    
    details.style.display = 'block';
    details.innerHTML = payload;

    let album_link = document.getElementsByClassName('album-link')[0];
    album_link.style.display = 'none';
    let play = document.getElementById('play-button');
    play.style.display = 'none';
}

function ajax_req(){
    // get songs
    let xhr = new XMLHttpRequest();
    let sql_query = `${BASE_URL}/api/song_list?page=${page_id}`;
    if (query != null) sql_query = sql_query.concat(`&query=${query}`);
    console.log(sql_query);
    xhr.open("GET", sql_query, false);
    xhr.send()
    if (xhr.readyState == 4 && xhr.status == 201) {
        render_page(xhr.responseText)
        let data = JSON.parse(xhr.responseText);
        data['cur_page'] = parseInt(data['cur_page']);
        data['total_page'] = parseInt(data['total_page']);
        if (data['cur_page']>1){
            let prevButton = document.getElementById('prev-button');
            page_id = data['cur_page']-1;
            let newButton = prevButton.cloneNode(true);
            prevButton.parentNode.replaceChild(newButton, prevButton);
            prevButton = document.getElementById('prev-button');
            prevButton.addEventListener("click", () => {
                ajax_req();
            });
        }
        if (data['cur_page']<data['total_page']){
            let nextButton = document.getElementById('next-button');
            let newButton = nextButton.cloneNode(true);
            nextButton.parentNode.replaceChild(newButton, nextButton);
            nextButton = document.getElementById('next-button');
            page_id = data['cur_page']+1;
            nextButton.addEventListener("click", () => {
                ajax_req();
            });
        }
    } else if(xhr.readyState == 4 && xhr.status != 201){
        window.alert("page not found");
        window.location.href = `${BASE_URL}/home`;
    }
}

// Load album list
// show button if admin
let req = new XMLHttpRequest();
req.open("GET", `${BASE_URL}/api/role`, false);
req.send();
if (req.readyState == 4 && req.status == 200) {
    role = JSON.parse(req.responseText)['role'];
}

window.onload = () => {
    ajax_req()
};



/*
import { BASE_URL } from "./const.js";

const username = document.querySelector("#username");
const email = document.querySelector("#email");

let xhr = new XMLHttpRequest();
xhr.open("POST", `${BASE_URL}/api/login`, false);
xhr.send(new FormData());
if (xhr.status != 200) {
  console.log("User has not logged in");
} else {
  let data = JSON.parse(xhr.responseText);
  username.innerText = data["username"];
  email.innerText = data["email"];
}
*/