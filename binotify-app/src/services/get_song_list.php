<?php

/*
    Format get reqeust 
        - page: integer
        - album_id: integer, optional
        - query: string, optional
        - is_ascending: string, optional (true, false)

    Format reply
        http response 201:
        - cur_page: integer
        - total_page: integer
        - data: array of song, all fields included
        other http responses:
        - error
*/
$page_size = 10; // 1 page = 10 rows;

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    
    // check if id is set 

    if(!isset($_GET['page'])|| $_GET['page'] < 1){
        $page_num = 1;
    }else{
        $page_num = $_GET['page'];
    }
    
    // album id
    if(isset($_GET['album_id'])){
        $album_id = $_GET['album_id'];
    }else{
        $album_id = null;
    }

    // query
    $base_query = "no";
    if(!isset($_GET['query'])){
        $query = "";
    }else{
        $base_query = $_GET['query'];
        $query = $_GET['query'];
    }
    $query = "%" . $query . "%";

    // establish connection to db
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    // get song
    $get_song= 'SELECT * FROM song WHERE (LOWER("Judul") LIKE LOWER($1) OR LOWER("Penyanyi") LIKE LOWER($1) OR LOWER("Genre") LIKE LOWER($1)';
    if(is_numeric($base_query)){
        $get_song = $get_song.'OR DATE_PART(\'year\', "Tanggal_terbit") = '.$base_query;
    }
    $get_song = $get_song.')';

    if($album_id != null){
        $get_song = $get_song . ' AND "album_id" =  '. $album_id;
    }
    if (!isset($_GET['order_by_year'])){
        $get_song = $get_song . ' ORDER BY "Judul"';
        if (isset($_GET['is_ascending']) && $_GET['is_ascending']=='false'){
            $get_song = $get_song . ' DESC';
        }
    } else{
        $get_song = $get_song . ' ORDER BY "Tanggal_terbit"';
        if ($_GET['order_by_year']=='descending'){
            $get_song = $get_song . ' DESC';
        }
    }
    
    if($prep = pg_prepare($dbconn,'get_song',$get_song)){
        $res = pg_execute($dbconn,'get_song', array($query));
        if(!$res){
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
        }else{
            $num_rows = pg_num_rows($res);
            // check whether page is valid
            if($num_rows + $page_size - 1< $page_num * $page_size && $num_rows!=0){
                $response_err = ['error' => 'Data not found'];
                http_response_code(401);
                echo json_encode($response_err);

            } else{
                // build pagination
                http_response_code(201);
                $page_count = floor(($num_rows+$page_size-1)/$page_size);
                if($page_count==0){
                    $page_count=1;
                }
                $response = ['cur_page' => $page_num, 'total_page' => $page_count,
                    'data' => []];
                $idx = ($page_num - 1) * $page_size;
                for($i = 0; $i < $page_size && $idx+$i < $num_rows; $i++){
                    $cur_row = pg_fetch_array($res, $idx +$i, PGSQL_NUM);
                    $new_row = ["Song_id" => $cur_row[0], "Judul" => $cur_row[1], "Penyanyi" => $cur_row[2], 
                        "Tanggal_terbit" => $cur_row[3], "Genre" => $cur_row[4],
                        "Duration" => $cur_row[5], "Audio_path" => $cur_row[6],
                        "Image_path" => $cur_row[7], "Album_id" => $cur_row[8]];
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