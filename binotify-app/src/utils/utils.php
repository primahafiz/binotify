<?php

function json_error($message, $code = 400)
{
    header('Content-type: application/json');
    http_response_code($code);
    echo json_encode(['error' => $message]);
    return;
}

function json_response($response)
{
    header('Content-type: application/json');
    http_response_code(200);
    echo json_encode($response);
    return;
}

function is_unique($dbconn, $table, $field, $value)
{
    $get_field = "SELECT * FROM public.$table WHERE $field = \$1";
    if (pg_prepare($dbconn, "get_$field", $get_field)) {
        $res = pg_execute($dbconn, "get_$field", [$value]);
        if (!$res) {
            throw new Exception('Internal server error');
        }
        $count = pg_num_rows($res);
        if ($count > 0) {
            return false;
        } else {
            return true;
        }
    }
}
