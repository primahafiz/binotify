<?php
/*
    Format post reqeust 
        - id : string (username / email)
        - password : string

    Format reply
        http response 200:
        - username : string
        - email : string
*/

require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/utils.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
    $_SESSION['start'] = time();
    $_SESSION['expire'] = $_SESSION['start'] + (24 * 60 * 60);
}
header('Content-type: application/json');

// checks if user has already logged in
if (isset($_SESSION['is_login']) && $_SESSION['is_login'] === true) {
    json_response([
        'username' => $_SESSION['username'],
        'email' => $_SESSION['email']
    ]);
    return;
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // checks if payload is right
    if (!isset($_POST['id']) || !isset($_POST['password'])) {
        json_error('Field should be set');
        return;
    }

    // checks if all fields are filled
    if (empty(trim($_POST['id'])) || empty(trim($_POST['password']))) {
        json_error('Field can not be empty');
        return;
    }

    try {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/config/config.php';

        // sanitize inputs
        $id = htmlentities(trim($_POST['id']));
        $password = htmlentities(trim($_POST['password']));

        // check identifier type
        if (filter_var($id, FILTER_VALIDATE_EMAIL)) {
            $query = "SELECT * FROM public.user WHERE email = $1";
        } else {
            $query = "SELECT * FROM public.user WHERE username = $1";
        }

        if (pg_prepare($dbconn, 'get_user_data', $query)) {
            $result = pg_execute($dbconn, 'get_user_data', [$id]);
            if ($result) {
                $user = pg_fetch_assoc($result);
                if ($user) {
                    if (password_verify($password, $user['password'])) {
                        $_SESSION['user_id'] = $user['user_id'];
                        $_SESSION['is_login'] = true;
                        $_SESSION['username'] = $user['username'];
                        $_SESSION['email'] = $user['email'];
                        $_SESSION['is_admin'] = false;
                        if ($user['isAdmin'] == 't') {
                            $_SESSION['is_admin'] = true;
                        }
                        json_response([
                            'username' => $user['username'],
                            'email' => $user['email']
                        ]);
                    } else {
                        json_error('Wrong password');
                    }
                } else {
                    json_error('User not found');
                }
            }
        }

        pg_close($dbconn);
        return;
    } catch (Exception $e) {
        json_error('Unexpected error while executing request, please try again later', 500);
        return;
    }
}
