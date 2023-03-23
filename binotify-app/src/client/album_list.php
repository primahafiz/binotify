<!DOCTYPE html>
<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/sidebar.php'; ?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="client/css/index.css">
    <link rel="stylesheet" href="client/css/album_list.css">
    <title>WBD - Album List</title>
    <?php echo_sidebar_styles() ?>
</head>
<body class="bg-gray">
<div>
    <?php
    $f = (isset($_SESSION['is_admin']))&&($_SESSION['is_admin']==true);
    echo_sidebar($f); // True if admin, else false
    ?>
</div>
<div>
    <div class="col-12" id="header">
        <h1>Album List</h1>
    </div>
    <div>
        <div class="control-placeholder">
            <input id="next-button" type="image" src="client/assets/next.png" />
            <input id="prev-button" type="image" src="client/assets/prev.png" />
      </div>
    </div>
    <div class="col-12" id="main">
        <div class="grid-container" id="grid-main">
        </div>
    </div>
</div>
<script type="module" src="client/app/album_list.js"></script>
<?php echo_sidebar_js() ?>
</body>
</html>