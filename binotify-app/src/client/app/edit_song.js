import { BASE_URL } from "./utils/const.js";

// Load album list
window.onload = () => {
    
    let url = window.location.href.split('/')
    let id = url[url.length-1]

    let xhr_detail = new XMLHttpRequest()
    xhr_detail.open("GET", `${BASE_URL}/api/song_details?id=${id}`, true);
    xhr_detail.send()

    xhr_detail.onreadystatechange = () =>{
        if (xhr_detail.readyState == 4 && xhr_detail.status == 201) {
            let response = JSON.parse(xhr_detail.responseText)
            console.log(response)
            
            // set input value
            document.getElementById('Judul').value = response['Judul']
            document.getElementById('Tanggal_terbit').value = response['Tanggal_terbit']
            document.getElementById('Genre').value = response['Genre']
        }
      }
  };

  const isMusicChangeInput = document.querySelector("#is_music_change")
isMusicChangeInput.addEventListener("change", () => {
  if(document.querySelector("#is_music_change").checked){
    document.getElementById('Music').disabled = true
  }else{
    document.getElementById('Music').disabled = false
  }
});

const isImageChangeInput = document.querySelector("#is_image_change")
isImageChangeInput.addEventListener("change", () => {
  if(document.querySelector("#is_image_change").checked){
    document.getElementById('Image_music').disabled = true
  }else{
    document.getElementById('Image_music').disabled = false
  }
});


// Submit edit song
const editSongForm = document.querySelector("#editSongForm");
editSongForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let url = window.location.href.split('/')
  let id = url[url.length-1]


  let btn = document.getElementById('submitBtn')
  btn.innerHTML = "<img src=\"../client/assets/loading_gif.gif\" class=\"loading_gif\">";
  
  const formData = new FormData(e.target);
  console.log(formData.get('Judul'));
  console.log(formData.get('Penyanyi'));
  console.log(formData.get('Tanggal_terbit'));
  console.log(formData.get('album_id'));
  console.log(formData.get('Genre'));
  console.log(formData.get('Music'));
  console.log(formData.get('is_image_change'));

  console.log(formData)

  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/api/song/edit/${id}`, true);
  // xhr.setRequestHeader("Content-type", 'x-www-form-urlencoded');
  // xhr.send(`Judul=${formData.get('Judul')}&Tanggal_terbit=${formData.get('Tanggal_terbit')}&Genre=${formData.get('Genre')}&Music=${formData.get('Music')}&is_music_change=${formData.get('is_music_change')}&is_image_change=${formData.get('is_image_change')}&Music=${formData.get('Music')}&Image_music=${formData.get('Image_music')}`);
  xhr.send(formData)
  let formMsg = document.getElementById('formMsg')
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        editSongForm.reset();
        btn.innerHTML = "Submit"
        formMsg.innerHTML = 'Song successfully edited'
        formMsg.classList.remove('text-error')
        formMsg.classList.add('text-success')
    } else if(xhr.readyState == 4 && xhr.status != 200){
        formMsg.classList.remove()
        btn.innerHTML = "Submit"
        formMsg.innerHTML = JSON.parse(xhr.responseText)["error"]
        formMsg.classList.remove('text-success')
        formMsg.classList.add('text-error')
    }
    document.getElementById('Music').disabled = false
    document.getElementById('Image_music').disabled = false
  }
});
