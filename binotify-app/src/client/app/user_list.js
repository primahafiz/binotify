import { BASE_URL } from "./utils/const.js";
import {find_get_parameter} from "./utils/utils.js";
import {play_song} from "./player.js"

let role = 'not_logged_in';

// Get page_id param
let page_id = find_get_parameter("page");
if (page_id==null) page_id=1;

function render_page(responseText){
    let tbodyRef = document.getElementById('songs');
    let response = JSON.parse(responseText)['data'];
    // insert rows
    for (let i = 0; i < response.length; i++) {
        let row = tbodyRef.insertRow(-1);
        let cell_1 = row.insertCell(0);
        cell_1.innerHTML = response[i]['username'];
        let cell_2 = row.insertCell(1);
        cell_2.innerHTML = response[i]['email'];
    }

    let title = document.getElementById('list-heading');
    let payload = "User List";
    title.innerHTML = payload;

}

function ajax_req(){
    // get songs
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/api/user_list?page=${page_id}`, false);
    xhr.send()
    if (xhr.readyState == 4 && xhr.status == 201) {
        render_page(xhr.responseText)
        let data = JSON.parse(xhr.responseText);
        data['cur_page'] = parseInt(data['cur_page']);
        data['total_page'] = parseInt(data['total_page']);
        if (data['cur_page']>1){
            let prevButton = document.getElementById('prev-button');
            let newButton = prevButton.cloneNode(true);
            prevButton.parentNode.replaceChild(newButton, prevButton);
            prevButton = document.getElementById('prevButton');
            page_id = data['cur_page']-1;
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

window.onload = () => {
    let req = new XMLHttpRequest();
    req.open("GET", `${BASE_URL}/api/role`, false);
    req.send();
    if (req.readyState == 4 && req.status == 200) {
        role = JSON.parse(req.responseText)['role'];
    }
    console.log(role)
    if (role != 'admin'){
        alert("Admin only!");
        window.location.href = `${BASE_URL}/home`;
    }
    ajax_req()
};

