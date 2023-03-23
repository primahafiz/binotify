<?php
function echo_player_styles(){
  $html = <<<"EOT"
    <link rel="stylesheet" href="client/css/song_player.css" />
EOT;
    echo $html;
}
function echo_player() {
   $html = <<<"EOT"
   <footer class = "footer">
    <audio id="song-audio">
      <source id="song-path" src=""></source>
    </audio> 
    <img id="song-picture" src="client/assets/empty.png"/>
    <div id="song-title"></div>
    <div id="song-artist"></div>
    <div class="song-control">
      <input class="control-button" id="song-control" type="image" src="client/assets/play_white.png" />
    </div>
  </footer>
EOT;

   echo $html;
}

?>