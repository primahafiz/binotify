<?php

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    http_response_code(200);
    if(!isset($_SESSION['is_login'])){
        $response = ['role' => 'not_logged_in'];
        echo json_encode($response);
    }else if(!$_SESSION['is_admin']){
        $response = ['role' => 'user'];
        echo json_encode($response);
    }else{
        $response = ['role' => 'admin'];
        echo json_encode($response);
    }
}

?>