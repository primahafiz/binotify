<?php

/*
    Format get reqeust 
        - id: integer

    Format reply
        http response 201:
        - Judul
        - Penyanyi
        - Tanggal_terbit
        - Genre
        - Duration
        - Audio_path
        - Image_path
        other http responses:
        - error
*/

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    
    // check if id is set
    if($_GET['id'] == null){
        $response_err = ['error' => 'id not set'];
        http_response_code(400);
        echo json_encode($response_err);
        return;
    }
    
    // establish connection to db
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    // get song
    $get_song= 'SELECT * FROM public.song where song_id = $1';

    if($prep = pg_prepare($dbconn,'get_song',$get_song)){
        $res = pg_execute($dbconn,'get_song',array($_GET['id']));
        if(!$res){
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
        }else{
            $rows = pg_fetch_array($res, 0, PGSQL_NUM);
            if($rows[1] == null){
                $response_err = ['error' => 'Data not found'];
                http_response_code(401);
                echo json_encode($response_err);

            } else{
                http_response_code(201);
                $response = ['Judul' => $rows[1], 
                    'Penyanyi' => $rows[2], 
                    'Tanggal_terbit' => $rows[3],
                    'Genre' => $rows[4],
                    'Duration' => $rows[5],
                    'Audio_path' => $rows[6],
                    'Image_path' => $rows[7],
                    'album_id' => $rows[8]];
                echo json_encode($response);
            }
            
        }
    }else{
        $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
        echo json_encode($response_err);
    }

    pg_close($dbconn);
}


?>