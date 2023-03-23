<?php
/*
    Format post reqeust 
        /api/check/username:
        - username : string (if /api/check/username)
        
        /api/check/username:
        - email : string 

    Format reply
        http response 200:
        - is_available : bool (true if available)
*/

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/utils.php';
header('Content-type: application/json');
$url = $_SERVER['REQUEST_URI'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/config/config.php';

        if ($url === '/api/check/username') {
            if (!isset($_POST['username']) || empty(trim($_POST['username']))) {
                json_error('Username is required');
                return;
            }

            $username = htmlentities(trim($_POST['username']));
            if (!is_unique($dbconn, 'user', 'username', $username)) {
                json_response(['is_available' => false]);
                return;
            }
        } else if ($url === '/api/check/email') {
            if (!isset($_POST['email']) || empty(trim($_POST['email']))) {
                json_error('Email is required');
                return;
            }

            $email = htmlentities(trim($_POST['email']));
            if (!is_unique($dbconn, 'user', 'email', $email)) {
                json_response(['is_available' => false]);
                return;
            }
        }

        json_response(['is_available' => true]);
        return;
        pg_close($dbconn);
    } catch (Exception $e) {
        json_error('Internal server error', 500);
        return;
    }
}
