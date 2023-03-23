<?php

/*
Format get request

Format response:
    status 500 (server error)
        - error
    status 200:
        - data : list of singer
            - penyanyi_id : int
            - name : string
            - is_subscribed : boolean
*/

$rest_host = 'localhost';
$rest_port = 8081;

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    $response = file_get_contents('http://'.$rest_host.':'.$rest_port.'/'.'api/singer');
    $response = json_decode($response);

    require_once $_SERVER['DOCUMENT_ROOT'].'/config/config.php';
    
    $wsdl   = 'http://localhost:9080/verify?wsdl';
    $client = new SoapClient($wsdl, array('trace'=>1));
    // web service input param
    $request_param = array(
        'arg0' => $_POST['creator_id'],
        'arg1' => $_SESSION['user_id'],
        'arg2' => 'WU9JbWl5YWFJc0Fsc29PUDIwam5pMzRu'
    );
    try {
        $response_param = $client->verify($request_param);
        $result = $response_param->return;
        
    } catch (Exception $e) { 
        http_response_code(500);
        $response = ['succ' => 'Soap connection error'];
    }
    if ($result == "ACCEPTED" || $result == "REJECTED"){
        $get_subs= 'UPDATE public.subscription SET "status" = $1 WHERE "subscriber_id" = $2;';
        if($prep = pg_prepare($dbconn,'get_subs',$get_subs)){
            $res = pg_execute($dbconn,'get_subs', array($result, $_SESSION['user_id']));
        }
    }
    

    // get user list
    $get_subs= 'SELECT * FROM public.subscription WHERE "subscriber_id" = $1;';

    if($prep = pg_prepare($dbconn,'get_subs',$get_subs)){
        $res = pg_execute($dbconn,'get_subs', array($_SESSION['user_id']));
        if(!$res){
            $response_err = ['error' => 'Unexpected error while executing request, please try again later'];
            http_response_code(500);
            echo json_encode($response_err);
            return;
        }
        $num_rows = pg_num_rows($res);
        $subs = [];
        for($i = 0; $i < $num_rows ; $i++){
            $cur_row = pg_fetch_array($res, $i, PGSQL_NUM);
            if($cur_row[2] != 'ACCEPTED') continue;
            $subs[] = (int)$cur_row[0];
        }
        for($i = 0; $i< count($response->data); $i++){
            $is_subscribed = false;
            for($j = 0; $j< count($subs); $j++){
                if($response->data[$i]->penyanyi_id == $subs[$j]){
                    $is_subscribed=true;
                }
            }
            $response->data[$i]->is_subscribed = $is_subscribed;
        }
        echo json_encode($response);
    }else{
        $response_err = ['error' => 'Unexpected error while preparing request, please try again later'];
        echo json_encode($response_err);
    }
    pg_close($dbconn);
}

?>