<?php

/* Format request:
    - Judul
    - Tanggal_terbit
    - Genre
    - is_image_change
    - Image_path
 */

if($_SERVER['REQUEST_METHOD'] == 'POST'){

    $params = get_params_url($_SERVER['REQUEST_URI']);

    $id = (int)$params; 

    if(empty(trim($_POST['Judul'])) || empty(trim($_POST['Tanggal_terbit'])) || empty(trim($_POST['Genre']))){
        $response_err = ['error' => 'Field cannot be empty'];
        http_response_code(401);
        echo json_encode($response_err);
        return;
    }

    // check if image music file found
    if(empty($_POST['is_image_change']) && isset($_FILES['Image_path'])){
        if(empty($_FILES['Image_path']['name'])){
            $response_err = ['error' => 'Image song is not found'];
            http_response_code(401);
            echo json_encode($response_err);
            return;
        }
    }

    // check if image music is an image file
    if(empty($_POST['is_image_change'])){
        $image_mime = $_FILES['Image_path']['type'];
        if(!strstr($image_mime,'image/')){
            $response_err = ['error' => 'Image song is not an image file'];
            http_response_code(401);
            echo json_encode($response_err);
            return;
        }
    }

    // establish connection to db
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    $sql_edit_property = 'UPDATE album SET "Judul" = $1, "Tanggal_terbit" = $2, "Genre" = $3 WHERE "album_id" = $4';

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

    if(empty($_POST['is_image_change'])){
        
        $upload_dir = $_SERVER['DOCUMENT_ROOT'].'/static/uploads/';
        $path_info_image = pathinfo($_FILES['Image_path']['name']);
        $now = getdate();
        $unique = strval($now['0']);
        $image_path = $upload_dir.$path_info_image['filename'].'_'.$unique.'.'.$path_info_image['extension'];
        move_uploaded_file($_FILES['Image_path']['tmp_name'], $image_path);
        
        $image_path = $path_info_image['filename'].'_'.$unique.'.'.$path_info_image['extension'];
        $sql_edit_img = 'UPDATE album SET "Image_path" = $1 WHERE "album_id" = $2';

        if($prep = pg_prepare($dbconn,'sql_edit_img',$sql_edit_img)){
            $arr = array($image_path,$id);
            $res = pg_execute($dbconn,'sql_edit_img',$arr);
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
    http_response_code(200);
    pg_close($dbconn);
}


?>