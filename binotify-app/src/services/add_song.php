<?php

/*
Format post request
    - Judul : string
    - Penyanyi : string
    - Tanggal_terbit : string
    - Genre : string
    - album_id : integer
    - Music : file audio
    - Image_music : file image

Format response:
    status 401 (input error)
        - error
    status 500 (server error)
        - error
    status 200:
        - success
*/
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    
    // check if non file field is empty
    if(empty(trim($_POST['Judul'])) || empty(trim($_POST['Tanggal_terbit'])) || empty(trim($_POST['Genre'])) || empty($_POST['album_id'])){
        $response_err = ['error' => 'Field cannot be empty'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    // check if audio music file found
    if(empty($_FILES['Music']['name'])){
        $response_err = ['error' => 'Audio song is not found'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    // check if image music file found
    if(empty($_FILES['Image_music']['name'])){
        $response_err = ['error' => 'Image song is not found'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    $audio_filename = $_FILES['Music']['name'];

    // check if audio music is an audio file
    $path_info_audio = pathinfo($_FILES['Music']['name']);
    if($path_info_audio['extension'] != 'mp3'){
        $response_err = ['error' => 'Audio song is not an audio file'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    $image_filename = $_FILES['Image_music']['name'];

    // check if image music is an image file
    $image_mime = $_FILES['Image_music']['type'];
    if(!strstr($image_mime,'image/')){
        $response_err = ['error' => 'Image song is not an image file'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    // save audio and image music file
    $upload_dir = $_SERVER['DOCUMENT_ROOT'].'/static/uploads/';
    $now = getdate();
    $unique = strval($now['0']);
    $path_info_audio = pathinfo($_FILES['Music']['name']);
    $path_info_image = pathinfo($_FILES['Image_music']['name']);
    $audio_path = $upload_dir.$path_info_audio['filename'].'_'.$unique.'.'.$path_info_audio['extension'];
    $image_path = $upload_dir.$path_info_image['filename'].'_'.$unique.'.'.$path_info_image['extension'];

    move_uploaded_file($_FILES['Music']['tmp_name'], $audio_path);
    move_uploaded_file($_FILES['Image_music']['tmp_name'], $image_path);
    
    // count music audio duration
    require_once $_SERVER['DOCUMENT_ROOT'].'/lib/getid3/getid3.php';

    $getID3 = new getID3;
    $Duration = ceil($getID3->analyze($audio_path)['playtime_seconds']);
    
    // establish connection to db
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    $penyanyi = '';

    $get_album= 'SELECT "Penyanyi" FROM album WHERE album_id=$1;';
    if($prep = pg_prepare($dbconn,'get_album',$get_album)){
        $res = pg_execute($dbconn,'get_album', array($_POST['album_id']));
        if(!$res){
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
        }else{
                $cur_row = pg_fetch_array($res, 0, PGSQL_NUM);
                $penyanyi = $cur_row[0];
        }
    }else{
        $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
        echo json_encode($response_err);
    }


    $audio_path = $path_info_audio['filename'].'_'.$unique.'.'.$path_info_audio['extension'];
    $image_path = $path_info_image['filename'].'_'.$unique.'.'.$path_info_image['extension'];

    // insert song
    $sql_song = 'INSERT INTO Song ("Judul", "Penyanyi", "Tanggal_terbit", "Genre", "Duration", "Audio_path", "Image_path", "album_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

    if($prep = pg_prepare($dbconn,'insert_song',$sql_song)){
        $arr = array(trim($_POST['Judul']),trim($penyanyi),trim($_POST['Tanggal_terbit']),trim($_POST['Genre']),$Duration,$audio_path,$image_path,$_POST['album_id']);
        $res = pg_execute($dbconn,'insert_song',$arr);
        if(!$res){
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
            pg_close($dbconn);
            return;
        }
    }else{
        $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
        http_response_code(500);
        echo json_encode($response_err);
        pg_close($dbconn);
        return;
    }

    // update album Total_duration
    $sql_album = 'UPDATE album SET "Total_duration" = "Total_duration" + $1 WHERE album_id = $2';

    if($prep = pg_prepare($dbconn,'update_album',$sql_album)){
        $arr = array($Duration,$_POST['album_id']);
        $res = pg_execute($dbconn,'update_album',$arr);
        if(!$res){
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
            pg_close($dbconn);
            return;
        }
    }else{
        $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
        http_response_code(500);
        echo json_encode($response_err);
        pg_close($dbconn);
        return;
    }
    http_response_code(200);
    echo json_encode(['success' => 'Song is added succesfully']);
    pg_close($dbconn);
}


?>
