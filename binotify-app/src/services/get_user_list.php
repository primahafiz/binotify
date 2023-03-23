<?php

/*
    Format get reqeust 
        - page: integer

    Format reply
        http response 201:
        - cur_page: integer
        - total_page: integer
        - data: array of
            - username
            - email
        other http responses:
        - error
*/
$page_size = 30; // 1 page = 30 rows;

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    
    // check if page is set 
    $page_num = $_GET['page'];
    if($_GET['page'] == null || $_GET['page'] < 1){
        $page_num = 1;
    }
    
    // establish connection to db
    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    // get user list
    $get_user= 'SELECT "username", "email" FROM public.user WHERE "isAdmin" = false;';

    if($prep = pg_prepare($dbconn,'get_user',$get_user)){
        $res = pg_execute($dbconn,'get_user', array());
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
                    $cur_row = pg_fetch_array($res, $idx + $i, PGSQL_NUM);
                    $new_row = ["username" => $cur_row[0], "email" => $cur_row[1]];
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