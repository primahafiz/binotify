<?php

/*
Format post request
    - Judul : string
    - Penyanyi : string
    - Tanggal_terbit : string
    - Genre : string
    - album_id : integer
    - is_music_change : boolean
    - Music : file audio
    - is_image_change : boolean
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

    $params = get_params_url($_SERVER['REQUEST_URI']);

    $id = (int)$params; 
    
    // check if non file field is empty
    if(empty(trim($_POST['Judul'])) || empty(trim($_POST['Tanggal_terbit'])) || empty(trim($_POST['Genre']))){ 
        $response_err = ['error' => 'Field cannot be empty'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    // check if audio music file found
    if(empty($_POST['is_music_change']) && isset($_FILES['Music'])){
        if(empty($_FILES['Music']['name'])){
            $response_err = ['error' => 'Audio song is not found'];
            http_response_code(401);
            echo json_encode($response_err);
            return;
        }
    }

    // check if image music file found
    if(empty($_POST['is_image_change']) && isset($_FILES['Image_music'])){
        if(empty($_FILES['Image_music']['name'])){
            $response_err = ['error' => 'Image song is not found'];
            http_response_code(401);
            echo json_encode($response_err);
            return;
        }
    }


    // check if audio music is an audio file
    if(empty($_POST['is_music_change'])){
        $path_info_audio = pathinfo($_FILES['Music']['name']);
        if($path_info_audio['extension'] != 'mp3'){
            $response_err = ['error' => 'Audio song is not an audio file'];
            http_response_code(401);
            echo json_encode($response_err);
            return;
        }
    }


    // check if image music is an image file
    if(empty($_POST['is_image_change'])){
        $image_mime = $_FILES['Image_music']['type'];
        if(!strstr($image_mime,'image/')){
            $response_err = ['error' => 'Image song is not an image file'];
            http_response_code(401);
            echo json_encode($response_err);
            return;
        }
    }

    // establish connection to db
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    $sql_edit_property = 'UPDATE song SET "Judul" = $1, "Tanggal_terbit" = $2, "Genre" = $3 WHERE "song_id" = $4';

    if($prep = pg_prepare($dbconn,'edit_property',$sql_edit_property)){
        $arr = array(trim($_POST['Judul']),trim($_POST['Tanggal_terbit']),trim($_POST['Genre']),$id);
        $res = pg_execute($dbconn,'edit_property',$arr);
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

    // save audio and image music file
    $upload_dir = $_SERVER['DOCUMENT_ROOT'].'/static/uploads/';
    $now = getdate();
    $unique = strval($now['0']);

    if(empty($_POST['is_music_change'])){
        $path_info_audio = pathinfo($_FILES['Music']['name']);
        $audio_path = $upload_dir.$path_info_audio['filename'].'_'.$unique.'.'.$path_info_audio['extension'];
        move_uploaded_file($_FILES['Music']['tmp_name'], $audio_path);

        // count music audio duration
        require_once $_SERVER['DOCUMENT_ROOT'].'/lib/getid3/getid3.php';

        $getID3 = new getID3;
        $Duration = ceil($getID3->analyze($audio_path)['playtime_seconds']);

        $audio_path = $path_info_audio['filename'].'_'.$unique.'.'.$path_info_audio['extension'];
        
        // update album Total_duration

        $sql_get_duration = 'SELECT "Duration" FROM song where "song_id" = $1';
        $last_duration = 0;

        if($prep = pg_prepare($dbconn,'get_duration',$sql_get_duration)){
            $arr = array($id);
            if($res = pg_execute($dbconn,'get_duration',$arr)){
                $data = pg_fetch_array($res, 0, PGSQL_NUM);
                $last_duration = (int)$data[0];
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


        $sql_album = 'UPDATE album SET "Total_duration" = "Total_duration" + $1 WHERE album_id = $2';

        if($prep = pg_prepare($dbconn,'update_album',$sql_album)){
            $arr = array($Duration-$last_duration,$_POST['album_id']);
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

        // update audio file
        $sql_update_audio = 'UPDATE song SET "Audio_path" = $1, "Duration" = $2 WHERE song_id = $3';
        if($prep = pg_prepare($dbconn,'update_audio',$sql_update_audio)){
            $arr = array($audio_path,$Duration,$id);
            $res = pg_execute($dbconn,'update_audio',$arr);
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

    }

    if(empty($_POST['is_image_change'])){
        $path_info_image = pathinfo($_FILES['Image_music']['name']);
        $image_path = $upload_dir.$path_info_image['filename'].'_'.$unique.'.'.$path_info_image['extension'];
        move_uploaded_file($_FILES['Image_music']['tmp_name'], $image_path);

        $image_path = $path_info_image['filename'].'_'.$unique.'.'.$path_info_image['extension'];

        // update image to database
        $sql_update_image = 'UPDATE song SET "Image_path" = $1 WHERE song_id = $2';
        if($prep = pg_prepare($dbconn,'update_image',$sql_update_image)){
            $arr = array($image_path,$id);
            $res = pg_execute($dbconn,'update_image',$arr);
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

}


?>