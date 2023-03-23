import { BASE_URL } from "./utils/const.js";
export function play_song(arr, role){
    console.log(arr)
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/api/count_play_song/get`, false);
    xhr.send();
    if (xhr.readyState == 4 && xhr.status == 200) {
        let data = JSON.parse(xhr.responseText);
        let count = parseInt(data['count']);
        console.log('count = ')
        console.log(data['count'])
        console.log(role)
        if (count>=3 && role =='not_logged_in'){
            window.alert("Daily limit reached. Please register or login!");
            window.location.href = `${BASE_URL}/home`;
        } else{
            let up = new XMLHttpRequest()
            up.open("POST", `${BASE_URL}/api/count_play_song/update`, true);
            up.send();
        }
    } else if(xhr.readyState == 4 && xhr.status != 200){
        window.alert("internal server error");
        window.location.href = `${BASE_URL}/home`;
    }

    let footer = document.getElementsByClassName('footer')[0];
    footer.style.display = 'table-row';
    let picture = document.getElementById('song-picture');
    if(arr['Image_path'] == null){
        picture.src = 'client/assets/empty.png';
    }else{
        picture.src = 'static/uploads/' + arr['Image_path'];
    }
    let title = document.getElementById('song-title');
    title.innerText = arr['Judul'];
    let artist = document.getElementById('song-artist');
    if(arr['Penyanyi']){
        artist.innerText = arr['Penyanyi'];
    }else{
        artist.innerText = '';
    }
    let button = document.getElementById('song-control');
    let control = document.getElementById('song-audio');
    let song = document.getElementById('song-path');
    if(arr['audio_path']){
        song.src = `http://localhost:8081/api/songblob?audioPath=${arr['audio_path']}`;
    }else{
        song.src = 'static/uploads/' + arr['Audio_path'];
    }
    //song.src = 'static/uploads/test.mp3';
    button.src = 'client/assets/pause.png';
    control.load();
    control.play();
    let newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    button = document.getElementById('song-control');
    button.addEventListener("click", () => {
        console.log("CALL")
        let button = document.getElementById('song-control');
        let control = document.getElementById('song-audio');
        if(!control.paused){
            control.pause();
            button.src = 'client/assets/play.png';

        }else{
            control.play();
            button.src = 'client/assets/pause.png';
        }
    })
}