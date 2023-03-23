<?php

/*
Format get request
    - creator_id : int
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
    $subs= 'INSERT INTO public.subscription ("creator_id", "subscriber_id", "status") VALUES ($1,$2,$3);';
    
    if($prep = pg_prepare($dbconn,'subs',$subs)){
        $res = pg_execute($dbconn,'subs', array($_POST['creator_id'],$_SESSION['user_id'],'PENDING'));
        if(!$res){
            $response_err = ['error' => 'Cannot have multiple data with same creator_id and subscriber_id'];
            http_response_code(500);
            echo json_encode($response_err);
            return;
        }
        $wsdl   = 'http://localhost:9080/subscribe?wsdl';
        $client = new SoapClient($wsdl, array('trace'=>1));
        // web service input param
        $request_param = array(
            'arg0' => $_POST['creator_id'],
            'arg1' => $_SESSION['user_id'],
            'arg2' => 'WU9JbWl5YWFJc0Fsc29PUDIwam5pMzRu'
        );
        try {
            $response_param = $client->request($request_param);
            $result = $response_param->return;
            if ($result == "Success"){
                http_response_code(200);
                $response = ['succ' => 'Subscribe request successfully created'];
            }else{
                http_response_code(400);
                $response = ['succ' => 'Bad request'];
            }
            
        } catch (Exception $e) { 
            http_response_code(500);
            $response = ['succ' => 'Soap connection error'];
        }
        echo json_encode($response);
    }else{
        $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
        http_response_code(500);
        echo json_encode($response_err);
    }
    pg_close($dbconn);
}

?>