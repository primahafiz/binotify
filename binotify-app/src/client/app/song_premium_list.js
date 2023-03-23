import { BASE_URL } from "./utils/const.js";
import { play_song } from "./player.js";

let role = 'not_logged_in';

function render_page(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // init request
    let xhr = new XMLHttpRequest()
    xhr.open("GET", `${BASE_URL}/api/song_premium_list?penyanyi_id=${urlParams.get('penyanyi_id')}`, true)
    xhr.send()
    console.log('masuk')

    xhr.onreadystatechange = () =>{
        console.log(xhr.readyState+' '+xhr.status)
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.readyState+" "+xhr.s)
            let response = JSON.parse(xhr.responseText)
            // let payload = '';
            var container = document.getElementById('song-premiums')
            document.getElementsByTagName('h1')[0].innerHTML += response['penyanyi_name']
            for(let i=0;i<response['data'].length;i++){
                var tr = document.createElement('tr')

                var td1 = document.createElement('td')
                td1.innerHTML = response['data'][i]['Judul'];

                var td2 = document.createElement('td')

                var td3 = document.createElement('td')

                var inp = document.createElement('input');
                inp.className = 'play-button'
                inp.setAttribute('type','image')
                inp.setAttribute('src', 'client/assets/play_white.png')
                inp.addEventListener("click", () => play_song(response['data'][i], 'user'));
                

                td3.appendChild(inp)

                tr.appendChild(td1)
                tr.appendChild(td2)
                tr.appendChild(td3)

                container.appendChild(tr)
            }
        }else if(xhr.readyState == 4){
            window.alert('Your subscription is not valid')
            window.location.href = `${BASE_URL}/singer_list`
        }
    }
}

window.onload = () => {
    render_page()
}