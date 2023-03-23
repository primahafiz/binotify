<?php

/*
    Format post reqeust 
        - username : string
        - email : string
        - password : string
        - retype_password : string

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
    if (!isset($_POST['username']) || !isset($_POST['email']) || !isset($_POST['password']) || !isset($_POST['retype_password'])) {
        json_error('Username and password is not set');
        return;
    }

    // checks if all fields are filled
    if (empty(trim($_POST['username'])) || empty(trim($_POST['email'])) || empty(trim($_POST['password'])) || empty(trim($_POST['retype_password']))) {
        json_error('Field can not be empty');
        return;
    }

    // checks if password and retype password are the same
    if (trim($_POST['password']) !== trim($_POST['retype_password'])) {
        json_error('Password and retype password is not match');
        return;
    }

    try {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/config/config.php';

        // sanitize inputs
        $username = htmlentities(trim($_POST['username']));
        $email = htmlentities(trim($_POST['email']));
        $password = htmlentities(trim($_POST['password']));
        $retype_password = htmlentities(trim($_POST['retype_password']));


        // checks if username is already taken
        if (!is_unique($dbconn, 'user', 'username', $username)) {
            json_error('Username is already taken');
            return;
        }

        // checks if email is already taken
        if (!is_unique($dbconn, 'user', 'email', $email)) {
            json_error('Email is already taken');
            return;
        }

        // check if email is valid
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_error('Email is not valid');
            return;
        }

        // save user to db
        $create_user = 'INSERT INTO public.user ("username", "email", "password", "isAdmin", "salt") VALUES ($1, $2, $3, false, $4)';
        if (pg_prepare($dbconn, 'create_user', $create_user)) {
            $res = pg_execute($dbconn, 'create_user', [$username, $email, password_hash($password, PASSWORD_DEFAULT), 'not implemented']);
            if (!$res) {
                throw new Exception('Internal server error');
            }
            $_SESSION['is_login'] = true;
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            $_SESSION['is_admin'] = false;
            json_response(['username' => $username, 'email' => $email]);
        }
        pg_close($dbconn);
        return;
    } catch (Exception $e) {
        json_error('Unexpected error while executing request, please try again later', 500);
        return;
    }
}
