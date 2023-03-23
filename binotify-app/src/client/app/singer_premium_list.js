import { BASE_URL } from "./utils/const.js";

var currentData = []

function subscribe_singer(id){
    const formdata = new FormData()
    formdata.append('creator_id',id)
    formdata.append('status','PENDING')

    let xhr = new XMLHttpRequest()
    xhr.open("POST", `${BASE_URL}/api/song_premium/add`, true)
    xhr.send(formdata)

    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.alert('Subscription request successfully sent');
            window.location.reload()
        }else if(xhr.readyState == 4){
            window.alert('You already made subscription request to this singer');
        }
    }
}

function pollingSubscriptionStatus(){
    let xhr = new XMLHttpRequest()
    xhr.open("GET", `${BASE_URL}/api/singer_premium_list`, true)
    xhr.send()

    console.log('polling')

    xhr.onreadystatechange = () =>{
        console.log(xhr.readyState+' '+xhr.status)
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)['data']
            for(let i=0;i<currentData.length;i++){
                for(let j=0;j<response.length;j++){
                    if(currentData[i]['penyanyi_id']==response[j]['penyanyi_id']){
                        if(currentData[i]['is_subscribed']!=response[j]['is_subscribed']){
                            window.alert('Need to reload because there is new subscription request accepted')
                            window.location.reload()
                            return
                        }
                        break
                    }
                }
            }
        }
    }

}

function view_song(id){
    console.log('view song '+id)
    window.location.href =  `${BASE_URL}/song_premium_list?penyanyi_id=${id}`
}
function render_page(){
    // init request
    let xhr = new XMLHttpRequest()
    xhr.open("GET", `${BASE_URL}/api/singer_premium_list`, true)
    xhr.send()

    xhr.onreadystatechange = () =>{
        console.log(xhr.readyState+' '+xhr.status)
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)['data']
            currentData = response
            var container = document.getElementById('singers')
            for(let i=0;i<response.length;i++){
                var tr = document.createElement('tr')

                var td1 = document.createElement('td')
                td1.innerHTML = response[i]['name'];

                var td2 = document.createElement('td')

                var td3 = document.createElement('td')

                var button = document.createElement("button");
                if(response[i]['is_subscribed']){
                    button.innerHTML = 'View Song';
                    button.className = 'btn btn-subs';
                    button.addEventListener('click',function(e){
                        view_song(response[i]['penyanyi_id'])
                    })
                }else{
                    button.innerHTML = 'Subscribe'
                    button.className = 'btn btn-subs'
                    button.addEventListener('click',function(e){
                        subscribe_singer(response[i]['penyanyi_id'])
                    })
                }

                td3.appendChild(button)

                tr.appendChild(td1)
                tr.appendChild(td2)
                tr.appendChild(td3)

                container.appendChild(tr)
            }
        }
    }
}

window.onload = () => {
    render_page()
    setInterval(pollingSubscriptionStatus,20000)
}