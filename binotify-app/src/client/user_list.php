<!DOCTYPE html>
<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/sidebar.php'; ?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="client/css/index.css">
    <link rel="stylesheet" href="client/css/song_list.css">
    <?php echo_sidebar_styles() ?>
    <title>WBD - User List</title>
</head>
<body class = "bg-black">
  <?php
    $f = (isset($_SESSION['is_admin']))&&($_SESSION['is_admin']==true);
    echo_sidebar($f); // True if admin, else false
  ?>
  <div>
    <div class="list-title">
      <h1 id = "list-heading">
        User List
        <p id = "list-subtitle"></p>
      </h1>
    </div>
    <div class="text-white right-wrapper">
      <div class="control-placeholder">
        <input id="prev-button" type="image" src="client/assets/prev.png" />
        <input id="next-button" type="image" src="client/assets/next.png" />
      </div>
      <table id="songs">
        <tr>
          <th>Username</th>
          <th>Email</th>
        </tr>
      </table>
    </div>
  </div>
  <script type="module" src="client/app/user_list.js"></script>
  <?php echo_sidebar_js() ?>
</body>