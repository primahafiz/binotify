<!DOCTYPE html>
<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/sidebar.php'; ?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="client/css/index.css">
    <link rel="stylesheet" href="client/css/search_song.css">
    <title>WBD - Search Song</title>
    <?php echo_sidebar_styles() ?>
</head>
<body class="bg-gray">
    <div>
        <?php
        echo_sidebar(true); // True if admin, else false
        ?>
    </div>
    <div id="searchContainer">
        <input type="search" name="search" id="search" class="middle" placeholder="Search song by Title, Singer, or Release Year">
        <button id="btnSearch" type="submit" class="middle"><img src="client/assets/search_icon.png" alt=""></button>
    </div>
    <script type="module" src="client/app/search_song.js"></script>
    <?php echo_sidebar_js() ?>
</body>
</html>