<?php

header('Access-Control-Allow-Origin: *');

$request = $_SERVER['REQUEST_URI'];

require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/parse_url.php';

$base_url = get_base_url($request);
$base_url_get = get_base_url_get($request);
$params = get_params_url($request);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
    $_SESSION['start'] = time();
    $_SESSION['expire'] = $_SESSION['start'] + (24 * 60 * 60);
}

$role = '';

if(!isset($_SESSION['is_login'])){
    $role = 'not_logged_in';
}else if(!$_SESSION['is_admin']){
    $role = 'user';
}else{
    $role = 'admin';
}

// song
if ($request == '/api/song/add' && $role == 'admin') {
    require __DIR__ . '/services/add_song.php';
} else if ($base_url == '/api/song/delete' && $role == 'admin') {
    require __DIR__ . '/services/delete_song.php';
} else if ($base_url == '/api/song/edit' && $role == 'admin') {
    require __DIR__ . '/services/edit_song.php';
}else if ($base_url_get == '/api/song_list'){
    require __DIR__.'/services/get_song_list.php';
}else if ($base_url_get == '/api/album_songs'){
    require __DIR__.'/services/get_album_songs.php';
}else if ($base_url_get == '/api/song_details'){
    require __DIR__ . '/services/get_song_details.php';

// album
} else if ($request == '/api/album/add' && $role == 'admin') {
    require __DIR__ . '/services/add_album.php';
} else if ($base_url == '/api/album/delete' && $role == 'admin') {
    require __DIR__ . '/services/delete_album.php';
} else if ($base_url_get == '/api/album'){
    require __DIR__ . '/services/get_album_list.php';
} else if ($base_url_get == '/api/album_details'){
    require __DIR__ . '/services/get_album_details.php';
}else if ($base_url == '/api/album/edit' && $role == 'admin'){
    require __DIR__ . '/services/edit_album.php';

    
    
 // user account services
} else if ($request == '/api/check/username' || $request == '/api/check/email') {
    require __DIR__ . '/services/check_unique.php';
} else if ($request == '/api/role') {
    require __DIR__ . '/services/get_role.php';
} else if ($request == '/api/register') {
    require __DIR__ . '/services/register.php';
} else if ($request == '/api/login') {
    require __DIR__ . '/services/login.php';
} else if ($request == '/api/logout' && $role != 'not_logged_in') {
    require __DIR__ . '/services/logout.php';
} else if ($base_url_get == '/api/user_list' && $role == 'admin'){
    require __DIR__.'/services/get_user_list.php';
}

// count play song
else if ($request == '/api/count_play_song/get'){
    require __DIR__ . '/services/get_count_play_song.php';
}else if ($request == '/api/count_play_song/update'){
    require __DIR__ . '/services/update_count_play_song.php';
}

// premium song
else if($request == '/api/singer_premium_list'){
    require __DIR__ . '/services/get_singer_premium_list.php';
}else if($base_url_get == '/api/song_premium_list' && $role == 'user'){
    require __DIR__ . '/services/get_song_premium_list.php';
}else if($request == '/api/song_premium/add' && $role == 'user'){
    require __DIR__ . '/services/add_subscription.php';
}else if($request == '/api/song_premium/update'){
    require __DIR__ . '/services/update_subscription.php';
}

// frontend


// authentication
else if ($request == '/login') {
    require __DIR__ . '/client/login.html';
} else if ($request == '/register') {
    require __DIR__ . '/client/register.html';
} else if ($base_url_get == '/user_list' && $role == 'admin'){
    require __DIR__.'/client/user_list.php';
}

// home page
else if ($request == '/home') {
    require __DIR__ . '/client/home.php';
} 

// song data
else if ($request == '/add_song' && $role == 'admin'){
    require __DIR__ . '/client/add_song.php';
}else if ($base_url == '/edit_song' && $role == 'admin'){
    require __DIR__ . '/client/edit_song.php';
} else if ($base_url_get == '/song_list'){
    require __DIR__ . '/client/song_list.php';
} else if ($base_url_get == '/search'){
    require __DIR__.'/client/search_result.php';
}

// album data
else if ($request == '/add_album' && $role == 'admin'){
    require __DIR__ . '/client/add_album.php';
}else if ($base_url_get == '/album_list'){
    require __DIR__ . '/client/album_list.php';
}else if ($base_url_get == '/album_songs'){
    require __DIR__ . '/client/album_songs.php';
}else if($base_url == '/edit_album' && $role == 'admin'){
    require __DIR__ . '/client/edit_album.php';
}

// premium
else if($request == '/singer_list' && $role=='user'){
    require __DIR__ . '/client/singer_premium_list.php';
}else if($base_url_get == '/song_premium_list' && $role=='user'){
    require __DIR__ . '/client/song_premium_list.php';
}




else {
    require __DIR__ . '/client/landing.html';
}
