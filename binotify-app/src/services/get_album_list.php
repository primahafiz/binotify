<?php

/*
    Format get reqeust 
        - page: integer

    Format reply
        http response 201:
        - cur_page: integer
        - total_page: integer
        - data: array of
            - Judul
            - Penyanyi
            - Image_path
        other http responses:
        - error
*/
$page_size = 4; // 1 page = 4 rows;

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    // get only id and title
    if(isset($_GET['title_only'])){
        $get_album= 'SELECT "album_id", "Judul" FROM album;';
        // establish connection to db
        require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';
        if($prep = pg_prepare($dbconn,'get_album',$get_album)){
            $res = pg_execute($dbconn,'get_album', array());
            if(!$res){
                $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
                http_response_code(500);
                echo json_encode($response_err);
            }else{
                    // build pagination
                    $num_rows = pg_num_rows($res);
                    http_response_code(201);
                    for($i = 0; $i < $num_rows; $i++){
                        $cur_row = pg_fetch_array($res, $i, PGSQL_NUM);
                        $new_row = ["album_id" => $cur_row[0], "Judul" => $cur_row[1]];
                        $response['data'][] = $new_row;
                    }
                    echo json_encode($response);
            }
        }else{
            $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
            echo json_encode($response_err);
        }

    }else{
        // check if id is set 
        $page_num = 1;
        if(isset($_GET['page'])){
            $page_num = $_GET['page'];
        }
        
        // establish connection to db
        require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';
    
        // get album
        $get_album= 'SELECT "album_id", "Judul", "Penyanyi", "Total_duration", "Image_path", "Tanggal_terbit", "Genre" FROM album ORDER BY "Judul";';
    
        if($prep = pg_prepare($dbconn,'get_album',$get_album)){
            $res = pg_execute($dbconn,'get_album', array());
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
                        $new_row = ["album_id" => $cur_row[0], "Judul" => $cur_row[1], "Penyanyi" => $cur_row[2], "Total_duration" => $cur_row[3], "Image_path" => $cur_row[4], "Tanggal_terbit" => $cur_row[5], "Genre" => $cur_row[6]];
                        $response['data'][] = $new_row;
                    }
                    echo json_encode($response);
                }
            }
        }else{
            $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
            echo json_encode($response_err);
        }
    }
    

    pg_close($dbconn);
}

?>