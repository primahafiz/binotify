<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/sidebar.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WBD - Sidebar</title>
    <?php echo_sidebar_styles() ?>
</head>

<body>
    <?php
    echo_sidebar(true); // True if admin, else false
    ?>
    <!-- YOUR HTML HERE -->
    <?php echo_sidebar_js() ?>
</body>

</html>