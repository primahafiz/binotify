<!DOCTYPE html>
<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/sidebar.php'; ?>
<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/player.php'; ?>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="client/css/index.css">
    <link rel="stylesheet" href="client/css/song_premium_list.css">
    <?php echo_sidebar_styles() ?>
    <?php echo_player_styles() ?>
    <title>WBD - Singer Premium List</title>
</head>

<body class="bg-black">
    <?php
    $f = (isset($_SESSION['is_admin'])) && ($_SESSION['is_admin'] == true);
    echo_sidebar($f); // True if admin, else false
    ?>
    <div>
        <div class="list-title">
            <h1>
                Premium Song by
            </h1>
        </div>
        <div class="text-white right-wrapper">
            <table id="song-premiums">
                <tr id="tb-header">
                    <th class="width-40">Title</th>
                    <th class="width-30"></th>
                    <th class="width-30"></th>
                </tr>
            </table>
        </div>
        </br></br></br></br>
    </div>
    <?php echo_player() ?>
    <script type="module" src="client/app/song_premium_list.js"></script>
    <?php echo_sidebar_js() ?>
</body>