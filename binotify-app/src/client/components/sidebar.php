<?php
function echo_sidebar_styles()
{
    $html = <<<"EOT"
    <link rel="stylesheet" href="/client/css/index.css" />
    <link rel="stylesheet" href="/client/css/sidebar.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />  
EOT;
    echo $html;
}

function echo_sidebar_js()
{
    $html = <<<"EOT"
    <script type="module" src="/client/app/sidebar.js"></script>
EOT;
    echo $html;
}

function echo_sidebar($is_admin)
{
    $html = <<<"EOT"
    <div class="sidebar">
        <div class="small-sidebar">
            <img src="/client/assets/logo-white.png" alt="" class="small-logo" />
            <div class="small-right">
                <i class="fa fa-bars fa-lg bars"></i>
            </div>
        </div>

        <div class="sidebar-box">
            <img src="/client/assets/logo-white.png"  alt="" class="sidebar-logo" />

            <div class="sidebar-list">
                <button class="sidebar-btn home-btn">
                <i class="fa fa-home sidebar-icon"></i> Home
                </button>
            </div>
            <div class="sidebar-list">
                <button class="sidebar-btn search-btn">
                <i class="fa fa-search sidebar-icon"></i> Search
                </button>
            </div>
            <div class="sidebar-list">
                <button class="sidebar-btn song-btn">
                <i class="fa fa-music sidebar-icon"></i> Songs
                </button>
            </div>
            <div class="sidebar-list">
                <button class="sidebar-btn album-btn">
                <i class="fa fa-book sidebar-icon"></i> Albums
                </button>
            </div>
EOT;
    if ($is_admin) {
        $html .= '       
            <div class="sidebar-list sidebar-admin">
                <button class="sidebar-btn add-song-btn">
                <i class="fa fa-plus sidebar-icon"></i> Add Songs
                </button>
            </div>
            <div class="sidebar-list sidebar-admin">
                <button class="sidebar-btn add-album-btn">
                <i class="fa fa-pencil sidebar-icon"></i> Add Albums
                </button>
            </div>
            <div class="sidebar-list sidebar-admin">
                <button class="sidebar-btn user-list-btn">
                <i class="fa fa-users sidebar-icon"></i> User List
                </button>
            </div>
        </div>
    </div>';
    } else {
        $html .= '
            <div class="sidebar-list">
                <button class="sidebar-btn singer-btn">
                <i class="fa fa-microphone sidebar-icon"></i> Premium Singers
                </button>
            </div>
        </div>
    </div>';
    }

    echo $html;
}
