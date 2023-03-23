<!DOCTYPE html>
<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/sidebar.php'; ?>
<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/player.php'; ?>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="client/css/index.css">
    <link rel="stylesheet" href="client/css/song_list.css">
    <link rel="stylesheet" href="client/css/home.css">
    <?php echo_sidebar_styles() ?>
    <?php echo_player_styles() ?>
    <title>WBD - Home</title>
</head>

<body class="bg-black">
    <?php
    $f = (isset($_SESSION['is_admin'])) && ($_SESSION['is_admin'] == true);
    echo_sidebar($f); // True if admin, else false
    ?>
    <div>
        <div class="list-title">
            <image id="list-picture" src="client/assets/empty.png" />
            <h1 id="list-heading">
                Welcome to Spotify
                <p id="list-subtitle"></p>
            </h1>
            <input id="play-button" type="image" src="client/assets/play_white.png" />
            <button class="mr-5 btn album-link"> View Album </button>
            <div class="user-info">
            </div>
        </div>
        <div class="text-white right-wrapper">
            <div class="control-placeholder">
                <input id="prev-button" type="image" src="client/assets/prev.png" />
                <input id="next-button" type="image" src="client/assets/next.png" />
            </div>
            <table id="songs">
                <tr id="tb-header">
                    <th class="width-20">#</th>
                    <th class="width-20">Title</th>
                    <th class="width-20">Artist</th>
                    <th class="width-20">Genre</th>
                    <th class="width-20">Year</th>
                </tr>
            </table>
        </div>
    </div>
    <?php echo_player() ?>
    <script type="module" src="client/app/home.js"></script>
    <?php echo_sidebar_js() ?>
</body>