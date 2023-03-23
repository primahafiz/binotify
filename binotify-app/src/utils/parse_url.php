<?php

// Case url = localhost/user/prima
// base = localhost/user
// params = prima


function get_base_url($url){
    $arr = explode('/',$url);
    $base_url = '';
    for($i=0; $i<count($arr)-1; $i+=1){
        if($i == count($arr)-2){
            $base_url = $base_url.$arr[$i];
        }else{
            $base_url = $base_url.$arr[$i].'/';
        }
    }
    return $base_url;
}

function get_params_url($url){
    $arr = explode('/',$url);
    return $arr[count($arr)-1];
}

function get_base_url_get($url){
    $arr = explode('?',$url);
    return $arr[0];
}


?>