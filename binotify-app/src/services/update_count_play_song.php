<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    if(isset($_SESSION['count_play_song'])){
        http_response_code(200);
        $_SESSION['count_play_song'] += 1;
        echo json_encode(['count' => $_SESSION['count_play_song']]);
    }else{
        // case user is authenticated user -> can play infinite song
        if (isset($_SESSION['is_login']) && $_SESSION['is_login'] === true){
            http_response_code(200);
            echo json_encode(['count' => 0]);
        }
        // case user is not an authenticated user and not already logged in -> set session
        else{
            $_SESSION['count_play_song'] = 0;
            http_response_code(200);
            echo json_encode(['count' => 0]);
        }
    }
}

?>