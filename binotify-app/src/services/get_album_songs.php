<?php

/*
    Format get reqeust 
        - album_id: integer
        - page: integer

    Format reply
        http response 201:
        - cur_page: integer
        - total_page: integer
        - data: array of
            - Judul
            - Penyanyi
            - Tanggal_terbit
            - Genre
        other http responses:
        - error
*/
$page_size = 10; // 1 page = 10 rows;

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    
    // if album id is not set, return error
    if($_GET['album_id'] == null){
        $response_err = ['error' => 'album id not set'];
        http_response_code(400);
        echo json_encode($response_err);
        return;
    }
    $album_id = $_GET['album_id'];

    // check if id is set 
    $page_num = $_GET['page'];
    if($_GET['page'] == null || $_GET['page'] < 1){
        $page_num = 1;
    }

    // establish connection to db
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    // get song
    $get_song= 'SELECT "Judul", "Penyanyi", "Tanggal_terbit", "Genre" FROM song where album_id = $1;';

    if($prep = pg_prepare($dbconn,'get_song',$get_song)){
        $res = pg_execute($dbconn,'get_song', array($album_id));
        if(!$res){
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
        }else{
            $num_rows = pg_num_rows($res);
            // check whether page is valid
            if($num_rows + $page_size - 1< $page_num * $page_size){
                $response_err = ['error' => 'Data not found'];
                http_response_code(401);
                echo json_encode($response_err);

            } else{
                // build pagination
                http_response_code(201);
                $page_count = floor(($num_rows+$page_size-1)/$page_size);
                $response = ['cur_page' => $page_num, 'total_page' => $page_count,
                    'data' => []];
                $idx = ($page_num - 1) * $page_size;
                for($i = 0; $i < $page_size && $idx+$i < $num_rows; $i++){
                    $cur_row = pg_fetch_array($res, $idx +$i, PGSQL_NUM);
                    $new_row = ["Judul" => $cur_row[0], "Penyanyi" => $cur_row[1], "Tanggal_terbit" => $cur_row[2], "Genre" => $cur_row[3]];
                    $response['data'][] = $new_row;
                }
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