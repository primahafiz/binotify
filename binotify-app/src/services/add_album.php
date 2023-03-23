<?php

/*
Format post request
    - Judul : string
    - Penyanyi : string
    - Tanggal_terbit : string
    - Genre : string
    - Image : file

Format response:
    status 401 (input error)
        - error
    status 500 (server error)
        - error
    status 200:
        - success
*/


if($_SERVER['REQUEST_METHOD'] == 'POST'){

    // empty checking
    if(empty(trim($_POST['Judul'])) || empty(trim($_POST['Penyanyi'])) || empty(trim($_POST['Tanggal_terbit'])) || empty(trim($_POST['Genre']))){
        $response_err = ['error' => 'Field cannot be empty'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    // empty checking for file
    if(!isset($_FILES['Image'])){
        $response_err = ['error' => 'Image song is not found'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    // check if image album is an image file
    $image_mime = $_FILES['Image']['type'];
    if(!strstr($image_mime,'image/')){
        $response_err = ['error' => 'Image album is not an image file'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    // save image file
    $upload_dir = $_SERVER['DOCUMENT_ROOT'].'/static/uploads/';
    $now = getdate();
    $unique = strval($now['0']);

    $path_info_image = pathinfo($_FILES['Image']['name']);
    $image_path = $upload_dir.$path_info_image['filename'].'_'.$unique.'.'.$path_info_image['extension'];

    move_uploaded_file($_FILES['Image']['tmp_name'], $image_path);

    // establish connection to db
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    // insert to album database
    $sql = 'INSERT INTO Album ("Judul", "Penyanyi", "Total_duration", "Image_path", "Tanggal_terbit", "Genre") VALUES ($1, $2, $3, $4, $5, $6)';

    if($prep = pg_prepare($dbconn,'insert_album',$sql)){
        $image_path = $path_info_image['filename'].'_'.$unique.'.'.$path_info_image['extension'];
        $arr = array(trim($_POST['Judul']),trim($_POST['Penyanyi']),0,$image_path,trim($_POST['Tanggal_terbit']),trim($_POST['Genre']));
        if($res = pg_execute($dbconn,'insert_album',$arr)){
            http_response_code(200);
            echo json_encode(['success' => 'Album is added succesfully']);
            pg_close($dbconn);
        }else{
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
        }
    }else{
        $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
        http_response_code(500);
        echo json_encode($response_err);
    }

}


?>