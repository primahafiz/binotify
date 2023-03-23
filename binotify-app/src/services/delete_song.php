<?php


require_once $_SERVER['DOCUMENT_ROOT'].'/utils/parse_url.php';

if($_SERVER['REQUEST_METHOD'] == 'DELETE'){
    $id = get_params_url($_SERVER['REQUEST_URI']);

    // Get duration
    $sql_get_duration = 'SELECT "Duration", album_id FROM song where song_id = $1';
    $Duration = 0;
    $album_id = 0;

    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';
    if($prep = pg_prepare($dbconn,'get_duration',$sql_get_duration)){
        $arr = array($id);
        if($res = pg_execute($dbconn,'get_duration',$arr)){
            $data = pg_fetch_array($res, 0, PGSQL_NUM);
            $Duration = (int)$data[0];
            $album_id = (int)$data[1];
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

    // update album duration and delete song
    $sql_delete_song = 'DELETE FROM song where song_id = $1';
    $sql_update_album = 'UPDATE album SET "Total_duration" = "Total_duration" - $1 WHERE album_id = $2';

    if($prep = pg_prepare($dbconn,'delete_song',$sql_delete_song)){
        $arr = array($id);
        if($res = pg_execute($dbconn,'delete_song',$arr)){
            if($prep = pg_prepare($dbconn,'update_album',$sql_update_album)){
                $arr = array($Duration,$album_id);
                if($res = pg_execute($dbconn,'update_album',$arr)){
                    http_response_code(200);
                    echo json_encode(['success' => 'Song is deleted succesfully']);
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