import { BASE_URL } from "./utils/const.js";

var page

function updateAlbumList(){
    let gridMain = document.getElementById('grid-main')
    gridMain.innerHTML = "<p>Loading....</p>"

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/api/album?page=${page}`, true);
    xhr.send()

    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4 && xhr.status == 201) {
            console.log(parseInt(JSON.parse(xhr.responseText)['cur_page']))

            let response = JSON.parse(xhr.responseText)['data']

            if(parseInt(JSON.parse(xhr.responseText)['total_page']) == parseInt(page)){
                document.getElementById('next-button').disabled = true
            }else{
                document.getElementById('next-button').disabled = false
            }
            if(parseInt(JSON.parse(xhr.responseText)['cur_page']) == 1){
                document.getElementById('prev-button').disabled = true
            }else{
                document.getElementById('prev-button').disabled = false
            }
            
            // set option value
            var grid;

            gridMain.innerHTML = '';

            for (let i = 0; i < response.length; i++) {
                // development only
                if(response[i]['album_id']<6)continue

                // janlup add href
                grid = `<a href="/album_songs?album_id=${response[i]['album_id']}" class="grid-item"><img src="/static/uploads/${response[i]['Image_path']}" class="img-album" alt=""><h3>${response[i]['Judul']}</h3><p>By ${response[i]['Penyanyi']}</p><p>${parseInt(response[i]['Tanggal_terbit'])}</p><p>${response[i]['Genre']}</p></a>`
                
                gridMain.innerHTML += grid
            }
        }
      }
}

window.onload = () => {
    page = 1

    updateAlbumList()
}

const nextButton = document.querySelector("#next-button");

nextButton.addEventListener('click', function(){
    page++
    updateAlbumList()
})


const prevButton = document.querySelector("#prev-button");

prevButton.addEventListener('click', function(){
    page--
    updateAlbumList()
})