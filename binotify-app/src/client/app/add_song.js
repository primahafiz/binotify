import { BASE_URL } from "./utils/const.js";

// Load album list
window.onload = () => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/api/album?title_only=1`, true);
    xhr.send()
    xhr.onreadystatechange = () =>{
      if (xhr.readyState == 4 && xhr.status == 201) {
          let select = document.getElementById('album_id')
          let response = JSON.parse(xhr.responseText)['data']
          
          // set option value
          var opt;
          for (let i = 0; i < response.length; i++) {
              opt = document.createElement("option");
              opt.innerHTML = response[i]['Judul'];
              opt.value = response[i]['album_id'];
              select.appendChild(opt);
          }
      }
    }
  };

// Submit add song
const addSongForm = document.querySelector("#addSongForm");
addSongForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let btn = document.getElementById('submitBtn')
  btn.innerHTML = "<img src=\"../client/assets/loading_gif.gif\" class=\"loading_gif\">";
  
  const formData = new FormData(e.target);
  console.log(formData.get('Judul'));
  console.log(formData.get('Tanggal_terbit'));
  console.log(formData.get('album_id'));
  console.log(formData.get('Genre'));
  console.log(formData.get('Music'));
  console.log(formData.get('Image_music'));

  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/api/song/add`, true);
  xhr.send(formData);
  let formMsg = document.getElementById('formMsg')
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      addSongForm.reset();
      btn.innerHTML = "Submit"
      formMsg.innerHTML = 'Song successfully added'
      formMsg.classList.remove('text-error')
      formMsg.classList.add('text-success')
    } else if(xhr.readyState == 4 && xhr.status != 200){
      formMsg.classList.remove()
      btn.innerHTML = "Submit"
      formMsg.innerHTML = JSON.parse(xhr.responseText)["error"]
      formMsg.classList.remove('text-success')
      formMsg.classList.add('text-error')
    }
  }
});
