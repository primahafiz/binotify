<?php

$host_db = '20.5.48.98';
$dbname_db = 'phpwbd';
$user_db = 'postgres';
$password_db = '35p8SGfEBofTpT9LP';

$str = 'host='.$host_db.' '.'dbname='.$dbname_db.' '.'user='.$user_db.' '.'password='.$password_db;

$dbconn = pg_connect($str);

if(!$dbconn){
    echo 'Connection attempt failed';
}

?>