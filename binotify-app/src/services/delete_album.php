<?php

require_once $_SERVER['DOCUMENT_ROOT'].'/utils/parse_url.php';

if($_SERVER['REQUEST_METHOD'] == 'DELETE'){
    $params = get_params_url($_SERVER['REQUEST_URI']);

    $id = (int)$params;

    // Delete album by id
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    $sql_song = 'DELETE FROM song WHERE album_id=$1';

    if($prep = pg_prepare($dbconn,'delete_song',$sql_song)){
        $arr = array($id);
        if($res = pg_execute($dbconn,'delete_song',$arr)){
            $sql_album = 'DELETE FROM album WHERE album_id=$1';
            if($prep = pg_prepare($dbconn,'delete_album',$sql_album)){
                if($res = pg_execute($dbconn,'delete_album',$arr)){
                    http_response_code(200);
                    echo json_encode(['success' => 'Album is deleted succesfully']);
                }else{
                    $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
                    http_response_code(500);
                    echo json_encode($response_err);
                }
            }else{
                $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
                http_response_code(500);
                echo json_encode($response_err);
            }
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

    pg_close($dbconn);
}



?>