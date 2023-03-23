import { BASE_URL } from "./utils/const.js";

// Submit add album
const addAlbumForm = document.querySelector("#addAlbumForm");
addAlbumForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let btn = document.getElementById('submitBtn')
  btn.innerHTML = "<img src=\"../client/assets/loading_gif.gif\" class=\"loading_gif\">";

  const formData = new FormData(e.target);
  console.log(formData.get('Judul'));
  console.log(formData.get('Penyanyi'));
  console.log(formData.get('Tanggal_terbit'));
  console.log(formData.get('Genre'));
  console.log(formData.get('Image'));

  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/api/album/add`, true);
  xhr.send(formData);
  let formMsg = document.getElementById('formMsg')
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        addAlbumForm.reset();
        btn.innerHTML = "Submit"
        formMsg.innerHTML = 'Album successfully added'
        formMsg.classList.remove('text-error')
        formMsg.classList.add('text-success')
    } else if(xhr.readyState == 4 && xhr.status != 200){
        formMsg.classList.remove()
        btn.innerHTML = "Submit";
        formMsg.innerHTML = JSON.parse(xhr.responseText)["error"]
        console.log(JSON.parse(xhr.responseText)["error"])
        formMsg.classList.remove('text-success')
        formMsg.classList.add('text-error')
    }
  }
});
