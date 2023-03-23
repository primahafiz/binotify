import { BASE_URL } from "./utils/const.js";
import {find_get_parameter} from "./utils/utils.js";
import {play_song} from "./player.js"

let role = 'not_logged_in';

// Get page_id param
let album_id = find_get_parameter("album_id");
if (album_id==null){
    window.alert("Album not found");
    window.location.href = `${BASE_URL}/home`;
} 
let page_id = 1;

function delete_album(){
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `${BASE_URL}/api/album/delete/${album_id}`, false);
    xhr.send()
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
        window.alert("album delete success");
        
    } else if(xhr.readyState == 4 && xhr.status != 200){
        console.log(xhr.responseText);
        window.alert("album delete failed");
    }
    window.location.href = `${BASE_URL}/home`;
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
    
    if (role == 'admin'){
        let edit = document.getElementsByClassName('edit-btn')[0];
        edit.style.display = 'block';
        let new_edit = edit.cloneNode(true);
        edit.parentNode.replaceChild(new_edit, edit);
        edit = document.getElementsByClassName('edit-btn')[0];
        edit.addEventListener("click", () => {
            window.location.href = "".concat(`${BASE_URL}/edit_song/`, arr['Song_id']);
        });
        let del = document.getElementsByClassName('delete-btn')[0];
        del.style.display = 'block';
        let new_del = del.cloneNode(true);
        del.parentNode.replaceChild(new_del, del);
        del = document.getElementsByClassName('delete-btn')[0];
        del.addEventListener("click", () => {
            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", `${BASE_URL}/api/song/delete/${arr['Song_id']}`, false);
            xhr.send()
            if (xhr.readyState == 4 && xhr.status == 200) {
                window.alert("delete success");
                ajax_req();
                
            } else if(xhr.readyState == 4 && xhr.status != 200){
                window.alert("delete failed");
                ajax_req();
            }
        });
    }

    let details = document.getElementsByClassName('detail-info')[0];
    payload = "";
    payload = payload.concat("<p> Judul: ", arr['Judul'], "</p> <br>");
    payload = payload.concat("<p> Penyanyi: ", arr['Penyanyi'], "</p> <br>");
    payload = payload.concat("<p> Tanggal terbit: ", arr['Tanggal_terbit'], "</p> <br>");
    payload = payload.concat("<p> Genre: ", arr['Genre'], "</p> <br>");
    let time = new Date(parseInt(arr['Duration']) * 1000).toISOString().substr(14,5);
    payload = payload.concat("<p> Durasi: ", time, "</p> <br>");
    details.style.display = 'block';
    details.innerHTML = payload;
    
}

function display_album_details(arr){
    let picture = document.getElementById('list-picture');
    picture.src = 'static/uploads/' + arr['Image_path'];
    let title = document.getElementById('list-heading');
    let payload = arr['Judul'];
    payload = payload.concat('<br> <p id="list-subtitle"> ', arr['Penyanyi'],'</p>');
    title.innerHTML = payload;

    let play = document.getElementById('play-button');
    play.style.display = 'none';
    if (role == 'admin'){
        let edit = document.getElementsByClassName('edit-btn')[0];
        edit.style.display = 'block';
        edit.addEventListener("click", () => {
            window.location.href = `${BASE_URL}/edit_album/${album_id}`;
        })
        let del = document.getElementsByClassName('delete-btn')[0];
        del.style.display = 'block';
        del.addEventListener("click", delete_album);
    }

    let details = document.getElementsByClassName('detail-info')[0];
    payload = "";
    payload = payload.concat("<p> Judul: ", arr['Judul'], "</p> <br>");
    payload = payload.concat("<p> Penyanyi: ", arr['Penyanyi'], "</p> <br>");
    payload = payload.concat("<p> Tanggal terbit: ", arr['Tanggal_terbit'], "</p> <br>");
    payload = payload.concat("<p> Genre: ", arr['Genre'], "</p> <br>");
    let time = new Date(parseInt(arr['Total_duration']) * 1000).toISOString()
    payload = payload.concat("<p> Total Durasi: ", time.substr(14, 5), "</p> <br>");
    details.style.display = 'block';
    details.innerHTML = payload;
    
}

function render_page(responseText){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/api/album_details?page=${page_id}&id=${album_id}`, false);
    xhr.send()
    if (xhr.readyState == 4 && xhr.status == 201) {
        let data = JSON.parse(xhr.responseText);
        let picture = document.getElementById('list-picture');
        picture.src = 'static/uploads/'+data['Image_path'];
        let title = document.getElementById('list-heading');
        let payload = data['Judul'];
        title.innerHTML = payload;
        let details = document.getElementsByClassName('detail-info')[0];
        details.style.display = 'block';
        details.innerHTML = data['Penyanyi'];
        display_album_details(data);
    }

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
        let cell_1 = row.insertCell(0);
        cell_1.innerHTML = response[i]['Judul'];
        let cell_2 = row.insertCell(1);
        cell_2.innerHTML = response[i]['Penyanyi'];
        let cell_3 = row.insertCell(2);
        cell_3.innerHTML = response[i]['Genre'];
        let cell_4 = row.insertCell(3);
        cell_4.innerHTML = response[i]['Tanggal_terbit'].substring(0,4);
        let rowRef = document.getElementById('songs').rows[i+1];
        rowRef.addEventListener("click", () => display_details(response[i]));
    }
}

function ajax_req(){
    // get songs
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/api/song_list?page=${page_id}&album_id=${album_id}`, false);
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
            page_id = data['cur_page']+1;
            let newButton = nextButton.cloneNode(true);
            nextButton.parentNode.replaceChild(newButton, nextButton);
            nextButton = document.getElementById('next-button');
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
window.onload = () => {
    let req = new XMLHttpRequest();
    req.open("GET", `${BASE_URL}/api/role`, false);
    req.send();
    if (req.readyState == 4 && req.status == 200) {
        role = JSON.parse(req.responseText)['role'];
    }

    ajax_req()
};

