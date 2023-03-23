<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/utils.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
    $_SESSION['start'] = time();
    $_SESSION['expire'] = $_SESSION['start'] + (24 * 60 * 60);
}

try {
    $_SESSION = array();
    session_destroy();

    json_response(['message' => 'Logout success!']);

    // redirect to login page (later)
    header("location: /");
} catch (Exception $e) {
    json_error("Internal server error", 500);
}
