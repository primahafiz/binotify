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
    <link rel="stylesheet" href="client/css/search_result.css">
    <?php echo_sidebar_styles() ?>
    <?php echo_player_styles() ?>
    <title>WBD - Song List</title>
</head>

<body class="bg-black">
    <?php
    $f = (isset($_SESSION['is_admin'])) && ($_SESSION['is_admin'] == true);
    echo_sidebar($f); // True if admin, else false
    ?>
    <div>
        <div class="list-input">
            <form action="" id="formFilterSort">
                <input type="search" name="search" id="search" class="mt-10">
                <select name="yearMode" id="yearMode" class="dropdown">
                    <option value="">None</option>
                    <option value="ascending">Ascending (Year)</option>
                    <option value="descending">Descending (Year)</option>
                </select>
                <select name="titleMode" id="titleMode" class="dropdown mt-10">
                    <option value="">None</option>
                    <option value="true">Ascending (Title)</option>
                    <option value="false">Descending (Title)</option>
                </select>
                <button type="submit" id="btnSearch" class="bg-super-light-gray mt-10">Search</button>
            </form>
        </div>
        <div class="list-title">
            <image id="list-picture" src="client/assets/empty.png" />
            <h1 id="list-heading">
                Search Result
                <p id="list-subtitle"></p>
            </h1>
            <input id="play-button" type="image" src="client/assets/play_white.png" />
            <button class="mr-5 btn album-link"> View Album </button>
            <button class="mr-5 btn edit-btn">Edit</button>
            <button class="mr-5 btn delete-btn">Delete</button>
            <div class="detail-info mt-20">
                <p> Title: hi </p> <br>
                <p> Artist: you </p><br>
                <p> Album: heehee </p><br>
            </div>
        </div>
        <div class="text-white right-wrapper">

            <div class="control-placeholder">
                <input id="prev-button" type="image" src="client/assets/prev.png" />
                <input id="next-button" type="image" src="client/assets/next.png" />
            </div>
            <table id="songs">
                <tr id="tb-header">
                    <th class="width-25">Title</th>
                    <th class="width-25">Artist</th>
                    <th class="width-25">Genre</th>
                    <th class="width-25">Year</th>
                </tr>
            </table>
        </div>
    </div>
    <?php echo_player() ?>
    <script type="module" src="client/app/search_result.js"></script>
    <?php echo_sidebar_js() ?>
</body>