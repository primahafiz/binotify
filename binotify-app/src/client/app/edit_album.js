import { BASE_URL } from "./utils/const.js";

// Load album list
window.onload = () => {
    
    let url = window.location.href.split('/')
    let id = url[url.length-1]

    let xhr_detail = new XMLHttpRequest()
    xhr_detail.open("GET", `${BASE_URL}/api/album_details?id=${id}`, true);
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

  const isImageChangeInput = document.querySelector("#is_image_change")
  isImageChangeInput.addEventListener("change", () => {
    if(document.querySelector("#is_image_change").checked){
      document.getElementById('Image_path').disabled = true
    }else{
      document.getElementById('Image_path').disabled = false
    }
  });

// Submit edit album
const editAlbumForm = document.querySelector("#editAlbumForm");
editAlbumForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let url = window.location.href.split('/')
  let id = url[url.length-1]
  
  const formData = new FormData(e.target);
  console.log(formData.get('Judul'));
  console.log(formData.get('Tanggal_terbit'));
  console.log(formData.get('Genre'));
  console.log(formData.get('Image_path'));
  console.log(formData.get('is_image_change'));

  console.log(formData)

  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/api/album/edit/${id}`, true);
  // xhr.setRequestHeader("Content-type", 'x-www-form-urlencoded');
  // xhr.send(`Judul=${formData.get('Judul')}&Tanggal_terbit=${formData.get('Tanggal_terbit')}&Genre=${formData.get('Genre')}&is_image_change=${formData.get('is_image_change')}&Image_path=${formData.get('Image_path')}`);
  xhr.send(formData)
  let formMsg = document.getElementById('formMsg')
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        editAlbumForm.reset()
        formMsg.innerHTML = 'Song successfully edited'
        formMsg.classList.remove('text-error')
        formMsg.classList.add('text-success')
    } else if(xhr.readyState == 4 && xhr.status != 200){
        formMsg.classList.remove()
        console.log(xhr.responseText)
        formMsg.innerHTML = JSON.parse(xhr.responseText)["error"]
        formMsg.classList.remove('text-success')
        formMsg.classList.add('text-error')
    }
    document.getElementById('Image_path').disabled = false
  }
});
