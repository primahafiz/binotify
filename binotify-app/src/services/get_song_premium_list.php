<?php

/*
Format get request
    - penyanyi_id : int
Format response:
    status 200:
        - data : list of song
            - song_id : int
            - Judul : string
            - Audio_path : string
*/

$rest_host = 'localhost';
$rest_port = 8081;

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    
    $context = stream_context_create(['http' => ['ignore_errors' => true]]);
    $response = file_get_contents('http://'.$rest_host.':'.$rest_port.'/'.'api/songuser?user_id='.$_SESSION['user_id'].'&'.'penyanyi_id='.$_GET['penyanyi_id'], false, $context);
    
    $status_line = $http_response_header[0];
    preg_match('{HTTP\/\S*\s(\d{3})}', $status_line, $match);
    $status = $match[1];
    
    if($status == '200'){
        http_response_code(200);
    }else{
        http_response_code(400);
    }

    echo $response;
}

?>