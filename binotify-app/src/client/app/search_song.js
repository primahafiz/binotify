import { BASE_URL } from "./utils/const.js";

const searchButton = document.querySelector("#btnSearch");

searchButton.addEventListener('click',function(){
    console.log('masuk')
    const query = document.getElementById('search').value
    window.location = `${BASE_URL}/search_result?query=${query}`
})