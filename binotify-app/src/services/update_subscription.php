<?php

/*
Format get request
    - creator_id : int
    - subscriber_id : int
    - status : string
Format response:
    status 500 (server error)
        - error
    status 200:
        - succ
*/


if($_SERVER['REQUEST_METHOD'] == 'POST'){

    // TODO : verify api key


    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';

    // get user list
    $subs= 'UPDATE public.subscription SET "status" = $3 WHERE "creator_id" = $1 AND "subscriber_id" = $2 ;';

    if($prep = pg_prepare($dbconn,'subs',$subs)){
        $res = pg_execute($dbconn,'subs', array($_POST['creator_id'],$_POST['subscriber_id'],$_POST['status']));
        if(!$res){
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
            return;
        }
        http_response_code(200);
        $response = ['succ' => 'Subscribe request successfully updated'];
        echo json_encode($response);
    }else{
        $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
        http_response_code(500);
        echo json_encode($response_err);
    }
    pg_close($dbconn);
}

?>