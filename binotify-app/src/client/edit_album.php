<!DOCTYPE html>
<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/client/components/sidebar.php'; ?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../client/css/index.css">
    <link rel="stylesheet" href="../client/css/edit_album.css">
    <title>WBD - Edit Album</title>
    <?php echo_sidebar_styles() ?>
</head>
<body class="bg-gray">
    <div>
        <?php
        echo_sidebar(true); // True if admin, else false
        ?>
    </div>
    <div>
        <div class="col-12" id="main">
            <form id="editAlbumForm" method="POST" class="form-container m-5">
                <h2 class="text-white text-center">Edit Album</h2>
                <label for="Judul" class="text-white label-form">Title</label></br>
                <input type="text" name="Judul" id="Judul" class="input-text-dark"></br>
                <label for="Tanggal_terbit" class="text-white label-form">Date Released</label></br>
                <input type="date" name="Tanggal_terbit" id="Tanggal_terbit" class="input-text-dark mb-5"></br>
                <label for="Genre" class="text-white label-form">Genre</label></br>
                <select name="Genre" id="Genre" class="input-dropdown">
                    <option value="Classic">Classic</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Blues">Blues</option>
                    <option value="Country">Country</option>
                    <option value="Techno">Techno</option>
                    <option value="Reggae">Reggae</option>
                    <option value="R&B">R&B</option>
                    <option value="Rap">Rap</option>
                    <option value="Death Metal">Death Metal</option>
                    <option value="Dangdut">Dangdut</option>
                    <option value="Pop">Pop</option>
                    <option value="Balada">Balada</option>
                </select></br></br>
                <input type="file" name="Image_path" id="Image_path"></br>
                <input type="checkbox" name="is_image_change" id="is_image_change" class="mt-5" value="1">
                <label for="is_image_change" class="label-checkbox">Keep using previous image file</label></br>
                <p id="formMsg" class="mt-5">&nbsp;</p>
                <div id="submit-container">
                    <button type="submit" class="btn bg-white mt-20" id="submitBtn">Submit</button>
                </div>
            </form>
        </div>
    </div>
    <script type="module" src="../client/app/edit_album.js"></script>
    <?php echo_sidebar_js() ?>
</body>
</html>